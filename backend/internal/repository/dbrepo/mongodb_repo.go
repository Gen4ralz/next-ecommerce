package dbrepo

import (
	"backend/internal/models"
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type MongoDBRepo struct {
	DB *mongo.Database
}

const dbTimeOut = time.Second * 3

func (m *MongoDBRepo) Connection() *mongo.Database {
	return m.DB
}

func (m *MongoDBRepo) AllProducts() ([]*models.Product, error){
	var products []*models.Product

	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	collection := m.DB.Client().Database("next-ecommerce").Collection("products")

	cur, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	defer cur.Close(ctx)

	for cur.Next(ctx) {
		var product models.Product
		err := cur.Decode(&product)
		if err != nil {
			return nil, err
		}
		products = append(products, &product)
	}

	if err := cur.Err(); err != nil {
        return nil, err
    }

	return products, nil
}

func (m *MongoDBRepo) ProductBySlug(slug string)(*models.Product,error){
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	var product models.Product

	collection := m.DB.Client().Database("next-ecommerce").Collection("products")
	err := collection.FindOne(ctx, bson.M{"slug": slug}).Decode(&product)
	if err != nil {
		return nil, err
	}

	return &product, nil
}

func (m *MongoDBRepo) InsertProduct(product models.Product) (error){
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	collection := m.DB.Collection("products")
	_, err := collection.InsertOne(ctx, bson.M{
		"name":        product.Name,
        "slug":        product.Slug,
        "category":    product.Category,
        "image":       product.Image,
        "images":      product.Images,
        "colors":      product.Colors,
        "price":       product.Price,
        "brand":       product.Brand,
        "rating":      product.Rating,
        "num_reviews": product.NumReviews,
        "description": product.Description,
        "details":     product.Details,
        "models":      product.Models,
        "created_at":  product.CreatedAt,
        "updated_at":  product.UpdatedAt,
	})
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoDBRepo) DeleteAllProducts()(error){
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	_, err := m.DB.Collection("products").DeleteMany(ctx, bson.M{})
	if err != nil {
		return err
	}
	return nil
}