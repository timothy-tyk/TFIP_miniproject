package server.server.controller;

import java.io.IOException;

import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.JsonObject;
import jakarta.servlet.http.HttpServletResponse;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import server.server.service.SpotifyService;

@RestController
@RequestMapping("/api/spotify")
public class SpotifyController {
  @Autowired
  SpotifyService spotifySvc;

  @GetMapping(path = "/login")
  @ResponseBody
  public String spotifyLogin(){
    return spotifySvc.spotifyLoginAuth();
  }

  @GetMapping(path = "/getusercode")
  public String getSpotifyUserCode(@RequestParam("code")String userCode,HttpServletResponse response) throws IOException{
    response.sendRedirect("http://localhost:4200/lobby");
    String spotifyToken = spotifySvc.getSpotifyUserCode(userCode);
    return spotifyToken;
  }

  // @GetMapping(path = "/gettoken")
  // @ResponseBody
  // public String getSpotifyToken(){
  //   // TODO: add some security validation here
  //   String spotifyToken = spotifySvc.getSpotifyUserCode()
  //   JsonObject json = Json.createObjectBuilder().add("token", spotifyToken).build();
  //   return json.toString();
  // }

  @GetMapping(path = "/search")
  public ResponseEntity<String> searchSpotifyCatalog(@RequestParam String query) throws ParseException, SpotifyWebApiException, IOException{
    JsonObject response = spotifySvc.searchSpotifyCatalog(query);
    return ResponseEntity.ok().body(response.toString());
  }
  
}
