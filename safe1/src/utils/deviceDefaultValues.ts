import { DeviceType } from '@/models/devices';

type ValueMappings = {
    [key in DeviceType]: string
};

const deviceDefaultValues: ValueMappings = {
    "buzzer": "1023",
    "fan": "255",
    "gas": "1",
    "power": "0",
    "servo": "60",
    "sprinkler": "1",
    "temperature": "100"
};

export default deviceDefaultValues;