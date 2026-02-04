import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {FullCalendarModule} from '@fullcalendar/angular';
import {PlanningComponent} from '../admin/planning/planning.component';
import {ShopRequestComponent} from '../admin/shop-request/shop-request.component';
import {FormsModule} from '@angular/forms';
import {ShopRequestListComponent} from '../admin/shop-request/shop-request-list.component';
import {PlanningAddComponent} from '../admin/planning/planning-add.component';

@NgModule({
  declarations: [
    AppComponent,
    PlanningComponent,
    PlanningAddComponent,
    ShopRequestComponent,
    ShopRequestListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FullCalendarModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
