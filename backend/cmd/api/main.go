package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
)

const port = 8080

type application struct {
	DSN string
	Domain string
	DB *mongo.Database
}

func main() {
	// set application config
	var app application

	err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file: %v", err)
    }

    // Get the value of the DSN environment variable
    app.DSN = os.Getenv("DSN")

	// connect to the database
	conn, err := app.connectToDB()
	if err != nil {
		log.Fatal(err)
	}
	app.DB = conn
	defer func() {
		if err = conn.Client().Disconnect(context.Background()); err != nil {
			log.Fatal(err)
		}
	}()

	log.Println("Starting application on port", port)

	// start web server
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())
	if err != nil {
		log.Fatal(err)
	}
}