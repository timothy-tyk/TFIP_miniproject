package server.server.repository;

import java.util.Arrays;
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
  public final String INSERT_ROOM_SQL="INSERT INTO rooms (name, description, user_count, owner_email, room_id, active, track_list, track_index, track_position) VALUES (?,?,?,?,?,?,?,?,?)";
  public final String QUERY_ROOM_BY_ROOM_ID="SELECT * FROM rooms WHERE room_id=?";
  public final String UPDATE_ROOM_TRACKLIST_BY_ID="UPDATE rooms SET track_list=? WHERE room_id=?";
  public final String UPDATE_ROOM_TRACKINFO_BY_ID="UPDATE rooms SET track_index=?, track_position=? WHERE room_id=?";
  public final String UPDATE_ROOM_USERCOUNT_USERLIST_BY_ID="UPDATE rooms SET user_count=?, user_list=? WHERE room_id=?";

  public List<Room> getAllRooms(){
    List<Room> roomList = jdbcTemplate.query(QUERY_ALL_ROOMS_SQL,BeanPropertyRowMapper.newInstance(Room.class));
    return roomList;
  }

  public Room insertRoom(Room room){
    Integer inserted =jdbcTemplate.update(INSERT_ROOM_SQL, room.getName(), room.getDescription(), room.getUserCount(), room.getOwnerEmail(), room.getRoomId(), room.isActive(), room.getTrackList(), room.getTrackIndex(), room.getTrackPosition());
    if(inserted>0){
      return jdbcTemplate.queryForObject(QUERY_ROOM_BY_ROOM_ID, BeanPropertyRowMapper.newInstance(Room.class),room.getRoomId());
    }
    return null;
  }

  public Room getRoomById(String id){
    return jdbcTemplate.queryForObject(QUERY_ROOM_BY_ROOM_ID, BeanPropertyRowMapper.newInstance(Room.class),id);
  }

  public Room updateRoomAddTrack(String id, String trackId){
    Room room = jdbcTemplate.queryForObject(QUERY_ROOM_BY_ROOM_ID, BeanPropertyRowMapper.newInstance(Room.class),id);
    String trackList = room.getTrackList();
    trackList = trackList+","+trackId;
    Integer updated = jdbcTemplate.update(UPDATE_ROOM_TRACKLIST_BY_ID, trackList, id);
    if(updated>0){
      return jdbcTemplate.queryForObject(QUERY_ROOM_BY_ROOM_ID, BeanPropertyRowMapper.newInstance(Room.class),id);
    }
    return null;
  }

  public Room updateRoomTrackInfo(String id, Integer trackIndex, Integer trackPosition){
    Integer updated = jdbcTemplate.update(UPDATE_ROOM_TRACKINFO_BY_ID,trackIndex,trackPosition, id);
    if(updated>0){
      return jdbcTemplate.queryForObject(QUERY_ROOM_BY_ROOM_ID, BeanPropertyRowMapper.newInstance(Room.class),id);
    }
    return null;
  }

  public Room updateRoomUsers(String roomId, String userEmail, String joinOrLeave){
    Room room = jdbcTemplate.queryForObject(QUERY_ROOM_BY_ROOM_ID, BeanPropertyRowMapper.newInstance(Room.class),roomId);
    if(joinOrLeave.equals("JOIN")){
      String userList = room.getUserList()!=null && room.getUserList().length()>0?room.getUserList()+","+userEmail:userEmail;
      Integer currentUserCount = room.getUserCount()+1;
      jdbcTemplate.update(UPDATE_ROOM_USERCOUNT_USERLIST_BY_ID,currentUserCount,userList,roomId);
    }else if(joinOrLeave.equals("LEAVE")){
      List<String> users =Arrays.asList(room.getUserList().split(","));
      List<String> currentUsers = users.stream().filter(user->!user.equals(userEmail)).toList();
      String userList = String.join(",", currentUsers);
      Integer currentUserCount = currentUsers.size();
      jdbcTemplate.update(UPDATE_ROOM_USERCOUNT_USERLIST_BY_ID,currentUserCount,userList,roomId);
    }
    return getRoomById(roomId);
  }
}
