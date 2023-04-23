package models

import "time"

type Product struct {
    Name        string      `json:"name" bson:"name"`
    Slug        string      `json:"slug" bson:"slug"`
    Category    string      `json:"category" bson:"category"`
    Image       string      `json:"image" bson:"image"`
    Images      []Image     `json:"images" bson:"images"`
    Colors      []Color     `json:"colors" bson:"colors"`
    Price       float64     `json:"price" bson:"price"`
    Brand       string      `json:"brand" bson:"brand"`
    Rating      float64     `json:"rating" bson:"rating"`
    NumReviews  int         `json:"numReviews" bson:"numReviews"`
    Description string      `json:"description" bson:"description"`
    Details     []Detail    `json:"details" bson:"details"`
    Models      []Model     `json:"models" bson:"models"`
	CreatedAt	time.Time	`json:"created_at" bson:"-"`
	UpdatedAt	time.Time	`json:"updated_at" bson:"_"` 
}

type Image struct {
    Src 		string 		`json:"src" bson:"src"`
    Alt 		string 		`json:"alt" bson:"alt"`
}

type Color struct {
    ColorName  		string  `json:"colorname" bson:"colorname"`
    Class 		string   	`json:"class" bson:"class"`
    Sizes 		[]Size   	`json:"sizes" bson:"sizes"`
    Image 		string   	`json:"image" bson:"image"`
}

type Size struct {
    Name  		string 		`json:"sizename" bson:"sizename"`
    Stock 		int    		`json:"stock" bson:"stock"`
    Sku   		string   	`json:"sku" bson:"sku"`
}

type Detail struct {
    Bust   		string    	`json:"bust,omitempty" bson:"bust,omitempty"`
	Tlength		string		`json:"tlength,omitempty" bson:"tlength,omitempty"`	
    Waise  		string 		`json:"waise,omitempty" bson:"waise,omitempty"`
    Hip    		string    	`json:"hip,omitempty" bson:"hip,omitempty"`
    Blength 	string    	`json:"blength" bson:"blength"`
}

type Model struct {
    Height 		string `json:"height,omitempty" bson:"height,omitempty"`
    Size   		string `json:"size,omitempty" bson:"size,omitempty"`
    Wear   		string `json:"wear,omitempty" bson:"wear,omitempty"`
}
