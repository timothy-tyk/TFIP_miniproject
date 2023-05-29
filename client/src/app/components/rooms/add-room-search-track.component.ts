import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Track } from 'src/app/models/track-model';
import { SpotifyService } from 'src/app/services/spotify/spotify.service';

@Component({
  selector: 'app-add-room-search-track',
  templateUrl: './add-room-search-track.component.html',
  styleUrls: ['./add-room-search-track.component.css'],
})
export class AddRoomSearchTrackComponent implements OnInit {
  addTrackForm!: FormGroup;
  searchForm!: FormGroup;
  searchResults!: Track[];
  selectedTrack!: Track;
  @Output() selectedTrackId: Subject<Track> = new Subject<Track>();
  userAccessToken!: string;

  constructor(private fb: FormBuilder, private spotifySvc: SpotifyService) {}
  ngOnInit(): void {
    this.createSearchForm();
    this.userAccessToken = localStorage.getItem('access_token')!;
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
    this.spotifySvc.searchSpotifyCatalog(query).then((res: any) => {
      this.searchResults = res as Track[];
    });
  }

  selectTrack(track: Track) {
    this.selectedTrack = track;
    this.selectedTrackId.next(track);
  }
}
