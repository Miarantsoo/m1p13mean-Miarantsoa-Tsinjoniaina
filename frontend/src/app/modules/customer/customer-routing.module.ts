import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SidebarComponent} from '@/shared/components/sidebar/sidebar.component';
import {RegisterComponent} from '@/modules/customer/auth/pages/register/register.component';
import {LoginComponent} from '@/modules/customer/auth/pages/login/login.component';
import {AuthCallbackComponent} from '@/modules/customer/auth/pages/auth-callback/auth-callback.component';
import {
  CreateShopRequestComponent
} from '@/modules/customer/shop-restaurant/pages/create-shop-request/create-shop-request.component';
import {FrontOfficeLayoutComponent} from '@/shared/components/front-office-layout/front-office-layout.component';
import {ProduitListingComponent} from '@/modules/customer/front-office/pages/produit-listing/produit-listing.component';
import {ProductDetailComponent} from '@/modules/customer/front-office/pages/product-detail/product-detail.component';
import {ShopListComponent} from '@/modules/customer/front-office/pages/shop-list/shop-list.component';

const routes: Routes = [
  {
    path: '',
    component: FrontOfficeLayoutComponent,
    children : [
      {
        path: "",
        component: ProduitListingComponent
      },
      { path: 'shops', component: ShopListComponent },
      { path: 'shops/:shopId', component: ProduitListingComponent },
      { path: 'shop-request/add', component: CreateShopRequestComponent },
      { path: 'details/:id', component: ProductDetailComponent },
    ]
  },
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
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
