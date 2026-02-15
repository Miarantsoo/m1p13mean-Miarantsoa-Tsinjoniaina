import { Component, ViewChild } from '@angular/core';
import {ShopRequestStatusListComponent} from '@/modules/admin/shop-request/components/shop-request-status-list/shop-request-status-list.component';

@Component({
  selector: 'app-shop-request-list',
  standalone: false,
  templateUrl: './shop-request-list.component.html',
  styleUrls: ['./shop-request-list.component.scss']
})
export class ShopRequestListComponent {
  @ViewChild('newTab') newTab!: ShopRequestStatusListComponent;
  @ViewChild('pendingTab') pendingTab!: ShopRequestStatusListComponent;
  @ViewChild('rejectedTab') rejectedTab!: ShopRequestStatusListComponent;

  onTabChange(event: any): void {
    const tabComponents = [this.newTab, this.pendingTab, this.rejectedTab];
    const activeComponent = tabComponents[event.index];

    if (activeComponent) {
      activeComponent.loadData();
    }
  }
}
