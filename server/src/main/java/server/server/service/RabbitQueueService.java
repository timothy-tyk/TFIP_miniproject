package server.server.service;

public interface RabbitQueueService {
  void addNewQueue(String queueName, String exchangeName, String routingKey);
  void addQueueToListener(String listenerId, String queueName);
  void removeQueueFromListener(String listenerId,String queueName);
  Boolean checkQueueExistsOnListener(String listenerId, String queueName);
}
