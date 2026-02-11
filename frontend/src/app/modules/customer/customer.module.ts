import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { LoginComponent } from './auth/pages/login/login.component';
import {RegisterComponent} from '@/modules/customer/auth/pages/register/register.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ZardButtonComponent} from '@/shared/components/button';
import {
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent,
  ZardFormMessageComponent
} from '@/shared/components/form';
import {ZardInputDirective} from '@/shared/components/input';
import {ZardCardComponent} from '@/shared/components/card';
import {ZardAlertComponent} from '@/shared/components/alert';
import { AuthCallbackComponent } from './auth/pages/auth-callback/auth-callback.component';



@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    AuthCallbackComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardFormFieldComponent,
    ZardInputDirective,
    ZardCardComponent,
    ZardAlertComponent,
    ZardFormControlComponent,
    ZardFormLabelComponent,
    ZardFormMessageComponent
  ]
})
export class CustomerModule { }
