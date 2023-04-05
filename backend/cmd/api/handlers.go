package main

import (
	"backend/internal/models"
	"encoding/json"
	"fmt"
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

	out, err := json.Marshal(payload)
	if err != nil {
		fmt.Println(err)
	}
	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	res.Write(out)
}

func (app *application) AllProducts(res http.ResponseWriter, req *http.Request) {
	var products []models.Product

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

	products = append(products, nina)

	out, err := json.Marshal(products)
	if err != nil {
		fmt.Println(err)
	}

	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	res.Write(out)
}

func (app *application) ProductBySlug(res http.ResponseWriter, req *http.Request) {
    // Get the slug from the request URL
    slug := chi.URLParam(req, "slug")

	var products []models.Product

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

	products = append(products, nina)

	// Loop through the products and find the one with the matching slug
	var product *models.Product
	for _, i := range products {
		if i.Slug == slug {
			product = &i
			break
		}
	}

    // If the product is not found, return a 404 error
	if product == nil {
		http.NotFound(res, req)
		return
	}
    

    // Marshal the product data as JSON and send it in the response
	out, err := json.Marshal(product)
	if err != nil {
		fmt.Println(err)
	}
	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	res.Write(out)
}