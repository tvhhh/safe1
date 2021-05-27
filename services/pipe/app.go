package main

import (
	"encoding/json"
	"fmt"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
	"github.com/tvhhh/safe1/services/pipe/api"
)

type App struct {
	pipe  mqtt.Client // CSE_BBC
	pipe1 mqtt.Client // CSE_BBC1
}

func (a *App) Initialize(broker, username, key, username1, key1 string) {
	a.pipe = a.setupMqttConfig(broker, username, key)
	if token := a.pipe.Connect(); token.Wait() && token.Error() != nil {
		log.WithFields(log.Fields{"error": token.Error()}).Error("Pipe connection failed")
		return
	}
	a.sub(a.pipe, "bk-iot-led", "bk-iot-speaker", "bk-iot-temp-humid")

	a.pipe1 = a.setupMqttConfig(broker, username1, key1)
	if token := a.pipe1.Connect(); token.Wait() && token.Error() != nil {
		log.WithFields(log.Fields{"error": token.Error()}).Error("Pipe1 connection failed")
		return
	}
	a.sub(a.pipe1, "bk-iot-relay", "bk-iot-servo", "bk-iot-gas")
}

func (a *App) setupMqttConfig(broker, username, key string) mqtt.Client {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("tcp://%s", broker))
	opts.SetClientID(uuid.NewString())
	opts.SetUsername(username)
	opts.SetPassword(key)
	opts.SetAutoReconnect(true)
	opts.SetDefaultPublishHandler(a.messageHandler)
	opts.SetOnConnectHandler(func(c mqtt.Client) {
		log.Info("Pipe connected")
	})
	opts.SetConnectionLostHandler(func(c mqtt.Client, err error) {
		log.WithFields(log.Fields{"error": err}).Error("Pipe disconnected")
	})
	opts.SetReconnectingHandler(func(c mqtt.Client, opts *mqtt.ClientOptions) {
		log.Info("Pipe reconnecting")
	})

	return mqtt.NewClient(opts)
}

func (a *App) messageHandler(client mqtt.Client, msg mqtt.Message) {
	log.WithFields(log.Fields{"topic": msg.Topic()}).Info("Message received")

	var payload map[string]interface{}
	if err := json.Unmarshal(msg.Payload(), &payload); err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Invalid message format")
		return
	}

	if err := api.UpdateTopicData(payload); err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Error calling api UpdateTopicData")
		return
	}
}

func (a *App) sub(client mqtt.Client, topics ...string) error {
	for _, topic := range topics {
		if token := client.Subscribe(topic, 1, nil); token.Wait() && token.Error() != nil {
			log.WithFields(log.Fields{"error": token.Error()}).Error("Error subscribing")
		}
		log.WithFields(log.Fields{"topic": topic}).Info("Subscribed")
	}

	return nil
}

func (a *App) Run() {
	log.Info("Running pipe service")

	keepAlive := make(chan struct{})
	<-keepAlive
}
