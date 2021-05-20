import {Component, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';

@Component({
  templateUrl: 'stations.component.html',
  styleUrls: ['stations.component.css']
})
export class StationComponent {

  dtOptions: DataTables.Settings = {};
  stationForm: FormGroup;
  submitted = false;
  loading = false;
  @ViewChild('myModal') public myModal: ModalDirective;
  @ViewChild('largeModal') public largeModal: ModalDirective;

  public gridOptions: GridOptions = {
    defaultColDef: {
      resizable: true
    },
    animateRows: true,
    pagination: true,
    paginationPageSize: 10,
    colResizeDefault: 'shift',
    domLayout: 'autoHeight',
  }; 

  columnDefs = [
    { headerName: 'Station ID', field: 'stationID', sortable: true, filter: true },
    { headerName: 'Serial No', field: 'serialNo', filter: "agTextColumnFilter" },
    { headerName: 'Firmware', field: 'firmware' },
    { headerName: 'Hardware', field: 'hardware', filter: "agTextColumnFilter" },
    { headerName: 'Site', field: 'site', filter: "agTextColumnFilter" },
    { headerName: 'Link', field: 'link', filter: "agTextColumnFilter" },
    { headerName: 'Type', field: 'type', filter: "agTextColumnFilter" },
  ];

  public data = [
    {stationID: 'MPCT11', serialNo: 'MPCT11', firmware:'MPCT11.1', hardware:"EPC32", site:"MPCT1", link:"", type:"Fast Charger"},
    {stationID: 'MPCT12', serialNo: 'MPCT12', firmware:'MPCT12.1', hardware:"EPC32", site:"MPCT1", link:"", type:"Fast Charger"},
    {stationID: 'MPCT13', serialNo: 'MPCT13', firmware:'MPCT13.1', hardware:"EPC32", site:"MPCT1", link:"", type:"Slow Charger"},
    {stationID: 'MPCT14', serialNo: 'MPCT14', firmware:'MPCT14.1', hardware:"EPC32", site:"MPCT1", link:"", type:"Fast Charger"},
    {stationID: 'MPCT15', serialNo: 'MPCT15', firmware:'MPCT15.1', hardware:"EPC32", site:"MPCT1", link:"", type:"Slow Charger"},
    {stationID: 'MPCT16', serialNo: 'MPCT16', firmware:'MPCT16.1', hardware:"EPC32", site:"MPCT1", link:"", type:"Fast Charger"},
    {stationID: 'MPCT17', serialNo: 'MPCT17', firmware:'MPCT17.1', hardware:"EPC32", site:"MPCT1", link:"", type:"Fast Charger"},
  ];
  constructor(public formBuilder: FormBuilder) {

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
  }

  get f() { return this.stationForm.controls; }

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
}
