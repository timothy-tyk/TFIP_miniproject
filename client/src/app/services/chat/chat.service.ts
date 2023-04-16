import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ChatMessage } from 'src/app/models/chatmessage-model';
const SERVER_URL = '/api';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private httpClient: HttpClient) {}

  // Lobby Chat
  getChatMessages(location: string) {
    return firstValueFrom(
      this.httpClient.get(`${SERVER_URL}/chat/${location}`).pipe()
    );
  }

  submitChatMessage(msg: ChatMessage) {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/json;charset=UTF-8'
    );
    return firstValueFrom(
      this.httpClient.post(`${SERVER_URL}/chat/${msg.location}`, msg).pipe()
    );
  }
}
