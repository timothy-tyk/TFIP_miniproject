import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Subject } from 'rxjs';
import { Room } from 'src/app/models/room-model';
import { User } from 'src/app/models/user-model';
import { RoomService } from 'src/app/services/room/room.service';
import { UserService } from 'src/app/services/user/user.service';
import { WebsocketService } from 'src/app/services/websocket/websocket.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css'],
})
export class AddRoomComponent implements OnInit {
  addRoomForm!: FormGroup;
  roomInfo!: Room;
  userEmail!: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private userSvc: UserService,

    private roomSvc: RoomService,
    private router: Router,
    private websocketSvc: WebsocketService
  ) {}
  ngOnInit(): void {
    this.auth.user$.subscribe((user) => (this.userEmail = user?.email!));
    this.addRoomForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      description: this.fb.control('', [Validators.required]),
      startingTrack: this.fb.control('', [Validators.required]),
    });
    this.websocketSvc.initializeConnection();
  }

  submitRoomForm() {
    const newRoom: Room = {
      name: this.addRoomForm.get('name')?.value,
      description: this.addRoomForm.get('description')?.value,
      ownerEmail: this.userEmail,
      userCount: 0,
      userList: '',
      roomId: '',
      active: true,
      // replace with spotify API
      trackList: this.addRoomForm.get('startingTrack')?.value,
      trackIndex: 0,
    };
    console.log(newRoom);
    this.roomSvc
      .addRoom(newRoom)
      .then((res: any) => {
        console.log(res);
        this.roomInfo = res as Room;
      })
      .then(() => {
        this.websocketSvc.initializeChatRoom(this.roomInfo);
      })
      .then(() => this.websocketSvc.onAddNewRoom())
      .then(() =>
        this.router
          .navigate([`/rooms/${this.roomInfo.roomId}`])
          .then(() => window.location.reload())
      );
  }

  onSelectTrack(e: any) {
    this.addRoomForm.patchValue({ startingTrack: e });
  }
}
