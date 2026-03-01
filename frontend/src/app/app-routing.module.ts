import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ROUTES} from '@/core/configs/navigation/navigation.constant';

const routes: Routes = [
  {
    path: ROUTES.ADMIN,
    loadChildren: () =>
      import('./modules/admin/admin.module').then(
        (m) => m.AdminModule,
      ),
    // canActivate: [AuthGuard],
    // data: { roles: ['PARAMETRAGE'] },
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/customer/customer.module').then(
        (m) => m.CustomerModule,
      ),
    // canActivate: [AuthGuard],
    // data: { roles: ['PARAMETRAGE'] },
  },
  {
    path: ROUTES.SHOP,
    loadChildren: () =>
      import('./modules/shop/shop.module').then(
        (m) => m.ShopModule,
      ),
    // canActivate: [AuthGuard],
    // data: { roles: ['PARAMETRAGE'] },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
