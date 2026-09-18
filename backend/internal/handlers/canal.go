package handlers

import (
	"encoding/csv"
	"hydroguard/internal/database"
	"hydroguard/internal/models"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/labstack/echo/v4"
)

func PredictCanalStuff(db database.Database) echo.HandlerFunc {
	// Read and parse CSV file at initialization with built-in fallbacks
	soilCValues := map[string]float32{
		"clayey":        1.2,
		"loamy":         1.4,
		"sandy":         1.65,
		"gravelly":      1.7,
		"silty":         1.3,
		"peaty":         1.5,
		"hardpan":       1.1,
		"alluvial":      1.45,
		"black-cotton":  1.2,
		"red":           1.5,
		"kankar":        1.6,
		"lateritic":     1.5,
		"rocky":         1.7,
		"saline":        1.4,
		"alluvial soil": 1.45,
	}

	csvPaths := []string{"c-value.csv", "./c-value.csv", "backend/c-value.csv", "../backend/c-value.csv"}
	var file *os.File
	var err error
	for _, p := range csvPaths {
		file, err = os.Open(p)
		if err == nil {
			break
		}
	}

	if err == nil && file != nil {
		defer file.Close()
		reader := csv.NewReader(file)
		if _, readErr := reader.Read(); readErr == nil {
			for {
				record, rErr := reader.Read()
				if rErr == io.EOF {
					break
				}
				if rErr != nil || len(record) != 2 {
					continue
				}
				if cValue, parseErr := strconv.ParseFloat(record[1], 32); parseErr == nil {
					soilCValues[strings.TrimSpace(strings.ToLower(record[0]))] = float32(cValue)
				}
			}
		}
	} else {
		log.Printf("c-value.csv not found in working paths; using embedded standard soil C-values.")
	}

	return func(c echo.Context) error {
		res := &models.Response{}

		type Canal struct {
			Qe          float32 `json:"qe,omitempty"`
			Width       float32 `json:"width,omitempty"`
			SoilType    string  `json:"soil_type,omitempty"`
			CanalArea   float32 `json:"canal_area,omitempty"`
			CanalType   string  `json:"canal_type,omitempty"`
			CanalDepth  float32 `json:"canal_depth,omitempty"`
			CanalLength float32 `json:"canal_length,omitempty"`
		}

		x := Canal{}
		if err := c.Bind(&x); err != nil {
			res.Message = err.Error()
			return c.JSON(http.StatusBadRequest, res)
		}

		// Validate input data
		if x.SoilType == "" || x.CanalArea == 0 || x.CanalDepth == 0 || x.CanalLength == 0 || x.Qe == 0 {
			res.Message = "Missing required parameters"
			return c.JSON(http.StatusBadRequest, res)
		}

		// Get c_avg value for the soil type
		cValue, exists := soilCValues[strings.TrimSpace(strings.ToLower(x.SoilType))]
		if !exists {
			cValue = 1.4 // Default c_avg fallback for general soil
		}

		// Calculate seepage loss
		seepageLoss := cValue * x.CanalArea * x.CanalDepth

		// Calculate evaporation loss
		evaporationLoss := x.Qe * x.CanalLength

		// Calculate total loss
		totalLoss := seepageLoss + evaporationLoss

		// Prepare response
		type Result struct {
			SeepageLoss     float32 `json:"seepage_loss"`
			EvaporationLoss float32 `json:"evaporation_loss"`
			TotalLoss       float32 `json:"total_loss"`
		}

		result := Result{
			SeepageLoss:     seepageLoss,
			EvaporationLoss: evaporationLoss,
			TotalLoss:       totalLoss,
		}

		res.Message = "Success"
		res.Data = result

		return c.JSON(http.StatusOK, res)
	}
}
