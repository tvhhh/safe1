import Device from '@/models/devices';

export default interface Building {
  name: string,
  address?: string,
  devices: Device[],
  role: "owner" | "admin" | "member"
};