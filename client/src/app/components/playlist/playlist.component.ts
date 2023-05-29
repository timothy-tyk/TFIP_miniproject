import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Track } from 'src/app/models/track-model';
import { User } from 'src/app/models/user-model';
import { RoomService } from 'src/app/services/room/room.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
})
export class PlaylistComponent implements OnInit, OnChanges {
  playList!: Track[];
  userInfo!: User;
  @Input() trackList!: string[];
  @Input() trackIndex!: number;
  @Output() trackIndexChange: Subject<number> = new Subject<number>();

  constructor(private roomSvc: RoomService, private userSvc: UserService) {}
  ngOnInit(): void {
    this.loadPlayList();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')!) as User;
    if (
      this.playList &&
      this.trackList &&
      this.playList.length < this.trackList.length
    ) {
      this.loadPlayList();
    }
  }
  loadPlayList() {
    this.roomSvc
      .getRoomTracks(location.pathname.replace('/rooms/', ''))
      .then((res: any) => {
        this.playList = res['playlist'] as Track[];
        this.playList.sort((a, b) => a.searchTimestamp - b.searchTimestamp);
      });
  }
  selectTrack(idx: number) {
    this.trackIndexChange.next(idx);
  }
  saveTrack(idx: number) {
    const trackId = this.trackList[idx];
    this.userSvc.saveTrack(trackId, this.userInfo.email).then((res) => {
      this.userInfo = res as User;
    });
  }
}
