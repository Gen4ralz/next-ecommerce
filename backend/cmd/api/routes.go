package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func (app *application) routes() http.Handler {
	// create router mux
	mux := chi.NewRouter()
	mux.Use(middleware.Recoverer)
	mux.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"https://*", "http://*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE","OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders: []string{"Link"},
		AllowCredentials: true,
		MaxAge: 300,
	}))

	mux.Get("/", app.Home)

	mux.Post("/authenticate", app.authenticate)

	mux.Get("/products", app.AllProducts)
	mux.Get("/products/{slug}", app.ProductBySlug)
	mux.Get("/products/seed", app.SeedProducts)
	mux.Get("/users/seed", app.SeedUsers)

	mux.Route("/admin", func(mux chi.Router) {
		mux.Use(app.authRequired)
	})

	return mux
}