import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product, CreateProductDto, UpdateProductDto } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly baseUrl = 'http://localhost:5224/api/products';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl).pipe(
      map(products => products.map(product => ({
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt)
      }))),
      catchError(this.handleError)
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`).pipe(
      map(product => ({
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt)
      })),
      catchError(this.handleError)
    );
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product).pipe(
      map(product => ({
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt)
      })),
      catchError(this.handleError)
    );
  }

  updateProduct(id: number, product: UpdateProductDto): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product).pipe(
      map(product => ({
        ...product,
        createdAt: new Date(product.createdAt),
        updatedAt: new Date(product.updatedAt)
      })),
      catchError(this.handleError)
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Bilinmeyen bir hata oluştu';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Hata: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Geçersiz istek. Lütfen girdiğiniz bilgileri kontrol edin.';
          break;
        case 404:
          errorMessage = 'Aranan kaynak bulunamadı.';
          break;
        case 500:
          errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
          break;
        default:
          errorMessage = `Sunucu hatası: ${error.status}`;
      }
    }

    console.error('ProductService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
} 