package main

import (
	"fmt"
	"net/http"

	log "github.com/sirupsen/logrus"

	"github.com/gorilla/mux"
	"github.com/tvhhh/safe1/services/control/client"
	"github.com/tvhhh/safe1/services/control/pipe"
)

type App struct {
	broker    string
	pipe      *pipe.Pipe
	router    *mux.Router
	secretKey string
	username  string
}

func (a *App) SetupAdafruitConfig(broker, username, key string) {
	a.broker = broker
	a.username = username
	a.secretKey = key
}

func (a *App) InitializeDataHandler(topicFmt string) {
	a.pipe = pipe.NewPipe(topicFmt)
	a.pipe.Init(a.broker, a.username, a.secretKey, fmt.Sprintf("%s/feeds/+", a.username))
}

func (a *App) InitializeRoutes() {
	a.router = mux.NewRouter()
	a.router.PathPrefix("/").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		client.Serve(w, r, a.broker, a.username, a.secretKey)
	})
}

func (a *App) Run(address int) {
	port := fmt.Sprintf(":%d", address)

	if err := http.ListenAndServe(port, a.router); err != nil {
		log.WithFields(log.Fields{"error": err}).Fatal("Failed to listen on port %s", port)
	} else {
		log.Info("Listening on port %s", port)
	}
}
