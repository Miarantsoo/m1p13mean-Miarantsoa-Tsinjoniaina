import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@/core/services/http/http.service';

export interface OrderItemRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  items: OrderItemRequest[];
  pickupDate: string;
}

export interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    photo?: string;
  };
  quantity: number;
  priceAtOrder: number;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  shop: {
    _id: string;
    name: string;
  };
  items: OrderItem[];
  pickupDate: string;
  status: 'pending' | 'ready' | 'picked_up' | 'cancelled';
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService extends HttpService {
  protected override endpoint = 'orders';

  createOrder(payload: CreateOrderRequest): Observable<{ success: boolean; data: Order[]; message: string }> {
    return this.doPost<{ success: boolean; data: Order[]; message: string }>('', payload);
  }

  getMyOrders(): Observable<{ success: boolean; data: Order[] }> {
    return this.doGet<{ success: boolean; data: Order[] }>('my');
  }

  getShopOrders(shopId: string): Observable<{ success: boolean; data: Order[] }> {
    return this.doGet<{ success: boolean; data: Order[] }>(`shop/${shopId}`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<{ success: boolean; data: Order; message: string }> {
    return this.doPatch<{ success: boolean; data: Order; message: string }>(`${orderId}/status`, { status });
  }

  checkPendingOrders(): Observable<{ success: boolean; data: { hasPendingOrders: boolean } }> {
    return this.doGet<{ success: boolean; data: { hasPendingOrders: boolean } }>('pending-check');
  }
}

