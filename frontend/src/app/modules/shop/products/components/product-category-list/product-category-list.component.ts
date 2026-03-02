import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { PromotionService } from '../../services/promotion.service';
import { Product } from '../../models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';
import { PromotionModalComponent } from '../promotion-modal/promotion-modal.component';
import { ZardLoaderComponent } from '@/shared/components/loader/loader.component';
import { ZardDividerComponent } from '@/shared/components/divider';
import { ZardPaginationComponent } from '@/shared/components/pagination';
import {toast} from 'ngx-sonner';

@Component({
  selector: 'app-product-category-list',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    PromotionModalComponent,
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

  showPromotionModal = false;
  selectedProduct: Product | null = null;

  Math = Math;

  constructor(
    private productService: ProductService,
    private promotionService: PromotionService,
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

        // Charger les promotions pour chaque produit
        this.loadPromotions();

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

  loadPromotions() {
    this.products.forEach(product => {
      this.promotionService.getActivePromotionForProduct(product._id!).subscribe({
        next: (response: any) => {
          if (response.data) {
            product.promotion = response.data;
          }
        },
        error: (error: any) => {
          console.error('Erreur lors du chargement de la promotion:', error);
        }
      });
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
          this.showErrorToast('Erreur lors de la suppression du produit');
        }
      });
    }
  }

  onAddPromotion(product: Product) {
    this.selectedProduct = product;
    this.showPromotionModal = true;
  }

  onRemovePromotion(product: Product) {
    if (product.promotion && confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      this.promotionService.deletePromotion(product.promotion._id).subscribe({
        next: () => {
          this.showSuccesToast('Promotion supprimée avec succès');
          this.loadProducts();
        },
        error: (error: any) => {
          console.error('Erreur lors de la suppression:', error);
          this.showErrorToast('Erreur lors de la suppression de la promotion');
        }
      });
    }
  }

  showSuccesToast(message: string) {
    toast.success(message, {
      description: '',
      position: "top-right"
    });
  }

  showErrorToast(message: string) {
    toast.error(message, {
      description: '',
      position: "top-right"
    });
  }

  closePromotionModal() {
    this.showPromotionModal = false;
    this.selectedProduct = null;
  }

  savePromotion(promotionData: any) {
    console.log("→ savePromotion reçu :", promotionData);

    this.promotionService.createPromotion(promotionData).subscribe({
      next: (response) => {
        console.log("Succès création promo :", response);
        this.showSuccesToast('Promotion créée avec succès');
        this.closePromotionModal();
        this.loadProducts();
      },
      error: (err) => {
        console.error("Erreur API création promo :", err);
        this.showErrorToast('Erreur lors de la création promo');
      },
      complete: () => console.log("Requête createPromotion terminée")
    });
  }
}
