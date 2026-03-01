import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SidebarComponent} from '@/shared/components/sidebar/sidebar.component';
import {ProductListComponent} from '@/modules/shop/products/pages/product-list/product-list.component';
import {ProductFormComponent} from '@/modules/shop/products/pages/product-form/product-form.component';



const routes: Routes = [
  {
    path: '',
    component: SidebarComponent,
    children: [
      {
          path: 'products',
          children: [
            { path: '',           component: ProductListComponent },
            { path: 'add',        component: ProductFormComponent },
            { path: 'edit/:id',   component: ProductFormComponent }
          ]
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
