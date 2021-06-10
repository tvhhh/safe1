export const OUTPUT_DEVICES = [
  { name: 'Extractor fans', subtitle: 'Propeller devices', icon: 'fan', deviceType:'fan', protection: true},
  { name: 'Sprinkler', subtitle: 'Mini pump devices', icon: 'sprinkler-variant', deviceType:'sprinkler', protection: true},
  { name: 'Fire alarm', subtitle: 'buzzer devices', icon: 'fire', deviceType: 'buzzer', protection: true},
  { name: 'Smart door', subtitle: 'RC servo devices', icon: 'door-open', deviceType:'servo', protection: true},
  { name: 'Power system', subtitle: 'relay circut', icon: 'flash', deviceType:'power', protection: true},
];


export type typeItem = {
  name: string, 
  subtitle: string,
  icon: string,
  deviceType: string,
  protection: boolean
}