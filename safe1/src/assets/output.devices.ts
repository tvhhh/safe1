export const OUTPUT_DEVICES = [
  {
    name: 'Extractor fans',
    subtitle: 'Propeller devices', 
    icon: 'fan', 
    deviceType:'fan', 
    protection: true, 
    setting:'Fan speed',
    maxSetting: 255
  },
  { 
    name: 'Sprinkler', 
    subtitle: 'Mini pump devices', 
    icon: 'sprinkler-variant', 
    deviceType:'sprinkler', 
    protection: true, 
    setting: 'Sprinkler controller',
    maxSetting: 1
  },
  { 
    name: 'Fire alarm', 
    subtitle: 'buzzer devices', 
    icon: 'fire', 
    deviceType: 'buzzer', 
    protection: true,
    setting: 'Buzzer volume',
    maxSetting: 1023
  },
  { 
    name: 'Smart door', 
    subtitle: 'RC servo devices', 
    icon: 'door-open', 
    deviceType:'servo', 
    protection: true,
    setting: 'Door rotation angle',
    maxSetting: 180
  },
  { 
    name: 'Power system', 
    subtitle: 'relay circut', 
    icon: 'flash', 
    deviceType:'power', 
    protection: true,
    setting: 'Power controller',
    maxSetting: 1
  },
];


export type typeItem = {
  name: string, 
  subtitle: string,
  icon: string,
  deviceType: string,
  protection: boolean,
  setting: string,
  maxSetting: number
}