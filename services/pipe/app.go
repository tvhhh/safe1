package main

import (
	"encoding/json"
	"fmt"
	"regexp"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	log "github.com/sirupsen/logrus"
	"github.com/tvhhh/safe1/services/pipe/api"
)

type App struct {
	pipe     mqtt.Client
	topicFmt string
}

func (a *App) Initialize(broker, username, key string) {
	a.topicFmt = fmt.Sprintf("%s/feeds/bk-iot-.*", username)

	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("tcp://%s", broker))
	opts.SetClientID("pipe-service")
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

	a.pipe = mqtt.NewClient(opts)
	if token := a.pipe.Connect(); token.Wait() && token.Error() != nil {
		log.WithFields(log.Fields{"error": token.Error()}).Error("Pipe connection failed")
		return
	}

	if err := a.sub(fmt.Sprintf("%s/feeds/+", username)); err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Pipe subscription failed")
		return
	}
}

func (a *App) messageHandler(client mqtt.Client, msg mqtt.Message) {
	if matched, err := regexp.MatchString(a.topicFmt, msg.Topic()); err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Error from regex")
	} else if !matched {
		return
	}

	log.WithFields(log.Fields{"topic": msg.Topic()}).Info("Message received")

	var payload map[string]interface{}
	if err := json.Unmarshal(msg.Payload(), &payload); err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Invalid message format")
		return
	}

	if err := api.UpdateTopicData(msg.Topic(), payload); err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Error calling api UpdateTopicData")
		return
	}
}

func (a *App) sub(topic string) error {
	if token := a.pipe.Subscribe(topic, 1, nil); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	log.WithFields(log.Fields{"topic": topic}).Info("Subscribed")
	return nil
}

func (a *App) Run() {
	log.Info("Running pipe service")

	keepAlive := make(chan struct{})
	<-keepAlive
}
