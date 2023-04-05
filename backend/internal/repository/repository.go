package repository

import "backend/internal/models"

type DatabaseRepo interface {
	AllProducts() ([]*models.Product, error)
}