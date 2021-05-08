package models

type User struct {
	Uid         string `json:"uid" gorm:"primaryKey"`
	DisplayName string `json:"name"`
	Email       string `json:"email"`
	PhoneNumber string `json:"phoneNumber"`
	PhotoURL    string `json:"photoURL"`
}
