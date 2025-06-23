using Microsoft.EntityFrameworkCore;
using CrudApi.Data;
using CrudApi.Models;
using CrudApi.Models.DTOs;

namespace CrudApi.Services
{
    public class ProductService : IProductService
    {
        private readonly ApplicationDbContext _context;
        private readonly IRabbitMQService _rabbitMQService;
        private readonly ILogger<ProductService> _logger;

        public ProductService(ApplicationDbContext context, IRabbitMQService rabbitMQService, ILogger<ProductService> logger)
        {
            _context = context;
            _rabbitMQService = rabbitMQService;
            _logger = logger;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            try
            {
                var products = await _context.Products
                    .Where(p => p.IsActive)
                    .Select(p => new ProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        Stock = p.Stock,
                        CreatedAt = p.CreatedAt,
                        UpdatedAt = p.UpdatedAt,
                        IsActive = p.IsActive
                    })
                    .ToListAsync();

                return products;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting all products");
                throw;
            }
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            try
            {
                var product = await _context.Products
                    .Where(p => p.Id == id && p.IsActive)
                    .Select(p => new ProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        Price = p.Price,
                        Stock = p.Stock,
                        CreatedAt = p.CreatedAt,
                        UpdatedAt = p.UpdatedAt,
                        IsActive = p.IsActive
                    })
                    .FirstOrDefaultAsync();

                return product;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while getting product with id {id}");
                throw;
            }
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
        {
            try
            {
                var product = new Product
                {
                    Name = createProductDto.Name,
                    Description = createProductDto.Description,
                    Price = createProductDto.Price,
                    Stock = createProductDto.Stock,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                var productDto = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    Stock = product.Stock,
                    CreatedAt = product.CreatedAt,
                    UpdatedAt = product.UpdatedAt,
                    IsActive = product.IsActive
                };

                // Publish RabbitMQ event
                _rabbitMQService.PublishProductEvent("ProductCreated", productDto);

                _logger.LogInformation($"Product created successfully with id {product.Id}");
                return productDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating product");
                throw;
            }
        }

        public async Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null || !product.IsActive)
                {
                    return null;
                }

                // Update only provided fields
                if (!string.IsNullOrWhiteSpace(updateProductDto.Name))
                    product.Name = updateProductDto.Name;
                
                if (!string.IsNullOrWhiteSpace(updateProductDto.Description))
                    product.Description = updateProductDto.Description;
                
                if (updateProductDto.Price.HasValue)
                    product.Price = updateProductDto.Price.Value;
                
                if (updateProductDto.Stock.HasValue)
                    product.Stock = updateProductDto.Stock.Value;
                
                if (updateProductDto.IsActive.HasValue)
                    product.IsActive = updateProductDto.IsActive.Value;

                product.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var productDto = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    Stock = product.Stock,
                    CreatedAt = product.CreatedAt,
                    UpdatedAt = product.UpdatedAt,
                    IsActive = product.IsActive
                };

                // Publish RabbitMQ event
                _rabbitMQService.PublishProductEvent("ProductUpdated", productDto);

                _logger.LogInformation($"Product updated successfully with id {id}");
                return productDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while updating product with id {id}");
                throw;
            }
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null || !product.IsActive)
                {
                    return false;
                }

                // Soft delete
                product.IsActive = false;
                product.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Publish RabbitMQ event
                _rabbitMQService.PublishProductEvent("ProductDeleted", new { Id = id });

                _logger.LogInformation($"Product deleted successfully with id {id}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting product with id {id}");
                throw;
            }
        }

        public async Task<bool> ProductExistsAsync(int id)
        {
            try
            {
                return await _context.Products.AnyAsync(p => p.Id == id && p.IsActive);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while checking if product exists with id {id}");
                throw;
            }
        }
    }
} 