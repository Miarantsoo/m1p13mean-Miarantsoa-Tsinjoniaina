import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '@/core/services/http/http.service';
import { Product, ProductListResponse, Category } from '../models/front-office.model';

export interface ProductFilters {
  categoryId?: string;
  available?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

interface BackendProductResponse {
  success: boolean;
  data: Product;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService extends HttpService {
  protected override endpoint = 'product';

  getAllProducts(filters?: ProductFilters): Observable<ProductListResponse> {
    const params: any = {};
    if (filters?.categoryId) params.categoryId = filters.categoryId;
    if (filters?.available !== undefined) params.available = filters.available.toString();
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page.toString();
    if (filters?.limit) params.limit = filters.limit.toString();

    return this.doGet<ProductListResponse>('', { params });
  }

  getProductsByShop(shopId: string, filters?: ProductFilters): Observable<ProductListResponse> {
    const params: any = {};
    if (filters?.categoryId) params.categoryId = filters.categoryId;
    if (filters?.available !== undefined) params.available = filters.available.toString();
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page.toString();
    if (filters?.limit) params.limit = filters.limit.toString();

    return this.doGet<ProductListResponse>(`shop/${shopId}`, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.doGet<BackendProductResponse>(id).pipe(
      map(response => response.data)
    );
  }

  getCategories(): Observable<{ success: boolean; data: Category[] }> {
    return this.doGet<{ success: boolean; data: Category[] }>('categories');
  }
}
