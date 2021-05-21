import { controlUrl } from '@/api/url';
import { Building, Device, Message, Request } from '@/models';
import store from '@/redux/store';
import actions from '@/redux/actions';

class ControlService {
  public ws: WebSocket | undefined;

  connect = () => {
    this.ws = new WebSocket(controlUrl);
    this.ws.onopen = this.init;
    this.ws.onmessage = (event: WebSocketMessageEvent) => {
      try {
        if (event.data) {
          this.handleMessage(JSON.parse(event.data) as Message);
        }
      } catch (err) {
        console.log(event.data);
      }
    };
    this.ws.onerror = (event: WebSocketErrorEvent) => {
      console.error(`Error establishing Websocket: ${event.message}`);
    };
    this.ws.onclose = (event: WebSocketCloseEvent) => {
      console.log(`Closing Websocket: ${event.message}`);
    };
  }

  init = () => {
    this.dispatchMessage({ 
      action: "init", 
      topic: "", 
      payload: store.getState().currentUser?.uid 
    });
  }

  sub = (building: Building) => {
    building.devices.forEach((device: Device) => {
      this.dispatchMessage({
        action: "sub",
        topic: device.topic,
        payload: null
      })
    });
  }

  unsub = (building: Building) => {
    building.devices.forEach((device: Device) => {
      this.dispatchMessage({
        action: "unsub",
        topic: device.topic,
        payload: null
      })
    });
  }

  pub = (device: Device, msg: any) => {
    this.dispatchMessage({
      action: "pub",
      topic: device.topic,
      payload: msg
    });
  }

  handleMessage = (message: Message) => {
    store.dispatch(actions.updateData(message));
  }

  dispatchMessage = (request: Request) => {
    this.ws?.send(JSON.stringify(request));
  }

  close = () => {
    this.ws?.close();
  }
};

export default new ControlService();