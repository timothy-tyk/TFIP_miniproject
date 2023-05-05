package server.server.config;

import org.springframework.amqp.rabbit.listener.MessageListenerContainer;
import org.springframework.amqp.rabbit.listener.RabbitListenerEndpointRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import server.server.service.RabbitQueueServiceImpl;

@Component
public class RabbitMQStartup {
  @Autowired
  RabbitQueueServiceImpl rabbitQueueServiceImpl;

  @Autowired
  RabbitListenerEndpointRegistry rabbitListenerEndpointRegistry;
  @EventListener(ContextRefreshedEvent.class)
  public void start(){
    // Initialize Lobby Chat Queue
    rabbitQueueServiceImpl.addNewQueue("lobby", "chat-exchange", "lobby");
    // Initialize Start Listener
    MessageListenerContainer mlc = rabbitListenerEndpointRegistry.getListenerContainer("chat-exchange");
    System.out.println("MLC:"+mlc);
  }

}
