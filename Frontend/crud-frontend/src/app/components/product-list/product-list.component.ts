import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Observable, BehaviorSubject, Subject, firstValueFrom } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="row">
      <div class="col-12">
        <div class="card fade-in">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h4 class="mb-0">
              <i class="fas fa-boxes me-2"></i>
              Ürün Listesi
            </h4>
            <button class="btn btn-outline-primary btn-sm" (click)="refreshProducts()">
              <i class="fas fa-sync-alt me-1"></i>
              Yenile
            </button>
          </div>
          <div class="card-body">
            <!-- Debug Info -->
            <div class="alert alert-info" *ngIf="products.length > 0">
              <small>
                <i class="fas fa-info-circle me-1"></i>
                Debug: {{ products.length }} ürün yüklendi - Son güncelleme: {{ lastUpdate | date:'HH:mm:ss' }}
              </small>
            </div>

            <!-- Loading -->
            <div *ngIf="loading" class="loading-spinner text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Yükleniyor...</span>
              </div>
              <p class="mt-2 text-muted">Ürünler yükleniyor...</p>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="alert alert-danger d-flex align-items-center">
              <i class="fas fa-exclamation-triangle me-2"></i>
              <div class="flex-grow-1">{{ errorMessage }}</div>
              <button class="btn btn-outline-danger btn-sm" (click)="refreshProducts()">
                <i class="fas fa-redo me-1"></i>
                Tekrar Dene
              </button>
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage" class="alert alert-success d-flex align-items-center">
              <i class="fas fa-check-circle me-2"></i>
              {{ successMessage }}
            </div>

            <!-- Products Table -->
            <div *ngIf="!loading && !errorMessage" class="table-responsive">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-muted">
                  <strong>Toplam {{ products.length }} ürün</strong> bulundu
                </span>
                <a routerLink="/products/new" class="btn btn-success">
                  <i class="fas fa-plus me-1"></i>
                  Yeni Ürün Ekle
                </a>
              </div>
              
              <table class="table table-hover table-striped" *ngIf="products.length > 0">
                <thead class="table-dark">
                  <tr>
                    <th width="60">ID</th>
                    <th>Ürün Adı</th>
                    <th>Açıklama</th>
                    <th width="120">Fiyat</th>
                    <th width="100">Stok</th>
                    <th width="150">Tarih</th>
                    <th width="120">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let product of products; trackBy: trackByProductId; let i = index" 
                      class="animate-row" 
                      [style.animation-delay]="(i * 0.1) + 's'">
                    <td><strong>{{ product.id }}</strong></td>
                    <td>
                      <div class="fw-bold text-primary">{{ product.name }}</div>
                    </td>
                    <td>
                      <span class="text-muted">{{ product.description || 'Açıklama yok' }}</span>
                    </td>
                    <td>
                      <span class="fw-bold text-success">{{ product.price | currency:'TRY':'symbol':'1.2-2':'tr' }}</span>
                    </td>
                    <td>
                      <span class="badge" [class]="getStockBadgeClass(product.stock)">
                        {{ product.stock }} adet
                      </span>
                    </td>
                    <td class="small">{{ product.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td>
                      <div class="btn-group btn-group-sm" role="group">
                        <a [routerLink]="['/products/edit', product.id]" 
                           class="btn btn-outline-primary" 
                           title="Düzenle">
                          <i class="fas fa-edit"></i>
                        </a>
                        <button class="btn btn-outline-danger" 
                                (click)="deleteProduct(product)"
                                title="Sil">
                          <i class="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <!-- Empty State -->
              <div *ngIf="products.length === 0" class="text-center py-5">
                <i class="fas fa-box-open fa-4x text-muted mb-3"></i>
                <h5 class="text-muted">Henüz ürün bulunmuyor</h5>
                <p class="text-muted">İlk ürününüzü eklemek için aşağıdaki butona tıklayın.</p>
                <a routerLink="/products/new" class="btn btn-success btn-lg">
                  <i class="fas fa-plus me-2"></i>
                  İlk Ürünü Ekle
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" *ngIf="productToDelete">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Ürün Silme Onayı
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="alert alert-warning">
              <strong>{{ productToDelete.name }}</strong> adlı ürünü silmek istediğinize emin misiniz?
            </div>
            <p class="text-muted mb-0">
              <i class="fas fa-info-circle me-1"></i>
              Bu işlem geri alınamaz.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              <i class="fas fa-times me-1"></i>
              İptal
            </button>
            <button type="button" class="btn btn-danger" (click)="confirmDelete()" data-bs-dismiss="modal">
              <i class="fas fa-trash me-1"></i>
              Evet, Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-group .btn {
      margin-right: 2px;
    }
    .table td {
      vertical-align: middle;
    }
    .badge {
      font-size: 0.85em;
    }
    .loading-spinner {
      min-height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .animate-row {
      animation: fadeInUp 0.5s ease-out forwards;
      opacity: 0;
      transform: translateY(20px);
    }
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .table-striped tbody tr:nth-of-type(odd) {
      background-color: rgba(0,0,0,.02);
    }
    .table-hover tbody tr:hover {
      background-color: rgba(0,123,255,.075);
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  productToDelete: Product | null = null;
  lastUpdate = new Date();
  
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    console.log('🚀 ProductListComponent initialized');
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadProducts(): Promise<void> {
    console.log('📥 Loading products...');
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.lastUpdate = new Date();
    
    try {
      const products = await firstValueFrom(this.productService.getAllProducts());
      console.log('✅ Products loaded successfully:', products);
      this.products = [...products];
      this.lastUpdate = new Date();
      console.log('📊 Products array updated:', this.products);
    } catch (error: any) {
      console.error('❌ Error loading products:', error);
      this.errorMessage = error.message || 'Ürünler yüklenirken hata oluştu';
      this.products = [];
    } finally {
      this.loading = false;
      console.log('🔄 Loading finished');
    }
  }

  refreshProducts(): void {
    console.log('🔄 Manual refresh triggered');
    this.loadProducts();
  }

  deleteProduct(product: Product): void {
    this.productToDelete = product;
    
    // Bootstrap modal açma
    const modal = document.getElementById('deleteModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  async confirmDelete(): Promise<void> {
    if (this.productToDelete) {
      const productName = this.productToDelete.name;
      
      try {
        await firstValueFrom(this.productService.deleteProduct(this.productToDelete.id));
        this.successMessage = `${productName} başarıyla silindi.`;
        this.productToDelete = null;
        this.closeModal();
        await this.loadProducts();
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      } catch (error: any) {
        this.errorMessage = error.message || 'Ürün silinirken hata oluştu';
        this.productToDelete = null;
        this.closeModal();
      }
    }
  }

  private closeModal(): void {
    const modal = document.getElementById('deleteModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }

  getStockBadgeClass(stock: number): string {
    if (stock === 0) return 'bg-danger';
    if (stock <= 5) return 'bg-warning text-dark';
    if (stock <= 20) return 'bg-info text-dark';
    return 'bg-success';
  }
} 