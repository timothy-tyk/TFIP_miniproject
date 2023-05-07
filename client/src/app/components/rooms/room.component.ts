import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';
import { ChatMessage } from 'src/app/models/chatmessage-model';
import { Room } from 'src/app/models/room-model';
import { RoomService } from 'src/app/services/room/room.service';
import { UserService } from 'src/app/services/user/user.service';
import { WebsocketPlayerService } from 'src/app/services/websocket/websocket-player.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  userInfo!: User;
  id!: string;
  room!: Room;
  trackList: string[] = [];
  trackIndex: number = 0;
  onAddTrack!: Subscription;
  command$!: Subscription;

  constructor(
    private roomSvc: RoomService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private webSocketPlayerSvc: WebsocketPlayerService
  ) {}
  ngOnInit(): void {
    this.fetchRoomData();
    this.onAddTrack = this.roomSvc.trackAdded.subscribe((id) => {
      const newList = [...this.trackList, id];
      this.trackList = newList;
      this.webSocketPlayerSvc.sendCommand(id);
    });
    this.command$ = this.webSocketPlayerSvc.newCommand.subscribe((e: any) => {
      if (e.toString().startsWith('index:')) {
        this.trackIndex = Number.parseInt(e.toString().replace('index:', ''));
      } else if (e == 'Play' || e == 'Pause') {
        // do something
      } else {
        this.fetchRoomData();
        const newList = [...this.trackList, e];
        this.trackList = newList;
      }
    });
  }

  fetchRoomData() {
    this.activatedRoute.paramMap.subscribe(
      (data: any) => (this.id = data['params']['id'])
    );
    this.roomSvc.getRoom(this.id).then((res: any) => {
      this.room = res as Room;
      this.trackList = this.room['trackList']
        .split(',')
        .filter((track) => track.length > 0);
    });
  }

  fetchUserInfo() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '') as User;
  }

  onTrackIndexChange(e: any) {
    this.trackIndex = e;
    this.webSocketPlayerSvc.sendCommand(`index:${e}`);
  }

  updatePlayerTrack(e: any) {
    this.trackIndex = e;
  }

  updateRoomUserCount() {
    // Todo
  }

  backToLobby() {
    this.router.navigate(['/lobby']);
  }
}

// 5w3CRkbTWXfbYepIdFpGUN?si=b9e1670581ca46eb
