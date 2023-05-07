package server.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackIndexPositionInfo {
  private Integer trackIndex;
  private Integer trackPosition;
  private Boolean userClicked;
}
