import { Injectable, OnDestroy } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ChatMessage } from 'src/app/models/chatmessage-model';
import { WebSocket } from 'ws';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  constructor() {}
  stompClient!: Stomp.Client;
  ws!: globalThis.WebSocket;
  public messages: Map<string, ChatMessage[]> = new Map<
    string,
    ChatMessage[]
  >();
  public messageAdded = new Subject();

  initializeConnection() {
    const serverUrl = 'http://localhost:8080/chat';
    this.ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(this.ws);
    const that = this;
    this.stompClient.connect({}, function (frame) {
      const fromLocation = location.pathname.replace('/rooms', '');
      that.stompClient.subscribe(`/message${fromLocation}`, (msg) => {
        console.log(msg);
        const newMsg = JSON.parse(msg.body) as ChatMessage;
        const previousMsgs = that.messages.get(fromLocation)
          ? that.messages.get(fromLocation)
          : [];
        that.messages.set(fromLocation, [...previousMsgs!, newMsg]);
        that.messageAdded.next(that.messages);
        console.log(that.messages);
      });
    });
  }

  sendMessage(message: any) {
    // console.log(location.pathname);
    const fromLocation = location.pathname.replace('/rooms', '');
    // console.log(fromLocation);
    this.stompClient.send(`/app/chat${fromLocation}`, {}, message);
  }

  disconnect(url: string) {
    const fromLocation = url.replace('/rooms', '');
    this.stompClient.unsubscribe(`/message${fromLocation}`);
    this.stompClient.disconnect(() => console.log('disconnecting wsservice'));
    // this.ws.close();
  }
}
