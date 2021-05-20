import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';

import { ManagementService } from '../management.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';



@Component({
  templateUrl: 'stations.component.html',
  styleUrls: ['stations.component.css','../management.scss']
})
export class StationsComponent {

  dtOptions: DataTables.Settings = {};
  stationForm: FormGroup;
  submitted = false;
  loading = false;
  stationData: any = [];
  stationID:any;
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('largeModal') public largeModal: ModalDirective;

  public gridOptions: any = {
    defaultColDef: {
      resizable: true
    },
    animateRows: true,
    pagination: true,
    paginationPageSize: 10,
    colResizeDefault: 'shift',
    domLayout: 'autoHeight',
    rowHeight: 32,
  };

  columnDefs = [
    { headerName: 'Station ID', field: 'stationId', sortable: true, filter: true, suppressSizeToFit: false },
    { headerName: 'Station Name', field: 'stationName', sortable: true, filter: "agTextColumnFilter", suppressSizeToFit: false },
    { headerName: 'Station Type', field: 'stationType', suppressSizeToFit: false },
    { headerName: 'Site Name', field: 'siteName', sortable: true, suppressSizeToFit: false },
    { headerName: 'Distributor', field: 'distributor', suppressSizeToFit: false },
    { headerName: 'Firmware Version', field: 'firmwareVersion', suppressSizeToFit: false },
    { headerName: 'Hardware Version', field: 'hardwareVersion', suppressSizeToFit: false },
    { headerName: 'isActive', field: 'isActive', suppressSizeToFit: false },
    { headerName: 'isAvailable', field: 'isAvailable', suppressSizeToFit: false },
    { headerName: 'hasError', field: 'hasError', suppressSizeToFit: false },
    { headerName: 'Installed On', field: 'installedOn', suppressSizeToFit: false },
    {
      headerName: "Actions", pinned: 'right', suppressSizeToFit: false,
      template:
        ` <button type="button" data-action-type="view" class="btn btn-sm btn-ghost-success"><i data-action-type="view" class="icon-pencil"></i></button>
          <button type="button" data-action-type="remove" class="btn btn-sm btn-ghost-danger"><i data-action-type="remove" class="icon-trash"></i></button>
        `
    }
  ];

  //   currentLevel: "15A"
  // errorCode: null
  // errorDescription: null
  // installedBy: "string"
  // installedOn: "2020-04-27T13:26:46.628"
  // isLockAvailable: true
  // isMultiplePortSupported: true
  // isSensorAvailable: true
  // isTestStation: true
  // lastUpgradedOn: "0001-01-01T00:00:00"
  // stationPhoto: "string"


  public data = [
    { stationID: 'MPCT11', serialNo: 'MPCT11', firmware: 'MPCT11.1', hardware: "EPC32", site: "MPCT1", link: "", type: "Fast Charger" },
    { stationID: 'MPCT12', serialNo: 'MPCT12', firmware: 'MPCT12.1', hardware: "EPC32", site: "MPCT1", link: "", type: "Fast Charger" },
    { stationID: 'MPCT13', serialNo: 'MPCT13', firmware: 'MPCT13.1', hardware: "EPC32", site: "MPCT1", link: "", type: "Slow Charger" },
    { stationID: 'MPCT14', serialNo: 'MPCT14', firmware: 'MPCT14.1', hardware: "EPC32", site: "MPCT1", link: "", type: "Fast Charger" },
    { stationID: 'MPCT15', serialNo: 'MPCT15', firmware: 'MPCT15.1', hardware: "EPC32", site: "MPCT1", link: "", type: "Slow Charger" },
    { stationID: 'MPCT16', serialNo: 'MPCT16', firmware: 'MPCT16.1', hardware: "EPC32", site: "MPCT1", link: "", type: "Fast Charger" },
    { stationID: 'MPCT17', serialNo: 'MPCT17', firmware: 'MPCT17.1', hardware: "EPC32", site: "MPCT1", link: "", type: "Fast Charger" },
  ];
  constructor(public formBuilder: FormBuilder,
    private managementService: ManagementService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService
  ) {
  }

  ngOnInit() {
    this.stationForm = this.formBuilder.group({
      siteID: ['0', Validators.required],
      stationID: ['', Validators.required],
      stationFirmware: ['', Validators.required],
      stationHardware: ['', Validators.required],
      stationSerialNo: ['', Validators.required],

      isLockBox: [true, ''],
      voltage: ['', ''],
      maxAmp: ['', ''],
      isHeatSensor: [true, ''],
    });

    this.loading = true;
    this.loadStations();

    

  }
  loadStations() {
    this.managementService.getAllStations().subscribe(data => {
      if (data.hasError === false) {
        this.loading = false;
        this.stationData = data.stationViewModels;
      }
    }, (error: any) => {
      this.toastr.error(error.error, 'Error');
      this.loading = false;
    })
  }


  get f() { return this.stationForm.controls; }

  onGridReady(params) {
    // params.api.sizeColumnsToFit();
    var allColumnIds = [];
    this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
  }

  onSubmit() {
    this.submitted = true;
    if (this.stationForm.invalid) {
      return;
    }
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.stationForm.value, null, 4));
  }

  onReset() {
    this.submitted = false;
    this.stationForm.reset();
    this.stationForm.patchValue({
      isHeatSensor: [true, ''],
      isLockBox: [true, ''],
    })
  }

  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "view":
          return this.onActionViewClick(data);
        case "remove":
          return this.onActionRemoveClick(data);
      }
    }
  }

  public onActionViewClick(data: any) {
    this.stationID = data.userId;
  }

  public onActionRemoveClick(data: any) {

    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete ?')
			.then((confirmed) => {
        this.loading = true;
				this.managementService.deleteStation(data.userId).subscribe(data => {
          if (data.hasError === false) {
            this.toastr.success('Record Deleted!!!', 'Success');
            this.loadStations();
            this.loading = false;
          }
        }, (error: any) => {
          this.toastr.error(error.error, 'Error');
          this.loading = false;
        });
			
			})
      .catch(() => console.log('User dismissed the dialog'));
      
  }
}
