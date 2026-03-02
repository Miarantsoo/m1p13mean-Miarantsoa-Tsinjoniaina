import { Injectable } from '@angular/core';
import { HttpService } from '@/core/services/http/http.service'; // ajuste le chemin si nécessaire
import { Observable } from 'rxjs';
import { Product, ProductResponse, Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends HttpService {

  protected override endpoint = 'product';

  getProductsByShop(
    shopId: string,
    filters?: {
      categoryId?: string;
      available?: boolean;
      search?: string;
      page?: number;
      limit?: number;
    }
  ): Observable<ProductResponse> {
    let params: any = { shopId };

    if (filters?.categoryId) params.categoryId = filters.categoryId;
    if (filters?.available !== undefined) params.available = filters.available;
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    return this.doGet<ProductResponse>(`shop/${shopId}`, params);
  }
  getProductById(id: string): Observable<ProductResponse> {
    return this.doGet<ProductResponse>(id);
  }
  createProduct(productData: FormData): Observable<ProductResponse> {
    return this.doPost<ProductResponse>('', productData);
  }
  updateProduct(id: string, productData: FormData): Observable<ProductResponse> {
    return this.doPut<ProductResponse>(id, productData);
  }
  deleteProduct(id: string): Observable<ProductResponse> {
    return this.doDelete<ProductResponse>(id);
  }
  updateStock(id: string, stock: number): Observable<ProductResponse> {
    return this.doPatch<ProductResponse>(`${id}/stock`, { stock });
  }
  getCategories(): Observable<{ success: boolean; data: Category[] }> {
    return this.doGet<{ success: boolean; data: Category[] }>('categories');
  }


  getProductStats(shopId: string): Observable<any> {
    return this.doGet<any>(`shop/${shopId}/stats`);
  }
}
