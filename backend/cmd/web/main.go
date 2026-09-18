package main

import (
	"fmt"
	"hydroguard/internal/database"
	"hydroguard/internal/util/mailer"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	amqp "github.com/rabbitmq/amqp091-go"
)

var app *App

func main() {
	app = &App{}
	e := echo.New()

	// Load local .env if available, ignored in production containers
	_ = godotenv.Load(".env", "../.env")

	// 1. Resolve PostgreSQL DSN (Direct DATABASE_URL from Render or structured env vars)
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		host := os.Getenv("POSTGRES_HOST")
		if host == "" {
			host = "localhost"
		}
		port := os.Getenv("POSTGRES_PORT")
		if port == "" {
			port = "5432"
		}
		user := os.Getenv("POSTGRES_USER")
		pass := os.Getenv("POSTGRES_PASSWORD")
		name := os.Getenv("POSTGRES_DB")

		if user != "" && name != "" {
			dsn = fmt.Sprintf("postgres://%s:%s@%s:%s/%s", user, pass, host, port, name)
		} else {
			// Fallback local connection string
			dsn = fmt.Sprintf("postgres://postgres:postgres@%s:%s/hydroguard", host, port)
		}
	}

	db, err := database.InitDB(dsn, 3*time.Second)
	if err != nil {
		log.Printf("Database warning (%v). Proceeding.", err)
	}

	// 2. Cache initialization
	cacheHost := os.Getenv("MEMCACHED_HOST")
	if cacheHost == "" {
		cacheHost = "127.0.0.1:11211"
	}
	cache, err := database.InitCache(cacheHost)
	if err != nil {
		log.Printf("Cache warning: %v", err)
	}

	// 3. AMQP Queue initialization
	amqpURL := os.Getenv("RABBITMQ_URL")
	if amqpURL == "" {
		amqpURL = "amqp://guest:guest@localhost:5672/"
	}
	queue, err := amqp.Dial(amqpURL)
	if err != nil {
		log.Printf("RabbitMQ warning (%v). Continuing without AMQP queue.", err)
	} else {
		defer queue.Close()
		m, closeMailer, err := mailer.InitMailer(queue)
		if err == nil {
			defer closeMailer()
			app.mailer = m
		}
		app.queue = queue
	}

	app.cache = cache
	app.db = db
	SetupRoutes(e)

	// 4. Bind to dynamic $PORT assigned by Render/Cloud PaaS (default 8080)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	serverAddr := fmt.Sprintf("0.0.0.0:%s", port)
	log.Printf("Starting HydroGuard server on %s", serverAddr)
	if err := e.Start(serverAddr); err != nil {
		log.Println(err.Error())
	}
}
