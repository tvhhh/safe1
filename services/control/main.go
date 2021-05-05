package main

func main() {
	a := App{}
	a.Initialize(
		"io.adafruit.com",
		1883,
		"go_mqtt_client",
		"tvhhh",
		"PUT_ADAFRUIT_IO_KEY_HERE",
	)
}
