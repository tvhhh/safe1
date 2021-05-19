package models

import (
	"encoding/json"
	"errors"
	"time"

	"gorm.io/gorm"
)

type Data struct {
	Device string    `json:"device" gorm:"primaryKey"`
	Time   time.Time `json:"time" gorm:"primaryKey"`
	Value  []byte    `json:"value"`
}

func UpdateData(db *gorm.DB, params interface{}) (interface{}, error) {
	payload := params.(map[string]interface{})

	var d Device
	if err := db.Where("name = ?", payload["device"].(string)).First(&d).Error; errors.Is(err, gorm.ErrRecordNotFound) {
		return map[string]interface{}{"success": true}, nil
	} else if err != nil {
		return nil, err
	}

	payload["value"], _ = json.Marshal(payload["value"])
	payload["time"] = time.Now()

	data := map[string]interface{}{
		"Device": payload["device"],
		"Time":   payload["time"],
		"Value":  payload["value"],
	}

	if err := db.Create(data).Error; err != nil {
		return nil, err
	}

	return map[string]interface{}{"success": true}, nil
}
