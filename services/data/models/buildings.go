package models

import (
	"encoding/json"

	"github.com/tvhhh/safe1/services/data/api"
	"gorm.io/gorm"
)

type Building struct {
	Address string   `json:"address"`
	Devices []Device `json:"devices" gorm:"foreignKey:Building;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Name    string   `json:"name" gorm:"primaryKey"`
	Members []User   `json:"members" gorm:"many2many:user_buildings;references:Uid;joinReferences:UserId;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	OwnerID string   `json:"ownerId"`
	Owner   User     `json:"owner" gorm:"foreignKey:OwnerID"`
}

func CreateBuilding(db *gorm.DB, params interface{}) (interface{}, error) {
	var b Building
	byteStream, _ := json.Marshal(params)
	json.Unmarshal(byteStream, &b)

	if err := db.Create(&b).Error; err != nil {
		return nil, err
	}

	if err := api.UpdateProtection(b.Devices); err != nil {
		return nil, err
	}

	return &b, nil
}

func GetBuilding(db *gorm.DB, params interface{}) (interface{}, error) {
	payload := params.(map[string]interface{})
	buildingName := payload["buildingName"].(string)

	var b Building
	if err := db.
		Model(&Building{Name: buildingName}).
		Preload("Devices").
		Preload("Owner").
		Preload("Members").
		First(&b).Error; err != nil {
		return nil, err
	}

	return &b, nil
}
