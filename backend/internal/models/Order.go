package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Order struct {
	ID        		primitive.ObjectID 	`bson:"_id,omitempty" json:"id,omitempty"`				
	UserID			string			`json:"user_id" bson:"user_id"`
    OrderItems  	[]OrderItems	`json:"order_items" bson:"order_items"`
	ShippingAddress	ShippingAddress	`json:"shipping_address" bson:"shipping_address"`
	PaymentMethod	string			`json:"paymentMethod" bson:"paymentMethod"`
	PaymentResult	PaymentResult	`json:"paymentResult" bson:"paymentResult"`
	ItemsPrice		int				`json:"itemsPrice" bson:"itemsPrice"`
	ShippingFee		int				`json:"shippingFee" bson:"shippingFee"`
	TotalPrice		int				`json:"totalPrice" bson:"totalPrice"`
	IsPaid			bool			`json:"isPaid" bson:"isPaid"`
	IsDelivered		bool			`json:"isDelivered" bson:"isDelivered"`
	PaidAt			time.Time		`json:"paidAt,omitempty" bson:"paidAt,omitempty"`
	DeliveredAt		time.Time		`json:"deliveredAt,omitempty" bson:"deliveredAt,omitempty"`
	CreatedAt		time.Time		`json:"created_at" bson:"created_at"`
	UpdatedAt		time.Time		`json:"updated_at" bson:"updated_at"` 
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

type PaymentResult struct {
	ID			string		`json:"id" bson:"id"`
	Status		string		`json:"status" bson:"status"`
	Email		string		`json:"email_address" bson:"email_address"`
	Intent      string 		`json:"intent" bson:"intent"`
}