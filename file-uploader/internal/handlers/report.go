package handlers

import (
	"database/sql"
	"fmt"
	"io"
	"log"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
)

func buildHandlerReport(db *sql.DB) func(c *gin.Context) {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Content-Type", "text/event-stream")
		c.Writer.Header().Set("Cache-Control", "no-cache")
		c.Writer.Header().Set("Connection", "keep-alive")
		c.Writer.Header().Set("Transfer-Encoding", "chunked")

		items := make(chan gin.H, 10)
		target := c.QueryArray("regExps")

		go func() {

			cr := make([]regexp.Regexp, 0, len(target))

			for _, t := range target {
				r, err := regexp.Compile(t)
				if err != nil {
					fmt.Println(err)
					c.Status(400)
					c.Done()
				}
				cr = append(cr, *r)
			}

			q := `
				select
					id,
					filename,
					send_date,
					upload_date,
					"to",
					cc,
					"from",
					subject,
					content
				from email
			`

			rows, e := db.Query(q)
			log.Println(e)
			defer rows.Close()

			log.Print("here")

			for rows.Next() {
				var (
					id          string
					filename    string
					send_date   time.Time
					upload_date time.Time
					to          string
					cc          string
					from        string
					subject     string
					content     string
				)

				rows.Scan(
					&id,
					&filename,
					&send_date,
					&upload_date,
					&to,
					&cc,
					&from,
					&subject,
					&content,
				)

				dangerValues := make([]string, 0)

				for _, r := range cr {
					dangerValues = append(dangerValues, r.FindAllString(string(content), -1)...)
				}

				if len(dangerValues) > 0 {
					items <- gin.H{
						"id":   id,
						"name": filename,
					}
				}
			}

			close(items)
		}()

		c.Stream(func(w io.Writer) bool {
			if item, ok := <-items; ok {
				c.SSEvent("message", item)
				return true
			}
			c.SSEvent("message", "close")
			return false
		})
	}
}
