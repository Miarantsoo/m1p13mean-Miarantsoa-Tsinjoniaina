import { Component, inject, signal, computed } from '@angular/core';
import {Product} from '@/modules/customer/front-office/models/front-office.model';
import {CartService} from '@/modules/customer/front-office/services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  private cartService = inject(CartService);
  product: Product = {
    brand: 'Everyday Humans',
    name: 'Oh My Bod! Sunscreen Lotion',
    rating: 5,
    reviewCount: 214,
    originalPrice: 20.0,
    discount: 20,
    description:
      'A reliable bodyguard for your skin, with secret uses. This lightweight, long lasting SPF50 sunscreen lotion will save you from the harshest midday sun, while also protecting dry skin, discoloured tattoos, darker scars, gel manicure UV exposures and more.',
    imageUrl: 'assets/images/oh-my-bod.png',
  };

  // --- Signals (Angular 19 reactivity) ---
  selectedSizeIndex = signal(1);
  quantity = signal(1);
  isWishlisted = signal(false);
  isDetailOpen = signal(false);
  cartState = signal<'idle' | 'added'>('idle');

  // --- Computed ---
  currentPrice = computed(() => this.product.originalPrice * (1 - this.product.discount / 100));

  cartButtonText = computed(() =>
    this.cartState() === 'added' ? 'ajouté' : 'ajouter au panier'
  );

  stars = computed(() => Array(this.product.rating).fill(0));

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
    this.cartService.add(this.product);
    this.cartState.set('added');
    setTimeout(() => this.cartState.set('idle'), 2000);
  }
}
