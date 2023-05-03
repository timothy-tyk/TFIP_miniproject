package server.server.Utils;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import server.server.model.Room;
import server.server.repository.RoomRepository;

public class MiscUtils {
  @Autowired
  RoomRepository roomRepo;

  public String[] getQueues(){
    List<String> allQueues = new ArrayList<String>();
    List<Room> rooms = roomRepo.getAllRooms();
    for(Room room:rooms){
      allQueues.add(room.getRoomId());
    }
    return allQueues.toArray(new String[0]);
  }
}
