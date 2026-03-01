import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ROUTES} from '@/core/configs/navigation/navigation.constant';
import {authGuard} from '@/core/guards/auth.guard';

const routes: Routes = [
  {
    path: ROUTES.ADMIN,
    loadChildren: () =>
      import('./modules/admin/admin.module').then(
        (m) => m.AdminModule,
      ),
    canActivate: [authGuard],
    data: { roles: ['admin'] },
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/customer/customer.module').then(
        (m) => m.CustomerModule,
      ),
  },
  {
    path: ROUTES.SHOP,
    loadChildren: () =>
      import('./modules/shop/shop.module').then(
        (m) => m.ShopModule,
      ),
    canActivate: [authGuard],
    data: { roles: ['shop'] },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
