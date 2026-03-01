import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '@/modules/customer/front-office/models/front-office.model';
import { CartService } from '@/modules/customer/front-office/services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  product = signal<Product | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // --- Signals (Angular 19 reactivity) ---
  selectedSizeIndex = signal(1);
  quantity = signal(1);
  isWishlisted = signal(false);
  isDetailOpen = signal(false);
  cartState = signal<'idle' | 'added'>('idle');

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  loadProduct(id: string): void {
    this.isLoading.set(true);
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement du produit');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  // --- Computed ---
  currentPrice = computed(() => {
    const prod = this.product();
    if (!prod) return 0;

    if (prod.promotion) {
      const discount = prod.promotion.discountType === 'percentage'
        ? (prod.price * prod.promotion.discountValue) / 100
        : prod.promotion.discountValue;
      return prod.price - discount;
    }
    return prod.price;
  });

  discountPercentage = computed(() => {
    const prod = this.product();
    if (!prod?.promotion) return 0;
    if (prod.promotion.discountType === 'percentage') {
      return prod.promotion.discountValue;
    }
    return Math.round((prod.promotion.discountValue / prod.price) * 100);
  });

  cartButtonText = computed(() =>
    this.cartState() === 'added' ? 'ajouté' : 'ajouter au panier'
  );

  // --- Methods ---
  selectSize(index: number): void {
    this.selectedSizeIndex.set(index);
  }

  incrementQty(): void {
    this.quantity.update((q) => Math.min(q + 1, 10));
  }

  decrementQty(): void {
    this.quantity.update((q) => Math.max(q - 1, 1));
  }

  toggleWishlist(): void {
    this.isWishlisted.update((v) => !v);
  }

  toggleDetail(): void {
    this.isDetailOpen.update((v) => !v);
  }

  addToCart(): void {
    const prod = this.product();
    if (prod) {
      this.cartService.add(prod);
      this.cartState.set('added');
      setTimeout(() => this.cartState.set('idle'), 2000);
    }
  }
}
