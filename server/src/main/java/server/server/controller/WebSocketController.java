package server.server.controller;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.Reader;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

// import jakarta.json.Json;
// import jakarta.json.JsonObject;
// import jakarta.json.JsonReader;
import server.server.model.ChatMessage;
import server.server.service.ChatService;

@Controller
public class WebSocketController {
  @Autowired
  ChatService chatSvc;
  @Autowired
  SimpMessagingTemplate smTemplate;
  @MessageMapping("/send/message")
  public void sendMessage(String message) throws InterruptedException, ExecutionException{
    System.out.println(message);
    JsonObject json = JsonParser.parseString(message).getAsJsonObject();
    ChatMessage cm = ChatMessage.fromJson(json);
    chatSvc.storeChatMessage(cm);
    this.smTemplate.convertAndSend("/message",message);
  }
}
