package server.server.controller;

import java.io.IOException;
import java.net.URI;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.servlet.http.HttpServletResponse;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;

@RestController
@RequestMapping("/api/spotify")
public class SpotifyController {
  private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:8080/api/spotify/getusercode");
  private String code = "";
  private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
              .setClientId("bf828884d19840dcafa60811d407887c")
              .setClientSecret("763c40ff86a9462497afc7da0f1a5ef9")
              .setRedirectUri(redirectUri)
              .build();

  @GetMapping(path = "/login")
  @ResponseBody
  public String spotifyLogin(){
    AuthorizationCodeUriRequest authorizationCodeUriRequest = spotifyApi.authorizationCodeUri()
    .scope("user-read-private, user-read-email, user-top-read")
    .show_dialog(true)
    .build();
  final URI uri = authorizationCodeUriRequest.execute();
  JsonObject json = Json.createObjectBuilder().add("link", uri.toString()).build();
  return json.toString() ;
  }

  @GetMapping(path = "/getusercode")
  public String getSpotifyUserCode(@RequestParam("code")String userCode, HttpServletResponse response) throws IOException{
    System.out.println("ping");
    String code = userCode;
    AuthorizationCodeRequest authCodeReq = spotifyApi.authorizationCode(code).build();
    try {
      final AuthorizationCodeCredentials authCodeCred = authCodeReq.execute();
      spotifyApi.setAccessToken(authCodeCred.getAccessToken());
      spotifyApi.setRefreshToken(authCodeCred.getRefreshToken());
      System.out.println("Expires in: "+authCodeCred.getExpiresIn());
    } catch (Exception e) {
      System.out.println(e);
    }
    response.sendRedirect("http://localhost:4200/lobby");
    return spotifyApi.getAccessToken();
  }
}
