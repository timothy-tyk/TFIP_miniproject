package server.server.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.annotation.RabbitListenerConfigurer;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.listener.RabbitListenerEndpointRegistrar;
import org.springframework.amqp.rabbit.listener.RabbitListenerEndpointRegistry;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.handler.annotation.support.DefaultMessageHandlerMethodFactory;



@Configuration
public class RabbitMQConfig implements RabbitListenerConfigurer{
  @Value("${spring.rabbitmq.host}") String host;
  @Value("${spring.rabbitmq.username}") String username;
  @Value("${spring.rabbitmq.password}") String password;

  @Bean(name = "cf")
  public CachingConnectionFactory configureConnectionFactory(){
    CachingConnectionFactory connectionFactory = new CachingConnectionFactory(host);
    connectionFactory.setUsername(username);
    connectionFactory.setPassword(password);
    connectionFactory.setVirtualHost(username);
    return connectionFactory;
  }
  
  @Bean
  public Jackson2JsonMessageConverter producerJ2MessageConverter(){
    return new Jackson2JsonMessageConverter();
  }
  @Bean
  public MappingJackson2MessageConverter consumerJ2MessageConverter(){
    return new MappingJackson2MessageConverter();
  }
  @Bean
  public RabbitTemplate rabbitTemplate(@Qualifier("cf") CachingConnectionFactory connectionFactory){
    final RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
    rabbitTemplate.setMessageConverter(producerJ2MessageConverter());
    return rabbitTemplate;
  }
  @Bean
  public RabbitAdmin rabbitAdmin(@Qualifier("cf") CachingConnectionFactory connectionFactory){
    return new RabbitAdmin(connectionFactory);
  }
  @Bean
  public TopicExchange topicExchange(){
    return new TopicExchange("chat-exchange");
  }
  @Bean
  public RabbitListenerEndpointRegistry rabbitListenerEndpointRegistry(){
    RabbitListenerEndpointRegistry newRegistry =  new RabbitListenerEndpointRegistry();
    return newRegistry;
  }
  
  @Bean
  public DefaultMessageHandlerMethodFactory messageHandlerMethodFactory() {
      DefaultMessageHandlerMethodFactory factory = new DefaultMessageHandlerMethodFactory();
      factory.setMessageConverter(consumerJ2MessageConverter());
      return factory;
  }
  @Bean
  public MessageConverter jsonMessageConverter() {
      return new Jackson2JsonMessageConverter();
  }
  @Override
  public void configureRabbitListeners(final RabbitListenerEndpointRegistrar registrar){
    CachingConnectionFactory connectionFactory = new CachingConnectionFactory(host);
    connectionFactory.setUsername(username);
    connectionFactory.setPassword(password);
    connectionFactory.setVirtualHost(username);
    SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
    factory.setConnectionFactory(connectionFactory);
    registrar.setContainerFactory(factory);
    registrar.setEndpointRegistry(rabbitListenerEndpointRegistry());
    registrar.setMessageHandlerMethodFactory(messageHandlerMethodFactory());
  }




}


