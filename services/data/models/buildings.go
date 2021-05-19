package models

import (
	"encoding/json"

	"gorm.io/gorm"
)

type Building struct {
	Address string   `json:"address"`
	Devices []Device `gorm:"foreignKey:Building"`
	Name    string   `json:"name" gorm:"primaryKey"`
}

func CreateBuilding(db *gorm.DB, params interface{}) (interface{}, error) {
	var b Building
	byteStream, _ := json.Marshal(params)
	json.Unmarshal(byteStream, &b)

	if err := db.Create(&b).Error; err != nil {
		return nil, err
	}

	return &b, nil
}
