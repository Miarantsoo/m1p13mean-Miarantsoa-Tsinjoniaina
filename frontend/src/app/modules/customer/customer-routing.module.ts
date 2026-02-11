import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SidebarComponent} from '@/shared/components/sidebar/sidebar.component';
import {RegisterComponent} from '@/modules/customer/auth/pages/register/register.component';
import {LoginComponent} from '@/modules/customer/auth/pages/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: SidebarComponent,
    children : [
      {
        path: 'auth/register',
        component: RegisterComponent
      },
      {
        path: 'auth/login',
        component: LoginComponent
      }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
