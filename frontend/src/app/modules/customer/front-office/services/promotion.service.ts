import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Promotion } from '../models/front-office.model';
import {HttpService} from '@/core/services/http/http.service';

export interface PromotionListResponse {
  promotions: Promotion[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface PromotionFilters {
  isActive?: boolean;
  productId?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PromotionService extends HttpService {
  protected override endpoint = 'promotion';

  getPromotionsByShop(shopId: string, filters?: PromotionFilters): Observable<PromotionListResponse> {
    const params: any = {};
    if (filters?.isActive !== undefined) params.isActive = filters.isActive.toString();
    if (filters?.productId) params.productId = filters.productId;
    if (filters?.page) params.page = filters.page.toString();
    if (filters?.limit) params.limit = filters.limit.toString();

    return this.doGet<PromotionListResponse>(`shop/${shopId}`, { params });
  }

  getPromotionById(id: string): Observable<Promotion> {
    return this.doGet<Promotion>(id);
  }

  getActivePromotionForProduct(productId: string): Observable<Promotion> {
    return this.doGet<Promotion>(`product/${productId}`);
  }
}
