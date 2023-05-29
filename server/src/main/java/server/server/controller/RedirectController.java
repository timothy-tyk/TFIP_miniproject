package server.server.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(path = {"/get-user-code","/login","/logout","/lobby","/home","/user/edit","/rooms","/rooms/{id}"})
public class RedirectController {
  @GetMapping()
  public String redirectRequests(){
    return "forward:/";
  }
}
