import {Component, ViewChild} from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Router, ActivatedRoute } from '@angular/router'
import { ManagementService } from '../../management.service'
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../../../../confirmation-dialog/confirmation-dialog.service';
import * as moment from 'moment';

@Component({
  templateUrl: 'sitereports.component.html',
  styleUrls: ['sitereports.component.css', '../../management.scss']
})
export class SiteReportsnNewComponent {
  
  constructor() {

  }
  ngOnInit() {
    console.log("init called...")
  }
  
}
