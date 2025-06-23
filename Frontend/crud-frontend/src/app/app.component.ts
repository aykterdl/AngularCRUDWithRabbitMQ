import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <i class="fas fa-boxes me-2"></i>
          CRUD Ürün Yönetimi
        </a>
        <div class="navbar-nav ms-auto">
          <a class="nav-link" routerLink="/products" routerLinkActive="active">
            <i class="fas fa-list me-1"></i>
            Ürünler
          </a>
          <a class="nav-link" routerLink="/products/new" routerLinkActive="active">
            <i class="fas fa-plus me-1"></i>
            Yeni Ürün
          </a>
        </div>
      </div>
    </nav>
    
    <div class="container-fluid">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar-nav .nav-link {
      margin: 0 10px;
      border-radius: 5px;
      transition: all 0.3s ease;
    }
    
    .navbar-nav .nav-link:hover,
    .navbar-nav .nav-link.active {
      background-color: rgba(255, 255, 255, 0.1);
      transform: translateY(-1px);
    }
  `]
})
export class AppComponent {
  title = 'CRUD Frontend';
} 