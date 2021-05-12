package pipe

import (
	"encoding/json"
	"fmt"
	"regexp"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	log "github.com/sirupsen/logrus"
	"github.com/tvhhh/safe1/services/control/api"
)

type Pipe struct {
	client   mqtt.Client
	topicFmt string
}

func NewPipe(topicFmt string) *Pipe {
	return &Pipe{topicFmt: topicFmt}
}

func (p *Pipe) Init(broker, username, password string, topic string) error {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("tcp://%s", broker))
	opts.SetClientID("control-svc-pipe")
	opts.SetUsername(username)
	opts.SetPassword(password)
	opts.SetAutoReconnect(true)
	opts.SetDefaultPublishHandler(p.messageHandler)
	opts.SetOnConnectHandler(func(c mqtt.Client) {
		log.Info("Pipe connected")
	})
	opts.SetConnectionLostHandler(func(c mqtt.Client, err error) {
		log.WithFields(log.Fields{"error": err}).Error("Pipe disconnected")
	})
	opts.SetReconnectingHandler(func(c mqtt.Client, opts *mqtt.ClientOptions) {
		log.Info("Pipe reconnecting")
	})

	p.client = mqtt.NewClient(opts)
	if token := p.client.Connect(); token.Wait() && token.Error() != nil {
		log.WithFields(log.Fields{"error": token.Error()}).Error("Pipe connection failed")
		return token.Error()
	}

	if err := p.sub(topic); err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Pipe subscription failed")
		return err
	}

	return nil
}

func (p *Pipe) messageHandler(client mqtt.Client, msg mqtt.Message) {
	if matched, err := regexp.MatchString(p.topicFmt, msg.Topic()); err != nil {
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

	api.UpdateTopicData(msg.Topic(), payload)
}

func (p *Pipe) sub(topic string) error {
	if token := p.client.Subscribe(topic, 1, nil); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	log.WithFields(log.Fields{"topic": topic}).Info("Subscribed")
	return nil
}
