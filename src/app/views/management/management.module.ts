import { NgModule } from '@angular/core';
import { DataTablesModule} from 'angular-datatables';
import { CommonModule } from '@angular/common';

import { SiteComponent } from './site/site.component';
import { PaymentComponent } from './payment/payment.component';
import { UserComponent } from './user/user.component';
import { ReportsComponent } from './reports/reports.component';
import { DeviceComponent } from './device/device.component';

import { ManagementRoutingModule } from './management-routing.module'; 

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { StationComponent } from './site/stations/stations.component';
import { StationsComponent } from './stations/stations.component';
import { ReactiveFormsModule } from '@angular/forms';

import { AmazingTimePickerModule } from 'amazing-time-picker';
import { AgmCoreModule } from '@agm/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ManagementService} from './management.service';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { TableActionsComponent} from './table.actions'

import { ButtonRendererComponent } from './button.renderer.component';
import { SiteInfoComponent } from './site/siteInfo/siteinfo.component';
import { SiteReportsComponent } from './reports/sitereports/sitereports.component';
import { SiteReportsnNewComponent } from './reports/sitereportsnew/sitereports.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { QRCodeModule } from 'angularx-qrcode';

import { InterceptorService } from '../../_services/interceptor.service';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';
// import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@NgModule({
  imports: [ 
    ManagementRoutingModule,
    DataTablesModule,
    CommonModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    ReactiveFormsModule,
    AmazingTimePickerModule,
    AgmCoreModule,
    HttpClientModule,
    AgGridModule.withComponents([ButtonRendererComponent]),
    NgMultiSelectDropDownModule,
    QRCodeModule,
    NgxDaterangepickerMd.forRoot(),
    FormsModule,
    NgbModule
    // AgGridModule
  ],
  declarations: [
    SiteComponent,
    SiteInfoComponent,
    PaymentComponent,
    UserComponent,
    ReportsComponent,
    StationsComponent,
    StationComponent,
    SiteReportsComponent,
    SiteReportsnNewComponent,

    TableActionsComponent,
    ButtonRendererComponent,
    DeviceComponent,
  ],
  entryComponents: [TableActionsComponent ],
  providers: [ 
    ManagementService, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
  ]
})
export class ManagementModule { }
