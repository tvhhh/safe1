package models

import (
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
	u := params.(User)

	err := db.Create(&u).Error
	if err != nil {
		return nil, err
	}

	return u, nil
}
