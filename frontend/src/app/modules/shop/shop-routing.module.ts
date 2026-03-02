import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SidebarComponent} from '@/shared/components/sidebar/sidebar.component';
import {ProductListComponent} from '@/modules/shop/products/pages/product-list/product-list.component';
import {ProductFormComponent} from '@/modules/shop/products/pages/product-form/product-form.component';
import {ShopOrderListComponent} from '@/modules/shop/orders/pages/order-list/shop-order-list.component';
import {ShopDashboardComponent} from '@/modules/shop/dashboard/pages/shop-dashboard.component';



const routes: Routes = [
  {
    path: '',
    component: SidebarComponent,
    children: [
      {
        path: 'dashboard',
        component: ShopDashboardComponent
      },
      {
          path: 'products',
          children: [
            { path: '',           component: ProductListComponent },
            { path: 'add',        component: ProductFormComponent },
            { path: 'edit/:id',   component: ProductFormComponent }
          ]
        },
      {
        path: 'orders',
        component: ShopOrderListComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
