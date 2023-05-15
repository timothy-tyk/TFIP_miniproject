package server.server.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import server.server.model.Friends;
import server.server.model.User;

@Repository
public class UserRepository {
  @Autowired
  JdbcTemplate jdbcTemplate;

  private final String QUERY_USER_SQL="SELECT * FROM users WHERE email = ?";
  private final String INSERT_USER_SQL="INSERT INTO users (name, email, picture) VALUES (?,?,?)";
  private final String UPDATE_USER_SQL="UPDATE users SET name=?,picture=? WHERE email=?";
  private final String UPDATE_USER_ACCESS_TOKEN="UPDATE users SET access_token=? WHERE email=?";
  private final String GET_FRIENDS_BY_EMAIL="SELECT * FROM friends WHERE user_email=? OR friend_email=?";
  private final String INSERT_FRIEND_PAIR="INSERT INTO friends (user_email, friend_email) VALUES(?,?)";

  public User getUserDetails(String email){
    try {
      User user = jdbcTemplate.queryForObject(QUERY_USER_SQL, BeanPropertyRowMapper.newInstance(User.class), email);
      return user;
    } catch (EmptyResultDataAccessException e) {
      return null;
    }
  }

  public User addUserDetails(User user){
    jdbcTemplate.update(INSERT_USER_SQL, user.getName(), user.getEmail(), user.getPicture());
    return getUserDetails(user.getEmail());
  }

  public User updateUserDetails(User user){
    jdbcTemplate.update(UPDATE_USER_SQL, user.getName(), user.getPicture(), user.getEmail());
    return getUserDetails(user.getEmail());
  }

  public void updateUserAccessToken(String token, String email){
    jdbcTemplate.update(UPDATE_USER_ACCESS_TOKEN, token,email);
  }

  public List<Friends> getFriendsOfUser(String userEmail){
    return jdbcTemplate.query(GET_FRIENDS_BY_EMAIL, BeanPropertyRowMapper.newInstance(Friends.class),userEmail, userEmail);
  }

  public List<Friends> addFriendPair(Friends friends){
    jdbcTemplate.update(INSERT_FRIEND_PAIR, friends.getUserEmail(), friends.getFriendEmail());
    return getFriendsOfUser(friends.getUserEmail());
  }

}
