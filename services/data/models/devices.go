package models

import "gorm.io/gorm"

type Device struct {
	Building   string `json:"building"`
	Name       string `json:"name" gorm:"primaryKey"`
	Protection bool   `json:"protection"`
	Region     string `json:"region"`
	Topic      string `json:"topic"`
	Type       string `json:"deviceType"`
	Data       []Data `json:"data" gorm:"foreignKey:Device;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

func UpdateProtection(db *gorm.DB, params interface{}) (interface{}, error) {
	payload := params.(map[string]interface{})
	deviceName := payload["deviceName"].(string)
	protection := payload["protection"].(bool)

	d := Device{Name: deviceName}
	if err := db.Model(&d).Update("protection", protection).Error; err != nil {
		return nil, err
	}

	return &d, nil
}
