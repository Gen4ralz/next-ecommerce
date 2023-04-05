package dbrepo

import (
	"backend/internal/models"

	"go.mongodb.org/mongo-driver/mongo"
)

type MongoDBRepo struct {
	DB *mongo.Database
}

func (m *MongoDBRepo) AllProducts() ([]*models.Product, error){
	var products []*models.Product

	return products, nil
}