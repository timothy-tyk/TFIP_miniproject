import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import SpotifyWebApi from 'spotify-web-api-node';
import { SpotifyAuthService } from '../auth/spotify-auth.service';

const SPOTIFY_SEARCH_ENDPOINT = '/api/spotify/search';
@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  spotifyApi!: SpotifyWebApi;

  constructor(
    private httpClient: HttpClient,
    private spotifyAuth: SpotifyAuthService
  ) {
    this.spotifyApi = new SpotifyWebApi();
    this.spotifyApi.setAccessToken(localStorage.getItem('access_token')!);
  }

  refreshAccessToken() {
    this.spotifyAuth.getRefreshToken().then((data: any) => {
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      this.spotifyApi.setAccessToken(localStorage.getItem('access_token')!);
    });
  }

  searchSpotifyCatalog(query: string) {
    const limit = 10;
    const offset = 0;
    return this.spotifyApi
      .searchTracks(query, {
        limit: limit,
        offset: offset,
      })
      .then((res: any) => {
        return res.body['tracks']['items'];
      })
      .catch((e) => {
        this.refreshAccessToken();
        this.searchSpotifyCatalog(query);
      });
  }

  getTrackInfoById(id: string) {
    return this.spotifyApi
      .getTrack(id, { market: 'SG' })
      .then((res: any) => {
        return res['body'];
      })
      .catch((e) => {
        console.log(e);
        this.refreshAccessToken();
        this.getTrackInfoById(id);
      });
  }

  getUserTopItems() {
    const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('access_token')
    );
    return firstValueFrom(
      this.httpClient.get(
        'https://api.spotify.com/v1/me/shows?offset=0&limit=20',
        { headers }
      )
    );
  }
}
