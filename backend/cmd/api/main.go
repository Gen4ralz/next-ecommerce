package main

import (
	"backend/internal/repository"
	"backend/internal/repository/dbrepo"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
)

const port = 8080

type application struct {
	DSN 			string
	Domain 			string
	DB 				repository.DatabaseRepo
	auth 			Auth
	JWTSecret 		string
	JWTIssuer 		string
	JWTAudience 	string
	CookieDomain	string
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
	app.JWTSecret = os.Getenv("JWT_SECRET")
	app.JWTIssuer = os.Getenv("JWT_ISSUER")
	app.JWTAudience = os.Getenv("JWT_AUDIENCE")
	app.CookieDomain = os.Getenv("COOKIE_DOMAIN")
	app.Domain = os.Getenv("DOMAIN")

	// connect to the database
	conn, err := app.connectToDB()
	if err != nil {
		log.Fatal(err)
	}
	app.DB = &dbrepo.MongoDBRepo{DB: conn}
	defer func() {
		if err = conn.Client().Disconnect(context.TODO()); err != nil {
			log.Fatal(err)
		}
	}()

	app.auth = Auth{
		Issuer: app.JWTIssuer,
		Audience: app.JWTAudience,
		Secret: app.JWTSecret,
		TokenExpiry: time.Minute * 10,
		RefreshExpiry: time.Hour *24,
		CookiePath: "/",
		CookieName: "Host-refresh_token",
		CookieDomain: app.CookieDomain,
	}

	log.Println("Starting application on port", port)

	// start web server
	err = http.ListenAndServe(fmt.Sprintf(":%d", port), app.routes())
	if err != nil {
		log.Fatal(err)
	}
}