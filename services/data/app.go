package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"
	"github.com/tvhhh/safe1/services/data/models"

	"github.com/gorilla/mux"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type App struct {
	Router *mux.Router
	DB     *gorm.DB
}

func (a *App) ConnectPostgres(user, password, dbname, host string) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable", host, user, password, dbname)

	var err error
	a.DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.WithFields(log.Fields{
			"error": err,
			"dsn":   dsn,
		}).Fatal("Error creating DB")
	}

	if err := a.DB.AutoMigrate(
		&models.User{},
		&models.Building{},
		&models.Device{},
		&models.Data{},
	); err != nil {
		log.WithFields(log.Fields{"error": err}).Fatal("Error migrating DB")
	}
}

func (a *App) InitializeRoutes() {
	a.Router = mux.NewRouter()
	a.Router.HandleFunc("/createUser", a.createUser).Methods("POST")
	a.Router.HandleFunc("/createBuilding", a.createBuilding).Methods("POST")
	a.Router.HandleFunc("/getBuilding", a.getBuilding).Methods("POST")
	a.Router.HandleFunc("/getUserBuildings", a.getUserBuildings).Methods("POST")
	a.Router.HandleFunc("/updateData", a.updateData).Methods("POST")
	a.Router.HandleFunc("/ping", a.ping).Methods("GET")
}

func (a *App) createUser(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, models.User{}, models.CreateUser)
}

func (a *App) createBuilding(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, models.Building{}, models.CreateBuilding)
}

func (a *App) getBuilding(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]string{}, models.GetBuilding)
}

func (a *App) getUserBuildings(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]string{}, models.GetUserBuildings)
}

func (a *App) updateData(w http.ResponseWriter, r *http.Request) {
	a.handleRequest(w, r, map[string]string{}, models.UpdateData)
}

func (a *App) ping(w http.ResponseWriter, r *http.Request) {
	a.respond(w, http.StatusOK, "Pong")
}

func (a *App) handleRequest(w http.ResponseWriter, r *http.Request, body interface{}, handler func(*gorm.DB, interface{}) (interface{}, error)) {
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&body); err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Error decoding payload")
		a.respond(w, http.StatusBadRequest, err.Error())
		return
	}
	defer r.Body.Close()

	response, err := handler(a.DB, body)
	if err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Error handling request %s", r.URL)
		a.respond(w, http.StatusInternalServerError, err.Error())
		return
	}
	a.respond(w, http.StatusOK, response)
}

func (a *App) respond(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func (a *App) Run(address int) {
	port := fmt.Sprintf(":%d", address)

	log.Infof("Listening on port %s", port)
	if err := http.ListenAndServe(port, a.Router); err != nil {
		log.WithFields(log.Fields{"error": err}).Fatalf("Failed to listen on port %s", port)
	}
}
