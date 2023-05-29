import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user-model';
import { Track } from 'src/app/models/track-model';
import { SpotifyService } from 'src/app/services/spotify/spotify.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent implements OnInit {
  @Input() userInfo!: User;
  trackIndex: number = 0;
  userTracks: Map<string, Track> = new Map<string, Track>();
  trackList!: string[];
  constructor(
    private userSvc: UserService,
    private spotifySvc: SpotifyService
  ) {}
  ngOnInit(): void {
    this.getUserSavedTracks();
  }

  async getUserSavedTracks() {
    this.userSvc.getUserDetails(this.userInfo.email).then((res) => {
      const user = res as User;
      this.trackList = user.savedTracks.split(',');
      this.trackList.forEach((trackId) => {
        this.spotifySvc
          .getTrackInfoById(trackId)
          .then((data) => this.userTracks.set(trackId, data));
      });
    });
  }

  mapSortedAsIs(a: any, b: any) {
    return 1;
  }
  changeTrack(idx: number) {
    this.trackIndex = idx;
  }
}
