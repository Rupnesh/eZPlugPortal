// import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router'
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { ManagementService } from '../management.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import { AmazingTimePickerService } from 'amazing-time-picker';


@Component({
  templateUrl: 'site.component.html',
  styleUrls: ['site.component.css', '../management.scss']
})
export class SiteComponent {

  dtOptions: DataTables.Settings = {};

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

  siteForm: FormGroup;
  siteUpdateForm: FormGroup;
  siteUserMappingForm: FormGroup;
  submitted = false;
  submittedUpdate = false;
  submittedsiteUserMapping = false;

  loading = false;
  loadingAdd = false;
  loadingUpdate = false;
  loadingMapUser = false;
  loadingAssignUserToSite = false;
  siteData: any = [];
  userData: any = [];

  time_from: any = "08:00";
  time_to: any = "20:00";

  siteImage: any = "";
  url: any = ""

  detectChange = false;
  nameExistsCheckLoading = false;

  @ViewChild('largeModal') addModal: any;
  @ViewChild('updateModal') updateModal: any;
  @ViewChild('sitePhoto') sitePhoto;  
  @ViewChild('sitePhotoUpdate') sitePhotoUpdate;  


  latitude: number;
  longitude: number;
  zoom: number = 14;
  address: string;
  private geoCoder;

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;

  addFlag = false;
  updateFlag = false;
  selectedSiteId = '';
  userSavedRoles:any = [];

  availability: any;
  selectedStartTime: any = "08:00";
  selectedEndTime: any = "20:00";
  


  public data1 = [
    { siteID: 'MPCT1', siteName: 'MPCT1', NoOfStations: '10' },
    { siteID: 'MPCT2', siteName: 'MPCT2', NoOfStations: '5' },
    { siteID: 'MPCT3', siteName: 'MPCT3', NoOfStations: '6' },
    { siteID: 'MPCT4', siteName: 'MPCT4', NoOfStations: '8' },
  ];

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
    { headerName: 'Site Name', field: 'siteName', sortable: true, filter: true },
    { headerName: 'Location', valueGetter: 'data.lattitude + " " + data.longitude', filter: true, valueFormatter: this.formatLocation, suppressSizeToFit: false },
    { headerName: 'Station Count', field: 'stationCount', sortable: true, },
    { headerName: 'Start time', field: 'startTime', valueFormatter: this.formatDateTime, sortable: true, },
    { headerName: 'End time', field: 'endTime', valueFormatter: this.formatDateTime, sortable: true, },
    {
      headerName: "Actions", suppressMenu: true, suppressSorting: true, cellClass: 'noborder', pinned: 'right', suppressSizeToFit: false,
      cellRenderer: (data) => {
        if (data.data.isActive === true) {
          return '<button type="button" data-action-type="edit" class="btn btn-sm btn-ghost-success"><i data-action-type="edit" class="icon-pencil"></i></button>' +
            '<button type="button" data-action-type="view" class="btn btn-sm btn-ghost-success"><i data-action-type="view" class="icon-eye"></i></button>' +
            '<button type="button" style="width:64px;margin-left:5px" data-action-type="remove" class="btn btn-sm btn-success">Active</button>';
        }
        else {
          return '<button type="button" data-action-type="edit" class="btn btn-sm btn-ghost-success"><i data-action-type="edit" class="icon-pencil"></i></button>' +
            '<button type="button" data-action-type="view" class="btn btn-sm btn-ghost-success"><i data-action-type="view" class="icon-eye"></i></button>' +
            '<button type="button" style="width:64px;margin-left:5px" data-action-type="remove" class="btn btn-sm btn-danger">Inactive</button>';
        }
      }
    }
  ];
  

  

  public data = [
    { site: "Magarpatta", stations: 10, transactions: 5, revenue: 10, errors: 0, last_updated: "2020-01-31" },
    { site: "Nandan 1", stations: 8, transactions: 15, revenue: 2, errors: 5, last_updated: "2020-01-28" },
    { site: "Nandan 2", stations: 12, transactions: 25, revenue: 5, errors: 5, last_updated: "2020-01-26" },
    { site: "Kolte Patil", stations: 20, transactions: 10, revenue: 4, errors: 5, last_updated: "2020-01-22" },
    { site: "Pune", stations: 25, transactions: 23, revenue: 10, errors: 0, last_updated: "2020-01-20" },
    { site: "Khadki", stations: 5, transactions: 12, revenue: 10, errors: 8, last_updated: "2020-01-19" },
    { site: "Dapodi", stations: 15, transactions: 11, revenue: 10, errors: 4, last_updated: "2020-01-18" },
    { site: "Baner", stations: 19, transactions: 10, revenue: 10, errors: 4, last_updated: "2020-01-17" },
  ];

  columnDefsSIteUserMap = [
    { headerName: 'Site ID', field: 'siteID', sortable: true, suppressSizeToFit: false },
    { headerName: 'Site Name', field: 'siteName', sortable: true, suppressSizeToFit: false },
    { headerName: 'Number Of Stations', field: 'NoOfStations', sortable: true, suppressSizeToFit: false },
    { headerName: 'User', field: 'user', sortable: true, suppressSizeToFit: false },
    { headerName: 'Role', field: 'role', sortable: true, suppressSizeToFit: false },
  ]

  public siteUserMapData = [
    { siteID: 'SITE1', siteName: 'SITE1', NoOfStations: '3', user: 'USER1', role: 'OWNER' },
    { siteID: 'SITE2', siteName: 'SITE2', NoOfStations: '3', user: 'USER2', role: 'OWNER' },
    { siteID: 'SITE3', siteName: 'SITE3', NoOfStations: '3', user: 'USER3', role: 'OWNER' },
    { siteID: 'SITE4', siteName: 'SITE4', NoOfStations: '3', user: 'USER4', role: 'OWNER' },
  ]
  // @ViewChild('search') public searchElementRef: ElementRef;
  @ViewChild('search', { read: ElementRef }) public searchElementRef: ElementRef;
  

  constructor(public route: Router, public router: ActivatedRoute, private formBuilder: FormBuilder, private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private managementService: ManagementService, private confirmationDialogService: ConfirmationDialogService,
    private toastr: ToastrService, private atp: AmazingTimePickerService) {
  }

  async ngOnInit() {

    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
    })

    this.siteForm = this.formBuilder.group({
      siteName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      // zipcode: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      siteGeolocation: ['', Validators.required],
      // photos: [''],
      contactNumber: ['', Validators.required],
      isPublic: [true, ''],
      isLockBoxAvailable: [true, ''],
      isChargerAvailable: [true, ''],
      stationStartTime: ['08:00',  Validators.required],
      stationEndTime: ['20:00',  Validators.required],
      availability: '247'
    });
    this.siteUpdateForm = this.formBuilder.group({
      siteName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      // zipcode: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      siteGeolocation: ['', Validators.required],
      // photos: [''],
      contactNumber: ['', Validators.required],
      isPublic: [true, ''],
      isLockBoxAvailable: [true, ''],
      isChargerAvailable: [true, ''],

      stationStartTime: ['08:00', ''],
      stationEndTime: ['20:00', ''],
      availability: ''
    });

    this.siteUserMappingForm = this.formBuilder.group({
      siteID: ['0', Validators.required],
      users: new FormControl([], Validators.required)
      // users: ['0', Validators.required],
    });


    this.loading = true;
    this.loadSites();
    this.loadUsers();

    let roles = await JSON.parse(localStorage.getItem('userData'))
    this.userSavedRoles = roles.roles


    this.siteForm.controls['availability'].valueChanges.subscribe(value => {
      console.log(value)
      this.availability = value;
    })
    this.siteUpdateForm.controls['availability'].valueChanges.subscribe(value => {
      console.log(value)
      this.availability = value;
    })

    
  }

  loadSites() {
    this.managementService.filterSitesByUser().subscribe(data => {
      if (data.hasError === false) {
        this.loading = false;
        this.siteData = data.siteViewModels;
      }
    }, (error: any) => {
      if(error.status === 401) {
        this.toastr.error(error.name, 'Error');
        this.loading = false;
      }
      else {
        this.toastr.error(error.error.errorDescription, 'Error');
        this.loading = false;
      }
    })
  }
  loadUsers() {
    this.managementService.getAllUsersData().subscribe(data => {
      if (data.hasError === false) {
        this.userData = data.userDetailsViewModels
      }
    }, (error: any) => {
      
    })
  }

  // onGridReady(params) {
  //   var allColumnIds = [];
  //   this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
  //     allColumnIds.push(column.colId);
  //   });
  //   this.gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
  // }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
    var allColumnIds = [];
    this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
  }

  openStartTime() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectedStartTime = time;

      this.siteForm.patchValue({
        stationStartTime: time
      })

    });
  }
  openEndTime() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectedEndTime = time;
      

      var dtStart:any = new Date("1/1/2021 " + this.selectedStartTime);
      var dtEnd:any = new Date("1/1/2021 " + this.selectedEndTime);
      var difference_in_milliseconds = dtEnd - dtStart;
      if (difference_in_milliseconds > 0) {
        this.siteForm.patchValue({
          stationEndTime: time
        })
      }
      else {
        this.siteForm.patchValue({
          stationEndTime: null
        })
      }
    });
  }

  formatLocation(params) {
    if (params.value === '0 0') return 'NA'
    else return params.value.toString().replace(/ /g, ', ');
  }
  formatDateTime(params) {
    return moment(params.value).format("HH:mm A");
  }

  // convenience getter for easy access to form fields
  get f() { return this.siteForm.controls; }
  get u() { return this.siteUpdateForm.controls; }
  get sum() { return this.siteUserMappingForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.siteForm.invalid) {
      return;
    }
    const { siteGeolocation, stationStartTime, stationEndTime, ...formData } = this.siteForm.value;
    var latlang = siteGeolocation.match(/([^, ]+)/g);
    

    // var a = moment.utc("2013-11-18 11:55").tz("Asia/Taipei");
    // var b = moment.utc("2013-11-18 11:55").tz("America/Toronto");
    // a.format(); // 2013-11-18T19:55:00+08:00
    // b.format(); // 2013-11-18T06:55:00-05:00
    // a.utc().format(); // 2013-11-18T11:55Z
    // b.utc().format(); // 2013-11-18T11:55Z

    let startDateTime = moment().utc();
    let endDateTime = moment().utc();
    let startTime = moment(stationStartTime, 'HH:mm');
    let endTime = moment(stationEndTime, 'HH:mm');
    startDateTime.set({ hour: startTime.get('hour'), minute: startTime.get('minute'), second: startTime.get('second') });
    endDateTime.set({ hour: endTime.get('hour'), minute: endTime.get('minute'), second: endTime.get('second') });

    let serverData = { ...formData, latitude: parseFloat(latlang[0]), longitude: parseFloat(latlang[1]), stationStartTime: startDateTime, stationEndTime: endDateTime }

    this.managementService.addSite(serverData).subscribe(data => {
      if (data.hasError === false) {
        this.toastr.success('Site Added!!!', 'Success');
        this.loading = true;
        this.loadSites();
        this.loadingAdd = false;
        this.addModal.hide()
        this.uploadSitePhoto()
      }
    }, (error: any) => {
      this.toastr.error(error.error, 'Error');
      this.loadingAdd = false;
    })

  }

  onSubmitUpdate() {
    this.submittedUpdate = true;
    if (this.siteUpdateForm.invalid) {
      return;
    }
    const { siteGeolocation, stationStartTime, stationEndTime, ...formData } = this.siteUpdateForm.value;
    var latlang = siteGeolocation.match(/([^, ]+)/g);

    let startDateTime = moment.utc();
    let endDateTime = moment.utc();
    let startTime = moment(stationStartTime, 'HH:mm');
    let endTime = moment(stationEndTime, 'HH:mm');
    startDateTime.set({ hour: startTime.get('hour'), minute: startTime.get('minute'), second: startTime.get('second') });
    endDateTime.set({ hour: endTime.get('hour'), minute: endTime.get('minute'), second: endTime.get('second') });

    let serverData = { siteId: this.selectedSiteId,...formData, latitude: parseFloat(latlang[0]), longitude: parseFloat(latlang[1]), stationStartTime: startDateTime, stationEndTime: endDateTime }

    this.loadingUpdate = true;
    this.managementService.updateSite(serverData).subscribe(data => {
      if (data.hasError === false) {
        this.loadingUpdate = false;
        this.toastr.success('Site Updated', 'Success');
        this.loadSites();
        this.updateModal.hide()
        this.updateSitePhoto()
      }
    }, (error: any) => {
      console.log("error.....")
      this.loadingUpdate = false;
      if(error.status === 403)
        this.toastr.error("You dont have permission", 'Error');
      
    })

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

  readUrl1(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview();
  }
  preview() {
    // Show preview 
    var mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    }
  }

  uploadSitePhoto() {
    let formData = new FormData(); 
    console.log(this.sitePhoto.nativeElement.files[0])
    formData.append('photo', this.sitePhoto.nativeElement.files[0]);  
    this.managementService.uploadSitePhoto(formData, this.f.siteName.value).subscribe(data => {
      if (data.hasError === false) {
      }
    }, (error: any) => {
    })
  }
  updateSitePhoto() {
    let formData = new FormData(); 
    console.log(this.sitePhotoUpdate.nativeElement.files[0])
    formData.append('photo', this.sitePhotoUpdate.nativeElement.files[0]);  
    this.managementService.uploadSitePhoto(formData, this.u.siteName.value).subscribe(data => {
      if (data.hasError === false) {
      }
    }, (error: any) => {
    })
  }



  getGeolocation() {
    this.setCurrentLocation();
  }



  onReset() {
    this.submitted = false;
    this.siteForm.reset();
    this.siteForm.patchValue({
      isPublic: [true, ''],
      isLockBox: [true, ''],
      isCharger: [true, ''],
      siteFromTime: [this.time_from, ""],
      siteToTime: [this.time_to, ""],
    })
  }
  onResetUpdate() {
    this.submittedUpdate = false;
    this.siteUpdateForm.reset();
    this.siteUpdateForm.patchValue({
      isPublic: [true, ''],
      isLockBox: [true, ''],
      isCharger: [true, ''],
      siteFromTime: [this.time_from, ""],
      siteToTime: [this.time_to, ""],
    })
  }

  openPage() {
    this.route.navigate(['/management/site/station']);
  }


  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 14;
        var latLong = position.coords.latitude + ", " + position.coords.longitude;
        this.siteForm.patchValue({ "siteGeolocation": latLong })
        this.getAddress(this.latitude, this.longitude);
      }, err => { },
        { maximumAge: 60000, timeout: 5000, enableHighAccuracy: true });
    }
  }


  markerDragEnd($event: MouseEvent) {
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;

    var latLong = this.latitude + ", " + this.longitude;
    this.siteForm.patchValue({ "siteGeolocation": latLong })
    this.siteUpdateForm.patchValue({ "siteGeolocation": latLong })

    this.getAddress(this.latitude, this.longitude);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 14;
          this.address = results[0].formatted_address;

          let addressComponent: any = [];
          addressComponent = results[0].address_components;

          let postalCode = addressComponent.filter((item) => {
            return item.types[0] === "postal_code"
          })
          let addressCity = addressComponent.filter((item) => {
            return item.types[0] === "administrative_area_level_2"
          })
          let addressState = addressComponent.filter((item) => {
            return item.types[0] === "administrative_area_level_1"
          })
          let addressCountry = addressComponent.filter((item) => {
            return item.types[0] === "country"
          })

          this.siteForm.patchValue({
            "address": this.address,
            "zipcode": postalCode[0].long_name,
            "city": addressCity[0].long_name,
            "state": addressState[0].long_name,
            "country": addressCountry[0].long_name,
          })
          this.siteUpdateForm.patchValue({
            "address": this.address,
            "zipcode": postalCode[0].long_name,
            "city": addressCity[0].long_name,
            "state": addressState[0].long_name,
            "country": addressCountry[0].long_name,
          })
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  onFilterTextBoxChanged() {
    this.gridOptions.api.setQuickFilter((<HTMLInputElement>document.getElementById('filter-text-box')).value);
  }


  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "edit":
          return this.onActionEditClick(data);
        case "view":
          return this.onActionViewClick(data);
        case "remove":
          return this.onActionRemoveClick(data);
      }
    }
  }

  public onActionEditClick(data: any) {
    this.selectedSiteId = data.siteID;
    this.updateModal.show();

    this.latitude = data.lattitude;
    this.longitude = data.longitude;

    this.siteUpdateForm.setValue({
      siteName: data.siteName,
      // photos: data.photos,
      siteGeolocation: data.lattitude + ', ' + data.longitude,
      country: data.country,
      state: data.state,
      city: data.city,
      address: data.address,
      contactNumber: data.contact,
      stationStartTime: moment(data.startTime).format("HH:mm"),
      stationEndTime: moment(data.endTime).format("HH:mm"),
      isPublic: data.isPublic,
      isLockBoxAvailable: data.isLockBoxAvailable,
      isChargerAvailable: data.isChargerAvailable
    })
  }
  onActionViewClick(data: any) {
    localStorage.setItem('siteDataNav', JSON.stringify(data));
    this.route.navigateByUrl('/management/site/siteInfo', { state: { data: data } });
    // this.route.navigate(['/management/site/siteInfo'], { queryParams: { data: data } } );
  }
  public onActionRemoveClick(data: any) {
    let status = data.isActive ? 'Inactive' : 'Active';
    let serverData = { id: data.siteID, isActive: !data.isActive }
    this.confirmationDialogService.confirm('Please confirm..', `Do you really want to ${status} the site ?`)
      .then((confirmed) => {
        this.loading = true;
        this.managementService.deleteSite(serverData).subscribe(data => {
          if (data.hasError === false) {
            this.toastr.success('Site Updated!!!', 'Success');
            this.loadSites();
            this.loading = false;
          }
        }, (error: any) => {
          this.toastr.error(error.error, 'Error');
          this.loading = false;
        });

      })
      .catch(() => console.log('Site dismissed the dialog'));
  }

  onSubmitMapUser() {

  }
  assignUsersToSite() {
    this.loadingAssignUserToSite = true;
    const { siteID,users } = this.siteUserMappingForm.value;
    let serverData = { siteId: siteID, users: users.map(obj => obj.userId) }

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

  checkSiteExists() {
    this.nameExistsCheckLoading = true;
    this.managementService.checkSiteExists(this.f.siteName.value).subscribe(data => {
      if (data.hasError === false) {
        this.nameExistsCheckLoading = false;
      }
    }, (error: any) => {
      this.detectChange = true;
      this.nameExistsCheckLoading = false;
      this.toastr.error(error.error.errorDescription, 'Error');
      this.siteForm.get('siteName').setErrors({nameExists: error.error.errorDescription});
    })
    
  }

  

}
