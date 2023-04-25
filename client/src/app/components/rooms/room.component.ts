import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatMessage } from 'src/app/models/chatmessage-model';
import { Room } from 'src/app/models/room-model';
import { RoomService } from 'src/app/services/room/room.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit {
  id!: string;
  room!: Room;
  trackList!: string[];
  trackIndex: number = 0;
  nextTrack!: Subscription;

  constructor(
    private roomSvc: RoomService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.fetchRoomData();
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
