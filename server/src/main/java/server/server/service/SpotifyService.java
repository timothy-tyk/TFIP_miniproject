package server.server.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.apache.hc.core5.http.ParseException;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.neovisionaries.i18n.CountryCode;

import jakarta.json.Json;
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
import se.michaelthelin.spotify.model_objects.specification.Artist;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.Track;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRefreshRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;
import se.michaelthelin.spotify.requests.data.search.SearchItemRequest;
import se.michaelthelin.spotify.requests.data.tracks.GetTrackRequest;

@Service
public class SpotifyService {
  // private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:8080/api/spotify/getusercode");
  // private String code = "";
  // private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
  //             .setClientId("bf828884d19840dcafa60811d407887c")
  //             .setClientSecret("763c40ff86a9462497afc7da0f1a5ef9")
  //             .setRedirectUri(redirectUri)
  //             .build();
  // private String spotifyToken = "";

  // public String spotifyLoginAuth(String email){
  //   AuthorizationCodeUriRequest authorizationCodeUriRequest = spotifyApi.authorizationCodeUri()
  //   .scope("user-read-private, user-read-email, user-top-read, ugc-image-upload, user-read-playback-state, user-modify-playback-state, user-read-currently-playing, app-remote-control, streaming, playlist-read-private, playlist-read-collaborative, playlist-modify-private, playlist-modify-public, user-read-playback-position, user-read-recently-played")
  //   .show_dialog(true)
  //   .build();
  // final URI uri = authorizationCodeUriRequest.execute();
  // JsonObject json = Json.createObjectBuilder().add("link", uri.toString())
  // .add("userEmail", email)
  // .build();
  // System.out.println(json);
  // return json.toString() ;
  // }

  // public String getSpotifyUserCode(String userCode){
  //   String code = userCode;
  //   AuthorizationCodeRequest authCodeReq = spotifyApi.authorizationCode(code).build();
  //    try {
  //     final AuthorizationCodeCredentials authCodeCred = authCodeReq.execute();
  //     spotifyApi.setAccessToken(authCodeCred.getAccessToken());
  //     spotifyApi.setRefreshToken(authCodeCred.getRefreshToken());
  //     System.out.println(spotifyApi.getAccessToken());
  //     System.out.println("Expires in: "+authCodeCred.getExpiresIn());
  //   } catch (Exception e) {
  //     System.out.println(e);
  //   }
  //   return spotifyApi.getAccessToken();
  // }

  //  @Scheduled(timeUnit = TimeUnit.MINUTES, fixedRate = 59)
  // public void getRefreshToken() throws ParseException, SpotifyWebApiException, IOException{
  //   AuthorizationCodeRefreshRequest authorizationCodeRefreshRequest = spotifyApi.authorizationCodeRefresh().build();
  //   AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRefreshRequest.execute();
  //   spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
  //   System.out.println(spotifyApi.getAccessToken());
  // }



  public JsonObject searchSpotifyCatalog(String query, String userAccessToken) throws ParseException, SpotifyWebApiException, IOException{
    SpotifyApi spotifyApi = new SpotifyApi.Builder().setAccessToken(userAccessToken).build();
    String types = ModelObjectType.TRACK.getType() + ","+ ModelObjectType.ARTIST.getType();
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

  public JsonObject getTrackDetailsById(String id) throws ParseException, SpotifyWebApiException, IOException{
    GetTrackRequest trackRequest = spotifyApi.getTrack(id).market(CountryCode.SG).build();
    Track result = trackRequest.execute(); 
    Gson gson = new Gson();
    String jsonStr = gson.toJson(result);
    InputStream is = new ByteArrayInputStream(jsonStr.getBytes());
    JsonReader jReader = Json.createReader(is);
    JsonObject obj = jReader.readObject();
    JsonObjectBuilder jObjB = Json.createObjectBuilder(obj);
    long timeStamp = new Date().getTime();
    jObjB.add("searchTimestamp", timeStamp);
    return jObjB.build();
  }

  public Track getTrackById(String id) throws ParseException, SpotifyWebApiException, IOException{
    GetTrackRequest req = spotifyApi.getTrack(id).market(CountryCode.SG).build();
    Track result = req.execute();
    return result;
  }
  }
  
 