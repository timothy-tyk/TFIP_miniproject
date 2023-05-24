package server.server.controller;

import java.io.IOException;

import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.JsonObject;
import jakarta.servlet.http.HttpServletResponse;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Track;
import server.server.service.SpotifyService;

@RestController
@RequestMapping("/api/spotify")
public class SpotifyController {
  @Autowired
  SpotifyService spotifySvc;

  

  @PostMapping(path = "/search")
  public ResponseEntity<String> searchSpotifyCatalog(@RequestParam String query, @RequestBody String accessToken) throws ParseException, SpotifyWebApiException, IOException{
    System.out.println(accessToken);
    JsonObject response = spotifySvc.searchSpotifyCatalog(query, accessToken);
    return ResponseEntity.ok().body(response.toString());
  }

  @GetMapping(path = "/search/track")
  public ResponseEntity<Track> searchForTrackById(@RequestParam String id) throws ParseException, SpotifyWebApiException, IOException{
    Track result = spotifySvc.getTrackById(id);
    return ResponseEntity.ok().body(result);
  }
  
}
