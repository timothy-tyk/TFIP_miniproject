import { Album } from './album-model';
import { Artist } from './artist-model';

export interface Track {
  album: Album;
  artists: Artist[];
  durationMs: number;
  id: string;
  name: string;
  popularity: number;
  uri: string;
  searchTimestamp: number;
  userEmail: string;
}
