using Microsoft.EntityFrameworkCore;
using CrudApi.Data;
using CrudApi.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Swagger/OpenAPI configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "CRUD API", 
        Version = "v1",
        Description = "Ürün yönetimi için CRUD işlemleri içeren API"
    });
    
    // Include XML comments if available
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// Database Configuration
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS Configuration
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[] { "http://localhost:4200" };
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Register services
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddSingleton<IRabbitMQService, RabbitMQService>();

// Logging
builder.Services.AddLogging();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "CRUD API V1");
        c.RoutePrefix = "swagger";
    });
    app.MapOpenApi();
}

// Middleware pipeline
app.UseHttpsRedirection();
app.UseCors("AllowAngularApp");
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Create database and apply migrations
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        context.Database.EnsureCreated();
        app.Logger.LogInformation("Database created/verified successfully");
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "An error occurred while creating/verifying the database");
    }
}

// Root endpoint
app.MapGet("/", () => 
{
    return Results.Ok(new 
    { 
        message = "CRUD API başarıyla çalışıyor!", 
        timestamp = DateTime.UtcNow,
        endpoints = new[]
        {
            "GET /api/products - Tüm ürünleri listele",
            "GET /api/products/{id} - Belirli bir ürünü getir", 
            "POST /api/products - Yeni ürün oluştur",
            "PUT /api/products/{id} - Ürün güncelle",
            "DELETE /api/products/{id} - Ürün sil",
            "GET /swagger - API dokümantasyonu"
        }
    });
});

app.Run();
