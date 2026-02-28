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
    this._items().reduce(
      (sum, i) => sum + i.product.originalPrice * (1 - i.product.discount / 100) * i.quantity,
      0
    )
  );

  add(product: Product): void {
    this._items.update(items => {
      const idx = items.findIndex(i => i.product.name === product.name);
      if (idx >= 0) {
        const updated = [...items];
        updated[idx] = { ...updated[idx], quantity: Math.min(updated[idx].quantity + 1, 10) };
        return updated;
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  increment(productName: string): void {
    this._items.update(items =>
      items.map(i =>
        i.product.name === productName
          ? { ...i, quantity: Math.min(i.quantity + 1, 10) }
          : i
      )
    );
  }

  decrement(productName: string): void {
    this._items.update(items =>
      items
        .map(i =>
          i.product.name === productName ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter(i => i.quantity > 0)
    );
  }

  remove(productName: string): void {
    this._items.update(items => items.filter(i => i.product.name !== productName));
  }

  clear(): void {
    this._items.set([]);
  }
}

