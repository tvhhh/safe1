package models

import (
	"time"

	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type Device struct {
	Building  uuid.UUID `json:"building"`
	Name      string    `json:"name"`
	Topic     string    `json:"topic" gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

func CreateDevice(db *gorm.DB, params interface{}) (interface{}, error) {
	d := params.(Device)

	err := db.Create(&d).Error
	if err != nil {
		return nil, err
	}

	return d, nil
}
