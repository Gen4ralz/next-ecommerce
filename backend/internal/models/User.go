package models

import (
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID        	primitive.ObjectID 	`bson:"_id,omitempty" json:"id,omitempty"`
	IsAdmin 	bool				`bson:"is_admin" json:"is_admin"`
	Email     	string             	`bson:"email" json:"email"`
	FirstName 	string             	`bson:"first_name,omitempty" json:"first_name,omitempty"`
	LastName  	string             	`bson:"last_name,omitempty" json:"last_name,omitempty"`
	Password  	string             	`bson:"password" json:"password"`
	CreatedAt 	time.Time          	`bson:"created_at" json:"-"`
	UpdatedAt 	time.Time          	`bson:"updated_at" json:"-"`
}

func (u *User) PasswordMatches(plainText string) (bool, error) {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(plainText))
	if err != nil {
		switch {
		case errors.Is(err, bcrypt.ErrMismatchedHashAndPassword):
			// invalid password
			return false, nil
		default:
			return false, err
		}
	}
	return true, nil
}
