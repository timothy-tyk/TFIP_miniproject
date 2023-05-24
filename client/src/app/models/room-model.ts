import { Track } from './track-model';

export interface Room {
  name: string;
  description: string;
  ownerEmail: string;
  userCount: number;
  userList: string;
  roomId: string;
  active: boolean;
  trackList: string;
  trackIndex: number;
  startingTrack: Track;
}
