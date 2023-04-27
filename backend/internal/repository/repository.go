package repository

import (
	"backend/internal/models"

	"go.mongodb.org/mongo-driver/mongo"
)

type DatabaseRepo interface {
	Connection() *mongo.Database
	AllProducts() ([]*models.Product, error)
	InsertProduct(product models.Product) (error)
	DeleteAllProducts()(error)
	ProductBySlug(slug string)(*models.Product,error)
	GetUserByEmail(email string)(*models.User, error)
	InsertManyUser(users []models.User) (error)
	DeleteAllUsers()(error)
	GetUserByID(id string)(*models.User, error)
	CreateOrder(order models.Order) (string, error)
	GetOrderByID(id string) (*models.Order,error)
	CheckExistsEmail(email string) (bool, error)
	InserOneUser(userPayload models.User) (error)
	UpdateOrder(order *models.Order) (error)
	GetOrderByUserID(user_id string) ([]*models.Order, error)
}