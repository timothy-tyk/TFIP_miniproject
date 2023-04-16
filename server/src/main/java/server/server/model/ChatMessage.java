package server.server.model;


import com.google.gson.JsonObject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ChatMessage {
  private String email;
  private Long timestamp;
  private String message;
  private String location;

  // public ChatMessage(){
  //   this.timestamp = new Date().getTime();
  // }

  public static ChatMessage fromJson(JsonObject json){
    ChatMessage cm = new ChatMessage();
    cm.setEmail(json.get("email").getAsString());
    cm.setMessage(json.get("message").getAsString());
    cm.setLocation(json.get("location").getAsString());
    cm.setTimestamp(json.get("timestamp").getAsLong());
    return cm;
  }
}
