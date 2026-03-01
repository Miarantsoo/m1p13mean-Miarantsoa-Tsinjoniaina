import { Injectable, signal, computed } from '@angular/core';
import { Product } from '@/modules/customer/front-office/models/front-office.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly totalCount = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this._items().reduce((sum, item) => {
      const product = item.product;
      let price = product.price;

      // Appliquer la promotion si elle existe
      if (product.promotion) {
        const discount = product.promotion.discountType === 'percentage'
          ? (price * product.promotion.discountValue) / 100
          : product.promotion.discountValue;
        price = price - discount;
      }

      return sum + (price * item.quantity);
    }, 0)
  );

  add(product: Product, quantity: number = 1): void {
    this._items.update(items => {
      const idx = items.findIndex(i => i.product._id === product._id);
      if (idx >= 0) {
        const updated = [...items];
        const newQuantity = Math.min(
          updated[idx].quantity + quantity,
          product.stock
        );
        updated[idx] = { ...updated[idx], quantity: newQuantity };
        return updated;
      }
      return [...items, { product, quantity: Math.min(quantity, product.stock) }];
    });
  }

  increment(productId: string): void {
    this._items.update(items =>
      items.map(i => {
        if (i.product._id === productId) {
          const newQuantity = Math.min(i.quantity + 1, i.product.stock);
          return { ...i, quantity: newQuantity };
        }
        return i;
      })
    );
  }

  decrement(productId: string): void {
    this._items.update(items =>
      items
        .map(i =>
          i.product._id === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter(i => i.quantity > 0)
    );
  }

  remove(productId: string): void {
    this._items.update(items => items.filter(i => i.product._id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    this._items.update(items =>
      items.map(i => {
        if (i.product._id === productId) {
          const newQuantity = Math.max(1, Math.min(quantity, i.product.stock));
          return { ...i, quantity: newQuantity };
        }
        return i;
      })
    );
  }

  clear(): void {
    this._items.set([]);
  }

  getItemPrice(item: CartItem): number {
    let price = item.product.price;

    if (item.product.promotion) {
      const discount = item.product.promotion.discountType === 'percentage'
        ? (price * item.product.promotion.discountValue) / 100
        : item.product.promotion.discountValue;
      price = price - discount;
    }

    return price;
  }
}

