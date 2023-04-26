package server.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import se.michaelthelin.spotify.model_objects.specification.AlbumSimplified;
import se.michaelthelin.spotify.model_objects.specification.ArtistSimplified;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackModel {
  private String id;
  private String name;
  private Integer popularity;
  private String uri;
  private AlbumSimplified album;
  private ArtistSimplified[] artists;

}
