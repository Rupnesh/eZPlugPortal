import { NgModule } from '@angular/core';

import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProfileService } from './profile.service'
@NgModule({
  imports: [
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    TabsModule
  ],
  declarations: [ ProfileComponent ],
  providers: [ProfileService]
})
export class ProfileModule { }
