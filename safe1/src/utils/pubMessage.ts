import { Message } from '@/models';
 
export type DeviceTopics =  "bk-iot-speaker" | "bk-iot-drv" | "bk-iot-relay" | "bk-iot-servo" 

type TopicMappings = {
    [key in DeviceTopics]: Message
};

let item = {
    name:"",
    data:"",
    unit:""
}

const pubMessages: TopicMappings = {
    "bk-iot-speaker": {id: "3", ...item},
    "bk-iot-drv":     {id: "10", ...item},
    "bk-iot-relay":   {id: "11", ...item},
    "bk-iot-servo":   {id: "17", ...item},
};

export default pubMessages;