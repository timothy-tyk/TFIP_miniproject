package server.server.controller;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import server.server.model.ChatMessage;
import server.server.service.ChatService;

@Controller
public class WebSocketController {
  @Autowired
  ChatService chatSvc;
  @Autowired
  SimpMessagingTemplate smTemplate;
  @MessageMapping("/chat/{location}")
  public void sendMessage(@DestinationVariable("location") String location,String message) throws InterruptedException, ExecutionException{
    JsonObject json = JsonParser.parseString(message).getAsJsonObject();
    ChatMessage cm = ChatMessage.fromJson(json);
    chatSvc.storeChatMessage(cm);
    String destination = "/message/"+location;
    System.out.println(destination);
    this.smTemplate.convertAndSend(destination,message);
  }

  @MessageMapping("/chat/{location}/control")
  public void sendControls(@DestinationVariable("location")String location,String command){
    String destination = "/message/control/"+location;
    System.out.println(destination);
    this.smTemplate.convertAndSend(destination, command);
  }
}
