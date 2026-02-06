import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PlanningComponent} from '../admin/planning/planning.component';
import {ShopRequestComponent} from '../admin/shop-request/shop-request.component';
import {ShopRequestListComponent} from '../admin/shop-request/shop-request-list.component';
import {PlanningAddComponent} from '../admin/planning/planning-add.component';
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
