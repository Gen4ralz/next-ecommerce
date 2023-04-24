package main

import (
	"backend/internal/models"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"golang.org/x/crypto/bcrypt"
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

func (app *application) SeedUsers(res http.ResponseWriter, req *http.Request) {
	var users []models.User

	u1 := models.User{
		IsAdmin: true,
		Email: "admin@example.com",
		Password: "admin123",
		FirstName: "John",
		LastName: "Smith",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(u1.Password), 12)
	u1.Password = string(hashedPassword)
	users = append(users, u1)

	u2 := models.User{
		IsAdmin: false,
		Email: "user@example.com",
		Password: "user123",
		FirstName: "Chalita",
		LastName: "Yooth",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	hashedPassword, _ = bcrypt.GenerateFromPassword([]byte(u2.Password), 12)
	u2.Password = string(hashedPassword)
	users = append(users, u2)

	err := app.DB.DeleteAllUsers()
	if err != nil {
		app.errorJSON(res, err)
		return
	}

	err = app.DB.InsertManyUser(users)
	if err != nil {
		app.errorJSON(res, err)
		return
	}
    //Return success response
    _ = app.writeJSON(res, http.StatusCreated, nil)
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
				ColorName:   "Brick",
				Class:  "#A0522D",
				Sizes:  []models.Size{{Name: "Freesize", Stock: 5, Sku: "nina-bn-freesize",}},
				Image:  "/images/nina-bn.jpg",
			},
			{
				ColorName:   "Cream",
				Class:  "#FFF5EE",
				Sizes:  []models.Size{{Name: "Freesize", Stock: 2, Sku: "nina-cm-freesize",}},
				Image:  "/images/nina-cm.jpg",
			},	
			{
				ColorName:   "Olive",
				Class:  "#556B2F",
				Sizes:  []models.Size{{Name: "Freesize", Stock: 0, Sku: "nina-gn-freesize",}},
				Image:  "/images/nina-gn.jpg",
			},
			{
				ColorName:   "Pink",
				Class:  "#DDA0DD",
				Sizes:  []models.Size{{Name: "Freesize", Stock: 5, Sku: "nina-pk-freesize"}},
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
	var requestPayload struct {
		Email string	`json:"email" bson:"email"`
		Password string	`json:"password" bson:"password"`
	}

	err := app.readJSON(res, req, &requestPayload)
	if err != nil {
		app.errorJSON(res, err, http.StatusBadRequest)
		return
	}

	// validate user against database
	user, err := app.DB.GetUserByEmail(requestPayload.Email)
	if err != nil {
		app.errorJSON(res, errors.New("invalid credentials"), http.StatusBadRequest)
		return
	}

	// check password
	valid, err := user.PasswordMatches(requestPayload.Password)
	if err != nil || !valid {
		app.errorJSON(res, errors.New("invalid credentials"), http.StatusBadRequest)
		return
	}

	// create a JWT user
	u := jwtUser{
		ID: user.ID.Hex(),
		FirstName: user.FirstName,
		LastName: user.LastName,
		Email: user.Email,
		IsAdmin: user.IsAdmin,
	}

	// generate tokens
	tokens, err := app.auth.GenerateTokenPair(&u)
	if err != nil {
		app.errorJSON(res, err)
		return
	}

	log.Println(tokens.Token)

	// Set the response payload
		responsePayload := map[string]interface{}{
			"name": 	user.FirstName,
			"email":    user.Email,
			"tokens":   tokens,
			"isAdmin":  user.IsAdmin,
			"_id":		user.ID,
		}
		app.writeJSON(res, http.StatusAccepted, responsePayload)
}

func (app *application) CreateOrder(res http.ResponseWriter, req *http.Request) {
	// Parse request body
	var payload models.Order
	err := app.readJSON(res, req, &payload)
	if err != nil {
		app.errorJSON(res, err)
		return
	}

	tokenString, _, err := app.auth.GetTokenFromHeaderAndVerify(res, req)
	if err != nil {
		app.errorJSON(res, err)
		return
	}

	userEmail, err := app.auth.SearchUserEmailFromToken(tokenString)
	if err != nil {
		app.errorJSON(res, err)
		return
	}
	log.Println(userEmail)

	user, err := app.DB.GetUserByEmail(userEmail)
	if err != nil {
		app.errorJSON(res, err)
		return
	}
	
	payload.ID = app.generateOrderID()

	payload.UserID = user.ID.Hex()
	payload.IsDelivered = false
	payload.IsPaid = false
	payload.CreatedAt = time.Now()
	payload.UpdatedAt = time.Now()

	log.Println(payload)


	// Save order to database
	orderID, err := app.DB.CreateOrder(payload)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	// Return success response
	resp := JSONResponse {
		Error: false,
		Message: "Order has been created",
		Data: map[string]string{
			"order_id": orderID,
		},
	}
	app.writeJSON(res, http.StatusCreated, resp)
}