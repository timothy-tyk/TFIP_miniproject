import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Track } from 'src/app/models/track-model';
import { RoomService } from 'src/app/services/room/room.service';
import { SpotifyService } from 'src/app/services/spotify/spotify.service';

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
  constructor(
    private fb: FormBuilder,
    private roomSvc: RoomService,
    private spotifySvc: SpotifyService
  ) {}
  ngOnInit(): void {
    this.createAddForm();
    this.createSearchForm();
  }
  createAddForm() {
    this.addTrackForm = this.fb.group({
      trackUri: this.fb.control('', [Validators.required]),
    });
  }
  addTrack(id: string) {
    this.trackList.push(id);
    const trackListUris = this.trackList.join(',');
    this.roomSvc.updateRoomAddTrack(this.roomId, trackListUris);
    this.createSearchForm();
    this.searchResults = [];
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
