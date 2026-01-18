import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | null = null;
  private readonly socketUrl = 'wss://crypto-back-ptdf.onrender.com/api/v1/ws/';

  public messageReceived = new Subject<any>();

  constructor() {
    this.connect();
  }

  public connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }
    this.socket = new WebSocket(this.socketUrl);

    this.socket.onopen = () => {
      this.sendAuthToken();
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleIncomingMessage(data);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    this.socket.onclose = (event) => {
      console.warn('WebSocket Closed:', event.code, event.reason);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }

  private sendAuthToken() {
    const token = this.getCookie('access_token');
    if (token && this.socket) {
      const payload = {
        type: 'auth',
        token: token
      };
      this.socket.send(JSON.stringify(payload));
    }
  }

  private handleIncomingMessage(data: any) {
    if (data.status === 'authenticated') {
      return;
    }
    this.messageReceived.next(data);
  }

  public close() {
    if (this.socket) {
      this.socket.close();
    }
  }

  private  getCookie(name: string): string | null {
    const matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }
}
