package server.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import server.server.model.Room;
import server.server.repository.RoomRepository;

@Service
public class RoomService {
  @Autowired
  RoomRepository roomRepo;
  
  public ResponseEntity<List<Room>> getAllRooms(){
    List<Room> roomList = roomRepo.getAllRooms();
    return ResponseEntity.ok().body(roomList);
  }

  public ResponseEntity<Room> addRoom(Room room){
    Room inserted = roomRepo.insertRoom(room);
    return ResponseEntity.ok().body(inserted);
  }

  public ResponseEntity<Room> getRoomById(String id){
    Room fromDb = roomRepo.getRoomById(id);
    return ResponseEntity.ok().body(fromDb);
  }

  public ResponseEntity<Room> updateRoomAddTrack(String id, String trackId){
    Room updatedRoom = roomRepo.updateRoomAddTrack(id, trackId);
    return ResponseEntity.ok().body(updatedRoom);
  }

  public ResponseEntity<Room> updateRoomTrackInfo(String id, Integer trackIndex, Integer trackPosition){
    Room updatedRoom = roomRepo.updateRoomTrackInfo(id,trackIndex,trackPosition);
    return ResponseEntity.ok().body(updatedRoom);
  }

  public ResponseEntity<Room> updateRoomUsersOnline(String roomId,String userEmail, String joinOrLeave){
    Room updatedRoom = roomRepo.updateRoomUsers(roomId, userEmail, joinOrLeave);
    return ResponseEntity.ok().body(updatedRoom);
  }

  public ResponseEntity<Room> updateRoomPlayerStatus(String roomId, Boolean isActive){
    Room updatedRoom = roomRepo.updateRoomPlayerStatus(roomId, isActive);
    return ResponseEntity.ok().body(updatedRoom);
  }

}
