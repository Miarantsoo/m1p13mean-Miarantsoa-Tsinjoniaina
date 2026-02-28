import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { LoginComponent } from './auth/pages/login/login.component';
import {RegisterComponent} from '@/modules/customer/auth/pages/register/register.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import { CreateShopRequestComponent } from './shop-restaurant/pages/create-shop-request/create-shop-request.component';
import {AngularTiptapEditorComponent} from "@flogeez/angular-tiptap-editor";
import {FileToUrlPipe} from '@/shared/pipes/file-to-url.pipe';
import {ProduitListingComponent} from '@/modules/customer/front-office/pages/produit-listing/produit-listing.component';
import {ZardPaginationComponent} from '@/shared/components/pagination';
import {ProductBlockComponent} from '@/modules/customer/front-office/components/product-block/product-block.component';
import {ProductDetailComponent} from '@/modules/customer/front-office/pages/product-detail/product-detail.component';



@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    AuthCallbackComponent,
    CreateShopRequestComponent,
    ProductBlockComponent,
    ProductDetailComponent,
    ProduitListingComponent
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
    ZardFormMessageComponent,
    AngularTiptapEditorComponent,
    FormsModule,
    FileToUrlPipe,
    ZardPaginationComponent
  ]
})
export class CustomerModule { }
