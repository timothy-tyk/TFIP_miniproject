package server.server.model;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import server.server.model.track.Album;
import server.server.model.track.Artist;

@Data
@AllArgsConstructor
public class TrackModel{
  private String id;
  private String name;
  private Integer popularity;
  private String uri;
  private Album album;
  private List<Artist> artists;
  private long searchTimestamp;
  private String userEmail;

  public TrackModel(){
    this.searchTimestamp = new Date().getTime();
  }
}
