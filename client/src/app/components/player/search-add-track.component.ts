import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Track } from 'src/app/models/track-model';
import { User } from 'src/app/models/user-model';
import { RoomService } from 'src/app/services/room/room.service';
import { SpotifyService } from 'src/app/services/spotify/spotify.service';
import { WebsocketPlayerService } from 'src/app/services/websocket/websocket-player.service';

@Component({
  selector: 'app-search-add-track',
  templateUrl: './search-add-track.component.html',
  styleUrls: ['./search-add-track.component.css'],
})
export class SearchAddTrackComponent implements OnInit {
  addTrackForm!: FormGroup;
  searchForm!: FormGroup;
  @Input() roomId!: string;
  @Input() trackList!: string[];
  searchResults!: Track[];
  userInfo!: User;
  constructor(
    private fb: FormBuilder,
    private roomSvc: RoomService,
    private spotifySvc: SpotifyService
  ) {}
  ngOnInit(): void {
    this.getUserInfo();
    this.createAddForm();
    this.createSearchForm();
  }
  getUserInfo() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')!) as User;
  }
  createAddForm() {
    this.addTrackForm = this.fb.group({
      trackUri: this.fb.control('', [Validators.required]),
    });
  }
  addTrack(id: string) {
    this.roomSvc.updateRoomAddTrack(this.roomId, id, this.userInfo.email);
    this.createSearchForm();
    this.searchResults = [];
    // this.websocketPlayerSvc.sendCommand(id);
  }

  createSearchForm() {
    this.searchForm = this.fb.group({
      query: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  searchSpotifyAPI() {
    const query = this.searchForm.get('query')?.value;
    this.spotifySvc
      .searchSpotifyCatalog(query)
      .then((res: any) => (this.searchResults = res['tracks'] as Track[]));
  }
}

// 5xo1Gj4WTssjQgQ0w03cf2?si=5715f0abd1da4dec
