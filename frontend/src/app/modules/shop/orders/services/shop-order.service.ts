import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@/core/services/http/http.service';

export interface ShopOrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    photo?: string;
  };
  quantity: number;
  priceAtOrder: number;
}

export interface ShopOrder {
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
  items: ShopOrderItem[];
  pickupDate: string;
  status: 'pending' | 'ready' | 'picked_up' | 'cancelled';
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShopOrderService extends HttpService {
  protected override endpoint = 'orders';

  getShopOrders(shopId: string): Observable<{ success: boolean; data: ShopOrder[] }> {
    return this.doGet<{ success: boolean; data: ShopOrder[] }>(`shop/${shopId}`);
  }

  updateOrderStatus(orderId: string, status: string): Observable<{ success: boolean; data: ShopOrder; message: string }> {
    return this.doPatch<{ success: boolean; data: ShopOrder; message: string }>(`${orderId}/status`, { status });
  }
}

