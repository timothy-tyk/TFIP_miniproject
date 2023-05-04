package server.server.service;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.listener.AbstractMessageListenerContainer;
import org.springframework.amqp.rabbit.listener.RabbitListenerEndpointRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RabbitQueueServiceImpl implements RabbitQueueService{
  @Autowired
  private RabbitAdmin rabbitAdmin;
  @Autowired
  private RabbitListenerEndpointRegistry rabbitListenerEndpointRegistry;
  
  @Override
  public void addNewQueue(String queueName, String exchangeName, String routingKey){
    Queue queue = new Queue(queueName, true, false, false);
    Binding binding = new Binding(queueName, Binding.DestinationType.QUEUE, exchangeName, routingKey,null);
    rabbitAdmin.declareQueue(queue);
    rabbitAdmin.declareBinding(binding);
    this.addQueueToListener(exchangeName, queueName);
  }

  @Override
  public void addQueueToListener(String listenerId, String queueName){
    if(!checkQueueExistsOnListener(listenerId, queueName)){
      this.getMessageListenerContainerById(listenerId).addQueueNames(queueName);
    }
    else{
      return;
    }
  }
  @Override
  public void removeQueueFromListener(String listenerId, String queueName){
    if(checkQueueExistsOnListener(listenerId, queueName)){
      this.getMessageListenerContainerById(listenerId).removeQueueNames(queueName);
      this.rabbitAdmin.deleteQueue(queueName);
    }
  }

  @Override
  public Boolean checkQueueExistsOnListener(String listenerId, String queueName){
    String[] queueNames = this.getMessageListenerContainerById(listenerId).getQueueNames();
    if(queueNames !=null){
      for(String name:queueNames){
        if(name.equals(queueName))return true;
      }
      return false;
    }else{

      return false;
    }
  }

  private AbstractMessageListenerContainer getMessageListenerContainerById(String listenerId){
    return ((AbstractMessageListenerContainer)this.rabbitListenerEndpointRegistry.getListenerContainer(listenerId));
  }
}


