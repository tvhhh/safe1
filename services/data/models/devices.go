package models

type Device struct {
	Building string `json:"building"`
	Name     string `json:"name" gorm:"primaryKey"`
	Topic    string `json:"topic"`
	Data     []Data `json:"data" gorm:"foreignKey:Device;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
