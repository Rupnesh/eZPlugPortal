import { Component, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ManagementService } from '../management.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import {ModalDirective} from 'ngx-bootstrap/modal';

@Component({
  templateUrl: 'device.component.html',
  styleUrls: ['../management.scss']
})


export class DeviceComponent {

  deviceForm: FormGroup;
  deviceUpdateForm: FormGroup;
  submitted = false;
  submittedUpdate

  dtOptions: DataTables.Settings = {};
  loading = false;
  loadingAdd = false;
  loadingUpdate = false;
  detectChange = false;
  nameExistsCheckLoading = false;
  stationData: any = [];
  stationId: any;

  stationPhoto: any = "";
  url: any = ""

  stationTypes: any = [];
  usersForRole: any = [];

  stationQRCodeData: any;
  userSavedRoles:any = [];

  @ViewChild('largeModal') addModal: any;
  @ViewChild('updateModal') updateModal: any;
  @ViewChild('qrCodeModal') public qrCodeModal: ModalDirective;
  @ViewChild('qrCanvas') public qrCanvas;

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
    // { headerName: 'Station ID', field: 'stationId', sortable: true, suppressSizeToFit: false },
    { headerName: 'Station Name', field: 'stationName', sortable: true, suppressSizeToFit: false },
    { headerName: 'Station Type', field: 'stationType', sortable: true, suppressSizeToFit: false },
    { headerName: 'Site Name', field: 'siteName', sortable: true, suppressSizeToFit: false },
    { headerName: 'Distributor', field: 'distributor', sortable: true, suppressSizeToFit: false },
    { headerName: 'Firmware Version', field: 'firmwareVersion', sortable: true, suppressSizeToFit: false },
    { headerName: 'Hardware Version', field: 'hardwareVersion', sortable: true, suppressSizeToFit: false },
    // { headerName: 'isActive', field: 'isActive', sortable: true, filter: true, suppressSizeToFit: false },
    // { headerName: 'isAvailable', field: 'isAvailable', sortable: true, filter: true, suppressSizeToFit: false },
    // { headerName: 'hasError', field: 'hasError', sortable: true, filter: true, suppressSizeToFit: false },
    { headerName: 'Installed On', field: 'installedOn', sortable: true, suppressSizeToFit: false },
    {
      headerName: "Actions", pinned: 'right', suppressSizeToFit: false,
      cellRenderer: (data) => {
        if (data.data.isActive === true) {
          return '<button type="button" data-action-type="view" class="btn btn-sm btn-ghost-success"><i data-action-type="view" class="icon-pencil"></i></button>' +
            '<button type="button" data-action-type="qrcode" class="btn btn-sm btn-ghost-success"><i data-action-type="qrcode" class="fa fa-qrcode"></i></button>' +
            '<button type="button" style="width:64px;margin-left:5px" data-action-type="remove" class="btn btn-sm btn-success">Active</i></button>';
        }
        else {
          return '<button type="button" data-action-type="view" class="btn btn-sm btn-ghost-success"><i data-action-type="view" class="icon-pencil"></i></button>' +
            '<button type="button" data-action-type="qrcode" class="btn btn-sm btn-ghost-success"><i data-action-type="qrcode" class="fa fa-qrcode"></i></button>' +
            '<button type="button" style="width:64px;margin-left:5px" data-action-type="remove" class="btn btn-sm btn-danger">Inactive</button>';
        }
      }
      // template:
      //   ` <button type="button" data-action-type="view" class="btn btn-sm btn-ghost-success"><i data-action-type="view" class="icon-pencil"></i></button>
      //     <button type="button" data-action-type="remove" class="btn btn-sm btn-ghost-danger"><i data-action-type="remove" class="icon-trash"></i></button>
      //   `
    }
  ];

  public data = [
    { deviceID: 'eZ3KW1', deviceType: 'eZ3KW1', assigned: 'x', hardware: "1.0", software: "15.1", },
    { deviceID: 'eZ3KW2', deviceType: 'eZ3KW2', assigned: 'x', hardware: "1.0", software: "15.1", },
    { deviceID: 'eZ3KW3', deviceType: 'eZ3KW3', assigned: 'x', hardware: "1.0", software: "15.1", },
    { deviceID: 'eZ3KW4', deviceType: 'eZ3KW4', assigned: 'x', hardware: "1.0", software: "15.1", },
    { deviceID: 'eZ3KW5', deviceType: 'eZ3KW5', assigned: 'x', hardware: "1.0", software: "15.1", },
    { deviceID: 'eZ3KW6', deviceType: 'eZ3KW6', assigned: 'x', hardware: "1.0", software: "15.1", },
    { deviceID: 'eZ3KW7', deviceType: 'eZ3KW7', assigned: 'x', hardware: "1.0", software: "15.1", },
  ];

  constructor(public formBuilder: FormBuilder,
    private managementService: ManagementService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService) {

      

  }

  async ngOnInit() {
    this.deviceForm = this.formBuilder.group({
      siteId: [null],
      distributorId: ['0', Validators.required],
      stationTypeId: ['0', Validators.required],
      stationSerialNumber: ['', Validators.required],

      firmwareVersion: ['', Validators.required],
      hardwareVersion: ['', Validators.required],
      currentLevel: [null],
      // stationPhoto: [null],

      isLockAvailable: [true, ''],
      isSensorAvailable: [true, ''],
      isTestStation: [true, ''],
      isMultiplePortSupported: [true, ''],
      isRFIDStation: [false, ''],
    });
    this.deviceUpdateForm = this.formBuilder.group({
      siteId: [null],
      distributorId: ['0', Validators.required],
      stationTypeId: ['0', Validators.required],
      stationSerialNumber: ['', Validators.required],
      firmwareVersion: ['', Validators.required],
      hardwareVersion: ['', Validators.required],
      currentLevel: [null],
      // stationPhoto: [null],
      isLockAvailable: [true, ''],
      isSensorAvailable: [true, ''],
      isTestStation: [true, ''],
      isMultiplePortSupported: [true, ''],
      isRFIDStation: [false, ''],
    });

    this.loading = true;
    this.loadDevices();

    let roles = await JSON.parse(localStorage.getItem('userData'))
    this.userSavedRoles = roles.roles
  }
  loadDevices() {
    this.managementService.getAllStations().subscribe(data => {
      if (data.hasError === false) {
        this.loading = false;
        this.stationData = data.stationViewModels;
      }
    }, (error: any) => {
      this.toastr.error(error.error.errorDescription, 'Error');
      this.loading = false;
    })

    this.managementService.getAllStationTypes().subscribe(data => {
      if (data.hasError === false) {
        this.stationTypes = data.stationTypeViewModels;
      }
    }, (error: any) => {
      // this.toastr.error(error.error, 'Error');
    })
    this.managementService.getUsersForRole().subscribe(data => {
      if (data.hasError === false) {
        this.usersForRole = data.userDetailsViewModels;
      }
    }, (error: any) => {
      // this.toastr.error(error.error, 'Error');
    })
  }
  onGridReady(params) {
    params.api.sizeColumnsToFit();
    var allColumnIds = [];
    this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
  }

  get f() { return this.deviceForm.controls; }
  get u() { return this.deviceUpdateForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.deviceForm.invalid) {
      return;
    }
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.deviceForm.value, null, 4));

    this.loadingAdd = true;
    this.managementService.addStation(this.deviceForm.value).subscribe(data => {
      if (data.hasError === false) {
        this.toastr.success('Station Added!!!', 'Success');
        this.loading = true;
        this.loadDevices();
        this.loadingAdd = false;
        this.addModal.hide()

        this.managementService.registerStationOnIOTHub(this.f.stationSerialNumber.value).subscribe(data => {});
      }
    }, (error: any) => {
      this.toastr.error(error.error, 'Error');
      this.loadingAdd = false;
    });
  }
  onUpdate() {
    this.submittedUpdate = true;
    if (this.deviceUpdateForm.invalid) {
      return;
    }
    let serverData = {stationId: this.stationId, ...this.deviceUpdateForm.value }
    this.loadingUpdate = true;
    this.managementService.updateStation(serverData).subscribe(data => {
      if (data.hasError === false) {
        this.toastr.success('Station Updated!!!', 'Success');
        this.loading = true;
        this.loadDevices();
        this.loadingUpdate = false;
        this.updateModal.hide()
      }
    }, (error: any) => {
      this.toastr.error(error.error, 'Error');
      this.loadingUpdate = false;
    });
  }

  onReset() {
    this.submitted = false;
    this.deviceForm.reset();
    this.deviceForm.patchValue({
    })
  }
  onResetUpdate() {
    this.submittedUpdate = false;
    this.deviceUpdateForm.reset();
    this.deviceForm.patchValue({
    })
  }

  closeModal() {
    this.addModal.hide();
    this.onReset()
    this.detectChange = false;
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
        case "qrcode":
          return this.onActionQRCodeClick(data);
      }
    }
  }

  public onActionViewClick(data: any) {
    this.stationId = data.stationId;
    this.updateModal.show();
    console.log(data)

    this.updateModal.show();
    this.deviceUpdateForm.patchValue({
      siteId: null,
      distributorId: data.distributor,
      stationTypeId: data.stationType,
      stationSerialNumber: data.stationName,
      firmwareVersion: data.firmwareVersion,
      hardwareVersion: data.hardwareVersion,
      currentLevel: data.currentLevel,
      stationPhoto: data.stationPhoto,
      isLockAvailable: data.isLockAvailable,
      isSensorAvailable: data.isSensorAvailable,
      isTestStation: data.isTestStation,
      isMultiplePortSupported: data.isMultiplePortSupported,
    })
  }

  public onActionRemoveClick(data: any) {
    this.stationId = data.stationId;
    let status = data.isActive ? 'Inactive' : 'Active';
    let serverData = {Id: data.stationId, IsActive: !data.isActive}
    this.confirmationDialogService.confirm('Please confirm..', `Do you really want to ${status} the device ?`)
      .then((confirmed) => {
        this.loading = true;
        this.managementService.deleteStation(serverData).subscribe(data => {
          if (data.hasError === false) {
            this.toastr.success('Status changed!!!', 'Success');
            this.loadDevices();
            this.loading = false;
          }
        }, (error: any) => {
          this.toastr.error(error.error, 'Error');
          this.loading = false;
        });

      })
      .catch(() => console.log('User dismissed the dialog'));

  }

  onActionQRCodeClick(data: any) {
    console.log(data)
    let qrdata = {
      "Help" : "Please install the mobile app by opening below link.",
      "Link" : "http://onelink.to/djp9b8",
      "stationId" : data.stationId,
      "stationName" : data.stationName
    }
    this.stationQRCodeData = JSON.stringify(qrdata)
    this.qrCodeModal.show();
  }
  

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.url = (<FileReader>event.target).result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  checkStationExists() {
    this.nameExistsCheckLoading = true;
    this.managementService.checkStationExists(this.f.stationSerialNumber.value).subscribe(data => {
      if (data.hasError === false) {
        this.nameExistsCheckLoading = false;
      }
    }, (error: any) => {
      this.detectChange = true;
      this.nameExistsCheckLoading = false;
      this.toastr.error(error.error.errorDescription, 'Error');
      this.deviceForm.get('stationSerialNumber').setErrors({nameExists: error.error.errorDescription});
    })
    
  }

  onFilterTextBoxChanged() {
    this.gridOptions.api.setQuickFilter((<HTMLInputElement>document.getElementById('filter-text-box')).value);
  }

  saveAsImage() {
    let imageName = JSON.parse(this.stationQRCodeData)
    const image = html2canvas(document.querySelector('#qrImage')).then(
      canvas => saveAs(canvas.toDataURL(), `${imageName.stationName}QRcode`)
    );
  }

  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }

  printComponent(cmpName) {
    //  let printContents = document.getElementById(cmpName).innerHTML;
    //  window.print();
    const qrcode = document.getElementById('qrcode');
    let imageData = this.getBase64Image(qrcode.firstChild.firstChild);
    console.log(imageData)

    let windowContent = '<!DOCTYPE html>';
    windowContent += '<html>';
    // windowContent += '<head><title>Print canvas</title></head>';
    windowContent += '<body style="height:100%;width:100%;">';
    // windowContent += '<img src="' + imageData + '">';

    
    
    windowContent += '<div style="height:100%;width:100%; text-align: center;"><img style="height:40%; width:40%; margin-top:40%" src="' + imageData + '"></div>';
    windowContent += '</body>';
    windowContent += '</html>';

    const printWin = window.open('', '', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
// printWin.document.open();
printWin.document.write(windowContent); 

printWin.document.addEventListener('load', function() {
    printWin.focus();
    printWin.print();
    printWin.document.close();
    printWin.close();            
}, true);

  }
}