namespace CrudApi.Services
{
    public interface IRabbitMQService
    {
        void PublishMessage(string queueName, object message);
        void PublishProductEvent(string eventType, object data);
    }
} 