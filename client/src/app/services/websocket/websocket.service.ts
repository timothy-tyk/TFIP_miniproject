import { Injectable, OnDestroy, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ChatMessage } from 'src/app/models/chatmessage-model';
import { WebSocket } from 'ws';
import { BehaviorSubject, firstValueFrom, ReplaySubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Room } from 'src/app/models/room-model';
import { User } from 'src/app/models/user-model';
const SERVER_URL = '/api';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  stompClient!: Stomp.Client;
  ws!: globalThis.WebSocket;
  public messages: Map<string, ChatMessage[]> = new Map<
    string,
    ChatMessage[]
  >();
  messageAdded = new Subject();
  newRoomAdded = new Subject();
  userJoinedOrLeft: Subject<string> = new Subject<string>();
  constructor(private httpClient: HttpClient) {}

  initializeConnection() {
    const serverUrl = 'http://localhost:8080/chat';
    this.ws = new SockJS(serverUrl);
    this.stompClient = Stomp.over(this.ws);
    const that = this;
    this.stompClient.connect(
      {},
      function (frame) {
        const fromLocation = location.pathname.replace('/rooms', '');
        that.stompClient.subscribe(
          `/topic/message${fromLocation}`,
          (msg: any) => {
            // If User Joins or Leaves room, send to Room List
            if (msg.body == 'userJoinedOrLeft') {
              console.log('userJorL');
              that.userJoinedOrLeft.next(msg.body);
            } else {
              const newMsg = JSON.parse(msg.body) as ChatMessage;
              const previousMsgs = that.messages.get(fromLocation)
                ? that.messages.get(fromLocation)
                : [];
              that.messages.set(fromLocation, [...previousMsgs!, newMsg]);
              that.messageAdded.next(that.messages);
              console.log(that.messages);
            }
          }
        );
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

  onJoinLobby(userInfo: User) {
    const message: ChatMessage = {
      email: userInfo.email,
      message: `${userInfo.email} has joined the room.`,
      location: 'lobby',
      timestamp: 0,
      type: 'JOIN',
    };
    const fromLocation = 'lobby';
    return firstValueFrom(
      this.httpClient.post(`${SERVER_URL}/chat/${fromLocation}`, message).pipe()
    );
  }

  onJoinRoom(userInfo: User) {
    const message: ChatMessage = {
      email: userInfo.email,
      message: `${userInfo.email} has joined the room.`,
      location: location.pathname.replace('/rooms/', ''),
      timestamp: 0,
      type: 'JOIN',
    };
    const fromLocation = location.pathname.replace('/rooms', '');
    return firstValueFrom(
      this.httpClient.post(`${SERVER_URL}/chat/${fromLocation}`, message).pipe()
    ).then(() => {
      this.userJoinedOrLeft.next(message.type);
      this.stompClient.send(`/app/chat/joinLeaveRoom`, {}, 'userJoinedOrLeft');
    });
  }

  onLeaveRoom(userInfo: User, location: string) {
    const message: ChatMessage = {
      email: userInfo.email,
      message: `${userInfo.email} has left the room.`,
      location: location,
      timestamp: 0,
      type: 'LEAVE',
    };
    console.log('leaving' + message.location);

    this.stompClient.send(`/app/chat/joinLeaveRoom`, {}, 'userJoinedOrLeft');
    return firstValueFrom(
      this.httpClient.post(`${SERVER_URL}/chat/${location}`, message).pipe()
    );
  }

  onAddNewRoom() {
    this.stompClient.send(`/app/chat/newroom`, {}, 'newroom');
  }

  initializeChatRoom(room: Room) {
    return firstValueFrom(
      this.httpClient.post(`${SERVER_URL}/chat`, room).pipe()
    );
  }
}
