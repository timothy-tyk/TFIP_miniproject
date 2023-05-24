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
  userJoinedOrLeft = new Subject();
  updateUserOnlineLocation = new Subject();
  constructor(private httpClient: HttpClient) {}

  async initializeConnection() {
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
            if (msg.body == 'new room added') {
              that.newRoomAdded.next(msg.body);
            } else if (
              msg.body.includes('login:') ||
              msg.body.includes('logout:')
            ) {
              console.log(msg.body);
              that.updateUserOnlineLocation.next(msg.body.split(':')[1]);
            } else {
              const newMsg = JSON.parse(msg.body) as ChatMessage;
              if (newMsg.type == 'JOIN' || newMsg.type == 'LEAVE') {
                that.userJoinedOrLeft.next(newMsg.email);
                that.updateUserOnlineLocation.next(newMsg.email);
              }
              if (newMsg.display) {
                const previousMsgs = that.messages.get(fromLocation)
                  ? that.messages.get(fromLocation)
                  : [];
                // In case of duplicate messages
                if (that.messages.get(fromLocation)?.length! > 0) {
                  const mostRecentMsg =
                    previousMsgs![previousMsgs?.length! - 1];
                  if (
                    newMsg.timestamp == mostRecentMsg.timestamp &&
                    newMsg.message == mostRecentMsg.message
                  ) {
                    return;
                  }
                }
                that.messages.set(fromLocation, [...previousMsgs!, newMsg]);
                that.messageAdded.next(that.messages);
              }
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
      message: `${userInfo.email} has joined the room`,
      location: 'lobby',
      timestamp: new Date().getTime(),
      type: 'JOIN',
      display: true,
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
      display: true,
    };
    const fromLocation = location.pathname.replace('/rooms', '');
    return firstValueFrom(
      this.httpClient.post(`${SERVER_URL}/chat/${fromLocation}`, message).pipe()
    ).then(() => {
      this.userJoinedOrLeft.next(userInfo.email);
    });
  }

  onLeaveRoom(userInfo: User, location: string) {
    const message: ChatMessage = {
      email: userInfo.email,
      message: `${userInfo.email} has left the room.`,
      location: location,
      timestamp: new Date().getTime(),
      type: 'LEAVE',
      display: true,
    };

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

  onUserLoginLogout(userInfo: User, loginOrLogout: string) {
    this.stompClient.send(
      `/app/chat/loginlogout`,
      {},
      `${loginOrLogout}:${userInfo.email}`
    );
  }
}
