package models

import (
	"encoding/json"

	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type Building struct {
	ID      uuid.UUID `json:"id" gorm:"primaryKey"`
	Name    string    `json:"name"`
	Address string    `json:"address"`
	Devices []Device  `gorm:"foreignKey:Building"`
}

func (b *Building) BeforeCreate(db *gorm.DB) error {
	var err error
	b.ID, err = uuid.NewV4()
	return err
}

func CreateBuilding(db *gorm.DB, params interface{}) (interface{}, error) {
	var b Building
	byteStream, _ := json.Marshal(params)
	json.Unmarshal(byteStream, &b)

	if err := db.Create(&b).Error; err != nil {
		return nil, err
	}

	return &b, nil
}
