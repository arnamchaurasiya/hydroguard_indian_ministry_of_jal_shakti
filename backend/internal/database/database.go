package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"hydroguard/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Database struct {
	conn    *gorm.DB
	timeout time.Duration
}

func InitDB(dsn string, timeout time.Duration) (Database, error) {
	db := Database{}
	var conn *gorm.DB
	var err error

	// 1. Try primary PostgreSQL DSN
	log.Printf("Connecting to primary PostgreSQL: %s", dsn)
	conn, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Warn),
	})

	// 2. Fallback to alternative PostgreSQL port (5432) if 5433 failed
	if err != nil {
		altDSN := fmt.Sprintf("postgres://%s:%s@localhost:5432/%s?sslmode=disable",
			os.Getenv("POSTGRES_USER"), os.Getenv("POSTGRES_PASSWORD"), os.Getenv("POSTGRES_DB"))
		log.Printf("PostgreSQL primary failed, attempting fallback DSN: %s", altDSN)
		conn, err = gorm.Open(postgres.Open(altDSN), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Warn),
		})
	}

	// 3. Fallback to local SQLite database if PostgreSQL is unavailable
	if err != nil {
		log.Printf("PostgreSQL connection failed (%v). Falling back to SQLite database.", err)
		dbDir := "../.data"
		_ = os.MkdirAll(dbDir, 0755)
		sqlitePath := filepath.Join(dbDir, "hydroguard.db")
		conn, err = gorm.Open(sqlite.Open(sqlitePath), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Warn),
		})
		if err != nil {
			return db, fmt.Errorf("failed to initialize fallback sqlite database: %w", err)
		}
		log.Printf("Successfully connected to SQLite database at %s", sqlitePath)
	} else {
		log.Printf("Successfully connected to PostgreSQL database!")
	}

	db.conn = conn
	db.timeout = timeout

	// Migrate schemas
	err = conn.AutoMigrate(
		&models.Dam{},
		&models.Notification{},
		&models.Coordinate{},
		&models.User{},
		&models.Analysis{},
		&models.NotificationsRead{},
		&models.Crop{},
		&models.CommandCoordinate{},
		&models.CropAnalysis{},
	)
	if err != nil {
		log.Printf("AutoMigrate warning: %v", err)
	}

	// Seed default data if database is empty
	seedData(conn)

	return db, nil
}

func seedData(db *gorm.DB) {
	var count int64
	db.Model(&models.Dam{}).Count(&count)
	if count == 0 {
		log.Println("Seeding initial Dam data...")
		dams := []models.Dam{
			{
				Id:              1,
				Name:            "Gobind Sagar Dam (Bhakra)",
				Latitude:        31.41,
				Longitude:       76.43,
				MeanDepth:       35.7,
				GrossVolume:     9340000000,
				Status:          "Good",
				LastMaintenance: time.Now().AddDate(-1, 0, 0),
			},
			{
				Id:              2,
				Name:            "Tehri Dam",
				Latitude:        30.37,
				Longitude:       78.48,
				MeanDepth:       50.0,
				GrossVolume:     3540000000,
				Status:          "Optimal",
				LastMaintenance: time.Now().AddDate(-2, 0, 0),
			},
			{
				Id:              3,
				Name:            "Sardar Sarovar Dam",
				Latitude:        21.83,
				Longitude:       73.74,
				MeanDepth:       42.5,
				GrossVolume:     9500000000,
				Status:          "Good",
				LastMaintenance: time.Now().AddDate(0, -6, 0),
			},
		}
		for _, dam := range dams {
			db.Create(&dam)
		}

		// Seed initial analysis data for Dam 1
		analyses := []models.Analysis{
			{DamId: 1, WaterCover: 220.5, LiveVolume: 7500000, Sedimentation: 120000000, CreatedAt: time.Now().AddDate(0, -5, 0)},
			{DamId: 1, WaterCover: 222.1, LiveVolume: 7650000, Sedimentation: 122000000, CreatedAt: time.Now().AddDate(0, -4, 0)},
			{DamId: 1, WaterCover: 224.3, LiveVolume: 7800000, Sedimentation: 123500000, CreatedAt: time.Now().AddDate(0, -3, 0)},
			{DamId: 1, WaterCover: 226.0, LiveVolume: 7920000, Sedimentation: 125000000, CreatedAt: time.Now().AddDate(0, -2, 0)},
			{DamId: 1, WaterCover: 225.4, LiveVolume: 7880000, Sedimentation: 126000000, CreatedAt: time.Now().AddDate(0, -1, 0)},
		}
		for _, a := range analyses {
			db.Create(&a)
		}
	}

	var notifCount int64
	db.Model(&models.Notification{}).Count(&notifCount)
	if notifCount == 0 {
		log.Println("Seeding initial Notification data...")
		notifs := []models.Notification{
			{
				DamId:     1,
				Level:     "INFO",
				Content:   "Water level increased by 2.4% in Gobind Sagar Reservoir following monsoon rain.",
				CreatedAt: time.Now().Add(-2 * time.Hour),
			},
			{
				DamId:     2,
				Level:     "WARNING",
				Content:   "Sedimentation rate monitoring active for Tehri Reservoir sector 4.",
				CreatedAt: time.Now().Add(-5 * time.Hour),
			},
			{
				DamId:     3,
				Level:     "SUCCESS",
				Content:   "Routine maintenance and canal discharge verification complete.",
				CreatedAt: time.Now().Add(-24 * time.Hour),
			},
		}
		for _, n := range notifs {
			db.Create(&n)
		}
	}

	var cropCount int64
	db.Model(&models.Crop{}).Count(&cropCount)
	if cropCount == 0 {
		log.Println("Seeding initial Crop data...")
		defaultCrops := []models.Crop{
			{Name: "wheat", Season: "Rabi", TotalEtc: 450.0, Drip: true, Sprinkler: true},
			{Name: "rice", Season: "Kharif", TotalEtc: 1200.0, Drip: false, Sprinkler: false},
			{Name: "corn", Season: "Kharif", TotalEtc: 500.0, Drip: true, Sprinkler: true},
			{Name: "barley", Season: "Rabi", TotalEtc: 400.0, Drip: true, Sprinkler: true},
			{Name: "millet", Season: "Kharif", TotalEtc: 350.0, Drip: true, Sprinkler: true},
			{Name: "potato", Season: "Rabi", TotalEtc: 500.0, Drip: true, Sprinkler: true},
			{Name: "cotton", Season: "Kharif", TotalEtc: 700.0, Drip: true, Sprinkler: true},
			{Name: "sugarcane", Season: "Annual", TotalEtc: 1500.0, Drip: true, Sprinkler: false},
		}
		for _, c := range defaultCrops {
			db.Create(&c)
		}
	}

	var cmdCoordsCount int64
	db.Model(&models.CommandCoordinate{}).Count(&cmdCoordsCount)
	if cmdCoordsCount == 0 {
		log.Println("Seeding initial Command Coordinates data...")
		coords := []models.CommandCoordinate{
			{DamId: 1, Latitude: 31.41, Longitude: 76.43},
			{DamId: 1, Latitude: 31.45, Longitude: 76.48},
			{DamId: 1, Latitude: 31.40, Longitude: 76.50},
			{DamId: 1, Latitude: 31.36, Longitude: 76.45},
			{DamId: 2, Latitude: 30.37, Longitude: 78.48},
			{DamId: 2, Latitude: 30.41, Longitude: 78.52},
			{DamId: 2, Latitude: 30.35, Longitude: 78.55},
			{DamId: 3, Latitude: 21.83, Longitude: 73.74},
			{DamId: 3, Latitude: 21.88, Longitude: 73.80},
			{DamId: 3, Latitude: 21.80, Longitude: 73.82},
		}
		for _, cc := range coords {
			db.Create(&cc)
		}
	}
}

func (d Database) Ctx(c context.Context) (context.Context, context.CancelFunc) {
	return context.WithTimeout(c, d.timeout)
}

