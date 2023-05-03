package server.server.service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import com.google.gson.Gson;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonObjectBuilder;
import jakarta.json.JsonReader;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Track;
import server.server.model.TrackModel;

@Service
public class TrackService {
  @Autowired
  SpotifyService spotifySvc;

  public String storeTrackDetails(String id, String roomId) throws InterruptedException, ExecutionException, ParseException, SpotifyWebApiException, IOException{
    Track track = spotifySvc.getTrackById(id);
    Gson gson = new Gson();
    String jsonStr = gson.toJson(track).toString();
    TrackModel trackModel = gson.fromJson(jsonStr, TrackModel.class);

    Firestore dbFirestore = FirestoreClient.getFirestore();
    ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection("locations/"+roomId+"/tracks").document(trackModel.getId()).set(trackModel);
    return collectionsApiFuture.get().getUpdateTime().toString();
  }

 

  public JsonObject getTrackDetails(String roomId) throws InterruptedException, ExecutionException{
    Firestore dbFirestore = FirestoreClient.getFirestore();
    ApiFuture<QuerySnapshot> future = dbFirestore.collection("locations/"+roomId+"/tracks").get();
    List<QueryDocumentSnapshot> documents = future.get().getDocuments();
    List<TrackModel> trackDetails = new ArrayList<TrackModel>();
    for(QueryDocumentSnapshot doc:documents){
      trackDetails.add(doc.toObject(TrackModel.class));
    }
    JsonObjectBuilder response = Json.createObjectBuilder();
    JsonArrayBuilder jArrB = Json.createArrayBuilder();
    for(TrackModel track:trackDetails){
      String res = new Gson().toJson(track);
      InputStream is = new ByteArrayInputStream(res.getBytes());
      JsonReader jReader = Json.createReader(is);
      jArrB.add(jReader.readObject());
    }
    response.add("playlist", jArrB.build());
    return response.build();
  }


}
