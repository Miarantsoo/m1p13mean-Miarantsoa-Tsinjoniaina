import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Promotion, PromotionResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private apiUrl = `http://localhost:3000/api/promotions`;

  constructor(private http: HttpClient) {}

  createPromotion(promotionData: any): Observable<PromotionResponse> {
    return this.http.post<PromotionResponse>(this.apiUrl, promotionData);
  }

  getPromotionsByShop(shopId: string, filters?: {
    isActive?: boolean;
    productId?: string;
    page?: number;
    limit?: number;
  }): Observable<PromotionResponse> {
    let params = new HttpParams();

    if (filters?.isActive !== undefined) params = params.set('isActive', filters.isActive.toString());
    if (filters?.productId) params = params.set('productId', filters.productId);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<PromotionResponse>(`${this.apiUrl}/shop/${shopId}`, { params });
  }

  getPromotionById(id: string): Observable<PromotionResponse> {
    return this.http.get<PromotionResponse>(`${this.apiUrl}/${id}`);
  }

  updatePromotion(id: string, promotionData: any): Observable<PromotionResponse> {
    return this.http.put<PromotionResponse>(`${this.apiUrl}/${id}`, promotionData);
  }

  deletePromotion(id: string): Observable<PromotionResponse> {
    return this.http.delete<PromotionResponse>(`${this.apiUrl}/${id}`);
  }

  getActivePromotionForProduct(productId: string): Observable<PromotionResponse> {
    return this.http.get<PromotionResponse>(`${this.apiUrl}/product/${productId}`);
  }
}
