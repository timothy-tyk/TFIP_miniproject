import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { Track } from 'src/app/models/track-model';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css'],
})
export class PlaylistComponent implements OnInit, OnChanges {
  playList!: Track[];
  @Input() trackList!: string[];
  @Input() trackIndex!: number;
  @Output() trackIndexChange: Subject<number> = new Subject<number>();

  constructor(private roomSvc: RoomService) {}
  ngOnInit(): void {
    this.loadPlayList();
  }
  ngOnChanges(changes: SimpleChanges): void {
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
}
