import {
  AfterViewChecked,
  AfterViewInit,
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
import { RoomService } from 'src/app/services/room/room.service';
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
  userInfoSubject: Subject<User> = new Subject<User>();
  onUserInfo$!: Subscription;
  pos: number = 0;
  @Input() roomInfo!: Room;
  @Input() trackList!: string[];
  trackIndex: number = 0;
  trackPosition: number = 0;
  @Output() onTrackEnded: Subject<number> = new Subject<number>();
  playerStatus: string = 'Play';
  command$!: Subscription;

  // @ts-ignore important!!
  IFrameController!: EmbedController;
  constructor(
    private auth: AuthService,
    private spotifyAuth: SpotifyAuthService,
    private spotifyWebSDK: SpotifySdkWebPlayerService,
    private spotifySvc: SpotifyService,
    private websocketPlayerSvc: WebsocketPlayerService,
    private roomSvc: RoomService
  ) {}
  ngOnInit(): void {
    // this.spotifyAuth
    //   .getSpotifyToken()
    //   .then((token: any) => this.spotifyWebSDK.createWebPlayer(token['token']));
    this.auth.user$.subscribe((user) => {
      // console.log(user);
      this.userInfo = user as User;
      this.userInfoSubject.next(this.userInfo);
    });
    this.createIFrame();
    this.onUserInfo$ = this.userInfoSubject.subscribe((user) => {
      // initialize only after userInfo is collected
      console.log(user);
      this.getTrackIndexPosition();
      this.onStartingGetTrackIndexPosition();
      this.websocketPlayerSvc.initializeConnection();
      // var iframe = document.getElementById('player');
      // console.log(iframe);
      // iframe?.click();
    });

    // Subscribe to clicks on the Play/Pause Button, Track Change, Track Seek Position change
    this.command$ = this.websocketPlayerSvc.newCommand.subscribe((e: any) => {
      // Toggle Play/Pause of Player in other instances
      if (e == 'Play' || e == 'Pause') {
        this.playerStatus = e;
        this.IFrameController.togglePlay();
      } else if (e.startsWith('index')) {
        console.log('track change');
        const idx = Number.parseInt(e.replace('index:', ''));
        this.trackIndex = idx;
        this.IFrameController.loadUri(`spotify:track:${this.trackList[idx]}`);
        this.IFrameController.play();
        this.updateTrackIndexPosition(idx, 0);
      }
      // Update Track Index and Seek Position for Users to match up
      else if (JSON.parse(e)['track'] != null) {
        const trackIndex = JSON.parse(e)['track'];
        const trackPosition = JSON.parse(e)['position'];
        const userClicked = JSON.parse(e)['userClicked'];
        this.updateTrackIndexPosition(trackIndex, trackPosition);
        this.getTrackIndexPosition();
        if (userClicked) this.IFrameController.seek(trackPosition / 1000);
      } else {
        return;
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trackIndex'] && !changes['trackIndex'].firstChange) {
      console.log('changing track');
      console.log(changes['trackIndex']);
      this.changeTrack(this.trackIndex, true);
    }
  }
  onStartingGetTrackIndexPosition() {
    // called only on start
    setTimeout(() => {
      this.roomSvc
        .getRoom(this.roomInfo.roomId)
        .then((res: any) => {
          this.trackIndex = res['trackIndex'];
          this.trackPosition = res['trackPosition'];
        })
        .then(() => {
          this.changeTrack(this.trackIndex, false);
        });
    }, 100);
  }

  getTrackIndexPosition() {
    this.roomSvc.getRoom(this.roomInfo.roomId).then((res: any) => {
      this.trackIndex = res['trackIndex'];
      this.trackPosition = res['trackPosition'];
    });
  }

  refresh() {
    window.location.reload();
  }

  createIFrame() {
    console.log('createIframe: trackIndex:' + this.trackIndex);
    console.log(this.trackList[this.trackIndex]);
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
          if (Math.abs(e.data.position - this.pos) >= 6000) {
            console.log('user clicked');
            if (this.userInfo.email == this.roomInfo.ownerEmail) {
              this.onTrackPositionChange(e, true);
            } else {
              this.onTrackPositionChange(e, false);
            }
          }
          if (Math.abs(e.data.position - this.pos) >= 5000) {
            this.pos = e.data.position;
            // Ping the socket every 5 seconds to update seek position for incoming users
            this.onTrackPositionChange(e, false);
          }
          // Proceed to Next Track on Completion
          if (e.data.duration == e.data.position && e.data.duration > 0) {
            console.log(e);
            console.log('track over, next track');
            this.trackIndex++;
            this.onTrackEnded.next(this.trackIndex);
            this.changeTrack(this.trackIndex, true);
            this.updateTrackIndexPosition(this.trackIndex, 0);
          }
        });
        // EmbedController.play();
        EmbedController.addListener('ready', () => {
          console.log('ready');
          if (this.pos > 0) {
            setTimeout(() => {
              console.log('after 3s');
              console.log(this.trackIndex, this.trackPosition);
              EmbedController.seek(this.trackPosition / 1000);
            }, 3000);
          }
        });
        this.IFrameController = EmbedController;
      };
      IFrameAPI.createController(element, options, callback);
      console.log('controller created');
    };
  }

  changeTrack(idx: number, autoplay: boolean) {
    console.log(`changetrack, autoplay ${autoplay}`);
    console.log('iFrameController=', this.IFrameController);
    this.IFrameController.loadUri(`spotify:track:${this.trackList[idx]}`);
    if (autoplay) {
      this.IFrameController.play();
    }
    // only owner can send out socket messages to change player parameters
    if (this.userInfo.email == this.roomInfo.ownerEmail) {
      this.websocketPlayerSvc.sendCommand(`index:${idx}`);
      this.updateTrackIndexPosition(idx, this.trackPosition);
    }
    // visitors can only subscribe to messages, seek to current position
    else if (this.userInfo.email != this.roomInfo.ownerEmail) {
      this.IFrameController.play();
      // this.IFrameController.seek(this.trackPosition / 1000);
      setTimeout(() => {
        console.log(this.trackPosition);
        this.IFrameController.seek(this.trackPosition / 1000);
      }, 2000);
    }
    // this.updateTrackIndexPosition(idx, 0);
  }

  onTrackPositionChange(e: any, userClicked: boolean) {
    // only owner can send out the command
    if (this.userInfo.email == this.roomInfo.ownerEmail) {
      this.pos = e.data.position;
      const message = {
        track: this.trackIndex,
        position: this.pos,
        userClicked: userClicked,
      };
      this.websocketPlayerSvc.sendCommand(JSON.stringify(message));
    }
  }
  updateTrackIndexPosition(trackIndex: number, trackPosition: number) {
    console.log('updating track index' + trackIndex);
    this.roomSvc.updateRoomTrackInfo(
      this.roomInfo.roomId,
      trackIndex,
      trackPosition
    );
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
