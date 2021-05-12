package api

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"

	log "github.com/sirupsen/logrus"
)

var dataUrl = os.Getenv("DATA_SERVICE_URL")

func send(route string, payload map[string]interface{}) ([]byte, error) {
	postBody, _ := json.Marshal(payload)
	body := bytes.NewBuffer(postBody)
	res, err := http.Post(dataUrl+route, "application/json", body)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	log.WithFields(log.Fields{
		"statusCode": res.StatusCode,
		"status":     res.Status,
	}).Info("Response received from data service")

	return ioutil.ReadAll(res.Body)
}

func GetSubscribedDevices(uid string) ([]string, error) {
	response, err := send("/getSubscribedDevices", map[string]interface{}{"uid": uid})
	if err != nil {
		return nil, err
	}

	var topics []string
	err = json.Unmarshal(response, &topics)
	if err != nil {
		return nil, err
	}

	return topics, nil
}
