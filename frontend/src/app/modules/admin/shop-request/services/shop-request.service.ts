import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpService} from '@/core/services/http/http.service';
import {ShopRequestRejectionRequest} from '@/modules/admin/shop-request/models/shop-request.model';

@Injectable({
  providedIn: 'root'
})
export class ShopRequestService extends HttpService {
  protected override endpoint = "shop-requests";

  create(formData: FormData): Observable<any> {
    return this.doPost<string>('', formData);
  }

  getAll(status: string, page: number = 1, limit: number = 10) {
    const param = new URLSearchParams({
      status: status,
      page: page.toString(),
      limit: limit.toString()
    })
    return this.doGet<any>(`?${param.toString()}`,);
  }

  rejectDemand(data: ShopRequestRejectionRequest) {
    return this.doPost<any>(`reject`, data);
  }
}
