package server.server.controller;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.JsonObject;

import server.server.model.ChatMessage;
import server.server.model.Room;
import server.server.service.ChatService;
import server.server.service.RabbitQueueServiceImpl;
import server.server.service.WebSocketListener;

@RestController
@RequestMapping("/api")
public class WebSocketController {
  @Autowired
  ChatService chatSvc;
  @Autowired
  SimpMessagingTemplate smTemplate;
  @Autowired
  WebSocketListener wslSvc;
  
  @Autowired
  private AmqpTemplate amqpTemplate;
  
  private String chatExchange = "chat-exchange";
  
  @Autowired 
  private RabbitQueueServiceImpl rabbitQueueServiceImpl;
  
  @PostMapping(path = "/chat")
  public void createChatroom(@RequestBody Room room){
    String queueName = room.getRoomId();
    rabbitQueueServiceImpl.addNewQueue(queueName, chatExchange, queueName);
  }
  
  @PostMapping("/chat/{location}")
  public void sendMessageToChatRoom(@PathVariable String location, @RequestBody ChatMessage msg) throws InterruptedException, ExecutionException{
    amqpTemplate.convertAndSend(chatExchange, location, ChatMessage.toJsonString(msg));
    chatSvc.storeChatMessage(msg);
  
  }
  @RabbitListener(id = "chat-exchange", autoStartup = "true")
  public void handleChatMessages(String message){
    // Send messages to Client
    JsonObject msg = ChatMessage.fromString(message);
    ChatMessage cm = ChatMessage.fromJson(msg);
    String location = cm.getLocation();
    this.smTemplate.convertAndSend("/topic/message/"+location, message);
  }


  @GetMapping("/chat/{location}")
  public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable String location) throws InterruptedException, ExecutionException{
    List<ChatMessage> messages = chatSvc.getChatMessages(location);
    return ResponseEntity.ok().body(messages);
  }

  
}
