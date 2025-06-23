# CRUD Ürün Yönetimi Projesi

Bu proje .NET 9 backend API, Angular frontend, RabbitMQ mesajlaşma sistemi ve MSSQL veritabanı kullanarak kapsamlı bir CRUD (Create, Read, Update, Delete) ürün yönetim sistemi sunar.

## 🚀 Teknolojiler

### Backend
- **.NET 9** - Web API
- **Entity Framework Core** - ORM
- **SQL Server** - Veritabanı
- **RabbitMQ** - Mesajlaşma sistemi
- **Swagger** - API dokümantasyonu

### Frontend
- **Angular 17** - SPA Framework
- **Bootstrap 5** - UI Framework
- **RxJS** - Reactive Programming
- **TypeScript** - Type Safety

## 📁 Proje Yapısı

```
aykut-repo/
├── Backend/
│   └── CrudApi/
│       ├── Controllers/         # API Controllers
│       ├── Services/           # Business Logic
│       ├── Models/             # Entity Models & DTOs
│       ├── Data/              # DbContext & Migrations
│       └── Program.cs         # Startup Configuration
└── Frontend/
    └── crud-frontend/
        └── src/
            ├── app/
            │   ├── components/   # Angular Components
            │   ├── services/     # HTTP Services
            │   └── models/       # TypeScript Interfaces
            └── styles.css       # Global Styles
```

## 🛠️ Kurulum ve Çalıştırma

### Ön Gereksinimler
- .NET 9 SDK
- Node.js (v18+)
- SQL Server LocalDB
- RabbitMQ Server
- Angular CLI

### Backend Kurulumu

1. Backend dizinine gidin:
```bash
cd Backend/CrudApi
```

2. NuGet paketlerini geri yükleyin:
```bash
dotnet restore
```

3. Veritabanını oluşturun (LocalDB kullanılıyor):
```bash
dotnet ef database update
```

4. API'yi çalıştırın:
```bash
dotnet run
```

API şu adreste çalışacak: `https://localhost:7121`

### Frontend Kurulumu

1. Frontend dizinine gidin:
```bash
cd Frontend/crud-frontend
```

2. NPM paketlerini yükleyin:
```bash
npm install
```

3. Angular uygulamasını çalıştırın:
```bash
npm start
```

Uygulama şu adreste çalışacak: `http://localhost:4200`

### RabbitMQ Kurulumu

1. RabbitMQ Server'ı indirin ve kurun: https://www.rabbitmq.com/download.html
2. Varsayılan ayarlarla çalıştırın (localhost:5672)
3. Management plugin'i etkinleştirin:
```bash
rabbitmq-plugins enable rabbitmq_management
```
4. Management UI: http://localhost:15672 (guest/guest)

## 📋 API Endpoints

### Products API

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/products` | Tüm aktif ürünleri listele |
| GET | `/api/products/{id}` | Belirli bir ürünü getir |
| POST | `/api/products` | Yeni ürün oluştur |
| PUT | `/api/products/{id}` | Ürün güncelle |
| DELETE | `/api/products/{id}` | Ürün sil (soft delete) |
| HEAD | `/api/products/{id}` | Ürün var mı kontrol et |

### Swagger Dokümantasyonu
API dokümantasyonu için: `https://localhost:7121/swagger`

## 🎯 Özellikler

### Backend Özellikleri
- ✅ RESTful API tasarımı
- ✅ Entity Framework Core ile Code-First yaklaşım
- ✅ Soft delete implementasyonu
- ✅ RabbitMQ ile event-driven architecture
- ✅ Comprehensive error handling
- ✅ CORS desteği
- ✅ Swagger/OpenAPI dokümantasyonu
- ✅ Dependency Injection
- ✅ Logging

### Frontend Özellikleri
- ✅ Modern Angular standalone components
- ✅ Reactive forms ile form validation
- ✅ Responsive tasarım (Bootstrap 5)
- ✅ Loading states ve error handling
- ✅ Real-time feedback
- ✅ Beautiful UI/UX
- ✅ TypeScript type safety

### RabbitMQ Events
- `ProductCreated` - Yeni ürün oluşturulduğunda
- `ProductUpdated` - Ürün güncellendiğinde
- `ProductDeleted` - Ürün silindiğinde

## 🗄️ Veritabanı Şeması

### Products Tablosu
```sql
Id (int, PK, Identity)
Name (nvarchar(100), NOT NULL)
Description (nvarchar(500))
Price (decimal(18,2), NOT NULL)
Stock (int, NOT NULL)
CreatedAt (datetime2, DEFAULT GETUTCDATE())
UpdatedAt (datetime2, DEFAULT GETUTCDATE())
IsActive (bit, DEFAULT 1)
```

## 🔧 Konfigürasyon

### Backend Configuration (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=CrudApiDb;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true",
    "RabbitMQ": "localhost"
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:4200",
      "https://localhost:4200"
    ]
  }
}
```

### Frontend Configuration
```typescript
// Product Service Base URL
private readonly baseUrl = 'https://localhost:7121/api/products';
```

## 🚦 Test Etme

1. Backend'i çalıştırın
2. Frontend'i çalıştırın
3. Browser'da `http://localhost:4200` adresine gidin
4. Ürün ekleme, listeleme, güncelleme ve silme işlemlerini test edin
5. RabbitMQ Management UI'da mesajları kontrol edin

## 📈 Geliştirme Önerileri

- [ ] Authentication & Authorization
- [ ] Unit & Integration Tests
- [ ] Containerization (Docker)
- [ ] Pagination
- [ ] Search & Filter
- [ ] File Upload (Product Images)
- [ ] Audit Trail
- [ ] Performance Optimizations
- [ ] Caching (Redis)
- [ ] Monitoring & Metrics

## 🤝 Katkıda Bulunma

1. Bu projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Not:** Bu proje eğitim ve demo amaçlı geliştirilmiştir. Production ortamında kullanmadan önce güvenlik ve performans optimizasyonları yapılmalıdır. 