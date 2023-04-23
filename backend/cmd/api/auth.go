package main

import (
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type Auth struct {
	Issuer 			string
	Audience 		string
	Secret			string
	TokenExpiry 	time.Duration
	CookieDomain	string
	CookiePath		string
	CookieName		string
}

type jwtUser struct {
    ID          string `json:"id" bson:"id"`
    FirstName   string `json:"first_name" bson:"first_name"`
    LastName    string `json:"last_name" bson:"last_name"`
    Email       string `json:"email" bson:"email"`
    IsAdmin     bool   `json:"is_admin" bson:"is_admin"`
}

type TokenPairs struct {
	Token			string	`json:"access_token" bson:"access_token"`
}

type Claims	struct {
	jwt.RegisteredClaims
}

func (j *Auth) GenerateTokenPair(user *jwtUser) (TokenPairs, error) {
	// Create a token
	token := jwt.New(jwt.SigningMethodHS256)

	// Set the claims
	claims := token.Claims.(jwt.MapClaims)
	claims["name"] = fmt.Sprintf("%s %s", user.FirstName, user.LastName)
	claims["sub"] = fmt.Sprint(user.ID)
	claims["aud"] = j.Audience
	claims["iss"] = j.Issuer
	claims["iat"] = time.Now().UTC().Unix()
	claims["typ"] = "JWT"
	claims["email"] = user.Email
    claims["is_admin"] = user.IsAdmin

	// Set the expiry for JWT
	claims["exp"] = time.Now().UTC().Add(j.TokenExpiry).Unix()

	// Create a signed token
	signedAccessToken, err := token.SignedString([]byte(j.Secret))
	if err != nil {
		return TokenPairs{}, err
	}

	// Create TokenPairs and populate with signed tokens
	var tokenPairs = TokenPairs {
		Token: signedAccessToken,
	}

	// Return TokenPairs
	return tokenPairs, nil
}

func (j *Auth) GetTokenFromHeaderAndVerify(res http.ResponseWriter, req *http.Request) (string, *Claims, error) {
	res.Header().Add("Vary", "Authorization")

	// get auth header
	authHeader := req.Header.Get("Authorization")

	// sanity check
	if authHeader == "" {
		return "", nil, errors.New("no auth header")
	}

	// split the header on spaces
	headerParts := strings.Split(authHeader, " ")
	if len(headerParts) != 2 {
		return "", nil, errors.New("invalid auth header")
	}

	// check to see if we have the word Bearer
	if headerParts[0] != "Bearer" {
		return "", nil, errors.New("invalid auth header")
	}

	token := headerParts[1]

	// declare an empty claims
	claims := &Claims{}

	// parse the token
	_, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(j.Secret), nil
	})
	if err != nil {
		if strings.HasPrefix(err.Error(), "token is expired by") {
			return "", nil, errors.New("expired token")
		}
		return "", nil, err
	}

	if claims.Issuer != j.Issuer {
		return "", nil, errors.New("invalid issuer")
	}
	return token, claims, nil
}

func (j *Auth) SearchUserEmailFromToken(tokenString string) (string, error) {

	// Parse the token claims to get the user email
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(j.Secret), nil
	})
	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", errors.New("invalid token claims")
	}

	userEmail, ok := claims["email"].(string)
	if !ok {
		return "", errors.New("invalid email claim")
	}

	return userEmail, nil
}