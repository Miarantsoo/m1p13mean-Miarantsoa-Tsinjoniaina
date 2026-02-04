import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PlanningComponent} from '../admin/planning/planning.component';
import {ShopRequestComponent} from '../admin/shop-request/shop-request.component';
import {ShopRequestListComponent} from '../admin/shop-request/shop-request-list.component';
import {PlanningAddComponent} from '../admin/planning/planning-add.component';

const routes: Routes = [
  { path: 'planning', component: PlanningComponent },
  { path: 'planning/add', component: PlanningAddComponent },
  { path: 'shop-request', component: ShopRequestComponent },
  { path: 'shop-request/list', component: ShopRequestListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
