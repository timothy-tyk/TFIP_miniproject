import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';
import { Room } from 'src/app/models/room-model';
import { Track } from 'src/app/models/track-model';
const SERVER_URL = '/api';
@Injectable({
  providedIn: 'root',
})
export class RoomService {
  public trackAdded = new Subject<string>();
  roomAdded: Subject<string> = new Subject<string>();
  constructor(private httpClient: HttpClient) {}

  getListOfRooms() {
    return firstValueFrom(this.httpClient.get(`${SERVER_URL}/rooms`).pipe());
  }

  addRoom(room: Room) {
    this.roomAdded.next('new');
    return firstValueFrom(
      this.httpClient.post(`${SERVER_URL}/rooms`, room).pipe()
    );
  }

  getRoom(id: string) {
    return firstValueFrom(
      this.httpClient.get(`${SERVER_URL}/rooms/${id}`).pipe()
    );
  }
  updateRoomAddTrack(id: string, track: Track) {
    return firstValueFrom(
      this.httpClient.put(`${SERVER_URL}/rooms/${id}/add`, track, {}).pipe()
    ).then(() => this.trackAdded.next(id));
  }
  getRoomTracks(id: string) {
    return firstValueFrom(
      this.httpClient.get(`${SERVER_URL}/rooms/${id}/tracks`).pipe()
    );
  }
  updateRoomTrackInfo(id: string, trackIndex: number, trackPosition: number) {
    const trackInfo = {
      trackIndex: trackIndex,
      trackPosition: trackPosition,
    };
    return firstValueFrom(
      this.httpClient.put(`${SERVER_URL}/rooms/${id}/trackInfo`, trackInfo)
    );
  }
}
