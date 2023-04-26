import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { firstValueFrom, Subject } from 'rxjs';

const SPOTIFY_SEARCH_ENDPOINT = '/api/spotify/search';
@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  constructor(private httpClient: HttpClient) {}

  searchSpotifyCatalog(query: string) {
    const params = new HttpParams().set('query', query);
    // .set('type', 'track')
    // .set('market', 'SG')
    // .set('limit', 10);
    return firstValueFrom(
      this.httpClient.get(SPOTIFY_SEARCH_ENDPOINT, { params }).pipe()
    );
  }
}
