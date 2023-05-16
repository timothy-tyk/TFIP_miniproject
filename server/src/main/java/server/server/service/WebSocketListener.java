package server.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import server.server.model.ChatMessage;

@Service
public class WebSocketListener {
  @Autowired
  private SimpMessageSendingOperations messagingTemplate;
  @Autowired
  private UserService userSvc;
  @Autowired
  SimpMessagingTemplate smTemplate;

  @EventListener
  public void handleWebSocketConnectListener(SessionConnectedEvent event){
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    System.out.println("New Websocket Connection");
    System.out.println(headerAccessor);
  }

  @EventListener
  public void handleWebSocketDisconnectListener(SessionDisconnectEvent event){
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    String email = (String)headerAccessor.getSessionAttributes().get("User email");
    System.out.println(headerAccessor);
    System.out.println("Logged out");
    if(email != null){
      // ChatMessage msg = new ChatMessage();
      // msg.setType("Leave");
      // msg.setEmail(email);
      // String location = (String) headerAccessor.getSessionAttributes().get("location");
      // String destination = "topic/message";
      // messagingTemplate.convertAndSend(destination, msg);
      userSvc.updateUserLogin(email, false);
      String destination = "/topic/message/lobby";
      this.smTemplate.convertAndSend(destination, "logout:"+email);
    }
  }
  
}

