package main

import "os"

func main() {
	a := App{}
	a.Initialize(
		os.Getenv("ADAFRUIT_BROKER"),
		os.Getenv("ADAFRUIT_USERNAME"),
		os.Getenv("ADAFRUIT_SECRET_KEY"),
		os.Getenv("ADAFRUIT_USERNAME_1"),
		os.Getenv("ADAFRUIT_SECRET_KEY_1"),
	)
	a.Run(9010)
}
