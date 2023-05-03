package server.server.model.track;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AlbumImage {
  private String url;
  private Integer height;
  private Integer width;
}
