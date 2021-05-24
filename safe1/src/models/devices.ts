export default interface Device {
  name: string,
  topic: string,
  data: { time: Date, value: number | string }[]
};