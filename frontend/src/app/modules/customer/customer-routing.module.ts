import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SidebarComponent} from '@/shared/components/sidebar/sidebar.component';
import {RegisterComponent} from '@/modules/customer/auth/pages/register/register.component';
import {LoginComponent} from '@/modules/customer/auth/pages/login/login.component';
import {AuthCallbackComponent} from '@/modules/customer/auth/pages/auth-callback/auth-callback.component';
import {
  CreateShopRequestComponent
} from '@/modules/customer/shop-restaurant/pages/create-shop-request/create-shop-request.component';
import {ProductListComponent} from '@/modules/customer/products/pages/product-list/product-list.component';
import {ProductFormComponent} from '@/modules/customer/products/pages/product-form/product-form.component';

const routes: Routes = [
  {
    path: '',
    component: SidebarComponent,
    children : [
      {
        path: 'auth/register',
        component: RegisterComponent
      },
      {
        path: 'auth/login',
        component: LoginComponent
      },
      {
        path: 'auth/callback',
        component: AuthCallbackComponent
      },
      {
        path: 'shop',
        children: [
          {
            path:'add',
            component: CreateShopRequestComponent,
          },
          {
            path: 'products',
            children: [
              { path: '', component: ProductListComponent },
              { path: 'add', component: ProductFormComponent },
              { path: 'edit/:id', component: ProductFormComponent }
            ]
          }
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
export class CustomerRoutingModule { }
