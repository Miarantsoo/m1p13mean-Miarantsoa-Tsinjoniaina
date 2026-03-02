import { Injectable, signal, computed } from '@angular/core';
import { Product } from '@/modules/customer/front-office/models/front-office.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_GUEST_KEY = 'cart_items_guest';
const CART_KEY_PREFIX = 'cart_items_';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>(this.loadFromStorage());

  readonly items = this._items.asReadonly();

  readonly totalCount = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this._items().reduce((sum, item) => {
      const product = item.product;
      let price = product.price;

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
    this.saveToStorage();
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
    this.saveToStorage();
  }

  decrement(productId: string): void {
    this._items.update(items =>
      items
        .map(i =>
          i.product._id === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter(i => i.quantity > 0)
    );
    this.saveToStorage();
  }

  remove(productId: string): void {
    this._items.update(items => items.filter(i => i.product._id !== productId));
    this.saveToStorage();
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
    this.saveToStorage();
  }

  clear(): void {
    this._items.set([]);
    this.saveToStorage();
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

  /** Retourne les items formatés pour l'API */
  getItemsForApi(): { productId: string; quantity: number }[] {
    return this._items().map(i => ({
      productId: i.product._id,
      quantity: i.quantity
    }));
  }

  /**
   * À appeler lors du login : fusionne le panier invité dans le panier utilisateur,
   * puis vide le panier invité.
   */
  onLogin(userId: string): void {
    const guestItems = this.loadItems(CART_GUEST_KEY);
    const userItems = this.loadItems(this.userKey(userId));

    // Fusionner : pour chaque item invité, ajouter ou prendre la quantité max
    const merged = [...userItems];
    for (const guestItem of guestItems) {
      const idx = merged.findIndex(i => i.product._id === guestItem.product._id);
      if (idx >= 0) {
        merged[idx] = {
          ...merged[idx],
          quantity: Math.min(
            Math.max(merged[idx].quantity, guestItem.quantity),
            guestItem.product.stock
          )
        };
      } else {
        merged.push(guestItem);
      }
    }

    // Sauvegarder dans le panier utilisateur
    this.saveItems(this.userKey(userId), merged);
    // Vider le panier invité
    this.saveItems(CART_GUEST_KEY, []);
    // Mettre à jour le signal
    this._items.set(merged);
  }

  /**
   * À appeler lors du logout : repasse sur le panier invité (vide).
   */
  onLogout(): void {
    this._items.set(this.loadItems(CART_GUEST_KEY));
  }

  /** Recharge depuis le localStorage */
  reloadFromStorage(): void {
    this._items.set(this.loadFromStorage());
  }

  private getStorageKey(): string {
    try {
      const userStr = localStorage.getItem('user_info');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user?.id) {
          return this.userKey(user.id);
        }
      }
    } catch { /* ignore */ }
    return CART_GUEST_KEY;
  }

  private userKey(userId: string): string {
    return `${CART_KEY_PREFIX}${userId}`;
  }

  private saveToStorage(): void {
    this.saveItems(this.getStorageKey(), this._items());
  }

  private loadFromStorage(): CartItem[] {
    return this.loadItems(this.getStorageKey());
  }

  private saveItems(key: string, items: CartItem[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.error('Erreur lors de la sauvegarde du panier:', e);
    }
  }

  private loadItems(key: string): CartItem[] {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Erreur lors du chargement du panier:', e);
      return [];
    }
  }
}

