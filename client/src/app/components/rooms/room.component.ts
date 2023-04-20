import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private roomSvc: RoomService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private websocketSvc: WebsocketService,
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
    });
  }

  updateRoomUserCount() {
    // Todo
  }

  backToLobby() {
    this.router.navigate(['/lobby']);
  }
}
