import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpService} from '@/core/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class ShopRequestService extends HttpService {
  protected override endpoint = "shop-requests";

  create(formData: FormData): Observable<any> {
    return this.doPost<string>('', formData);
  }

  getAll() {
    return this.doGet<any[]>('');
  }
}
