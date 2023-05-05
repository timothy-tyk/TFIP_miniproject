package server.server.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Room {
  private Integer id;
  private String name;
  private String description;
  private String ownerEmail;
  private Integer userCount;
  private String roomId;
  private boolean active;
  private String trackList;
}
