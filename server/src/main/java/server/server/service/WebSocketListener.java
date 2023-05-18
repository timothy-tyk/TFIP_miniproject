package server.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

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
    // System.out.println("New Websocket Connection");
  }

  @EventListener
  public void handleWebSocketDisconnectListener(SessionDisconnectEvent event){
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    String email = (String)headerAccessor.getSessionAttributes().get("User email");
    if(email != null){
      userSvc.updateUserLogin(email, false);
      String destination = "/topic/message/lobby";
      this.smTemplate.convertAndSend(destination, "logout:"+email);
    }
  }
  
}

