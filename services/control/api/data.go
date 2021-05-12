package api

import (
	"bytes"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"os"

	log "github.com/sirupsen/logrus"
)

var dataUrl = os.Getenv("DATA_SERVICE_URL")

func send(route string, payload map[string]interface{}) ([]byte, int, error) {
	postBody, _ := json.Marshal(payload)
	body := bytes.NewBuffer(postBody)
	res, err := http.Post(dataUrl+route, "application/json", body)
	if err != nil {
		return nil, 0, err
	}
	defer res.Body.Close()

	log.WithFields(log.Fields{
		"statusCode": res.StatusCode,
		"status":     res.Status,
	}).Info("Response received from data service")

	b, _ := ioutil.ReadAll(res.Body)
	if res.StatusCode == 200 {
		return b, res.StatusCode, nil
	} else if res.StatusCode == 400 || res.StatusCode == 500 {
		var response map[string]interface{}
		json.Unmarshal(b, &response)
		return nil, res.StatusCode, errors.New(response["error"].(string))
	} else {
		return nil, res.StatusCode, errors.New(res.Status)
	}
}

func UpdateTopicData(topic string, data map[string]interface{}) error {
	_, statusCode, err := send("/updateData", map[string]interface{}{"topic": topic, "data": data})
	if err != nil {
		log.WithFields(log.Fields{"code": statusCode, "error": err}).Error("Error calling api UpdateTopicData")
		return err
	}
	return nil
}
