import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http/http.service';
import { Observable } from 'rxjs';

export interface ShopDashboardData {
  revenue: {
    daily: number;
    monthly: number;
  };
  topProductsGlobal: Array<{
    productId: string;
    name: string;
    quantitySold: number;
    revenue: number;
    category: string;
  }>;
  topProductsByCategory: Array<{
    categoryName: string;
    topProducts: Array<{
      productId: string;
      name: string;
      quantitySold: number;
    }>;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ShopDashboardService extends HttpService {
  protected override endpoint = 'dashboard-shop';

  getDashboard(shopId: string): Observable<{ success: boolean; data: ShopDashboardData }> {
    return this.doGet<{ success: boolean; data: ShopDashboardData }>(shopId);
  }
}
