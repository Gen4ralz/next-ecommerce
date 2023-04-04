package main

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (app *application) routes() http.Handler {
	// create router mux
	mux := chi.NewRouter()

	mux.Use(middleware.Recoverer)
	mux.Get("/", app.Home)

	mux.Get("/products", app.AllProducts)

	return mux
}