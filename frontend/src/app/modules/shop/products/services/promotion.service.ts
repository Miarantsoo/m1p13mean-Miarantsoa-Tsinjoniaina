import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http/http.service';
import { Observable } from 'rxjs';
import { Promotion, PromotionResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class PromotionService extends HttpService {

  protected override endpoint = 'promotions';
  createPromotion(promotionData: any): Observable<PromotionResponse> {
    return this.doPost<PromotionResponse>('', promotionData);
  }
  getPromotionsByShop(
    shopId: string,
    filters?: {
      isActive?: boolean;
      productId?: string;
      page?: number;
      limit?: number;
    }
  ): Observable<PromotionResponse> {
    let params: any = { shopId };

    if (filters?.isActive !== undefined) params.isActive = filters.isActive;
    if (filters?.productId) params.productId = filters.productId;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    return this.doGet<PromotionResponse>(`shop/${shopId}`, params);
  }
  getPromotionById(id: string): Observable<PromotionResponse> {
    return this.doGet<PromotionResponse>(id);
  }
  updatePromotion(id: string, promotionData: any): Observable<PromotionResponse> {
    return this.doPut<PromotionResponse>(id, promotionData);
  }
  deletePromotion(id: string): Observable<PromotionResponse> {
    return this.doDelete<PromotionResponse>(id);
  }
  getActivePromotionForProduct(productId: string): Observable<PromotionResponse> {
    return this.doGet<PromotionResponse>(`product/${productId}`);
  }
  getActivePromotions(): Observable<PromotionResponse> {
    return this.doGet<PromotionResponse>('active');
  }

  /*getPromotionsByDateRange(start: string, end: string): Observable<PromotionResponse> {
    return this.doGet<PromotionResponse>('', { startDate: start, endDate: end });
  }*/
}
