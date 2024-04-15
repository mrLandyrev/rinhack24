package handlers

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/mrLandyrev/file-uploader/internal/usecases"
)

func Bootstrap(db *sql.DB) (*gin.Engine, error) {
	server := gin.Default()
	saveFileUseCase := usecases.BuildSaveFileUseCase(db)

	server.Use(BuildCORSMiddleware())

	server.LoadHTMLGlob("templates/*.html")
	server.GET("/", func(ctx *gin.Context) {
		ctx.HTML(200, "index.html", nil)
	})
	server.GET("/api/email/list", BuildHandleList(db))
	server.POST("/api/email/upload", BuildHandlerUpload(saveFileUseCase))
	server.GET("/api/email/:id", BuildHandleDetails(db))
	server.GET("/api/report", buildHandlerReport(db))

	return server, nil
}
