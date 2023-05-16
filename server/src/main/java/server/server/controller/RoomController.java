package server.server.controller;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.gson.Gson;

import jakarta.json.JsonObject;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import server.server.model.Room;
import server.server.model.TrackIndexPositionInfo;
import server.server.service.RoomService;
import server.server.service.TrackService;

@Controller
@RequestMapping(path = "/api/rooms", produces = MediaType.APPLICATION_JSON_VALUE)
public class RoomController {
  @Autowired
  RoomService roomSvc;

  @GetMapping()
  public ResponseEntity<List<Room>> getRoomList(){
    System.out.println("grabbing all room data");
    return roomSvc.getAllRooms();
  }

  @Autowired
  TrackService trackSvc;
  @PostMapping()
  public ResponseEntity<Room> createRoom(@RequestBody Room room) throws ParseException, SpotifyWebApiException, InterruptedException, ExecutionException, IOException{
    String roomId = UUID.randomUUID().toString().substring(0,8);
    room.setRoomId(roomId);
    trackSvc.storeTrackDetails(room.getTrackList(), roomId, room.getOwnerEmail());
    String destination = "/topic/message";
      this.smTemplate.convertAndSend(destination, "new room added");
    return roomSvc.addRoom(room);
  }

  @GetMapping("/{roomId}")
  public ResponseEntity<Room> getRoomById(@PathVariable String roomId){
    return roomSvc.getRoomById(roomId);
  }

  @PutMapping("/{roomId}")
  public ResponseEntity<Room> updateRoomAddTrack(@PathVariable String roomId,@RequestParam("add") String trackId, @RequestBody String userEmail) throws ParseException, SpotifyWebApiException, InterruptedException, ExecutionException, IOException{
    System.out.println(userEmail);
    trackSvc.storeTrackDetails(trackId, roomId, userEmail);
    return roomSvc.updateRoomAddTrack(roomId, trackId);
  }

  @GetMapping("/{roomId}/tracks")
  public ResponseEntity<String> getRoomTracks(@PathVariable String roomId) throws InterruptedException, ExecutionException{
    JsonObject response = trackSvc.getTrackDetails(roomId);
    return ResponseEntity.ok().body(response.toString());
  }

  @PutMapping("/{roomId}/trackInfo")
  public ResponseEntity<Room> updateRoomTrackInfo(@PathVariable String roomId, @RequestBody TrackIndexPositionInfo trackInfo){
    return roomSvc.updateRoomTrackInfo(roomId, trackInfo.getTrackIndex(), trackInfo.getTrackPosition());
  }

  @Autowired
  SimpMessagingTemplate smTemplate;
    @MessageMapping("/app/chat/joinLeaveRoom")
    public void onUserJoinOrLeave(String message){
      String destination = "/topic/message";
      System.out.println(message);
      this.smTemplate.convertAndSend(destination, message);
    }
  

}
