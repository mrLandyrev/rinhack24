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

	server.GET("/api/email/list", BuildHandleList(db))
	server.POST("/api/email/upload", BuildHandlerUpload(saveFileUseCase))
	server.GET("/api/email/:id", BuildHandleDetails(db))

	return server, nil
}
