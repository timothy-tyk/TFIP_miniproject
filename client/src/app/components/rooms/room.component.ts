import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/models/room-model';
import { User } from 'src/app/models/user-model';
import { RoomService } from 'src/app/services/room/room.service';
import { UserService } from 'src/app/services/user/user.service';
import { WebsocketPlayerService } from 'src/app/services/websocket/websocket-player.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

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
  userJoin$!: Subscription;
  roomListeners!: Map<string, User>;
  // Dialog
  selectedUserEmail!: string;
  addTrackDialogVisible: boolean = false;
  playlistDialogVisible: boolean = false;

  constructor(
    private roomSvc: RoomService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private webSocketPlayerSvc: WebsocketPlayerService,
    private webSocketSvc: WebsocketService,
    private userSvc: UserService
  ) {}
  ngOnInit(): void {
    this.webSocketPlayerSvc.initializeConnection().subscribe((connected) => {
      this.fetchRoomData();
      this.onAddTrack = this.roomSvc.trackAdded.subscribe((id) => {
        const newList = [...this.trackList, id];
        this.trackList = newList;
        this.webSocketPlayerSvc.sendCommand(id);
      });
      this.command$ = this.webSocketPlayerSvc.newCommand.subscribe((e: any) => {
        if (e.toString().startsWith('index:')) {
          this.trackIndex = Number.parseInt(e.toString().replace('index:', ''));
        } else if (e.toString().startsWith('{"track')) {
          // do nothing
        } else if (e == 'Play' || e == 'Pause') {
          // do something
        } else {
          this.fetchRoomData();
          const newList = [...this.trackList, e];
          this.trackList = newList;
        }
      });
      this.userJoin$ = this.webSocketSvc.userJoinedOrLeft.subscribe(
        (e: any) => {
          this.fetchRoomData();
        }
      );
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
      this.fetchRoomListeners();
    });
  }

  fetchUserInfo() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '') as User;
  }
  fetchRoomListeners() {
    const userList = this.room.userList.split(',');
    let listeners = new Map<string, User>();
    if (this.room.userList != '') {
      console.log(userList);
      for (let user of userList) {
        this.userSvc.getUserDetails(user).then((user: any) => {
          console.log(user);
          listeners.set(user['email'], user);
        });
      }
    }
    this.roomListeners = listeners;
  }

  onTrackIndexChange(e: any) {
    this.trackIndex = e;
    this.webSocketPlayerSvc.sendCommand(`index:${e}`);
  }

  updatePlayerTrack(e: any) {
    this.trackIndex = e;
  }

  backToLobby() {
    this.router.navigate(['/lobby']);
  }

  showAddTrackDialog(e: any) {
    console.log('click');
    this.addTrackDialogVisible = true;
  }
  showPlaylistDialog(e: any) {
    console.log('clicked');
    this.playlistDialogVisible = true;
  }
  showListenerDialog(email: string) {
    console.log(email);
    this.selectedUserEmail = email;
  }
  closeListenerDialog() {
    this.selectedUserEmail = null!;
  }
}
