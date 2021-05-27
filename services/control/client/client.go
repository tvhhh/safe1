package client

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"sync"

	"github.com/tvhhh/safe1/services/control/utils"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	log "github.com/sirupsen/logrus"

	"github.com/gorilla/websocket"
)

type Client struct {
	broker      string
	mqttClient  mqtt.Client
	mqttClient1 mqtt.Client
	msgChan     chan []byte
	mu          sync.Mutex
	password    string
	password1   string
	username    string
	username1   string
	wsConn      *websocket.Conn
}

func New(conn *websocket.Conn, broker, username, password, username1, password1 string) *Client {
	return &Client{
		broker:    broker,
		msgChan:   make(chan []byte),
		password:  password,
		password1: password1,
		username:  username,
		username1: username1,
		wsConn:    conn,
	}
}

func Serve(w http.ResponseWriter, r *http.Request, broker, username, password, username1, password1 string) {
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

	c := New(conn, broker, username, password, username1, password1)

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

func (c *Client) validateWsMessage(pack map[string]interface{}) (string, string, string, error) {
	var action string
	var topic string
	var payload string

	if a, ok := pack["action"]; !ok {
		return "", "", "", errors.New("missing action")
	} else {
		action = a.(string)
	}

	if t, ok := pack["topic"]; !ok {
		return "", "", "", errors.New("missing topic")
	} else {
		topic = t.(string)
	}

	if p, ok := pack["payload"]; !ok {
		return "", "", "nil", errors.New("missing payload")
	} else {
		payload = p.(string)
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
		clientId := payload
		if err := c.initMqtt(clientId); err != nil {
			log.WithFields(log.Fields{"error": err}).Error("MQTT server connection failed")
		}
	case "pub":
		if err := c.publishMqttTopic(topic, payload); err != nil {
			log.WithFields(log.Fields{"topic": topic, "error": err}).Error("Error publishing topic")
			response := fmt.Sprintf("Publishing %s failed", topic)
			c.respond([]byte(response))
		} else {
			response := fmt.Sprintf("Successfully published %s", topic)
			c.respond([]byte(response))
		}
	case "sub":
		if err := c.subscribeMqttTopic(topic); err != nil {
			log.WithFields(log.Fields{"topic": topic, "error": err}).Error("Error subscribing topic")
			response := fmt.Sprintf("Subscribing %s failed", topic)
			c.respond([]byte(response))
		} else {
			response := fmt.Sprintf("Successfully subscribed %s", topic)
			c.respond([]byte(response))
		}
	case "unsub":
		if err := c.unsubscribeMqttTopic(topic); err != nil {
			log.WithFields(log.Fields{"topic": topic, "error": err}).Error("Error unsubscribing topic")
			response := fmt.Sprintf("Unsubscribing %s failed", topic)
			c.respond([]byte(response))
		} else {
			response := fmt.Sprintf("Successfully unsubscribed %s", topic)
			c.respond([]byte(response))
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
		close(c.msgChan)
		return nil
	})
}

// End WebSocket part

// MQTT part

func (c *Client) initMqtt(clientId string) error {
	c.mqttClient = c.initMqttClient(c.broker, clientId, c.username, c.password)
	if token := c.mqttClient.Connect(); token.Wait() && token.Error() != nil {
		return token.Error()
	}

	c.mqttClient1 = c.initMqttClient(c.broker, clientId, c.username1, c.password1)
	if token := c.mqttClient1.Connect(); token.Wait() && token.Error() != nil {
		return token.Error()
	}

	return nil
}

func (c *Client) initMqttClient(broker, clientId, username, password string) mqtt.Client {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(fmt.Sprintf("tcp://%s", broker))
	opts.SetClientID(clientId)
	opts.SetUsername(username)
	opts.SetPassword(password)
	opts.SetAutoReconnect(false)
	opts.SetCleanSession(false)
	opts.SetDefaultPublishHandler(c.mqttMessageHandler)
	opts.SetOnConnectHandler(c.mqttConnectHandler)
	opts.SetConnectionLostHandler(c.mqttConnectLostHandler)
	opts.SetReconnectingHandler(c.mqttReconnectingHandler)

	return mqtt.NewClient(opts)
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
	if utils.FindTopic(topic, utils.Topics) {
		if err := c.subscribe(c.mqttClient, c.username, topic); err != nil {
			return err
		}
	} else if utils.FindTopic(topic, utils.Topics1) {
		if err := c.subscribe(c.mqttClient1, c.username1, topic); err != nil {
			return err
		}
	}
	return nil
}

func (c *Client) subscribe(client mqtt.Client, username, topic string) error {
	if client == nil {
		return errors.New("MQTT client not established yet")
	}
	if token := client.Subscribe(fmt.Sprintf("%s/feeds/%s", username, topic), 1, nil); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	log.WithFields(log.Fields{"topic": topic}).Info("Subscribed")
	return nil
}

func (c *Client) unsubscribeMqttTopic(topic string) error {
	if utils.FindTopic(topic, utils.Topics) {
		if err := c.unsubscribe(c.mqttClient, c.username, topic); err != nil {
			return err
		}
	} else if utils.FindTopic(topic, utils.Topics1) {
		if err := c.unsubscribe(c.mqttClient1, c.username1, topic); err != nil {
			return err
		}
	}
	return nil
}

func (c *Client) unsubscribe(client mqtt.Client, username, topic string) error {
	if client == nil {
		return errors.New("MQTT client not established yet")
	}
	if token := client.Unsubscribe(fmt.Sprintf("%s/feeds/%s", username, topic)); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	log.WithFields(log.Fields{"topic": topic}).Info("Unsubscribed")
	return nil
}

func (c *Client) publishMqttTopic(topic string, msg string) error {
	if utils.FindTopic(topic, utils.Topics) {
		if err := c.publish(c.mqttClient, c.username, topic, msg); err != nil {
			return err
		}
	} else if utils.FindTopic(topic, utils.Topics1) {
		if err := c.publish(c.mqttClient1, c.username1, topic, msg); err != nil {
			return err
		}
	}
	return nil
}

func (c *Client) publish(client mqtt.Client, username, topic string, msg string) error {
	if client == nil {
		return errors.New("MQTT client not established yet")
	}
	if token := client.Publish(fmt.Sprintf("%s/feeds/%s", username, topic), 0, false, msg); token.Wait() && token.Error() != nil {
		return token.Error()
	}
	log.WithFields(log.Fields{"topic": topic}).Info("Published")
	return nil
}

// End MQTT part
