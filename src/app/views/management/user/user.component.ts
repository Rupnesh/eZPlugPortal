import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManagementService } from '../management.service'
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { TableActionsComponent } from '../table.actions'
import { ButtonRendererComponent } from '../button.renderer.component';
import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';


@Component({
  templateUrl: 'user.component.html',
  styleUrls: ['../management.scss']
})
export class UserComponent {

  dtOptions: DataTables.Settings = {};
  userForm: FormGroup;
  userUpdateForm: FormGroup;
  userID: any;
  submitted = false;
  submittedUpdate = false;

  loading = false;
  loadingUpdate = false;

  userData: any = [];
  frameworkComponents: any;
  userRoles:any = [];
  siteData:any = [];
  siteAssignedToUser:any = [];
  siteAssignedToUserLoaded:any = false;

  settingsSite = {
    singleSelection: false,
    idField: 'siteID',
    textField: 'siteName',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'Clear',
    allowSearchFilter: true,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 3,
    searchPlaceholderText: 'Search site',
    noDataAvailablePlaceholderText: 'Data not found',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false
  };
  settingsRoles = {
    singleSelection: false,
    idField: 'roleId',
    textField: 'roleName',
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'Clear',
    allowSearchFilter: true,
    limitSelection: -1,
    clearSearchFilter: true,
    maxHeight: 197,
    itemsShowLimit: 3,
    searchPlaceholderText: 'Search role',
    noDataAvailablePlaceholderText: 'Data not found',
    closeDropDownOnSelection: false,
    showSelectedItemsAtTop: false,
    defaultOpen: false
  };
  updateSelectRole:any;
  isPasswordSame: any;
  show: boolean = false;

  // userData:any = [{email:'sharma@gmail.com',firstName:'rupnesh', lastName: 'sharma', phone:'9762800594'}];
  @ViewChild('addModal') addModal: any;
  @ViewChild('updateModal') updateModal: any;
  @ViewChild('addUserRolesSelect') addUserRolesSelect: any;

  public gridOptions: any = {
    defaultColDef: {
      resizable: true
    },
    animateRows: true,
    pagination: true,
    paginationPageSize: 10,
    rowHeight: 32,
    colResizeDefault: 'shift',
    domLayout: 'autoHeight',
    context: {
      componentParent: this
    }
  };

  constructor(public formBuilder: FormBuilder, public service: ManagementService, private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    }
  }

  columnDefs = [
    { headerName: 'UserID', field: 'email', valueFormatter: this.formatEmail, sortable: true, suppressSizeToFit: false },
    { headerName: 'Name', valueGetter: 'data.firstName + " " + data.lastName', valueFormatter: this.formatName, sortable: true, suppressSizeToFit: false },
    { headerName: 'Phone No', field: 'phone', valueFormatter: this.formatPhone, sortable: true, suppressSizeToFit: false },
    { headerName: 'Roles', field: 'roles', valueFormatter: this.formatRoles, sortable: true, suppressSizeToFit: false },
    { headerName: 'isActive', field: 'isActive', sortable: true, suppressSizeToFit: false },
    {
      headerName: "Actions", suppressMenu: true, suppressSorting: true, cellClass: 'noborder', suppressSizeToFit: false, pinned: 'right',
      cellRenderer: (data) => {
        if (data.data.isActive === true) {
          return '<button type="button" data-action-type="view" class="btn btn-sm btn-ghost-success"><i data-action-type="view" class="icon-pencil"></i></button>' +
            '<button type="button" style="width:64px;margin-left:5px" data-action-type="remove" class="btn btn-sm btn-success">Active</i></button>';
        }
        else {
          return '<button type="button" data-action-type="view" class="btn btn-sm btn-ghost-success"><i data-action-type="view" class="icon-pencil"></i></button>' +
            '<button type="button" style="width:64px;margin-left:5px" data-action-type="remove" class="btn btn-sm btn-danger">Inactive</button>';
        }
      }
      // template:
      //   ` <button type="button" data-action-type="view" class="btn btn-sm btn-ghost-success"><i data-action-type="view" class="icon-pencil"></i></button>
      //     <button type="button" data-action-type="remove" class="btn btn-sm btn-ghost-danger"><i data-action-type="remove" class="icon-trash"></i></button>
      //   `
    }

    // {
    //   headerName: 'Actions',
    //   cellRenderer: 'buttonRenderer',
    //   cellRendererParams: {
    //     onClick: this.editUser.bind(this),
    //     label: 'Click 1'
    //   }
    // },
    // { headerName: 'Actions', field: 'action', cellRendererFramework: TableActionsComponent },
  ];

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}')]],
      confirmPassword: ['', Validators.required],
      companyName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      roles: [this.userRoles, Validators.required],
      sites: [this.siteData, Validators.required],
      isActive: [true, Validators.required],

    },
      { validator: this.checkPassword('password', 'confirmPassword') }
    );
    this.userUpdateForm = this.formBuilder.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      companyName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      roles: [0, Validators.required],
      sites: [0, Validators.required],
      isActive: [true, Validators.required],
    });


    // this.loading = true;
    this.loadUsers();
    this.loadRoles();
    this.loadSitesByUser()

  }

  checkPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        this.isPasswordSame = (matchingControl.status == 'VALID') ? true : false;
      } else {
        matchingControl.setErrors(null);
        this.isPasswordSame = (matchingControl.status == 'VALID') ? true : false;
      }
    }
  }

  onGridReady(params) {
    params.api.sizeColumnsToFit();
    var allColumnIds = [];
    this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
  }

  loadUsers() {
    this.loading = true;
    this.service.getAllUsersData().subscribe(data => {
      if (data.hasError === false) {
        this.loading = false;
        this.userData = data.userDetailsViewModels
      }
    }, (error: any) => {
      console.log(error)
      
      this.loading = false;
      if(error.status === 401) {
        // this.toastr.error(error.name, 'Error');
      }
      else if(error.status === 403) {
        this.toastr.error("No user found", 'Error');
      }
    })
  }  
  loadRoles() {
    this.service.filterRoleList().subscribe(data => {
      if (data.hasError === false) {
        this.userRoles = data.roleViewModels
      }
    }, (error: any) => {
      // this.toastr.error(error.error, 'Error');
    })
  }
  loadSitesByUser() {
    this.service.filterSitesByUser().subscribe(data => {
      if (data.hasError === false) {
        this.siteData = data.siteViewModels;
      }
    }, (error: any) => {
      if(error.status === 401) {
        // this.toastr.error(error.name, 'Error');
      }
      else {
        // this.toastr.error(error.error, 'Error');
      }
    })
  }

  get f() { return this.userForm.controls; }
  get u() { return this.userUpdateForm.controls; }

  formatName(params) {
    if (params.value === 'null null') return 'NA'
    else return params.value.toString().toLowerCase().replace(/(\b[a-z](?!\s))/g, data => { return data.toUpperCase() });
  }
  formatEmail(params) {
    if (params.value === null) return 'NA'
  }
  formatPhone(params) {
    if (params.value === null) return 'NA'
  }
  formatRoles(params) {
    if (params.value.length === 0) return 'NA'
    else {
      return params.value.map(data => { return data.roleName})
    }
  }


  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }
    var { roles, sites, ...remaining} = this.userForm.value
    let userRolesArray;
    roles.length > 0 ? userRolesArray = roles.map(data => data.roleName) : userRolesArray = []
    let siteIDs;
    sites.length > 0 ? siteIDs = sites.map(data => data.siteID) : siteIDs = []
    let serverData = {...remaining, roles: userRolesArray, sites: siteIDs };

    this.loading = true;
    this.service.addUserData(serverData).subscribe(data => {
      if (data.hasError === false) {
        this.toastr.success('User Added', 'Success');
        this.loading = false;
        this.loadUsers();
        this.addModal.hide()
      }
    }, (error: any) => {
      this.toastr.error(error.error, 'Error');
      this.loading = false;
      this.addModal.hide()
    })

  }

  onUpdate() {
    this.submittedUpdate = true;
    if (this.userUpdateForm.invalid) {
      return;
    }
    var { sites, roles, ...remaining} = this.userUpdateForm.value
    
    let userRolesArray;
    roles.length > 0 ? userRolesArray = roles.map(data => data.roleName) : userRolesArray = []
    let siteIDs;
    sites.length > 0 ? siteIDs = sites.map(data => data.siteID) : siteIDs = []
    let serverData = {...remaining, sites: siteIDs, roles: userRolesArray, UserId: this.userID };
    
    this.loadingUpdate = true;
    this.service.updateUserData(serverData).subscribe(data => {
      if (data.hasError === false) {
        this.loadingUpdate = false;
        this.toastr.success('User Updated', 'Success');
        this.loadUsers();
        this.updateModal.hide()
      }
    }, (error: any) => {
      this.toastr.error(error.error, 'Error');
      this.loadingUpdate = false;
      this.updateModal.hide()
    })

    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.userUpdateForm.value, null, 4));
  }

  onFilterTextBoxChanged() {
    this.gridOptions.api.setQuickFilter((<HTMLInputElement>document.getElementById('filter-text-box')).value);
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
    this.userID = data.userId;
    this.updateModal.show();
    let roleIds = []
    roleIds = data.roles.map(dataR => {
      return dataR.roleName
    })

    this.userUpdateForm.patchValue({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      roles: data.roles,
      phoneNumber: data.phone,
    })

    this.service.getSiteAssignedToUser(data.userId).subscribe(data => {
      if (data.hasError === false) {
        this.siteAssignedToUser = data.siteViewModels;
        this.siteAssignedToUserLoaded = true
        this.userUpdateForm.patchValue({
          sites: this.siteAssignedToUser
        })
      }
    }, (error: any) => {
    })

    

  }

  public onActionRemoveClick(data: any) {
    let status = data.isActive ? 'Inactive' : 'Active';
    let serverData = { Id: data.userId, IsActive: !data.isActive }
    this.confirmationDialogService.confirm('Please confirm..', `Do you really want to ${status} the user ?`)
      .then((confirmed) => {
        this.loading = true;
        this.service.deleteUser(serverData).subscribe(data => {
          if (data.hasError === false) {
            this.toastr.success('Station Updated!!!', 'Success');
            this.loadUsers();
            this.loading = false;
          }
        }, (error: any) => {
          this.toastr.error(error.error, 'Error');
          this.loading = false;
        });

      })
      .catch(() => console.log('User dismissed the dialog'));

  }



  onReset() {
    this.submitted = false;
    this.userForm.reset();
  }
  onResetUpdate() {
    this.submittedUpdate = false;
    this.userUpdateForm.reset();
  }
  textOpen(type) {
    if(type === 'p')
      this.show = !this.show;
  }
  cloasAddModal() {
    this.addModal.hide();
    this.onReset()
  }
}
