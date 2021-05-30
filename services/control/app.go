package main

import (
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"

	"github.com/gorilla/mux"
	"github.com/tvhhh/safe1/services/control/client"
)

type App struct {
	broker     string
	router     *mux.Router
	secretKey  string
	secretKey1 string
	username   string
	username1  string
}

func (a *App) SetupAdafruitConfig(broker, username, key, username1, key1 string) {
	a.broker = broker
	a.username = username
	a.username1 = username1
	a.secretKey = key
	a.secretKey1 = key1
}

func (a *App) InitializeRoutes() {
	a.router = mux.NewRouter()
	a.router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		client.Serve(w, r, a.broker, a.username, a.secretKey, a.username1, a.secretKey1)
	})
}

func (a *App) Run(address int) {
	port := fmt.Sprintf(":%d", address)

	log.Infof("Listening on port %s", port)
	if err := http.ListenAndServe(port, a.router); err != nil {
		log.WithFields(log.Fields{"error": err}).Fatalf("Failed to listen on port %s", port)
	}
}
