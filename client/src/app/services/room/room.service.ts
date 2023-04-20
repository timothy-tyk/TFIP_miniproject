import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Room } from 'src/app/models/room-model';
const SERVER_URL = '/api';
@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private httpClient: HttpClient) {}

  getListOfRooms() {
    return firstValueFrom(this.httpClient.get(`${SERVER_URL}/rooms`).pipe());
  }

  addRoom(room: Room) {
    return firstValueFrom(
      this.httpClient.post(`${SERVER_URL}/rooms`, room).pipe()
    );
  }

  getRoom(id: string) {
    return firstValueFrom(
      this.httpClient.get(`${SERVER_URL}/rooms/${id}`).pipe()
    );
  }
}
