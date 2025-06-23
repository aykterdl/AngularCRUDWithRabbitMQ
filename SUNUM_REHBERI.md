# 🎯 SUNUM REHBERİ - CRUD Ürün Yönetimi Projesi

## 📱 Sunum Öncesi Hazırlık (15 dakika)

### 1. **Sistemi Hazırlama**
```bash
# 1. Proje dizinine git
cd D:\aykut-repo

# 2. Backend'i başlat (1. Terminal)
cd Backend\CrudApi
dotnet run

# 3. Frontend'i başlat (2. Terminal) 
cd Frontend\crud-frontend
npm start
```

### 2. **Kontrol Edilecekler**
- ✅ Backend çalışıyor mu: `https://localhost:7121`
- ✅ Frontend çalışıyor mu: `http://localhost:4200`
- ✅ Swagger çalışıyor mu: `https://localhost:7121/swagger`
- ✅ Veritabanı bağlantısı var mı

## 🎤 Sunum Akışı (10-15 dakika)

### **1. Giriş (2 dakika)**
> "Merhaba! Bugün size .NET 9, Angular, RabbitMQ ve SQL Server kullanarak geliştirdiğim modern bir CRUD ürün yönetim sistemi tanıtacağım."

### **2. Teknoloji Stack (2 dakika)**
📊 **Backend:**
- .NET 9 Web API
- Entity Framework Core
- SQL Server
- RabbitMQ Event System
- Swagger Documentation

📱 **Frontend:**
- Angular 17 (Standalone Components)
- Bootstrap 5 UI
- TypeScript
- Reactive Forms

### **3. Canlı Demo (8 dakika)**

#### **3.1 Backend API Demo (3 dakika)**
```
1. Swagger UI'ı aç: https://localhost:7121/swagger
2. GET /api/products - Ürün listesini göster
3. POST /api/products - Yeni ürün ekle
4. PUT /api/products/{id} - Ürün güncelle
5. DELETE /api/products/{id} - Ürün sil
```

#### **3.2 Frontend UI Demo (5 dakika)**
```
1. Anasayfa: http://localhost:4200
2. Ürün Listesi:
   - Modern UI tasarımı
   - Responsive bootstrap layout
   - Real-time data

3. Yeni Ürün Ekleme:
   - Form validasyonu
   - Error handling
   - Success feedback

4. Ürün Düzenleme:
   - Pre-filled form
   - Update işlemi

5. Ürün Silme:
   - Confirmation modal
   - Soft delete
```

### **4. Teknik Özellikler (2 dakika)**

🚀 **Backend Highlights:**
- RESTful API design
- Event-driven architecture (RabbitMQ)
- Entity Framework Code-First
- Comprehensive error handling
- CORS support
- Dependency Injection

🎨 **Frontend Highlights:**
- Modern Angular standalone components
- Reactive forms ile validation
- Beautiful gradient UI
- Mobile-first responsive design
- TypeScript type safety

### **5. Database & Architecture (1 dakika)**
```
📊 Veritabanı: SQL Server (192.168.25.11)
🔄 Event System: RabbitMQ
🌐 API: RESTful endpoints
📱 UI: Single Page Application
```

## 📋 Demo Senaryosu

### **Senaryo: E-ticaret Ürün Yönetimi**

1. **"Laptopa ihtiyacımız var"**
   - Yeni ürün ekle: "MacBook Pro M3"
   - Fiyat: ₺45,000
   - Stok: 5

2. **"Fiyat güncellemesi gerekiyor"**
   - Ürünü düzenle
   - Fiyatı ₺42,000 yap

3. **"Bu ürün artık satılmıyor"**
   - Ürünü sil (soft delete)
   - Listeden kaldırıldığını göster

## 🔧 Olası Sorunlar ve Çözümler

### **Backend Çalışmıyor:**
```bash
cd Backend\CrudApi
dotnet restore
dotnet run
```

### **Frontend Çalışmıyor:**
```bash
cd Frontend\crud-frontend
npm install
npm start
```

### **Veritabanı Bağlantı Hatası:**
- SQL Server erişilebilir mi?
- Connection string doğru mu?
- Kullanıcı yetkisi var mı?

### **RabbitMQ Çalışmıyor:**
- Localhost'ta RabbitMQ server çalışıyor mu?
- Management UI: http://localhost:15672

## 📊 Sunum Puanları

### **Teknik Puanlar:**
- ✅ Modern teknoloji stack
- ✅ Clean Architecture
- ✅ Event-driven design
- ✅ Responsive UI/UX
- ✅ Error handling
- ✅ Type safety

### **Business Puanlar:**
- ✅ Real-world scenario
- ✅ User-friendly interface
- ✅ Scalable architecture
- ✅ Production-ready features

## 🎯 Sunum Sonrası Sorular

**S: "Hangi pattern'leri kullandınız?"**
**C:** Repository Pattern, Dependency Injection, MVC Pattern, Observer Pattern (RabbitMQ)

**S: "Performans optimizasyonu yaptınız mı?"**
**C:** Entity Framework optimization, TypeScript compilation, Bootstrap CDN, async/await pattern

**S: "Security nasıl?"**
**C:** CORS policy, SQL injection koruması (EF Core), Input validation

**S: "Test etikleriniz var mı?"**
**C:** Manual testing, Swagger test environment, Browser testing

## 📞 İletişim Bilgileri

Bu proje GitHub'da mevcuttur ve her türlü katkıya açıktır.

---

**💡 İpucu:** Sunum sırasında rahat olun, projenizin her parçasını biliyorsunuz! 