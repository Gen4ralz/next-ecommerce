package main

import (
	"backend/internal/models"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
)

func (app *application) Home(res http.ResponseWriter, req *http.Request) {
	var payload = struct {
		Status string		`json:"status"`
		Message string		`json:"message"`
		Version string		`json:"version"`
	}{
		Status: "active",
		Message: "Go Ecommerce server up and running",
		Version: "1.0.0",
	}

	_ = app.writeJSON(res, http.StatusOK, payload)
}

func (app *application) SeedProducts(res http.ResponseWriter, req *http.Request) {
	nina := models.Product{
		Name:     "Nina Sets",
		Slug:     "nina-sets",
		Category: "Sets",
		Image:    "/images/nina-bn.jpg",
		Images: []models.Image{
			{Src: "/images/nina-bn.jpg", Alt: "nina-bn"},
			{Src: "/images/nina-cm.jpg", Alt: "nina-cm"},
			{Src: "/images/nina-gn.jpg", Alt: "nina-gn"},
			{Src: "/images/nina-pk.jpg", Alt: "nina-pk"},
		},
		Colors: []models.Color{
			{
				Name:   "Brick",
				Class:  "#A0522D",
				Sizes:  []models.Size{{Name: "Freesize", Stock: 5}},
				SKU:    "nina-bn",
				Image:  "/images/nina-bn.jpg",
			},
			{
				Name:   "Cream",
				Class:  "#FFF5EE",
				Sizes:  []models.Size{{Name: "Freesize", Stock: 2}},
				SKU:    "nina-cm",
				Image:  "/images/nina-cm.jpg",
			},	
			{
				Name:   "Olive",
				Class:  "#556B2F",
				Sizes:  []models.Size{{Name: "Freesize", Stock: 0}},
				SKU:    "nina-gn",
				Image:  "/images/nina-gn.jpg",
			},
			{
				Name:   "Pink",
				Class:  "#DDA0DD",
				Sizes:  []models.Size{{Name: "Freesize", Stock: 5}},
				SKU:    "nina-pk",
				Image:  "/images/nina-pk.jpg",
			},
		},
		Price:        590,
		Brand:        "Glamclothes",
		Rating:       4.6,
		NumReviews:   8,
		Description:  "ชุดเซทสายไขว้ เนื้อผ้าลื่นนิ่ม ใส่สบาย ลุคชิลๆ กางเกงเอวยางยืดรอบตัว  แนะนำเลยค่า งานแกรมเหมือนเดิมค่า",
		Details: []models.Detail{
			{Bust: "36", Tlength: "22"},
			{Waise: "24 - 38", Hip: "38", Blength: "39"},
		},
		Models: []models.Model{
			{Height: "160 ซม."},
			{Size: "32 / 25 / 34"},
			{Wear: "นางแบบสวมใส่ไซส์ S หรือ Freesize"},
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	err := app.DB.DeleteAllProducts()
	if err != nil {
		app.errorJSON(res, err)
		return
	}

	err = app.DB.InsertProduct(nina)
	if err != nil {
		app.errorJSON(res, err)
		return
	}
    //Return success response
    _ = app.writeJSON(res, http.StatusCreated, nil)
}

func (app *application) AllProducts(res http.ResponseWriter, req *http.Request) {
	// var products []models.Product

	products, err := app.DB.AllProducts()
	if err != nil {
		fmt.Println(err)
	}

	_ = app.writeJSON(res, http.StatusOK, products)
}

func (app *application) ProductBySlug(res http.ResponseWriter, req *http.Request) {
    // Get the slug from the request URL
    slug := chi.URLParam(req, "slug")

	product, err := app.DB.ProductBySlug(slug)
	if err != nil {
		app.errorJSON(res, err)
		return
	}
    
   _ = app.writeJSON(res, http.StatusOK, product)
}

func (app *application) authenticate(res http.ResponseWriter, req *http.Request) {
	// read json payload

	// validate user against database

	// check password

	// create a JWT user
	u := jwtUser{
		ID: 1,
		FirstName: "Admin",
		LastName: "User",
	}

	// generate tokens
	tokens, err := app.auth.GenerateTokenPair(&u)
	if err != nil {
		app.errorJSON(res, err)
		return
	}

	log.Println(tokens.Token)
	refreshCookie := app.auth.GetRefreshCookie(tokens.RefreshToken)
	http.SetCookie(res, refreshCookie)

	res.Write([]byte(tokens.Token))
}
