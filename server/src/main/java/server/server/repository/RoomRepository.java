package server.server.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import server.server.model.Room;

@Repository
public class RoomRepository {
  @Autowired
  JdbcTemplate jdbcTemplate;

  public final String QUERY_ALL_ROOMS_SQL="SELECT * FROM rooms";
  public final String INSERT_ROOM_SQL="INSERT INTO rooms (name, description, user_count, room_id, active, track_list) VALUES (?,?,?,?,?,?)";
  public final String QUERY_ROOM_BY_ROOM_ID="SELECT * FROM rooms WHERE room_id=?";
  public final String UPDATE_ROOM_TRACKLIST_BY_ID="UPDATE rooms SET track_list=? WHERE room_id=?";

  public List<Room> getAllRooms(){
    List<Room> roomList = jdbcTemplate.query(QUERY_ALL_ROOMS_SQL,BeanPropertyRowMapper.newInstance(Room.class));
    return roomList;
  }

  public Room insertRoom(Room room){
    Integer inserted =jdbcTemplate.update(INSERT_ROOM_SQL, room.getName(), room.getDescription(), room.getUserCount(), room.getRoomId(), room.isActive(), room.getTrackList());
    if(inserted>0){
      return jdbcTemplate.queryForObject(QUERY_ROOM_BY_ROOM_ID, BeanPropertyRowMapper.newInstance(Room.class),room.getRoomId());
    }
    return null;
  }

  public Room getRoomById(String id){
    return jdbcTemplate.queryForObject(QUERY_ROOM_BY_ROOM_ID, BeanPropertyRowMapper.newInstance(Room.class),id);
  }

  public Room updateRoomAddTrack(String id, String trackList){
    Integer updated = jdbcTemplate.update(UPDATE_ROOM_TRACKLIST_BY_ID, trackList, id);
    if(updated>0){
      return jdbcTemplate.queryForObject(QUERY_ROOM_BY_ROOM_ID, BeanPropertyRowMapper.newInstance(Room.class),id);
    }
    return null;
  }
}
