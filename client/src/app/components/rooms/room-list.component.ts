import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/models/room-model';
import { Track } from 'src/app/models/track-model';
import { User } from 'src/app/models/user-model';
import { RoomService } from 'src/app/services/room/room.service';
import { SpotifyService } from 'src/app/services/spotify/spotify.service';
import { UserService } from 'src/app/services/user/user.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';
import { WebsocketPlayerService } from 'src/app/services/websocket/websocket-player.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent implements OnInit {
  roomList!: Room[];
  onRoomAdded$!: Subscription;
  userJoinOrLeft$!: Subscription;
  playController$!: Subscription;
  // Row Expansion
  selectedIndex!: number;
  selectedRoomCurrentTrack!: Track;
  selectedRoomUserList!: string[];
  // Dialog
  dialogVisible: boolean = false;
  dialogInfo!: User;
  constructor(
    private roomSvc: RoomService,
    private router: Router,
    private webSocketSvc: WebsocketService,
    private spotifySvc: SpotifyService,
    private userSvc: UserService
  ) {}
  ngOnInit(): void {
    this.getRoomList();
    this.webSocketSvc.initializeConnection();
    // Update whenever new room added or when user joins room
    // USE WEBSOCKETS!! subscription and subject is only isolated to individual clients, not across clients, need to pass through server for that to happen (i.e. websockets)
    this.onRoomAdded$ = this.webSocketSvc.newRoomAdded.subscribe(() =>
      this.getRoomList()
    );
    this.userJoinOrLeft$ = this.webSocketSvc.userJoinedOrLeft.subscribe(
      (e: any) => {
        console.log('getting room list');
        setTimeout(() => {
          this.getRoomList();
        }, 500);
      }
    );
  }

  enterRoom(id: string) {
    this.router
      .navigate([`/rooms/${id}`])
      .then(() => {
        window.location.reload();
      })
      .then(() => this.webSocketSvc.userJoinedOrLeft.next('JOIN'));
  }

  getRoomList() {
    this.roomSvc
      .getListOfRooms()
      .then((res) => {
        console.log('roomlist gotten');
        this.roomList = res as Room[];
      })
      .then(() => {
        if (this.selectedIndex != null) {
          this.selectedRoomUserList =
            this.roomList[this.selectedIndex].userList.split(',');
        }
      });
  }

  onRoomDescriptionClick(i: number) {
    this.selectedIndex = i;
    const selectedRoomTrackList = this.roomList[i].trackList.split(',');
    const currentTrackIndex = this.roomList[i].trackIndex;
    const currentTrack = selectedRoomTrackList[currentTrackIndex];
    this.spotifySvc.getTrackInfoById(currentTrack).then((res) => {
      this.selectedRoomCurrentTrack = res as Track;
    });
    this.selectedRoomUserList = this.roomList[i].userList.split(',');
  }
  showUserDialog(email: string) {
    this.userSvc
      .getUserDetails(email)
      .then((res) => (this.dialogInfo = res as User))
      .then(() => (this.dialogVisible = true));
  }
}
