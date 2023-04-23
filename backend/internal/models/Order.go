package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Order struct {
	ID        		primitive.ObjectID 	`bson:"_id,omitempty" json:"id,omitempty"`
	UserID			string			`json:"userid" bson:"userid"`
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
    FullName	string		`json:"fullName" bson:"fullName"`
	Address		string		`json:"address" bson:"address"`
	PostalCode	string		`json:"postalCode" bson:"postalCode"`
	Phone		string		`json:"phone" bson:"phone"`

}

type OrderItems struct {
	Quantity	int			`json:"quantity" bson:"quantity"`
	SKU			string		`json:"sku" bson:"sku"`
	Product		Product		`json:"product" bson:"product"`
	Color		Color		`json:"color" bson:"color"`
	Size		Size		`json:"size" bson:"size"`
}