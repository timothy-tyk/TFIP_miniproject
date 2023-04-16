package server.server.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;

import server.server.model.ChatMessage;

@Service
public class ChatService {
  public String storeChatMessage(ChatMessage msg) throws InterruptedException, ExecutionException{
    Firestore dbFirestore = FirestoreClient.getFirestore();
    ApiFuture<WriteResult> collectionsApiFuture = dbFirestore.collection(msg.getLocation()).document().set(msg);
    return collectionsApiFuture.get().getUpdateTime().toString();
  }
  public List<ChatMessage> getChatMessages(String location) throws InterruptedException, ExecutionException{
    Firestore dbFirestore = FirestoreClient.getFirestore();
    ApiFuture<QuerySnapshot> future = dbFirestore.collection(location).get();
    List<QueryDocumentSnapshot> documents = future.get().getDocuments();
    List<ChatMessage> messages = new ArrayList<ChatMessage>();
    for(QueryDocumentSnapshot doc:documents){
     ChatMessage msg= doc.toObject(ChatMessage.class);
     messages.add(msg);
    }
    return messages;
  }
}
