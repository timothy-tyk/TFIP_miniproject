import { Injectable, OnDestroy } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ChatMessage } from 'src/app/models/chatmessage-model';
import { WebSocket } from 'ws';
import { firstValueFrom, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Room } from 'src/app/models/room-model';
const SERVER_URL = '/api';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  constructor(private httpClient: HttpClient) {}
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
    this.stompClient.connect(
      {},
      function (frame) {
        const fromLocation = location.pathname.replace('/rooms', '');
        that.onJoin();
        console.log(`/topic/message${fromLocation}`);
        that.stompClient.subscribe(`/topic/message${fromLocation}`, (msg) => {
          console.log(msg);
          const newMsg = JSON.parse(msg.body) as ChatMessage;
          const previousMsgs = that.messages.get(fromLocation)
            ? that.messages.get(fromLocation)
            : [];
          that.messages.set(fromLocation, [...previousMsgs!, newMsg]);
          that.messageAdded.next(that.messages);
          console.log(that.messages);
        });
      },
      (e) => console.log(e)
    );
  }

  sendMessage(message: ChatMessage) {
    const location = message.location;
    return firstValueFrom(
      this.httpClient.post(`${SERVER_URL}/chat/${location}`, message).pipe()
    );
  }

  disconnect(url: string) {
    const fromLocation = url.replace('/rooms', '');
    this.stompClient.unsubscribe(`/message${fromLocation}`);
    this.stompClient.disconnect(() => console.log('disconnecting wsservice'));
  }

  onJoin() {
    const message: ChatMessage = {
      email: 'example@example.com',
      message: '',
      location: location.pathname.replace('/rooms/', ''),
      timestamp: 0,
      type: 'JOIN',
    };
    const fromLocation = location.pathname.replace('/rooms', '');
    this.stompClient.send(`/app/chat`, {}, JSON.stringify(message));
  }

  initializeChatRoom(room: Room) {
    return firstValueFrom(
      this.httpClient.post(`${SERVER_URL}/chat`, room).pipe()
    );
  }
}
