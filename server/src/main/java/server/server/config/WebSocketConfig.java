package server.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker
@EnableScheduling
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
  private static final String WEBSOCKET_ALLOWED_ORIGIN = "https://listening-room-production-24f9.up.railway.app";
  @Override
  public void registerStompEndpoints(StompEndpointRegistry reg){
    reg.addEndpoint("/chat").setAllowedOrigins(WEBSOCKET_ALLOWED_ORIGIN).withSockJS();
  }
  
  @Override
    public void configureWebSocketTransport( WebSocketTransportRegistration registration )
    {
        registration.setMessageSizeLimit( 300000 * 50 ); // default : 64 * 1024
        registration.setSendTimeLimit( 30 * 10000 ); // default : 10 * 10000
        registration.setSendBufferSizeLimit( 3 * 512 * 1024 ); // default : 512 * 1024
    }
}
