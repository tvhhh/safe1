package main

import (
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"

	"github.com/gorilla/mux"
	"github.com/tvhhh/safe1/services/control/client"
)

type App struct {
	Router       *mux.Router
	adaBroker    string
	adaUsername  string
	adaSecretKey string
}

func (a *App) SetupAdafruitConfig(broker, username, key string) {
	a.adaBroker = broker
	a.adaUsername = username
	a.adaSecretKey = key
}

func (a *App) InitializeRoutes() {
	a.Router = mux.NewRouter()
	a.Router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		client.Serve(w, r, a.adaBroker, a.adaUsername, a.adaSecretKey)
	})
}

func (a *App) Run(address int) {
	port := fmt.Sprintf(":%d", address)

	if err := http.ListenAndServe(port, a.Router); err != nil {
		log.WithFields(log.Fields{"error": err}).Fatal("Failed to listen on port %s", port)
	} else {
		log.Info("Listening on port %s", port)
	}
}
