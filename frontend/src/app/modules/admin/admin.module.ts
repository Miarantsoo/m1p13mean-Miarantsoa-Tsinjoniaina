import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { PlanningComponent } from '@/modules/admin/planning/pages/planning/planning.component';
import { PlanningAddComponent } from '@/modules/admin/planning/pages/planning-add/planning-add.component';
import {FullCalendarModule} from '@fullcalendar/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ShopRequestComponent } from '@/modules/admin/shop-request/pages/shop-request/shop-request.component';
import { ShopRequestListComponent } from './shop-request/pages/shop-request-list/shop-request-list.component';
import { ShopRequestStatusListComponent } from './shop-request/components/shop-request-status-list/shop-request-status-list.component';
import {ZardTabComponent, ZardTabGroupComponent} from '@/shared/components/tabs';
import { ZardCardComponent } from '@/shared/components/card/card.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardLoaderComponent } from '@/shared/components/loader/loader.component';
import {
  ZardPaginationButtonComponent,
  ZardPaginationComponent, ZardPaginationContentComponent,
  ZardPaginationEllipsisComponent, ZardPaginationItemComponent, ZardPaginationNextComponent,
  ZardPaginationPreviousComponent
} from '@/shared/components/pagination';
import {ZardDividerComponent} from '@/shared/components/divider';
import {ZardIconComponent} from '@/shared/components/icon';
import { RejectShopRequestComponent } from './shop-request/components/reject-shop-request/reject-shop-request.component';
import {ZardInputDirective} from '@/shared/components/input';
import {ZardSelectComponent, ZardSelectItemComponent} from '@/shared/components/select';
import {AngularTiptapEditorComponent} from '@flogeez/angular-tiptap-editor';
import {ZardFormImports} from '@/shared/components/form';
import {ZardCalendarComponent} from '@/shared/components/calendar';
import {DashboardComponent} from '@/modules/admin/dashboard/pages/dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    PlanningAddComponent,
    ShopRequestComponent,
    ShopRequestListComponent,
    ShopRequestStatusListComponent,
    RejectShopRequestComponent,
  ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        FullCalendarModule,
        FormsModule,
        ReactiveFormsModule,
        ZardTabGroupComponent,
        ZardTabComponent,
        ZardCardComponent,
        ZardButtonComponent,
        ZardLoaderComponent,
        ZardPaginationComponent,
        ZardPaginationPreviousComponent,
        ZardPaginationEllipsisComponent,
        ZardPaginationNextComponent,
        ZardPaginationButtonComponent,
        ZardPaginationContentComponent,
        ZardPaginationItemComponent,
        ZardDividerComponent,
        ZardIconComponent,
        ZardInputDirective,
        ZardSelectComponent,
        ZardSelectItemComponent,
        AngularTiptapEditorComponent,
        ...ZardFormImports,
        ZardCalendarComponent
    ],
  providers: [DatePipe]
})
export class AdminModule { }
