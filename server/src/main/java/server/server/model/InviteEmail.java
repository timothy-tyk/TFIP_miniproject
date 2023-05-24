package server.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class InviteEmail {
  private String senderName;
  private String name;
  private String subject = "Invitation to Listening Room";
  private String recipientEmail;
  private String message;

}
