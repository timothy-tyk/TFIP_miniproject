package server.server.controller;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.listener.RabbitListenerEndpointRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.JsonObject;
import com.rabbitmq.http.client.Client;
import com.rabbitmq.http.client.domain.QueueInfo;

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

  // @MessageMapping("/chat/{location}")
  // public void sendMessage(@DestinationVariable("location") String location,String message) throws InterruptedException, ExecutionException{
  //   System.out.println("here");
  //   JsonObject json = JsonParser.parseString(message).getAsJsonObject();
  //   ChatMessage cm = ChatMessage.fromJson(json);
  //   chatSvc.storeChatMessage(cm);
  //   String destination = "/topic/message";
  //   this.smTemplate.convertAndSend(destination,message);
  // }

  // @MessageMapping("/chat/{location}/control")
  // public void sendControls(@DestinationVariable("location")String location,String command){
  //   String destination = "/topic/message/control";
  //   this.smTemplate.convertAndSend(destination, command);
  // }
  @Autowired
  private AmqpAdmin amqpAdmin;
  
  @Autowired
  private AmqpTemplate amqpTemplate;
  
  private String chatExchange = "chat-exchange";
  
  @Autowired 
  private RabbitQueueServiceImpl rabbitQueueServiceImpl;
  
  @Autowired
  private RabbitListenerEndpointRegistry rabbitListenerEndpointRegistry;
  // rabbitListenerEndpointRegistry.getListenerContainer("chat-exchange").start();
  
  @PostMapping(path = "/chat")
  public void createChatroom(@RequestBody Room room){
    String queueName = room.getRoomId();
    rabbitQueueServiceImpl.addNewQueue(queueName, chatExchange, queueName);
  }
  
  @PostMapping("/chat/{location}")
  // @MessageMapping("/chat/{location}")
  public void sendMessageToChatRoom(@PathVariable String location, @RequestBody ChatMessage msg) throws InterruptedException, ExecutionException{
    System.out.println(location);
    amqpTemplate.convertAndSend(chatExchange, location, ChatMessage.toJsonString(msg));
    chatSvc.storeChatMessage(msg);
    // rabbitListenerEndpointRegistry.getListenerContainer("chat-exchange").start();
  }
  @RabbitListener(id = "chat-exchange", autoStartup = "true")
  public void handleChatMessages(String message){
    // Send messages to Client
    JsonObject msg = ChatMessage.fromString(message);
    ChatMessage cm = ChatMessage.fromJson(msg);
    System.out.println(cm.getMessage());
    String location = cm.getLocation();
    this.smTemplate.convertAndSend("/topic/message/"+location, message);
  }


  @GetMapping("/chat/{location}")
  public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable String location) throws InterruptedException, ExecutionException{
    List<ChatMessage> messages = chatSvc.getChatMessages(location);
    return ResponseEntity.ok().body(messages);
  }

  
}
