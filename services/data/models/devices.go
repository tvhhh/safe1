package models

import (
	"encoding/json"

	"gorm.io/gorm"
)

type Device struct {
	Building string `json:"building"`
	Name     string `json:"name" gorm:"primaryKey"`
	Topic    string `json:"topic"`
	Data     []Data `gorm:"foreignKey:Device"`
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
