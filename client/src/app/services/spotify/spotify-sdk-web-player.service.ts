import { Injectable } from '@angular/core';
import { SpotifyAuthService } from '../auth/spotify-auth.service';
///  <reference types="../node_modules/@types/spotify-web-playback-sdk/index.d.ts"/>
declare global {
  interface window {
    onSpotifyWebPlaybackSDKReady: () => void;
    spotifyReady: Promise<void>;
  }
}
@Injectable({
  providedIn: 'root',
})
export class SpotifySdkWebPlayerService {
  spotifyPlayer!: Spotify.Player;
  // private spotifyToken!: string;
  constructor(private spotifyAuth: SpotifyAuthService) {}

  createWebPlayer(spotifyToken: string) {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.type = 'text/javascript';
    script.addEventListener('load', (e) => {
      console.log(e);
    });
    document.head.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log(
        'The Web Playback SDK is ready. We have access to Spotify.Player'
      );
      this.spotifyPlayer = new Spotify.Player({
        name: 'Shitty Player',
        getOAuthToken: (cb) => {
          cb(spotifyToken);
        },
        volume: 0.5,
      });

      this.spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      this.spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      this.spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error(message);
      });

      this.spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error(message);
      });

      this.spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error(message);
      });

      this.spotifyPlayer.connect();
      // this.spotifyPlayer.activateElement();
      // this.spotifyPlayer.
      console.log(window.Spotify.Player);
    };
  }
  activatePlayer() {
    this.spotifyPlayer.activateElement().then(() => console.log('starting'));
  }
}
