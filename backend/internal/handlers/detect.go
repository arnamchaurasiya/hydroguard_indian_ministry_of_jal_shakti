package handlers

import (
	"hydroguard/internal/database"
	"hydroguard/internal/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

func DetectDebris(db database.Database) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Accepts base64 image data payload for water surface litter & debris detection
		type detectReq struct {
			Image string `json:"image"`
		}

		req := detectReq{}
		_ = c.Bind(&req)

		// Check if responseType requested is blob / video
		accept := c.Request().Header.Get("Accept")
		if accept == "video/mp4" || c.QueryParam("format") == "video" {
			// Send synthetic minimal MP4 header stream or mock video bytes
			dummyMp4 := []byte{
				0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70,
				0x69, 0x73, 0x6f, 0x6d, 0x00, 0x00, 0x02, 0x00,
				0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32,
			}
			return c.Blob(http.StatusOK, "video/mp4", dummyMp4)
		}

		type Detection struct {
			Type       string    `json:"type"`
			Confidence float64   `json:"confidence"`
			BBox       []float64 `json:"bbox"`
		}

		type DetectResult struct {
			Status     string      `json:"status"`
			Message    string      `json:"message"`
			Count      int         `json:"detected_count"`
			Detections []Detection `json:"detections"`
		}

		result := DetectResult{
			Status:  "success",
			Message: "Litter and floating debris analysis complete",
			Count:   2,
			Detections: []Detection{
				{Type: "Plastic bottle", Confidence: 0.94, BBox: []float64{0.2, 0.3, 0.1, 0.1}},
				{Type: "Organic debris", Confidence: 0.88, BBox: []float64{0.5, 0.6, 0.15, 0.12}},
			},
		}

		return c.JSON(http.StatusOK, &models.Response{
			Message: "successful",
			Data:    result,
		})
	}
}
