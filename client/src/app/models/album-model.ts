import { AlbumImage } from './album-image-model';

export interface Album {
  id: string;
  name: string;
  artist: string;
  images: AlbumImage[];
  releaseDate: string;
}
