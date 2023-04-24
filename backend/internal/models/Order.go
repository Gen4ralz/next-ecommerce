package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Order struct {
	ID        		primitive.ObjectID 	`bson:"_id,omitempty" json:"id,omitempty"`				
	UserID			string			`json:"user_id" bson:"user_id"`
    OrderItems  	[]OrderItems	`json:"orderItems" bson:"orderItems"`
	ShippingAddress	ShippingAddress	`json:"shipping_address" bson:"shipping_address"`
	PaymentMethod	string			`json:"paymentMethod" bson:"paymentMethod"`
	ItemsPrice		int				`json:"itemsPrice" bson:"itemsPrice"`
	ShippingFee		int				`json:"shippingFee" bson:"shippingFee"`
	TotalPrice		int				`json:"totalPrice" bson:"totalPrice"`
	IsPaid			bool			`json:"is_paid" bson:"is_paid"`
	IsDelivered		bool			`json:"is_delivered" bson:"is_delivered"`
	PaidAt			time.Time		`json:"paid_at,omitempty" bson:"paid_at,omitempty"`
	DeliveredAt		time.Time		`json:"delivered_at,omitempty" bson:"delivered_at,omitempty"`
	CreatedAt		time.Time		`json:"created_at" bson:"_"`
	UpdatedAt		time.Time		`json:"updated_at" bson:"_"` 
}

type ShippingAddress struct {
    FullName	string		`json:"fullName" bson:"full_name"`
	Address		string		`json:"address" bson:"address"`
	PostalCode	string		`json:"postalCode" bson:"postalCode"`
	Phone		string		`json:"phone" bson:"phone"`

}

type OrderItems struct {
	Name		string		`json:"name" bson:"name"`
	Quantity	int			`json:"quantity" bson:"quantity"`
	Image		string		`json:"image" bson:"image"`
	Sku			string		`json:"sku" bson:"sku"`
	Price		int			`json:"price" bson:"price"`
	Color		string		`json:"color" bson:"color"`
	Size		string		`json:"size" bson:"size"`
	Slug        string      `json:"slug" bson:"slug"`
    Category    string      `json:"category" bson:"category"`
	Stock		int			`json:"stock" bson:"stock"`
	Brand		string		`json:"brand" bson:"brand"`
}