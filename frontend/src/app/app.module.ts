import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {FullCalendarModule} from '@fullcalendar/angular';
import {FormsModule} from '@angular/forms';
import { SidebarComponent } from '@/shared/components/sidebar/sidebar.component';
import {ZardDividerComponent} from '@/shared/components/divider';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FullCalendarModule,
    FormsModule,
    ZardDividerComponent,
    SidebarComponent,
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
