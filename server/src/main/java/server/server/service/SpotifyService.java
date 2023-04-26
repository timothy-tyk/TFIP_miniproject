package server.server.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;

import org.apache.hc.core5.http.ParseException;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.json.JsonReader;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.enums.ModelObjectType;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.model_objects.special.SearchResult;
import se.michaelthelin.spotify.model_objects.specification.Album;
import se.michaelthelin.spotify.model_objects.specification.Artist;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.Track;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;
import se.michaelthelin.spotify.requests.data.search.SearchItemRequest;

@Service
public class SpotifyService {
  private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:8080/api/spotify/getusercode");
  private String code = "";
  private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
              .setClientId("bf828884d19840dcafa60811d407887c")
              .setClientSecret("763c40ff86a9462497afc7da0f1a5ef9")
              .setRedirectUri(redirectUri)
              .build();
  private String spotifyToken = "";

  public String spotifyLoginAuth(){
    AuthorizationCodeUriRequest authorizationCodeUriRequest = spotifyApi.authorizationCodeUri()
    .scope("user-read-private, user-read-email, user-top-read, ugc-image-upload, user-read-playback-state, user-modify-playback-state, user-read-currently-playing, app-remote-control, streaming, playlist-read-private, playlist-read-collaborative, playlist-modify-private, playlist-modify-public, user-read-playback-position, user-read-recently-played")
    .show_dialog(true)
    .build();
  final URI uri = authorizationCodeUriRequest.execute();
  JsonObject json = Json.createObjectBuilder().add("link", uri.toString()).build();
  return json.toString() ;
  }

  public String getSpotifyUserCode(String userCode){
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
    return spotifyApi.getAccessToken();
  }

  public JsonObject searchSpotifyCatalog(String query) throws ParseException, SpotifyWebApiException, IOException{
    String types = ModelObjectType.TRACK.getType() + ","+ ModelObjectType.ARTIST.getType();
    System.out.println(spotifyApi.getAccessToken());
    SearchItemRequest request = spotifyApi.searchItem(query, types)
                                .limit(10)
                                .offset(0)
                                .build();
    SearchResult result = request.execute();
    Paging<Track> resultTrack = result.getTracks();
    Paging<Artist> resultArtist = result.getArtists();
    JsonObjectBuilder response = Json.createObjectBuilder();

    // Track Array
    JsonArrayBuilder jArrB = Json.createArrayBuilder();
    for(Track t: resultTrack.getItems()){
      Gson gson = new Gson();
      String jsonStr = gson.toJson(t);
      InputStream is = new ByteArrayInputStream(jsonStr.getBytes());
      JsonReader jReader = Json.createReader(is);
      JsonObject obj = jReader.readObject();
      jArrB.add(obj);
    }
    response.add("tracks", jArrB.build());

    // Artist Array
    // JsonArrayBuilder jArrBd = Json.createArrayBuilder();
    // for(Artist a: resultArtist.getItems()){
    //   Gson gson = new Gson();
    //   String jsonStr = gson.toJson(a);
    //   InputStream is = new ByteArrayInputStream(jsonStr.getBytes());
    //   JsonReader jReader = Json.createReader(is);
    //   JsonObject obj = jReader.readObject();
    //   jArrBd.add(obj);
    // }
    // response.add("artists", jArrBd.build());

    return response.build();
  }
}
