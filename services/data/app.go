package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type App struct {
	Router *mux.Router
}

func (a *App) Initialize() {

}

func (a *App) Run() {
	port := fmt.Sprintf(":%d", 8010)

	if err := http.ListenAndServe(port, a.Router); err != nil {
		log.Fatalf("Failed to listen on port %s", port)
	} else {
		log.Printf("Listening on port %s", port)
	}
}
