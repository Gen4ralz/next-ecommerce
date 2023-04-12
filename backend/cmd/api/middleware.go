package main

import "net/http"

func (app *application) authRequired(next http.Handler) http.Handler {
	return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
		_, _, err := app.auth.GetTokenFromHeaderAndVerify(res, req)
		if err != nil {
			res.WriteHeader(http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(res, req)
	})

}