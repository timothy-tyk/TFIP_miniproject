package server.server.model.track;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Album {
  private String id;
  private List<String> genres;
  private List<AlbumImage> images;
  private String releaseDate;
  private String name;
}
