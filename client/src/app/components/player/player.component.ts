import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { SpotifyAuthService } from 'src/app/services/auth/spotify-auth.service';
import { SpotifySdkWebPlayerService } from 'src/app/services/spotify/spotify-sdk-web-player.service';
import { SpotifyService } from 'src/app/services/spotify/spotify.service';
import { WebsocketPlayerService } from 'src/app/services/websocket/websocket-player.service';

/// <reference path="../node_modules/@types/spotify-web-playback-sdk/index.d.ts"/>

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent implements OnInit {
  // @Input() trackUri!: string;
  @Input() trackList!: string[];
  trackIndex: number = 0;
  @Output() onTrackEnded: Subject<number> = new Subject<number>();
  playerStatus: string = 'Play';
  command$!: Subscription;

  // @ts-ignore important!!
  IFrameController!: EmbedController;
  constructor(
    private spotifyAuth: SpotifyAuthService,
    private spotifyWebSDK: SpotifySdkWebPlayerService,
    private fb: FormBuilder,
    private spotifySvc: SpotifyService,
    private websocketPlayerSvc: WebsocketPlayerService
  ) {}
  ngOnInit(): void {
    // this.spotifyAuth
    //   .getSpotifyToken()
    //   .then((token: any) => this.spotifyWebSDK.createWebPlayer(token['token']));
    this.createIFrame();
    this.websocketPlayerSvc.initializeConnection();
    this.command$ = this.websocketPlayerSvc.newCommand.subscribe((e: any) => {
      console.log(e);
      this.playerStatus = e;
      this.IFrameController.togglePlay();
    });
  }

  createIFrame() {
    const iFrameScript = document.createElement('script');
    iFrameScript.src = 'https://open.spotify.com/embed-podcast/iframe-api/v1';
    iFrameScript.addEventListener('load', (e) => {
      console.log(e);
    });
    document.head.appendChild(iFrameScript);
    // @ts-ignore
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      const element = document.getElementById('embed-iframe');

      const options = {
        uri: `spotify:track:${this.trackList[this.trackIndex]}`,
      };
      // @ts-ignore
      const callback = (EmbedController) => {
        EmbedController.addListener('playback_update', (e: any) => {
          // Proceed to Next Track
          if (e.data.duration == e.data.position && e.data.duration > 0) {
            this.trackIndex++;
            this.onTrackEnded.next(this.trackIndex);
            this.changeTrack();
          }
          // if (e.data.isPaused) this.onClickPause();
          // if(e.data.isPaused && e.data)
        });
        EmbedController.play();

        EmbedController.addListener('play', () => console.log('play'));
        this.IFrameController = EmbedController;
      };
      IFrameAPI.createController(element, options, callback);
    };
  }
  changeTrack() {
    this.IFrameController.loadUri(
      `spotify:track:${this.trackList[this.trackIndex]}`
    );
    this.IFrameController.play();
  }

  onTogglePlay() {
    this.IFrameController.togglePlay();
    if (this.playerStatus == 'Play') {
      this.playerStatus = 'Pause';
      this.websocketPlayerSvc.sendCommand('Pause');
    } else {
      this.playerStatus = 'Play';
      this.websocketPlayerSvc.sendCommand('Play');
    }
  }
}
// 5xo1Gj4WTssjQgQ0w03cf2?si=0e10418a455f4973
// 0Rqwa6i410IwhTiugt6vXi?si=80214517c22849cf
// 0Cr3j6qhDItBeFbAzdXtN2?si=4605d259347e4f9e
