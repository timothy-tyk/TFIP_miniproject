package server.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
// @RequestMapping("/api")
public class PlayerController {
  @Autowired
  SimpMessagingTemplate smTemplate;
    @MessageMapping("/app/chat/{location}/control")
    public void sendControls(@DestinationVariable("location")String location,String command){
      String destination = "/topic/message/"+location+"/control";
      this.smTemplate.convertAndSend(destination, command);
    }
}
