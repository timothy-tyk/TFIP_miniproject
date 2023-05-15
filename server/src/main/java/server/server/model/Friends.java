package server.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Friends {
  private Integer id;
  private String userEmail;
  private String friendEmail;
}
