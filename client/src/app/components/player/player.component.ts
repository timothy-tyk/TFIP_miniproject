import {
  AfterViewChecked,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '@auth0/auth0-angular';
import { Observable, Subject, Subscription } from 'rxjs';
import { Room } from 'src/app/models/room-model';
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
export class PlayerComponent implements OnInit, OnChanges {
  userInfo: User = new User();
  @Input() roomInfo!: Room;
  @Input() trackList!: string[];
  @Input() trackIndex: number = 0;
  @Output() onTrackEnded: Subject<number> = new Subject<number>();
  playerStatus: string = 'Play';
  command$!: Subscription;

  // @ts-ignore important!!
  IFrameController!: EmbedController;
  constructor(
    private auth: AuthService,
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
    this.auth.user$.subscribe((user) => {
      console.log(user);
      this.userInfo = user as User;
    });
    this.createIFrame();
    this.websocketPlayerSvc.initializeConnection();

    // Subscribe to clicks on the Play/Pause Button or Track Change
    this.command$ = this.websocketPlayerSvc.newCommand.subscribe((e: any) => {
      if (e == 'Play' || e == 'Pause') {
        this.playerStatus = e;
        this.IFrameController.togglePlay();
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trackIndex'] && !changes['trackIndex'].firstChange) {
      console.log('changing track');
      this.changeTrack(this.trackIndex);
    }
  }

  refresh() {
    window.location.reload();
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
          // Proceed to Next Track on Completion
          if (e.data.duration == e.data.position && e.data.duration > 0) {
            this.trackIndex++;
            this.onTrackEnded.next(this.trackIndex);
            this.changeTrack(this.trackIndex);
          }
        });
        // EmbedController.play();

        EmbedController.addListener('play', () => console.log('play'));
        this.IFrameController = EmbedController;
      };
      IFrameAPI.createController(element, options, callback);
    };
  }
  changeTrack(idx: number) {
    this.IFrameController.loadUri(`spotify:track:${this.trackList[idx]}`);
    this.IFrameController.play();
    this.websocketPlayerSvc.sendCommand(`index:${idx}`);
  }

  autoplay() {}

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
