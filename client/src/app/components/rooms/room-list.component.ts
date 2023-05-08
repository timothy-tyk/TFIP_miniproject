import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/models/room-model';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent {
  roomList!: Room[];
  constructor(private roomSvc: RoomService, private router: Router) {}
  ngOnInit(): void {
    this.getRoomList();
  }

  enterRoom(id: string) {
    this.router.navigate([`/rooms/${id}`]).then(() => {
      window.location.reload();
    });
  }

  getRoomList() {
    this.roomSvc.getListOfRooms().then((res) => {
      this.roomList = res as Room[];
    });
  }
}
