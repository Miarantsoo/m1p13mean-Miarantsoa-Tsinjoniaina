import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductResponse, Category } from '../models/product.model';
// import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `http://localhost:3000/api/product`;
  private categoryUrl = `${this.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  getProductsByShop(shopId: string, filters?: {
    categoryId?: string;
    available?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }): Observable<ProductResponse> {
    let params = new HttpParams();

    if (filters?.categoryId) params = params.set('categoryId', filters.categoryId);
    if (filters?.available !== undefined) params = params.set('available', filters.available.toString());
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<ProductResponse>(`${this.apiUrl}/shop/${shopId}`, { params });
  }

  getProductById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  createProduct(productData: FormData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(this.apiUrl, productData);
  }

  updateProduct(id: string, productData: FormData): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, productData);
  }

  deleteProduct(id: string): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.apiUrl}/${id}`);
  }

  updateStock(id: string, stock: number): Observable<ProductResponse> {
    return this.http.patch<ProductResponse>(`${this.apiUrl}/${id}/stock`, { stock });
  }

  getCategories(): Observable<{ success: boolean; data: Category[] }> {
    return this.http.get<{ success: boolean; data: Category[] }>(this.categoryUrl);
  }

  getProductStats(shopId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/shop/${shopId}/stats`);
  }
}
