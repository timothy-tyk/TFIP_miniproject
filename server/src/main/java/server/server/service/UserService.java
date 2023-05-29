package server.server.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import server.server.model.Friends;
import server.server.model.User;
import server.server.repository.UserRepository;

@Service
public class UserService {
  @Autowired
  UserRepository userRepo;

  public ResponseEntity<User> getUserDetails(String email){
    User user = userRepo.getUserDetails(email);
    return ResponseEntity.ok().body(user);
  }
  public ResponseEntity<User> addUserDetails(User user){
    User userFromDb = userRepo.addUserDetails(user);
    return ResponseEntity.ok().body(userFromDb);
  }

  public ResponseEntity<User> updateUserDetails(User user){
    User fromDb = userRepo.updateUserDetails(user);
    return ResponseEntity.ok().body(fromDb);
  }

  public ResponseEntity<List<Friends>> getFriends(String email){
    List<Friends> friends = userRepo.getFriendsOfUser(email);
    return ResponseEntity.ok().body(friends);
  }

  public ResponseEntity<List<Friends>> addFriendPair(Friends friends){
    List<Friends> friendResult = userRepo.addFriendPair(friends);
    return ResponseEntity.ok().body(friendResult);
  }

  public void updateUserLogin(String email, Boolean onlineStatus){
    userRepo.updateUserLogin(email, onlineStatus);
  }

  public Integer updateUserLocation(String email, String location){
    return userRepo.updateUserLocation(email, location);
  }

  public Integer updateUserSavedTracks(String trackId, String email){
    return userRepo.addUserSavedTracks(trackId, email);
  }
}
