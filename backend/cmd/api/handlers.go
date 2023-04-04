package main

import (
	"fmt"
	"net/http"
)

func (app *application) Home(res http.ResponseWriter, req *http.Request) {
	fmt.Fprint(res, "Hello World!")
}