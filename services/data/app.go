package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"

	"github.com/gorilla/mux"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type App struct {
	Router *mux.Router
	DB     *gorm.DB
}

func (a *App) Initialize(user, password, dbname string, host string) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable", host, user, password, dbname)

	var err error
	a.DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"dsn":   dsn,
		}).Fatal("Error creating DB")
	}
}

func (a *App) Run() {
	port := fmt.Sprintf(":%d", 8000)

	if err := http.ListenAndServe(port, a.Router); err != nil {
		log.Fatal("Failed to listen on port %s", port)
	} else {
		log.Info("Listening on port %s", port)
	}
}

func (a *App) Respond(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func (a *App) InitializeRoutes() {

}
