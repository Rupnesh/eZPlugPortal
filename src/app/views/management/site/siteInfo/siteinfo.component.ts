import {Component, ViewChild} from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { Router, ActivatedRoute } from '@angular/router'
import { ManagementService } from '../../management.service'
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../../../../confirmation-dialog/confirmation-dialog.service';
import { DomSanitizer } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';


@Component({
  templateUrl: 'siteinfo.component.html',
  styleUrls: ['siteinfo.component.css', '../../management.scss']
})
export class SiteInfoComponent {
  siteDataNav:any = [];
  siteData:any = [];
  userData:any = [];
  stationData:any = [];
  pendingStationData:any = [];
  pricingTypesData:any = [];
  pricingModalData:any = [];
  siteStationPricingRuleData:any = [];

  loading = false;
  loadingAssignUserToSite = false;
  loadingAssignStationsToSite = false;
  loadingAddPricingRule = false;

  dtOptions: DataTables.Settings = {};
  stationForm: FormGroup;
  submitted = false;
  submittedsiteUserMapping = false;
  submittedsiteStationMapping = false;
  submittedsiteStationPricing = false;
  submittedsitePricingModal = false;

  public selectedStationList:any = [];
  stationQRCodeData: any;
  fileUrl;
  sitePhoto:any;
  @ViewChild('pricingModal') public pricingModal: ModalDirective;
  @ViewChild('largeModal') public largeModal: ModalDirective;
  @ViewChild('qrCodeModal') public qrCodeModal: ModalDirective;
  @ViewChild('imageModal') public imageModal: ModalDirective;
  @ViewChild('qrCanvas') public qrCanvas;

  siteUserMappingForm: FormGroup;
  siteStationMappingForm: FormGroup;
  siteStationPricingForm: FormGroup;
  pricingModalForm: FormGroup;
  siteStationPricingRuleForm: FormGroup;
  userSavedRoles:any = [];
  

  settings = {
    singleSelection: false,
    idField: 'userId',
    textField: 'firstName',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'Clear',
    allowSearchFilter: true,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 3,
    searchPlaceholderText: 'Search user',
    noDataAvailablePlaceholderText: 'Data not found',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false
  };
  settingsStations = {
    singleSelection: false,
    idField: 'stationId',
    textField: 'stationName',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'Clear',
    allowSearchFilter: true,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 3,
    searchPlaceholderText: 'Search Station',
    noDataAvailablePlaceholderText: 'Data not found',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false
  };

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
    autoSizeAllColumn: true
  };
  columnDefsPricing = [
  ]
  // columnDefsPricing = [
  //   { headerName: 'Station Name', field: 'stationName', sortable: true },
  //   { headerName: 'Pricing Type', field: 'pricingTypeName', editable: true, cellEditor: "agSelectCellEditor", 
  //     cellEditorParams: { values: ["AAA", "BBB", "CCC"] } 
  //   },
  //   { headerName: 'Amount', field: 'amount', editable: true },
  //   { headerName: 'isActive', field: 'isActive' },
  // ]

  columnDefs = [
    // { headerName: 'Station ID', field: 'stationId',sortable: true, suppressSizeToFit: false },
    { headerName: 'Station Name', field: 'stationName', sortable: true, suppressSizeToFit: false },
    { headerName: 'Unit Price', field: 'pricingRate', suppressSizeToFit: false },
    { headerName: 'Firmware Version', field: 'firmwareVersion', suppressSizeToFit: false },
    { headerName: 'Hardware Version', field: 'hardwareVersion', suppressSizeToFit: false },
    { headerName: 'IsActive', field: 'isActive', suppressSizeToFit: false },
    { headerName: 'IsAvailable', field: 'isAvailable', suppressSizeToFit: false },
    { headerName: 'Has Error', field: 'hasError', suppressSizeToFit: false },
    { headerName: 'Installed By', field: 'installedBy',sortable: true, suppressSizeToFit: false },
    { headerName: 'Installed On', field: 'installedOn', sortable: true, suppressSizeToFit: false },
    { headerName: 'Last Upgraded On', field: 'lastUpgradedOn', sortable: true, suppressSizeToFit: false },
    { headerName: 'Distributor', field: 'distributor', sortable: true, suppressSizeToFit: false },
    {
      headerName: "Actions", pinned: 'right', suppressSizeToFit: false,
      cellRenderer: (data) => { 
        return '<button type="button" data-action-type="pricing" class="btn btn-sm btn-ghost-success"><i data-action-type="pricing" class="fa fa-rupee"></i></button>' +
          '<button type="button" style="width:64px;margin-left:5px" data-action-type="remove" class="btn btn-sm btn-danger">Remove</button>';
      }
    }
  ];

  columnDefsSiteUser = [
    { headerName: 'Station Name', field: 'stationName', sortable: true, suppressSizeToFit: false },
    { headerName: 'Unit Price', field: 'pricingRate', suppressSizeToFit: false },
    { headerName: 'Firmware Version', field: 'firmwareVersion', suppressSizeToFit: false },
    { headerName: 'Hardware Version', field: 'hardwareVersion', suppressSizeToFit: false },
    { headerName: 'IsActive', field: 'isActive', suppressSizeToFit: false },
    { headerName: 'IsAvailable', field: 'isAvailable', suppressSizeToFit: false },
    { headerName: 'Has Error', field: 'hasError', suppressSizeToFit: false },
    { headerName: 'Installed By', field: 'installedBy',sortable: true, suppressSizeToFit: false },
    { headerName: 'Installed On', field: 'installedOn', sortable: true, suppressSizeToFit: false },
    { headerName: 'Last Upgraded On', field: 'lastUpgradedOn', sortable: true, suppressSizeToFit: false },
    { headerName: 'Distributor', field: 'distributor', sortable: true, suppressSizeToFit: false },
  ];

  
  constructor(public formBuilder: FormBuilder, public route: Router, public router: ActivatedRoute, public managementService: ManagementService,
    private toastr: ToastrService, private confirmationDialogService: ConfirmationDialogService,private sanitizer: DomSanitizer) {

  }

  async ngOnInit() {
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
    this.siteUserMappingForm = this.formBuilder.group({
      role: ['0', Validators.required],
      users: new FormControl([], Validators.required)
    });
    this.siteStationMappingForm = this.formBuilder.group({
      // siteId: ['0', Validators.required],
      stations: new FormControl([], Validators.required)
    });
    this.siteStationPricingForm = this.formBuilder.group({
      pricingTypeId: ['1', Validators.required],
      amount: ['', Validators.required],
      isActive: [true, Validators.required]
    });
    this.pricingModalForm = this.formBuilder.group({
      pricingTypeId: ['0', Validators.required],
      amount: ['', Validators.required],
      isActive: [true, Validators.required]
    });

    this.siteStationPricingRuleForm = this.formBuilder.group({
      pricingTypeId: ['0', Validators.required],
      amount: ['', Validators.required],
      isActive: [true, Validators.required]
    });


    let navData = await localStorage.getItem('siteDataNav');
    if(history.state.data) {
      this.siteDataNav = history.state.data
    }
    else {
      this.siteDataNav = JSON.parse(navData);
    }

    let roles = await JSON.parse(localStorage.getItem('userData'))
    this.userSavedRoles = roles.roles

    this.loading =true;
    this.loadSiteStations();
    this.loadSites();
    this.loadUsers();
    this.loadUnassignedStations();
    this.loadPricingTypes();
    this.loadSiteStationPricingRules();

    this.managementService.getAllPhotosForSite(this.siteDataNav.siteName).subscribe(data => {
      if (data.hasError === false) {
        this.sitePhoto = data.photoList[0]
      }
    }, (error: any) => {
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

  get siteStationMap() { return this.siteStationMappingForm.controls; }
  get siteUserMap() { return this.siteUserMappingForm.controls; }
  get sitePricingVal() { return this.siteStationPricingForm.controls; }
  get sitePricingModalVal() { return this.pricingModalForm.controls; }

  isFirstColumn(params) {
    var displayedColumns = params.columnApi.getAllDisplayedColumns();
    var thisIsFirstColumn = displayedColumns[0] === params.column;
    return thisIsFirstColumn;
  }
  onRowSelected(event) {
    this.selectedStationList.push(event.data.stationId)
  }
  
  onSelectionChanged(event) {
    // var rowCount = event.api.getSelectedNodes().length;
    // event.api.getSelectedNodes().map(obj => {
    //   console.log(obj.data.stationId)
    //   this.selectedStationList.push(obj.data.stationId)
    // })
  }

  loadSiteStations() {
    this.stationData = []
    this.managementService.getStationList(this.siteDataNav.siteID).subscribe(data => {
      if (data.hasError === false) {
        this.loading = false;
        this.stationData = data.stationViewModels
      }
    }, (error: any) => {
      this.toastr.error(error.error.errorDescription, 'Error');
      this.loading = false;
    })
  } 

  loadSites() {
    this.managementService.filterSitesByUser().subscribe(data => {
      if (data.hasError === false) {
        this.loading = false;
        this.siteData = data.siteViewModels;
      }
    }, (error: any) => {
      // this.toastr.error(error.error, 'Error');
      this.loading = false;
    })
  }
  loadUsers() {
    this.managementService.getAllUsersData().subscribe(data => {
      if (data.hasError === false) {
        this.userData = data.userDetailsViewModels
      }
    }, (error: any) => {
      // this.toastr.error(error.error, 'Error');
    })
  }
  loadUnassignedStations() {
    this.managementService.getStationsWithPendingSites().subscribe(data => {
      if (data.hasError === false) {
        this.pendingStationData = data.stationViewModels
      }
    }, (error: any) => {
      // this.toastr.error(error.error.errorDescription, 'Error');
    })
  }
  loadPricingTypes() {
    this.managementService.getAllPricingTypes().subscribe(data => {
      if (data.hasError === false) {
        this.pricingTypesData = data.pricingTypeViewModels
        let types = this.pricingTypesData.map(data => data.displayName)
        this.columnDefsPricing = [
          { headerName: 'Station Name', field: 'stationName', sortable: true },
          { headerName: 'Pricing Type', field: 'pricingTypeName', editable: true, cellEditor: "agSelectCellEditor", 
            cellEditorParams: { values: types } 
          },
          { headerName: 'Amount', field: 'amount', editable: true },
          { headerName: 'isActive', field: 'isActive' },
        ]
      }
    }, (error: any) => {
      // this.toastr.error(error.error, 'Error');
    })
  }
  loadSiteStationPricingRules() {
    this.managementService.getAllSiteStationPricingRules(this.siteDataNav.siteID).subscribe(data => {
      if (data.hasError === false) {
        this.siteStationPricingRuleData = data.siteStationPricingRuleViewModels
      }
    }, (error: any) => {
    })
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

  assignUsersToSite() {
    this.loadingAssignUserToSite = true;
    const { users } = this.siteUserMappingForm.value;
    let serverData = { siteId: this.siteDataNav.siteID, users: users.map(obj => obj.userId) }
    this.managementService.assignUserToSite(serverData).subscribe(data => {
      if (data.hasError === false) {
        this.toastr.success('User Assigned!!!', 'Success');
        this.loadingAssignUserToSite = false;
      }
    }, (error: any) => {
      this.toastr.error(error.error, 'Error');
      this.loadingAssignUserToSite = false;
    });
  } 

  assignStationsToSite() {

    // this.loadingAssignStationsToSite = true;
    const { stations } = this.siteStationMappingForm.value;
    let serverData = { siteId: this.siteDataNav.siteID, stations: stations.map(obj => obj.stationId) }
    console.log(serverData)
    this.managementService.assignStationsToSite(serverData).subscribe(data => {
      if (data.hasError === false) {
        this.toastr.success('Station Assigned!!!', 'Success');
        this.loadingAssignUserToSite = false;
        this.loadSiteStations();
      }
    }, (error: any) => {
      this.toastr.error(error.error, 'Error');
      this.loadingAssignUserToSite = false;
    });
    
  }

  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "pricing":
          return this.onActionPricingClick(data);
        case "remove":
          return this.onActionRemoveClick(data);
        case "qrcode":
          return this.onActionQRCodeClick(data);
      }
    }
  }

  public onActionPricingClick(data: any) { 
    this.pricingModal.show();
    this.pricingModalData = data
    // this.updateModal.show();

    this.pricingModalForm.patchValue({
      pricingTypeId: 1,
      amount: this.pricingModalData.pricingRate
    })
  }
  
  public onActionRemoveClick(data: any) {
    let serverData = { siteId: this.siteDataNav.siteID, stations: [data.stationId] }
    this.confirmationDialogService.confirm('Please confirm..', `Do you really want to remove the station ${data.stationName}?`)
      .then((confirmed) => {
        if(confirmed) {
          this.loading = true;
          this.managementService.unAssignStationsFromSite(serverData).subscribe(data => {
            if (data.hasError === false) {
              this.toastr.success('Station Removed!!!', 'Success');
              // this.loadSites();
              this.loadSiteStations();
              this.loading = false;
            }
          }, (error: any) => {
            this.toastr.error(error.error, 'Error');
            this.loading = false;
          });
        }
      })
      .catch(() => console.log('Station dismissed the dialog'));
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
    const blob = new Blob([this.stationQRCodeData], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  share() {
    var fakeLink = document.createElement('a');
    fakeLink.setAttribute('href', 'https://api.whatsapp.com/send?text='+encodeURIComponent('https://ztriciotstorage.blob.core.windows.net/site-photos/Vyom%20Labs/AR-Test1.png'));
    fakeLink.setAttribute('data-action', 'share/whatsapp/share');
    fakeLink.setAttribute('target', '_blank');
    fakeLink.click();
  }

  addPricingRule() {
    this.submittedsiteStationPricing = true;
    if (this.siteStationPricingForm.invalid) {
      return;
    }
    let serverData = { "siteId": this.siteDataNav.siteID, "stationId": null, "pricingTypeId": this.sitePricingVal.pricingTypeId.value, "amount": this.sitePricingVal.amount.value, "isActive": true }
    this.loadingAddPricingRule = true
    this.managementService.addSiteStationPricingRules(serverData).subscribe(data => {
      if (data.hasError === false) {
        this.toastr.success('Rule Added!!!', 'Success');
        // this.loadSites();
        this.loadSiteStationPricingRules();
        this.loadingAddPricingRule = false;
      }
    }, (error: any) => {
      this.toastr.error(error.error, 'Error');
      this.loadingAddPricingRule = false;
    });

  }
  addPricingRuleModal() {

    let serverData = { "siteId": this.siteDataNav.siteID, "stationId": this.pricingModalData.stationId, "pricingTypeId": this.sitePricingModalVal.pricingTypeId.value, "amount": this.sitePricingModalVal.amount.value, "isActive": true }
    this.loadingAddPricingRule = true
    this.managementService.addSiteStationPricingRules(serverData).subscribe(data => {
      if (data.hasError === false) {
        this.toastr.success('Rule Added!!!', 'Success');
        // this.loadSites();
        this.loadSiteStations();
        this.loadingAddPricingRule = false;
        this.pricingModal.hide()
      }
    }, (error: any) => {
      this.toastr.error(error.error, 'Error');
      this.loadingAddPricingRule = false;
      this.pricingModal.hide()
    });

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

  imageZoom() {
    this.imageModal.show();
  }

}
