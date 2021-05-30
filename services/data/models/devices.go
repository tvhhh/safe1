package models

import (
	"github.com/tvhhh/safe1/services/data/api"
	"gorm.io/gorm"
)

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

	if err := db.Model(&Device{Name: deviceName}).First(&d).Error; err != nil {
		return nil, err
	}

	var devices []Device
	if err := db.
		Model(&Device{}).
		Where("building = ? and region = ?", d.Building, d.Region).
		Find(&devices).Error; err != nil {
		return nil, err
	}

	if err := api.UpdateProtection(devices); err != nil {
		return nil, err
	}

	return &d, nil
}

func GetInputDevices(db *gorm.DB, params interface{}) (interface{}, error) {
	var d []Device
	if err := db.
		Model(&Device{}).
		Where("type = 'gas' or type = 'temperature'").
		Find(&d).Error; err != nil {
		return nil, err
	}

	return d, nil
}

func GetOutputDevices(db *gorm.DB, params interface{}) (interface{}, error) {
	payload := params.(map[string]interface{})
	building := payload["building"].(string)
	region := payload["region"].(string)

	var d []Device
	if err := db.
		Model(&Device{}).
		Where("building = ? and region = ? and type <> 'gas' and type <> 'temperature'", building, region).
		Find(&d).Error; err != nil {
		return nil, err
	}

	return d, nil
}
