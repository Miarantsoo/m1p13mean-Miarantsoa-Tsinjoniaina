import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopRequestService {
  private apiUrl = 'http://localhost:3000/api/shop-requests';

  constructor(private http: HttpClient) {}

  create(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  getAll() {
    return this.http.get<any[]>('http://localhost:3000/api/shop-requests');
  }
}
