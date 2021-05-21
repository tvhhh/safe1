package client

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"sync"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	log "github.com/sirupsen/logrus"

	"github.com/gorilla/websocket"
)

type Client struct {
	broker     string
	mqttClient mqtt.Client
	msgChan    chan []byte
	mu         sync.Mutex
	password   string
	username   string
	wsConn     *websocket.Conn
}

func New(conn *websocket.Conn, broker, username, password string) *Client {
	return &Client{
		broker:   broker,
		msgChan:  make(chan []byte),
		password: password,
		username: username,
		wsConn:   conn,
	}
}

func Serve(w http.ResponseWriter, r *http.Request, broker, username, password string) {
	upgrader := websocket.Upgrader{
		ReadBufferSize:  4096,
		WriteBufferSize: 4096,
	}

	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Cannot upgrade http connection")
		return
	}

	c := New(conn, broker, username, password)

	go c.waitToReceive()
	go c.listenToMsgChan()

	c.handleDisconnect()
}

// WebSocket part

func (c *Client) waitToReceive() {
	for {
		_, msg, err := c.wsConn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.WithFields(log.Fields{"error": err}).Error("Unexpected close error")
			}
			break
		}
		c.request(msg)
	}
}

func (c *Client) listenToMsgChan() {
	for msg := range c.msgChan {
		c.respond(msg)
	}
}

func (c *Client) validateWsMessage(pack map[string]interface{}) (string, string, interface{}, error) {
	var action string
	var topic string
	var payload interface{}

	if a, ok := pack["action"]; !ok {
		return "", "", nil, errors.New("missing action")
	} else {
		action = a.(string)
	}

	if t, ok := pack["topic"]; !ok {
		return "", "", nil, errors.New("missing topic")
	} else {
		topic = t.(string)
	}

	if p, ok := pack["payload"]; !ok {
		return "", "", nil, errors.New("missing payload")
	} else {
		payload = p
	}

	return action, topic, payload, nil
}

func (c *Client) request(msg []byte) {
	var pack map[string]interface{}
	if err := json.Unmarshal(msg, &pack); err != nil {
		log.WithFields(log.Fields{"error": err}).Error("Invalid request payload")
	}

	action, topic, payload, err := c.validateWsMessage(pack)
	if err != nil {
		log.WithFields(log.Fields{
			"packet": pack,
			"error":  err,
		}).Error("Invalid message format")
	}

	switch action {
	case "init":
		clientId := payload.(string)
		if err := c.initMqtt(c.broker, clientId, c.username, c.password); err != nil {
			log.WithFields(log.Fields{"error": err}).Error("MQTT server connection failed")
		}
	case "pub":
		if err := c.publishMqttTopic(topic, payload); err != nil {
			log.WithFields(log.Fields{"topic": topic, "error": err}).Error("Error publishing topic")
		}
	case "sub":
		if err := c.subscribeMqttTopic(topic); err != nil {
			log.WithFields(log.Fields{"topic": topic, "error": err}).Error("Error subscribing topic")
		}
	case "unsub":
		if err := c.unsubscribeMqttTopic(topic); err != nil {
			log.WithFields(log.Fields{"topic": topic, "error": err}).Error("Error unsubscribing topic")
		}
	default:
		log.WithFields(log.Fields{"action": action}).Warn("Unknown action")
	}
}

func (c *Client) respond(msg []byte) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.wsConn.WriteMessage(websocket.TextMessage, msg)
}

func (c *Client) handleDisconnect() {
	c.wsConn.SetCloseHandler(func(code int, text string) error {
		if c.mqttClient != nil {
			c.mqttClient.Disconnect(250)
		}
		return nil
	})
}

// End WebSocket part

// MQTT part

func (c *Client) initMqtt(broker, clientId, username, password string) error {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("tcp://%s", broker))
	opts.SetClientID(clientId)
	opts.SetUsername(username)
	opts.SetPassword(password)
	opts.SetAutoReconnect(true)
	opts.SetCleanSession(false)
	opts.SetDefaultPublishHandler(c.mqttMessageHandler)
	opts.SetOnConnectHandler(c.mqttConnectHandler)
	opts.SetConnectionLostHandler(c.mqttConnectLostHandler)
	opts.SetReconnectingHandler(c.mqttReconnectingHandler)

	c.mqttClient = mqtt.NewClient(opts)
	if token := c.mqttClient.Connect(); token.Wait() && token.Error() != nil {
		return token.Error()
	}

	return nil
}

func (c *Client) mqttConnectHandler(client mqtt.Client) {
	log.Info("MQTT broker connected")
	c.respond([]byte("MQTT server connected"))
}

func (c *Client) mqttConnectLostHandler(client mqtt.Client, err error) {
	log.WithFields(log.Fields{"error": err}).Error("MQTT broker disconnected")
	c.respond([]byte("MQTT server disconnected"))
}

func (c *Client) mqttReconnectingHandler(client mqtt.Client, opts *mqtt.ClientOptions) {
	log.Info("MQTT broker reconnecting")
	c.respond([]byte("Reconnecting to MQTT server"))
}

func (c *Client) mqttMessageHandler(client mqtt.Client, msg mqtt.Message) {
	log.WithFields(log.Fields{"topic": msg.Topic()}).Info("Message received")
	c.msgChan <- msg.Payload()
}

func (c *Client) subscribeMqttTopic(topic string) error {
	if c.mqttClient == nil {
		return errors.New("MQTT client not established yet")
	}
	if token := c.mqttClient.Subscribe(topic, 1, nil); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	log.WithFields(log.Fields{"topic": topic}).Info("Subscribed")
	return nil
}

func (c *Client) unsubscribeMqttTopic(topic string) error {
	if c.mqttClient == nil {
		return errors.New("MQTT client not established yet")
	}
	if token := c.mqttClient.Unsubscribe(topic); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	log.WithFields(log.Fields{"topic": topic}).Info("Unsubscribed")
	return nil
}

func (c *Client) publishMqttTopic(topic string, msg interface{}) error {
	if c.mqttClient == nil {
		return errors.New("MQTT client not established yet")
	}
	if token := c.mqttClient.Publish(topic, 0, false, msg); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	log.WithFields(log.Fields{"topic": topic}).Info("Published")
	return nil
}

// End MQTT part
