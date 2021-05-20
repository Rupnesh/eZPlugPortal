import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SiteComponent } from './site/site.component';
import { PaymentComponent } from './payment/payment.component';
import { UserComponent } from './user/user.component';
import { ReportsComponent } from './reports/reports.component';
import { StationComponent } from './site/stations/stations.component';
import { StationsComponent } from './stations/stations.component';
import { DeviceComponent } from './device/device.component';
import { SiteInfoComponent } from './site/siteInfo/siteinfo.component';
import { SiteReportsComponent } from './reports/sitereports/sitereports.component';
import { SiteReportsnNewComponent } from './reports/sitereportsnew/sitereports.component';
// import { SiteModule } from './site/site.module';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Management'
    },
    
    children: [
      {
        path: '',
        redirectTo: 'site'
      },
      {
        path: 'site',
        component: SiteComponent,
        data: {
          title: 'Site'
        },
      },
      {
        path: 'stations',
        component: StationsComponent,
        data: {
          title: 'Stations'
        },
      },
      {
        path: 'site/station',
        component: StationComponent,
        data: {
          title: 'Stations'
        },
      },
      {
        path: 'site/siteInfo',
        component: SiteInfoComponent,
        data: {
          title: 'Site Details'
        },
      },
      {
        path: 'payment',
        component: PaymentComponent,
        data: {
          title: 'Payment'
        }
      },
      {
        path: 'user',
        component: UserComponent,
        data: {
          title: 'User'
        }
      },
      {
        path: 'device',
        component: DeviceComponent,
        data: {
          title: 'Device'
        }
      },
      {
        path: 'reports',
        component: ReportsComponent,
        data: {
          title: 'Reports'
        }
      },
      {
        path: 'reports/sitereports',
        component: SiteReportsComponent,
        data: {
          title: 'Site Reports'
        }
      },
      {
        path: 'reports/sitereportsnew',
        component: SiteReportsnNewComponent,
        data: {
          title: 'Site Reports'
        }
      },


    ],


   
    
    
  },
  {
    path: '',
    redirectTo: 'management/site', 
    pathMatch: 'full'
  },
  { path: '**', redirectTo: 'management/site' },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {}
