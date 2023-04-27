import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Room } from 'src/app/models/room-model';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.css'],
})
export class AddRoomComponent implements OnInit {
  addRoomForm!: FormGroup;
  newRoomId!: string;
  constructor(
    private fb: FormBuilder,
    private roomSvc: RoomService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.addRoomForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      description: this.fb.control('', [Validators.required]),
      startingTrack: this.fb.control('', [Validators.required]),
    });
  }

  submitRoomForm() {
    const newRoom: Room = {
      name: this.addRoomForm.get('name')?.value,
      description: this.addRoomForm.get('description')?.value,
      userCount: 0,
      roomId: '',
      active: true,
      // replace with spotify API
      trackList: this.addRoomForm.get('startingTrack')?.value,
    };
    this.roomSvc
      .addRoom(newRoom)
      .then((res: any) => {
        console.log(res);
        this.newRoomId = res.roomId;
      })
      .then(() =>
        this.router
          .navigate([`/rooms/${this.newRoomId}`])
          .then(() => window.location.reload())
      );
  }
}

// 1SCXzqKZdif5b33POmzwI4?si=a7ae6c8a78414b68
