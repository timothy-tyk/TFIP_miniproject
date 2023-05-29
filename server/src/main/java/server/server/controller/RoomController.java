package server.server.controller;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import org.apache.hc.core5.http.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.json.JsonObject;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import server.server.model.Room;
import server.server.model.TrackIndexPositionInfo;
import server.server.model.TrackModel;
import server.server.service.RoomService;
import server.server.service.TrackService;

@Controller
@RequestMapping(path = "/api/rooms", produces = MediaType.APPLICATION_JSON_VALUE)
public class RoomController {
  @Autowired
  RoomService roomSvc;

  @GetMapping()
  public ResponseEntity<List<Room>> getRoomList(){
    return roomSvc.getAllRooms();
  }

  @Autowired
  TrackService trackSvc;
  @Autowired
  SimpMessagingTemplate smTemplate;

  @PostMapping()
  public ResponseEntity<Room> createRoom(@RequestBody Room room) throws ParseException, SpotifyWebApiException, InterruptedException, ExecutionException, IOException{
    String roomId = UUID.randomUUID().toString().substring(0,8);
    room.setRoomId(roomId);
    trackSvc.storeTrackDetails(room.getStartingTrack(), roomId);
    String destination = "/topic/message";
    this.smTemplate.convertAndSend(destination, "new room added");
    return roomSvc.addRoom(room);
  }

  @GetMapping("/{roomId}")
  public ResponseEntity<Room> getRoomById(@PathVariable String roomId){
    return roomSvc.getRoomById(roomId);
  }

  @PutMapping("/{roomId}/add")
  public ResponseEntity<Room> updateRoomAddTrack(@PathVariable String roomId, @RequestBody TrackModel track) throws ParseException, SpotifyWebApiException, InterruptedException, ExecutionException, IOException{
    trackSvc.storeTrackDetails(track, roomId);
    return roomSvc.updateRoomAddTrack(roomId, track.getId());
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

  @PutMapping("/{roomId}/playerStatus")
  public ResponseEntity<Room> updateRoomPlayerStatus(@PathVariable String roomId,@RequestParam Boolean isActive){
    return roomSvc.updateRoomPlayerStatus(roomId, isActive);
  }
  

}
