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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
