import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './_services/interceptor.service';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component'; 

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { ConfirmEmailComponent } from './views/confirmemail/confirmemail.component';

import { ResetPasswordComponent } from './views/resetpassword/resetpassword.component';
import { SendPasswordResetComponent } from './views/resetpassword/sendpasswordreset.component';
import { ResetEmailSentComponent } from './views/resetpassword/resetemailsent.component';

import { AmazingTimePickerModule } from 'amazing-time-picker';
import { AgmCoreModule } from '@agm/core';


const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';

import {DataTablesModule} from 'angular-datatables'; 

import { ReactiveFormsModule } from '@angular/forms';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule } from 'ngx-toastr';
import { PhoneMaskDirective } from '../app/_directives/phone-mask.directive';

import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    DataTablesModule,
    CommonModule,
    ReactiveFormsModule,
    AmazingTimePickerModule,
    HttpClientModule,

    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyAoBXuHO8PtumB1Sskinvt2FPYtKlGPCyc',
      apiKey: 'AIzaSyCL1UFb_fqya6ZiRSRIzFm2g9w0nL6mtB8',
      libraries: ['places']
    }),
    AgGridModule.withComponents([]),
    ToastrModule.forRoot(),
    NgbModule.forRoot(),
    
  ],
  declarations: [
    AppComponent,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    ConfirmEmailComponent,
    ResetPasswordComponent,
    SendPasswordResetComponent,
    ResetEmailSentComponent,
    PhoneMaskDirective,
    ConfirmationDialogComponent,
    DefaultLayoutComponent
  ],
  exports: [
    PhoneMaskDirective
  ],
  providers: [
    ConfirmationDialogService,
  {
    provide: LocationStrategy,
    useClass: HashLocationStrategy,
  }, 
  {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
  },
  fakeBackendProvider],
  entryComponents: [ ConfirmationDialogComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
