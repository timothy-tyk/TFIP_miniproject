package server.server.controller;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.rabbitmq.http.client.Client;
import com.rabbitmq.http.client.domain.QueueInfo;

import server.server.model.ChatMessage;
import server.server.model.Room;
import server.server.service.ChatService;
import server.server.service.RabbitQueueServiceImpl;
import server.server.service.WebSocketListener;

@Controller
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

  @PostMapping(path = "/chat")
  public void createChatroom(@RequestBody Room room){
    String queueName = room.getRoomId();
    // Queue queue = new Queue(queueName, true, false, false);
    // amqpAdmin.declareQueue(queue);
    // Binding binding = BindingBuilder.bind(queue).to(RabbitConfig.chatExchange()).with(room.getRoomId());
    // amqpAdmin.declareBinding(binding);
    rabbitQueueServiceImpl.addNewQueue(queueName, chatExchange, queueName);
    // rabbitQueueServiceImpl.addQueueToListener("chat-exchange", queueName);
  }

  @PostMapping("/chat/{location}")
  public void sendMessageToChatRoom(@PathVariable String location, @RequestBody ChatMessage msg) throws InterruptedException, ExecutionException{
    amqpTemplate.convertAndSend(chatExchange, location, msg.toString());
    // chatSvc.storeChatMessage(msg);
  }
  // @Autowired Client rabbitClient;
  // @Bean 
  // public String[] getQueues(){
  //   List<QueueInfo> queueInfos = rabbitClient.getQueues();
  //   // rabbitClient.getQueues().forEach(v -> v.getName());
  //   List<String>queueNames = new ArrayList<String>();
  //   for(QueueInfo qi :queueInfos){
  //     queueNames.add(qi.getName());
  //   }
  //   return queueNames.toArray(new String[0]);
  // }

  @RabbitListener(id = "chat-exchange")
  public void handleChatMessages(String queueName, String message){
    
    System.out.println(queueName+":"+message);
  }



  @GetMapping("/chat/{location}")
  public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable String location) throws InterruptedException, ExecutionException{
    List<ChatMessage> messages = chatSvc.getChatMessages(location);
    return ResponseEntity.ok().body(messages);
  }

  
}
