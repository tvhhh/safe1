package models

import (
	"encoding/json"

	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type User struct {
	Uid         string     `json:"uid" gorm:"primaryKey"`
	DisplayName string     `json:"name"`
	Email       string     `json:"email"`
	PhoneNumber string     `json:"phoneNumber"`
	PhotoURL    string     `json:"photoURL"`
	Buildings   []Building `gorm:"many2many:user_buildings;foreignKey:Uid;joinForeignKey:UserId;"`
}

type Role string

const (
	Owner  Role = "owner"
	Admin  Role = "admin"
	Member Role = "member"
)

type UserBuilding struct {
	BuildingId uuid.UUID `json:"buildingId" gorm:"primaryKey"`
	UserId     string    `json:"userId" gorm:"primaryKey"`
	Role       Role      `json:"role" gorm:"type:ENUM('owner','admin','member')"`
}

func CreateUser(db *gorm.DB, params interface{}) (interface{}, error) {
	var user User
	byteStream, _ := json.Marshal(params)
	json.Unmarshal(byteStream, &user)

	if err := db.Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUserBuildings(db *gorm.DB, params interface{}) (interface{}, error) {
	var user User
	uid := params.(map[string]string)["uid"]

	if err := db.
		Model(&User{Uid: uid}).
		Preload("Buildings").
		First(&user).Error; err != nil {
		return nil, err
	}

	return user.Buildings, nil
}
