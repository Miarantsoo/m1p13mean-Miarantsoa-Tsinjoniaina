import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpService } from '@/core/services/http/http.service';
import { Shop } from '../models/front-office.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService extends HttpService {
  protected override endpoint = 'shops';

  getAllShops(): Observable<Shop[]> {
    return this.doGet<{ success: boolean; data: Shop[] }>('').pipe(
      map(response => response.data)
    );
  }

  getShopById(id: string): Observable<Shop> {
    return this.doGet<{ success: boolean; data: Shop }>(id).pipe(
      map(response => response.data)
    );
  }
}

