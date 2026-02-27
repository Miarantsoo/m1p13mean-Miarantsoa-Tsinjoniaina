import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Category } from '../../models/product.model';
import { ProductCategoryListComponent } from '../../components/product-category-list/product-category-list.component';
import { ZardTabGroupComponent, ZardTabComponent } from '@/shared/components/tabs';
import { ZardButtonComponent } from '@/shared/components/button/button.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCategoryListComponent,
    ZardTabGroupComponent,
    ZardTabComponent,
    ZardButtonComponent
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  @ViewChild('allTab') allTab!: ProductCategoryListComponent;

  categories: Category[] = [];
  shopId = '69a0016ce198485ddf628ca1';
  activeTab = 0;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    });
  }

  onTabChange(event: { index: number; label: string }) {
    this.activeTab = event.index;
  }

  goToAddProduct() {
    this.router.navigate(['/shop/products/add']);
  }

  refreshCurrentTab() {
    if (this.allTab) {
      this.allTab.loadProducts();
    }
  }
}
