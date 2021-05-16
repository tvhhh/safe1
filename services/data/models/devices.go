package models

import (
	"encoding/json"
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
	var d Device
	byteStream, _ := json.Marshal(params)
	json.Unmarshal(byteStream, &d)

	if err := db.Create(&d).Error; err != nil {
		return nil, err
	}

	return &d, nil
}
