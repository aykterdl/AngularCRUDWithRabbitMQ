using Microsoft.AspNetCore.Mvc;
using CrudApi.Models.DTOs;
using CrudApi.Services;

namespace CrudApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(IProductService productService, ILogger<ProductsController> logger)
        {
            _productService = productService;
            _logger = logger;
        }

        /// <summary>
        /// Tüm aktif ürünleri getirir
        /// </summary>
        /// <returns>Aktif ürünlerin listesi</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            try
            {
                var products = await _productService.GetAllProductsAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while getting products");
                return StatusCode(500, "Ürünler getirilirken bir hata oluştu");
            }
        }

        /// <summary>
        /// Belirtilen ID'ye sahip ürünü getirir
        /// </summary>
        /// <param name="id">Ürün ID'si</param>
        /// <returns>Ürün bilgileri</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            try
            {
                var product = await _productService.GetProductByIdAsync(id);
                
                if (product == null)
                {
                    return NotFound($"ID'si {id} olan ürün bulunamadı");
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while getting product with id {id}");
                return StatusCode(500, "Ürün getirilirken bir hata oluştu");
            }
        }

        /// <summary>
        /// Yeni bir ürün oluşturur
        /// </summary>
        /// <param name="createProductDto">Oluşturulacak ürün bilgileri</param>
        /// <returns>Oluşturulan ürün</returns>
        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto createProductDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var product = await _productService.CreateProductAsync(createProductDto);
                
                return CreatedAtAction(
                    nameof(GetProduct), 
                    new { id = product.Id }, 
                    product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while creating product");
                return StatusCode(500, "Ürün oluşturulurken bir hata oluştu");
            }
        }

        /// <summary>
        /// Mevcut bir ürünü günceller
        /// </summary>
        /// <param name="id">Güncellenecek ürünün ID'si</param>
        /// <param name="updateProductDto">Güncellenecek ürün bilgileri</param>
        /// <returns>Güncellenmiş ürün</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<ProductDto>> UpdateProduct(int id, UpdateProductDto updateProductDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var product = await _productService.UpdateProductAsync(id, updateProductDto);
                
                if (product == null)
                {
                    return NotFound($"ID'si {id} olan ürün bulunamadı");
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while updating product with id {id}");
                return StatusCode(500, "Ürün güncellenirken bir hata oluştu");
            }
        }

        /// <summary>
        /// Belirtilen ID'ye sahip ürünü siler (soft delete)
        /// </summary>
        /// <param name="id">Silinecek ürünün ID'si</param>
        /// <returns>Silme işleminin sonucu</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var result = await _productService.DeleteProductAsync(id);
                
                if (!result)
                {
                    return NotFound($"ID'si {id} olan ürün bulunamadı");
                }

                return Ok(new { message = "Ürün başarıyla silindi", id = id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while deleting product with id {id}");
                return StatusCode(500, "Ürün silinirken bir hata oluştu");
            }
        }

        /// <summary>
        /// Belirtilen ID'ye sahip ürünün var olup olmadığını kontrol eder
        /// </summary>
        /// <param name="id">Kontrol edilecek ürünün ID'si</param>
        /// <returns>Ürünün var olup olmadığı</returns>
        [HttpHead("{id}")]
        public async Task<IActionResult> ProductExists(int id)
        {
            try
            {
                var exists = await _productService.ProductExistsAsync(id);
                
                if (exists)
                {
                    return Ok();
                }
                
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while checking if product exists with id {id}");
                return StatusCode(500);
            }
        }
    }
} 