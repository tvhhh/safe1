package main

import "os"

func main() {
	a := App{}

	a.ConnectPostgres(
		os.Getenv("APP_DB_USERNAME"),
		os.Getenv("APP_DB_PASSWORD"),
		os.Getenv("APP_DB_NAME"),
		os.Getenv("APP_DB_HOSTNAME"),
	)

	a.InitializeRoutes()

	a.Run(8000)
}
