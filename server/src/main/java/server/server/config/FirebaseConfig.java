package server.server.config;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@Configuration
public class FirebaseConfig {
  private static final String DATABASE_URL="https://spotify-6064a-default-rtdb.asia-southeast1.firebasedatabase.app/";

  @Value("${firebase.credentials}") String fbC;
  @Bean
  public FirebaseApp initFirebase() throws IOException{
    InputStream stream = new ByteArrayInputStream(fbC.getBytes());
    FirebaseOptions options = new FirebaseOptions.Builder()
      .setCredentials(GoogleCredentials.fromStream(stream))
      .setDatabaseUrl(DATABASE_URL).build();
      
      if(FirebaseApp.getApps().isEmpty()){
        return FirebaseApp.initializeApp(options);
      }
      System.out.println(FirebaseApp.getInstance());
      return FirebaseApp.getInstance();
  }
}
