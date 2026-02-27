import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ZardLoaderComponent } from '@/shared/components/loader/loader.component';
import { ZardDividerComponent } from '@/shared/components/divider';
import { ZardPaginationComponent } from '@/shared/components/pagination';

@Component({
  selector: 'app-product-category-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    ZardLoaderComponent,
    ZardDividerComponent,
    ZardPaginationComponent
  ],
  templateUrl: './product-category-list.component.html',
  styleUrl: './product-category-list.component.scss'
})
export class ProductCategoryListComponent implements OnInit {
  @Input() categoryId!: string;
  @Input() shopId!: string;

  products: Product[] = [];
  loading = signal(false);
  currentPage = signal(1);
  totalPages = signal(1);
  totalItems = signal(0);
  limit = signal(12);
  limitOptions = [6, 12, 24, 48];

  Math = Math;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);

    const filters = {
      categoryId: this.categoryId === 'all' ? undefined : this.categoryId,
      page: this.currentPage(),
      limit: this.limit()
    };

    this.productService.getProductsByShop(this.shopId, filters).subscribe({
      next: (response) => {
        this.products = Array.isArray(response.data) ? response.data : [];
        if (response.pagination) {
          this.totalPages.set(response.pagination.pages);
          this.totalItems.set(response.pagination.total);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des produits:', error);
        this.loading.set(false);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadProducts();
  }

  onLimitChange(newLimit: number) {
    this.limit.set(newLimit);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onEditProduct(product: Product) {
    this.router.navigate(['/shop/products/edit', product._id]);
  }

  onDeleteProduct(product: Product) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.name}" ?`)) {
      this.productService.deleteProduct(product._id!).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression du produit');
        }
      });
    }
  }
}
