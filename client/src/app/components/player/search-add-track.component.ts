import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-search-add-track',
  templateUrl: './search-add-track.component.html',
  styleUrls: ['./search-add-track.component.css'],
})
export class SearchAddTrackComponent implements OnInit {
  searchForm!: FormGroup;
  @Input() roomId!: string;
  @Input() trackList!: string[];
  constructor(private fb: FormBuilder, private roomSvc: RoomService) {}
  ngOnInit(): void {
    this.createSearchForm();
  }
  createSearchForm() {
    this.searchForm = this.fb.group({
      trackUri: this.fb.control('', [Validators.required]),
    });
  }
  addTrack() {
    console.log('adding');
    this.trackList.push(this.searchForm.get('trackUri')?.value);
    const trackListUris = this.trackList.join(',');
    console.log(trackListUris);
    this.roomSvc.updateRoomAddTrack(this.roomId, trackListUris);
    this.createSearchForm();
  }
}

// 5xo1Gj4WTssjQgQ0w03cf2?si=5715f0abd1da4dec
