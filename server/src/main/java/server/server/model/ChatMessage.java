package server.server.model;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ChatMessage {
  // email = sender
  private String email;
  private Long timestamp;
  private String message;
  private String location;
  private String type;
  private Boolean display;

  public static ChatMessage fromJson(JsonObject json){
    ChatMessage cm = new ChatMessage();
    cm.setEmail(json.get("email").getAsString());
    cm.setMessage(json.get("message").getAsString());
    cm.setLocation(json.get("location").getAsString());
    cm.setTimestamp(json.get("timestamp").getAsLong());
    cm.setType(json.get("type").getAsString());
    return cm;
  }
  
  public static String toJsonString(ChatMessage cm){
    Gson gson = new Gson();
    return gson.toJson(cm);
  }

  public static JsonObject fromString(String msg){
    Gson gson = new Gson();
    return gson.fromJson(msg, JsonObject.class);
  }

  
}
