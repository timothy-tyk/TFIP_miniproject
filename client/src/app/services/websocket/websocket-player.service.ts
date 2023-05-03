import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebsocketPlayerService {
  stompClient!: Stomp.Client;
  ws!: globalThis.WebSocket;
  // playPause: Map<string, string> = new Map<string, string>();
  public newCommand = new Subject();
  constructor() {}

  initializeConnection() {
    // const serverUrl = 'http://localhost:8080/chat';
    // this.ws = new SockJS(serverUrl);
    // this.stompClient = Stomp.over(this.ws);
    // const that = this;
    // this.stompClient.connect({}, function (frame) {
    //   const fromLocation = location.pathname.replace('/rooms', '');
    //   that.stompClient.subscribe(`/topic/message/control`, (msg) => {
    //     console.log(msg.body);
    //     // how to toggle play/pause in player?
    //     that.newCommand.next(msg.body);
    //   });
    // });
  }
  sendCommand(message: any) {
    // console.log(location.pathname);
    const fromLocation = location.pathname.replace('/rooms', '');
    // console.log(fromLocation);
    this.stompClient.send(`/app/chat${fromLocation}/control`, {}, message);
  }
}
