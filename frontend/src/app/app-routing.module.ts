import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PlanningComponent} from '../admin/planning/planning.component';

const routes: Routes = [
  { path: 'planning', component: PlanningComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
