// package server.server.config;

// import java.net.MalformedURLException;
// import java.net.URISyntaxException;

// import org.springframework.amqp.core.AmqpAdmin;
// import org.springframework.amqp.core.DirectExchange;
// import org.springframework.amqp.core.MessageListener;
// import org.springframework.amqp.core.Queue;
// import org.springframework.amqp.core.TopicExchange;
// import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
// import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
// import org.springframework.amqp.rabbit.connection.ConnectionFactory;
// import org.springframework.amqp.rabbit.core.RabbitAdmin;
// import org.springframework.amqp.rabbit.core.RabbitTemplate;
// import org.springframework.amqp.rabbit.listener.RabbitListenerEndpointRegistry;
// import org.springframework.amqp.rabbit.listener.SimpleMessageListenerContainer;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// import com.rabbitmq.http.client.Client;
// import com.rabbitmq.http.client.ClientParameters;

// @Configuration
// public class RabbitConfig {
//   @Bean
//   public ConnectionFactory connectionFactory() {
//     String host = "localhost";
//     Integer port = 5672;
//     CachingConnectionFactory connectionFactory = new CachingConnectionFactory(host, port);
//     connectionFactory.setUsername("guest");
//     connectionFactory.setPassword("guest");
//     return connectionFactory;
//   }
//   @Bean
//   public AmqpAdmin amqpAdmin() {
//     return new RabbitAdmin(connectionFactory());
//   }
//   @Bean
//   public static TopicExchange chatExchange(){
//     return new TopicExchange("chat-exchange");
//   }
//   // @Bean
//   // public static Queue queue(String queueName){
//   //   return new Queue(queueName, true, false, false);
//   // }
//   @Bean
//   public RabbitListenerEndpointRegistry rabbitListenerEndpointRegistry(){
//     return new RabbitListenerEndpointRegistry();
//   }
//   @Bean
//   public Client rabbitClient() throws MalformedURLException, URISyntaxException{
//     Client client = new Client(new ClientParameters()
//                     .url("http://127.0.0.1:15672/api/")
//                     .username("guest")
//                     .password("guest")
//                     );
//     return client;
//   }
 


  
// }
