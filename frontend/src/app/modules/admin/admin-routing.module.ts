import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlanningComponent} from '@/modules/admin/planning/pages/planning/planning.component';
import {PlanningAddComponent} from '@/modules/admin/planning/pages/planning-add/planning-add.component';
import {ShopRequestComponent} from '@/modules/admin/shop-request/pages/shop-request/shop-request.component';
import {
  ShopRequestListComponent
} from '@/modules/admin/shop-request/pages/shop-request-list/shop-request-list.component';
import {SidebarComponent} from '@/shared/components/sidebar/sidebar.component';
import {DashboardComponent} from '@/modules/admin/dashboard/pages/dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: SidebarComponent,
    children : [
      {
        path: 'planning',
        component: PlanningComponent
      },
      {
        path: 'planning/add',
        component: PlanningAddComponent
      },
      {
        path: 'shop-request',
        component: ShopRequestComponent
      },
      {
        path: 'shop-request/list',
        component: ShopRequestListComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
