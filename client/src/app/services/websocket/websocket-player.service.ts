import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebsocketPlayerService {
  stompClient!: Stomp.Client;
  ws!: globalThis.WebSocket;
  public newCommand = new Subject();
  constructor() {}

  initializeConnection(): Observable<boolean> {
    const serverUrl =
      'https://listening-room-production-24f9.up.railway.app/chat';
    return new Observable<boolean>((observer) => {
      const ws = new SockJS(serverUrl);
      this.stompClient = Stomp.over(ws);
      this.stompClient.connect(
        {},
        (frame) => {
          const fromLocation = location.pathname.replace('/rooms', '');
          this.stompClient.subscribe(
            `/topic/message${fromLocation}/control`,
            (msg) => {
              this.newCommand.next(msg.body);
            }
          );
          observer.next(true);
          observer.complete();
        },
        (e) => {
          observer.next(false);
          observer.complete();
        }
      );
    });
  }

  // initializeConnection() {
  //   const serverUrl =
  //     'https://listening-room-production-24f9.up.railway.app/chat';
  //   this.ws = new SockJS(serverUrl);
  //   this.stompClient = Stomp.over(this.ws);
  //   const that = this;
  //   this.stompClient.connect({}, function (frame) {
  //     const fromLocation = location.pathname.replace('/rooms', '');
  //     that.stompClient.subscribe(
  //       `/topic/message${fromLocation}/control`,
  //       (msg) => {
  //         console.log(msg.body);
  //         that.newCommand.next(msg.body);
  //       }
  //     );
  //   });
  // }
  sendCommand(message: any) {
    const fromLocation = location.pathname.replace('/rooms', '');
    this.stompClient.send(`/app/chat${fromLocation}/control`, {}, message);
  }
}
