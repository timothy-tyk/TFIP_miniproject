import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
const SERVER_URL = '/api';

@Injectable({
  providedIn: 'root',
})
export class SpotifyAuthService {
  constructor(private httpClient: HttpClient) {}

  getSpotifyUserLogin() {
    return firstValueFrom(
      this.httpClient.get(`${SERVER_URL}/spotify/login`).pipe()
    );
  }
}
