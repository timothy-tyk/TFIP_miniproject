import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ChatMessage } from 'src/app/models/chatmessage-model';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  constructor() {}
  stompClient!: Stomp.Client;
  public messages: ChatMessage[] = [];

  initializeConnection() {
    const serverUrl = 'http://localhost:8080/socket';
    const ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/message', (msg) => {
        console.log(msg);
        const newMsg = JSON.parse(msg.body) as ChatMessage;
        console.log(newMsg);
        that.messages.push(newMsg);
      });
    });
  }

  sendMessage(message: any) {
    this.stompClient.send('/app/send/message', {}, message);
  }
}
