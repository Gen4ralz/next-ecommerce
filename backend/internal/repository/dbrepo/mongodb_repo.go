package dbrepo

import (
	"backend/internal/models"
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func (m *MongoDBRepo) ProductBySlug(slug string)(*models.Product,error) {
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

func (m *MongoDBRepo) InsertProduct(product models.Product) (error) {
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
        "numReviews": product.NumReviews,
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

func (m *MongoDBRepo) InsertManyUser(users []models.User) (error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	collection := m.DB.Collection("users")
	var docs []interface{}
	for _, user := range users {
		docs = append(docs, user)
	}
	_, err := collection.InsertMany(ctx, docs)
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoDBRepo) DeleteAllProducts()(error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	_, err := m.DB.Collection("products").DeleteMany(ctx, bson.M{})
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoDBRepo) DeleteAllUsers()(error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	_, err := m.DB.Collection("users").DeleteMany(ctx, bson.M{})
	if err != nil {
		return err
	}
	return nil
}

func (m *MongoDBRepo) GetUserByEmail(email string)(*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	var user models.User

	collection := m.DB.Client().Database("next-ecommerce").Collection("users")
	err := collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("user not found for email %s", email)
		}
		return nil, err
	}

	return &user, nil
}

func (m *MongoDBRepo) GetUserByID(id string)(*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	var user models.User

	collection := m.DB.Client().Database("next-ecommerce").Collection("users")
	err := collection.FindOne(ctx, bson.M{"id": id}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("user not found for id %s", id)
		}
		return nil, err
	}

	return &user, nil
}

func (m *MongoDBRepo) CreateOrder(order models.Order) (string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	// var newID string
	collection := m.DB.Collection("orders")
	_, err := collection.InsertOne(ctx, bson.M{
		"_id":			 		order.ID,
		"user_id":       		order.UserID,
		"order_items":   		order.OrderItems,
		"shipping_address":     order.ShippingAddress,
		"paymentMethod":       	order.PaymentMethod,
		"itemsPrice":   		order.ItemsPrice,
		"shippingFee":  		order.ShippingFee,
		"totalPrice":   		order.TotalPrice,
		"is_paid":       		order.IsPaid,
		"paid_at":       		order.PaidAt,
		"is_delivered":  		order.IsDelivered,
		"delivered_at":  		order.DeliveredAt,
		"created_at":    		order.CreatedAt,
		"updated_at":    		order.UpdatedAt,
	})
	if err != nil {
		return "",err
	}

	return order.ID.Hex(), nil
}

func (m *MongoDBRepo) GetOrderByID(id string) (*models.Order, error) {
	ctx, cancel := context.WithTimeout(context.Background(), dbTimeOut)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
    return nil, fmt.Errorf("invalid order id: %s", id)
	}

	var order models.Order

	collection := m.DB.Client().Database("next-ecommerce").Collection("orders")
	err = collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&order)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("order not found for id %s", id)
		}
		return nil, err
	}

	return &order, nil
}