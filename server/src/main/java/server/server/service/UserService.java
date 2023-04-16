package server.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
}
