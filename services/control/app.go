package main

import (
	"fmt"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
)

type App struct {
	Router *mux.Router
}

func (a *App) messagePubHandler(client mqtt.Client, msg mqtt.Message) {
	fmt.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())
}

func (a *App) connectHandler(client mqtt.Client) {
	log.Info("Connected to MQTT broker")
}

func (a *App) connectLostHandler(client mqtt.Client, err error) {
	log.WithFields(log.Fields{
		"error": err,
	}).Error("Connection to MQTT broker lost")
}

func (a *App) Initialize(broker string, port int, clientId string, username string, password string) {
	log.SetLevel(log.DebugLevel)
	log.Info("Client MQTT...")

	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("tcp://%s:%d", broker, port))
	opts.SetClientID(clientId)
	opts.SetUsername(username)
	opts.SetPassword(password)
	opts.SetDefaultPublishHandler(a.messagePubHandler)
	opts.OnConnect = a.connectHandler
	opts.OnConnectionLost = a.connectLostHandler
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.WithFields(log.Fields{
			"error": token.Error(),
			"url":   fmt.Sprintf("tcp://%s:%d", broker, port),
		}).Error("MQTT server connection error")

		panic(nil)
	} else {
		log.WithFields(log.Fields{
			"url": fmt.Sprintf("tcp://%s:%d", broker, port),
		}).Debug("MQTT server connection")
	}

	log.WithFields(log.Fields{
		"is connected": client.IsConnected(),
	}).Info("Connection status")

	sub(client)
	publish(client)

	client.Disconnect(250)
}

func publish(client mqtt.Client) {
	num := 10
	for i := 0; i < num; i++ {
		text := fmt.Sprintf("Message %d", i)
		if token := client.Publish("tvhhh/feeds/bbc-led", 0, false, text); token.Wait() && token.Error() != nil {
			log.WithFields(log.Fields{
				"error": token.Error(),
			}).Error("MQTT publish error")

			panic(nil)
		}
		time.Sleep(time.Second)
	}
}

func sub(client mqtt.Client) {
	topic := "tvhhh/feeds/bbc-led"
	if token := client.Subscribe(topic, 1, nil); token.Wait() && token.Error() != nil {
		log.WithFields(log.Fields{
			"error": token.Error(),
		}).Error("MQTT subscribe error")

		panic(nil)
	}
	log.Info("Subscribed to topic: %s", topic)
}
