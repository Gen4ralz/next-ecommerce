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
}