package utils

var TriggerProtection = map[string]interface{}{
	"buzzer": map[string]string{
		"id":   "3",
		"data": "1",
		"unit": "",
	},
	"fan": map[string]string{
		"id":   "11",
		"data": "1",
		"unit": "",
	},
	"power": map[string]string{
		"id":   "11",
		"data": "0",
		"unit": "",
	},
	"sprinkler": map[string]string{
		"id":   "11",
		"data": "1",
		"unit": "",
	},
	"servo": map[string]string{
		"id":   "17",
		"data": "60",
		"unit": "degree",
	},
}

func GetProtectionMessage(deviceName, deviceType string) map[string]string {
	if msgTemplate, ok := TriggerProtection[deviceType].(map[string]string); ok {
		return map[string]string{
			"id":   msgTemplate["id"],
			"name": deviceName,
			"data": msgTemplate["data"],
			"unit": msgTemplate["unit"],
		}
	}

	return nil
}
