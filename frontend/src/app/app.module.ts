import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {FullCalendarModule} from '@fullcalendar/angular';
import {FormsModule} from '@angular/forms';
import { SidebarComponent } from '@/shared/components/sidebar/sidebar.component';
import {ZardDividerComponent} from '@/shared/components/divider';
import { AuthInterceptor } from '@/core/services/http/auth-interceptor';
import {ZardToastComponent} from '@/shared/components/toast';

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
    ZardToastComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
