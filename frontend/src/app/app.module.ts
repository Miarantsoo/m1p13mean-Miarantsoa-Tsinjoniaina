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
import { SidebarComponent } from '@/shared/components/sidebar/sidebar.component';
import {ZardButtonComponent} from '@/shared/components/button';
import {ZardSkeletonComponent} from '@/shared/components/skeleton';
import {ZardDividerComponent} from '@/shared/components/divider';
import {ZardAvatarComponent} from '@/shared/components/avatar';
import {ZardIconComponent} from '@/shared/components/icon';
import {LayoutComponent} from '@/shared/components/layout';

@NgModule({
  declarations: [
    AppComponent,
    PlanningComponent,
    PlanningAddComponent,
    ShopRequestComponent,
    ShopRequestListComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FullCalendarModule,
    FormsModule,
    ZardDividerComponent,
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
