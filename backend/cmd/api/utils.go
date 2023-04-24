package main

import (
	"encoding/json"
	"errors"
	"io"
	"math/rand"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JSONResponse struct {
	Error bool	`json:"error"`
	Message string	`json:"message"`
	Data interface{}	`json:"data,omitempty"`
}

func (app *application) writeJSON(res http.ResponseWriter, status int, data interface{}, headers ...http.Header) error {
	out, err := json.Marshal(data)
	if err != nil {
		return err
	}

	if len(headers) > 0 {
		for key, value := range headers[0] {
			res.Header()[key] = value
		}
	}
	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(status)
	_, err = res.Write(out)
	if err != nil {
		return err
	}
	return nil
}

func (app *application) readJSON(res http.ResponseWriter, req *http.Request, data interface{}) error {
	maxBytes := 1024 * 1024
	req.Body = http.MaxBytesReader(res, req.Body, int64(maxBytes))

	dec := json.NewDecoder(req.Body)

	dec.DisallowUnknownFields()

	err := dec.Decode(data)
	if err != nil {
		return err
	}

	err = dec.Decode(&struct{}{})
	if err != io.EOF {
		return errors.New("body must only contain a single JSON value")
	}
	return nil
}

func (app *application) errorJSON(res http.ResponseWriter, err error, status ...int) error {
	statusCode := http.StatusBadRequest

	if len(status) > 0 {
		statusCode = status[0]
	}

	var payload JSONResponse
	payload.Error = true
	payload.Message = err.Error()
	return app.writeJSON(res, statusCode, payload)
}

func (app *application) generateOrderID() primitive.ObjectID {
    // Get current date in the format DDMMYY
    currentDate := time.Now().Format("02012006")

    // Append 000000 to make it 12 characters long
    orderIDString := currentDate + "0000"

    randString := RandomString(12)

    // Append 12 random characters to make it 24 characters long
    orderIDString += randString

    // Convert order ID string to ObjectId
    orderID, _ := primitive.ObjectIDFromHex(orderIDString)

    return orderID
}

func RandomString(n int) string {
    var letters = []rune("0123456789abcdef")
    rand.Seed(time.Now().UnixNano())

    b := make([]rune, n)
    for i := range b {
        b[i] = letters[rand.Intn(len(letters))]
    }
    return string(b)
}