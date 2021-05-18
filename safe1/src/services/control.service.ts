import { controlUrl } from '@/api/url';

class ControlService {
  public ws: WebSocket | undefined;

  connect() {
    this.ws = new WebSocket(controlUrl);
    this.ws.onopen = () => {};
    this.ws.onmessage = (event: WebSocketMessageEvent) => {};
    this.ws.onerror = (event: WebSocketErrorEvent) => {
      console.error(`Error establishing Websocket: ${event.message}`);
      setTimeout(this.connect, 1000);
    };
    this.ws.onclose = (event: WebSocketCloseEvent) => {};
  }

  coordinateMessage(message: any) {}

  dispatchMessage(action: string, payload: any) {
    this.ws?.send(JSON.stringify({
      action: action,
      payload: payload
    }));
  }
};

export default new ControlService();