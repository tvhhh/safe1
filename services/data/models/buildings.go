package models

import (
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
	b := params.(Building)

	err := db.Create(&b).Error
	if err != nil {
		return nil, err
	}

	return b, nil
}
