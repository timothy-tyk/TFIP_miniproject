package server.server.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import server.server.model.Friends;
import server.server.model.InviteEmail;
import server.server.model.User;
import server.server.service.EmailService;
import server.server.service.UserService;

@Controller
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {
  @Autowired
  UserService userSvc;

  @GetMapping(path = "/user" )
  public ResponseEntity<User> getUserData(@RequestParam String email){
    return userSvc.getUserDetails(email);
  }

  @PostMapping(path = "/user")
  public ResponseEntity<User> addUserData(@RequestBody User user){
    return userSvc.addUserDetails(user);
  }

  @PutMapping(path = "/user")
  public ResponseEntity<User> updateUserData(@RequestPart String picture, @RequestPart String email, @RequestPart String name, @RequestPart String bio ) throws IOException{
      User user = new User();
      user.setEmail(email);
      user.setName(name);
      user.setPicture(picture);
      user.setBio(bio);
      System.out.println(user);
      return userSvc.updateUserDetails(user);
  }

  @GetMapping(path = "/user/friends")
  public ResponseEntity<List<Friends>> getFriends(@RequestParam String email){
    return userSvc.getFriends(email);
  }

  @PostMapping(path = "/user/friends")
  public ResponseEntity<List<Friends>> addFriend(@RequestBody Friends friends){
    return userSvc.addFriendPair(friends);
  }

  @Autowired
  EmailService emailSvc;

  @PostMapping(path = "/user/invite")
  public ResponseEntity<String> sendInvite(@RequestBody InviteEmail email){
    String sent = emailSvc.sendInviteEmail(email);
    JsonObjectBuilder jObjB = Json.createObjectBuilder();
    jObjB.add("message", sent);
    JsonObject json = jObjB.build();
    return ResponseEntity.ok().body(json.toString());
  }

  @Autowired
  SimpMessagingTemplate smTemplate;
    @MessageMapping("/app/chat/loginlogout")
    public void onUserJoinOrLeave(String message, SimpMessageHeaderAccessor headerAccessor){
      if(message.contains("login:")){
        String email = message.replace("login:", "");
      headerAccessor.getSessionAttributes().put("User email", email);
      userSvc.updateUserLogin(email, true);
    }
      String destination = "/topic/message/lobby";
      this.smTemplate.convertAndSend(destination, message);
    }

}
