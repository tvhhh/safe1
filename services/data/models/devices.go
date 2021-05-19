package models

type Device struct {
	Building string `json:"building"`
	Name     string `json:"name" gorm:"primaryKey"`
	Topic    string `json:"topic"`
	Data     []Data `gorm:"foreignKey:Device"`
}
