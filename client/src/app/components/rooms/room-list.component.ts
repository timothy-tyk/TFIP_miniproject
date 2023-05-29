import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/models/room-model';
import { Track } from 'src/app/models/track-model';
import { RoomService } from 'src/app/services/room/room.service';
import { SpotifyService } from 'src/app/services/spotify/spotify.service';
import { UserService } from 'src/app/services/user/user.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

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
  selectedRoomInfo!: Room;

  // Dialog
  selectedUserEmail!: string;
  openAddRoomDialog: boolean = false;

  constructor(
    private roomSvc: RoomService,
    private router: Router,
    private webSocketSvc: WebsocketService,
    private spotifySvc: SpotifyService,
    private userSvc: UserService
  ) {}
  ngOnInit(): void {
    this.getRoomList();
    this.webSocketSvc.initializeConnection().subscribe((connected) => {
      // Update websockets to update whenever new room added or when user joins room
      this.onRoomAdded$ = this.webSocketSvc.newRoomAdded.subscribe(() => {
        this.getRoomList();
      });
      this.userJoinOrLeft$ = this.webSocketSvc.userJoinedOrLeft.subscribe(
        (e: any) => {
          this.getRoomList();
        }
      );
    });
  }

  enterRoom(id: string) {
    this.router
      .navigate([`/rooms/${id}`])
      .then(() => {
        // window.location.reload();
      })
      .then(() => this.webSocketSvc.userJoinedOrLeft.next('JOIN'));
  }

  getRoomList() {
    this.roomSvc
      .getListOfRooms()
      .then((res) => {
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
    this.roomSvc.getRoom(this.roomList[i].roomId).then((res: any) => {
      this.roomList[i].userCount = res['userCount'];
      this.selectedRoomUserList = res['userList'].split(',');
    });
    const selectedRoomTrackList = this.roomList[i].trackList.split(',');
    const currentTrackIndex = this.roomList[i].trackIndex;
    const currentTrack = selectedRoomTrackList[currentTrackIndex];
    this.spotifySvc.getTrackInfoById(currentTrack).then((res) => {
      this.selectedRoomCurrentTrack = res as Track;
    });
  }
  showAddRoomDialog() {
    this.openAddRoomDialog = true;
  }
  closeAddRoomDialog() {
    this.openAddRoomDialog = false;
  }

  showUserDialog(email: string) {
    this.selectedUserEmail = email;
  }
  closeUserDialog() {
    this.selectedUserEmail = null!;
  }
}
