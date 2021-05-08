package models

import "time"

type Device struct {
	Name      string `json:"name"`
	Topic     string `json:"topic" gorm:"primaryKey"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
