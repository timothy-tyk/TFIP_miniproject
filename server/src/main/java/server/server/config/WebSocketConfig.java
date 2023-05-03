package server.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
 
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer{
  @Override
  public void registerStompEndpoints(StompEndpointRegistry reg){
    reg.addEndpoint("/chat").setAllowedOrigins("http://localhost:4200").withSockJS();
  }
  // @Override
  // public void configureMessageBroker(MessageBrokerRegistry msgReg){
  //   msgReg.setApplicationDestinationPrefixes("/app");
  //   // .enableSimpleBroker("/message");
  //   msgReg.enableStompBrokerRelay("/topic")
  //         .setRelayHost("localhost")
  //         .setRelayPort(61613)
  //         .setClientLogin("guest")
  //         .setClientPasscode("guest");
  // }
  @Override
    public void configureWebSocketTransport( WebSocketTransportRegistration registration )
    {
        registration.setMessageSizeLimit( 300000 * 50 ); // default : 64 * 1024
        registration.setSendTimeLimit( 30 * 10000 ); // default : 10 * 10000
        registration.setSendBufferSizeLimit( 3 * 512 * 1024 ); // default : 512 * 1024
    }
}
