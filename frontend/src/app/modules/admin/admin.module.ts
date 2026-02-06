import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { PlanningComponent } from '@/modules/admin/planning/pages/planning/planning.component';
import { PlanningAddComponent } from '@/modules/admin/planning/pages/planning-add/planning-add.component';
import {FullCalendarModule} from '@fullcalendar/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ShopRequestComponent } from '@/modules/admin/shop-request/pages/shop-request/shop-request.component';
import { ShopRequestListComponent } from './shop-request/pages/shop-request-list/shop-request-list.component';



@NgModule({
  declarations: [
    PlanningComponent,
    PlanningAddComponent,
    ShopRequestComponent,
    ShopRequestListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FullCalendarModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
