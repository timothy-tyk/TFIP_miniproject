package server.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import server.server.service.ChatService;

@Controller
@RequestMapping(path = "api", produces = MediaType.APPLICATION_JSON_VALUE)
public class ChatController {
  @Autowired
  ChatService chatSvc;

  // @PostMapping(path="/chat/{location}")
  // public ResponseEntity<String> postChatMessage(@RequestBody ChatMessage msg, @PathVariable String location) throws InterruptedException, ExecutionException{
  //   System.out.println(msg);
  //   String response = chatSvc.storeChatMessage(msg);
  //   return ResponseEntity.ok().body(response);
  // }

  // @GetMapping("/chat/{location}")
  // public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable String location) throws InterruptedException, ExecutionException{
  //   List<ChatMessage> messages = chatSvc.getChatMessages(location);
  //   return ResponseEntity.ok().body(messages);
  // }


}
