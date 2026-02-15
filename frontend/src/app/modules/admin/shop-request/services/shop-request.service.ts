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

  getAll(status: string) {
    const param = new URLSearchParams({
      status: status
    })
    return this.doGet<any[]>(`?${param.toString()}`,);
  }
}
