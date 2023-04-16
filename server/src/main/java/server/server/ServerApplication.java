package server.server;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) throws IOException {
		// Initialize Firebase
		ClassLoader cl = ServerApplication.class.getClassLoader();
		File file = new File(cl.getResource("serviceAccountKey.json").getFile());
		FileInputStream serviceAccount = new FileInputStream(file.getAbsolutePath());
		FirebaseOptions options = new FirebaseOptions.Builder()
			.setCredentials(GoogleCredentials.fromStream(serviceAccount))
			.setDatabaseUrl("https://spotify-6064a-default-rtdb.asia-southeast1.firebasedatabase.app/")
			.build();
		if(FirebaseApp.getApps().isEmpty()){
			FirebaseApp.initializeApp(options);
		}

		SpringApplication.run(ServerApplication.class, args);
	}

}
