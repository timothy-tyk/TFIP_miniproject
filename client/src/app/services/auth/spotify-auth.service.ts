import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
const SERVER_URL = '/api';

@Injectable({
  providedIn: 'root',
})
export class SpotifyAuthService {
  constructor(private httpClient: HttpClient) {}

  getSpotifyUserLogin() {
    // const email = localStorage.getItem.
    // const params = new HttpParams().set('email', )
    return firstValueFrom(
      this.httpClient.get(`${SERVER_URL}/spotify/login`).pipe()
    );
  }

  getSpotifyToken() {
    return firstValueFrom(
      this.httpClient.get(`${SERVER_URL}/spotify/gettoken`).pipe()
    );
  }
}
