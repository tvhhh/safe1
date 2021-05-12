package pipe

import (
	mqtt "github.com/eclipse/paho.mqtt.golang"
)

type Pipe struct {
	Client mqtt.Client
}
