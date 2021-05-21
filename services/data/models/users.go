package models

import (
	"encoding/json"

	"gorm.io/gorm"
)

type User struct {
	Uid         string `json:"uid" gorm:"primaryKey"`
	DisplayName string `json:"displayName"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phoneNumber"`
	PhotoURL    string `json:"photoURL"`
}

func CreateUser(db *gorm.DB, params interface{}) (interface{}, error) {
	var user User
	byteStream, _ := json.Marshal(params)
	json.Unmarshal(byteStream, &user)

	if err := db.FirstOrCreate(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUserBuildings(db *gorm.DB, params interface{}) (interface{}, error) {
	uid := params.(map[string]interface{})["uid"]

	var b []Building
	if err := db.
		Model(&Building{}).
		Joins("join user_buildings on buildings.name = user_buildings.building_name").
		Where("user_buildings.user_id = ?", uid).
		Preload("Owner").
		Preload("Members").
		Preload("Devices").
		Find(&b).Error; err != nil {
		return nil, err
	}

	return &b, nil
}
