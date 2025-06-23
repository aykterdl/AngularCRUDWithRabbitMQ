using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

namespace CrudApi.Services
{
    public class RabbitMQService : IRabbitMQService, IDisposable
    {
        private readonly ILogger<RabbitMQService> _logger;
        private readonly bool _mockMode = true; // Mock mode for demo

        public RabbitMQService(ILogger<RabbitMQService> logger, IConfiguration configuration)
        {
            _logger = logger;
            _logger.LogInformation("RabbitMQ Service initialized in DEMO mode (no server required)");
        }

        public void PublishMessage(string queueName, object message)
        {
            try
            {
                var json = JsonSerializer.Serialize(message);
                
                // Simulate message publishing
                _logger.LogInformation($"📨 [DEMO] Message published to queue '{queueName}': {json}");
                
                // In real implementation, this would actually send to RabbitMQ
                // For demo purposes, we just log the event
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to publish message to queue '{queueName}'");
            }
        }

        public void PublishProductEvent(string eventType, object data)
        {
            var eventMessage = new
            {
                EventType = eventType,
                Timestamp = DateTime.UtcNow,
                Data = data
            };

            _logger.LogInformation($"🚀 [DEMO] Product Event '{eventType}' triggered at {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}");
            PublishMessage("product_events", eventMessage);
        }

        public void Dispose()
        {
            _logger.LogInformation("RabbitMQ Service disposed");
        }
    }
} 