type DeviceType = "buzzer" | "power" | "servo" | "sprinkler" | "fan" | "gas" | "temperature" | "humidity";

export default interface Device {
  name: string,
  topic: string,
  deviceType: DeviceType,
  region: string,
  protection: boolean,
  data: { time: Date, value: string }[]
};