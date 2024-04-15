package handlers

import (
	"database/sql"
	"fmt"
	"io"
	"log"
	"regexp"
	"sync"
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

			type row struct {
				id          string
				filename    string
				send_date   time.Time
				upload_date time.Time
				to          string
				cc          string
				from        string
				subject     string
				content     string
			}
			rowC := make(chan *row, 20)

			wg := &sync.WaitGroup{}
			wg.Add(1)

			go func() {
				defer wg.Done()
				for rows.Next() {
					var r row
					rows.Scan(
						&r.id,
						&r.filename,
						&r.send_date,
						&r.upload_date,
						&r.to,
						&r.cc,
						&r.from,
						&r.subject,
						&r.content,
					)

					rowC <- &r
				}
			}()

			for i := 0; i < 20; i++ {
				wg.Add(1)
				go func() {
					defer wg.Done()
					for cur, ok := <-rowC; ok; {

						dangerValues := make([]string, 0)

						for _, r := range cr {
							dangerValues = append(dangerValues, r.FindAllString(string(cur.content), -1)...)
						}

						if len(dangerValues) > 0 {
							items <- gin.H{
								"id":   cur.id,
								"name": cur.filename,
							}
						}
					}
				}()
			}

			wg.Wait()

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
