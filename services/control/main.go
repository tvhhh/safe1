package main

func main() {
	a := App{}
	a.Initialize(
		"tcp://io.adafruit.com",
		1883,
		"go_mqtt_client",
		"tvhhh",
		"safe123",
	)
}
