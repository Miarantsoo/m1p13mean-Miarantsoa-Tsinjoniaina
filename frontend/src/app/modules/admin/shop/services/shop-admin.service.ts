import { Injectable } from '@angular/core';
import {HttpService} from '@/core/services/http/http.service';
import {ShopSlot} from '@/modules/admin/shop/models/shop.model';

@Injectable({
  providedIn: 'root'
})
export class ShopAdminService extends HttpService{
  protected override endpoint = "shop-slots";

  getAll() {
    return this.doGet<ShopSlot[]>("");
  }

  assignShop(slotId: string, shopRequestId: string, manager: Record<string, any>, color: string) {
    return this.doPut<ShopSlot>(`${slotId}/assign`, { shopRequestId, manager, color });
  }
}
