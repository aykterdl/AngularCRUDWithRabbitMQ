import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product, CreateProductDto, UpdateProductDto } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card fade-in">
          <div class="card-header">
            <h4 class="mb-0">
              <i class="fas fa-{{ isEditMode ? 'edit' : 'plus' }} me-2"></i>
              {{ isEditMode ? 'Ürün Düzenle' : 'Yeni Ürün Ekle' }}
            </h4>
          </div>
          <div class="card-body">
            <!-- Loading -->
            <div *ngIf="loading" class="loading-spinner">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Yükleniyor...</span>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="error-message">
              <i class="fas fa-exclamation-triangle me-2"></i>
              {{ errorMessage }}
            </div>

            <!-- Success Message -->
            <div *ngIf="successMessage" class="success-message">
              <i class="fas fa-check-circle me-2"></i>
              {{ successMessage }}
            </div>

            <!-- Form -->
            <form [formGroup]="productForm" (ngSubmit)="onSubmit()" *ngIf="!loading">
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="name" class="form-label">
                      Ürün Adı <span class="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      class="form-control"
                      formControlName="name"
                      [class.is-invalid]="isFieldInvalid('name')"
                      placeholder="Ürün adını giriniz">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('name')">
                      <div *ngIf="productForm.get('name')?.errors?.['required']">
                        Ürün adı zorunludur.
                      </div>
                      <div *ngIf="productForm.get('name')?.errors?.['maxlength']">
                        Ürün adı en fazla 100 karakter olabilir.
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="price" class="form-label">
                      Fiyat (₺) <span class="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      class="form-control"
                      formControlName="price"
                      [class.is-invalid]="isFieldInvalid('price')"
                      placeholder="0.00"
                      step="0.01"
                      min="0">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('price')">
                      <div *ngIf="productForm.get('price')?.errors?.['required']">
                        Fiyat zorunludur.
                      </div>
                      <div *ngIf="productForm.get('price')?.errors?.['min']">
                        Fiyat 0'dan büyük olmalıdır.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="stock" class="form-label">Stok Adedi</label>
                    <input
                      type="number"
                      id="stock"
                      class="form-control"
                      formControlName="stock"
                      [class.is-invalid]="isFieldInvalid('stock')"
                      placeholder="0"
                      min="0">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('stock')">
                      <div *ngIf="productForm.get('stock')?.errors?.['min']">
                        Stok adedi 0'dan küçük olamaz.
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-6" *ngIf="isEditMode">
                  <div class="mb-3">
                    <label for="isActive" class="form-label">Durum</label>
                    <select
                      id="isActive"
                      class="form-select"
                      formControlName="isActive">
                      <option [value]="true">Aktif</option>
                      <option [value]="false">Pasif</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="description" class="form-label">Açıklama</label>
                <textarea
                  id="description"
                  class="form-control"
                  formControlName="description"
                  [class.is-invalid]="isFieldInvalid('description')"
                  placeholder="Ürün açıklamasını giriniz"
                  rows="4"></textarea>
                <div class="invalid-feedback" *ngIf="isFieldInvalid('description')">
                  <div *ngIf="productForm.get('description')?.errors?.['maxlength']">
                    Açıklama en fazla 500 karakter olabilir.
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-between">
                <button
                  type="button"
                  class="btn btn-secondary"
                  (click)="goBack()">
                  <i class="fas fa-arrow-left me-1"></i>
                  Geri Dön
                </button>
                
                <button
                  type="submit"
                  class="btn btn-primary"
                  [disabled]="productForm.invalid || submitting">
                  <span *ngIf="submitting" class="spinner-border spinner-border-sm me-2"></span>
                  <i class="fas fa-{{ isEditMode ? 'save' : 'plus' }} me-1" *ngIf="!submitting"></i>
                  {{ isEditMode ? 'Güncelle' : 'Ekle' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-label {
      font-weight: 600;
      color: #495057;
    }
    
    .form-control:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
    }
    
    .is-invalid {
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      display: block;
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stock: [0, [Validators.min(0)]],
      isActive: [true]
    });
  }

  loadProduct(): void {
    if (this.productId) {
      this.loading = true;
      this.errorMessage = '';

      this.productService.getProductById(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            isActive: product.isActive
          });
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.submitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = this.productForm.value;

      if (this.isEditMode && this.productId) {
        const updateData: UpdateProductDto = {
          name: formValue.name,
          description: formValue.description,
          price: formValue.price,
          stock: formValue.stock,
          isActive: formValue.isActive
        };

        this.productService.updateProduct(this.productId, updateData).subscribe({
          next: () => {
            this.successMessage = 'Ürün başarıyla güncellendi!';
            this.submitting = false;
            setTimeout(() => {
              this.router.navigate(['/products']);
            }, 1500);
          },
          error: (error) => {
            this.errorMessage = error.message;
            this.submitting = false;
          }
        });
      } else {
        const createData: CreateProductDto = {
          name: formValue.name,
          description: formValue.description,
          price: formValue.price,
          stock: formValue.stock
        };

        this.productService.createProduct(createData).subscribe({
          next: () => {
            this.successMessage = 'Ürün başarıyla eklendi!';
            this.submitting = false;
            setTimeout(() => {
              this.router.navigate(['/products']);
            }, 1500);
          },
          error: (error) => {
            this.errorMessage = error.message;
            this.submitting = false;
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
} 