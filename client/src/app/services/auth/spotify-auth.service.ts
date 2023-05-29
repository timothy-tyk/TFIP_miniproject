import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
const SERVER_URL = '/api';

@Injectable({
  providedIn: 'root',
})
export class SpotifyAuthService {
  constructor(
    private httpClient: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {}

  getSpotifyUserLogin(email: string) {
    return firstValueFrom(
      this.httpClient
        .post(`${SERVER_URL}/spotify/login?email=${email}`, {})
        .pipe()
    );
  }

  getSpotifyToken() {
    return firstValueFrom(
      this.httpClient.get(`${SERVER_URL}/spotify/gettoken`).pipe()
    );
  }

  // PKCE FLOW

  clientId = environment.spotify.clientId;
  redirectUri = environment.spotify.redirectUri;

  spotifyPKCELogin() {
    this.activatedRoute.params.subscribe((p) => console.log(p));
    this.redirectToSpotifyAuthorizeEndpoint()
      .then(() => {
        const urlParams = new URLSearchParams(window.location.search);
        let code = urlParams.get('code')!;
        console.log(urlParams);
        return code;
      })
      .then((code) => this.getExchangeToken(code));
  }

  async redirectToSpotifyAuthorizeEndpoint() {
    let codeVerifier = this.generateRandomString(128);
    this.generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      let state = this.generateRandomString(16);
      let scope =
        'user-read-private user-read-email user-top-read ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-read-playback-position user-read-recently-played';
      localStorage.setItem('code_verifier', codeVerifier);

      let args = new URLSearchParams({
        response_type: 'code',
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        state: state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        scope: scope,
      });
      window.location.href = 'https://accounts.spotify.com/authorize?' + args;
    });
  }

  getExchangeToken(code: string) {
    let codeVerifier = localStorage.getItem('code_verifier');
    let body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      code_verifier: codeVerifier!,
    });
    let headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    const response = firstValueFrom(
      this.httpClient
        .post('https://accounts.spotify.com/api/token', body, {
          headers,
        })
        .pipe()
    ).then((res: any) => {
      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('refresh_token', res.refresh_token);
    });
  }

  // Code Verifier
  generateRandomString(length: number) {
    let text = '';
    let possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  // Code Challenge
  async generateCodeChallenge(codeVerifier: string) {
    function base64encode(str: ArrayBuffer) {
      return btoa(String.fromCharCode(...new Uint8Array(str)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);

    return base64encode(digest);
  }

  getRefreshToken() {
    const refresh_token = localStorage.getItem('refresh_token')!;
    let body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: this.clientId,
    });
    let headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    return firstValueFrom(
      this.httpClient.post('https://accounts.spotify.com/api/token', body, {
        headers,
      })
    );
  }
}
