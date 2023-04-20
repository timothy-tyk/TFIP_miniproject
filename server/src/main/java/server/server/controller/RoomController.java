package server.server.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import server.server.model.Room;
import server.server.service.RoomService;

@Controller
@RequestMapping(path = "/api/rooms", produces = MediaType.APPLICATION_JSON_VALUE)
public class RoomController {
  @Autowired
  RoomService roomSvc;

  @GetMapping()
  public ResponseEntity<List<Room>> getRoomList(){
    return roomSvc.getAllRooms();
  }

  @PostMapping()
  public ResponseEntity<Room> createRoom(@RequestBody Room room){
    room.setRoomId(UUID.randomUUID().toString().substring(0,8));
    return roomSvc.addRoom(room);
  }

  @GetMapping("/{roomId}")
  public ResponseEntity<Room> getRoomById(@PathVariable String roomId){
    return roomSvc.getRoomById(roomId);

  }
}
