import { controlUrl } from '@/api/url';
import Message from '@/models/messages';
import store from '@/redux/store';
import actions from '@/redux/actions';

class ControlService {
  public ws: WebSocket | undefined;

  connect() {
    this.ws = new WebSocket(controlUrl);
    this.ws.onopen = () => {};
    this.ws.onmessage = (event: WebSocketMessageEvent) => {
      if (event.data) this.handleMessage(event.data as Message);
    };
    this.ws.onerror = (event: WebSocketErrorEvent) => {
      console.error(`Error establishing Websocket: ${event}`);
      setTimeout(this.connect, 1000);
    };
    this.ws.onclose = (event: WebSocketCloseEvent) => {
      console.log(`Closing Websocket: ${event}`);
    };
  }

  handleMessage(message: Message) {
    store.dispatch(actions.updateData(message));
  }

  dispatchMessage(action: string, payload: any) {
    this.ws?.send(JSON.stringify({
      action: action,
      payload: payload
    }));
  }
};

export default new ControlService();