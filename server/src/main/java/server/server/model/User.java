package server.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
  private Integer id;
  private String name;
  private String email;
  private String bio;
  private String picture;
  private Boolean isOnline;
  private String location;
  private String accessToken;
  
}
