import { Component } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { ManagementService } from '../management.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router'

@Component({
  templateUrl: 'reports.component.html'
})
export class ReportsComponent {
  loading = false;
  siteData: any = [];

  

  private gridApi;
  private gridColumnApi;

  dtOptions: DataTables.Settings = {};
 
  public data1 = [
    {name: 'Rupnesh', email: 'rupnesh@gmail.com', website:'rupnesh.com'},
    {name: 'Amar', email: 'amar@gmail.com', website:'amar.com'},
    {name: 'Ajay', email: 'ajay@gmail.com', website:'ajay.com'},
    {name: 'Alok', email: 'alok@gmail.com', website:'alok.com'},
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
    // { headerName: 'Site ID', field: 'siteID', sortable: true, suppressSizeToFit: false },
    // { headerName: 'Site Name', field: 'siteName', sortable: true },
    { headerName: 'Site', field: 'siteName', editable: true, sortable: true, filter: true, suppressSizeToFit: false },
    { headerName: 'Stations', field: 'stationCount', filter: "agTextColumnFilter", suppressSizeToFit: false },
    { headerName: 'isActive', field: 'isActive', filter: "agNumberColumnFilter", suppressSizeToFit: false },
    { headerName: 'hasError', field: 'hasError', suppressSizeToFit: false, valueFormatter: this.precisionFormatter },
    {
      headerName: "Actions", suppressMenu: true, suppressSorting: true, cellClass: 'noborder', pinned: 'right',
      cellRenderer: (data) => {
        if (data.data.isActive === true) {
          return '<button type="button" data-action-type="view" class="btn btn-sm btn-ghost-success"><i data-action-type="view" class="icon-eye"></i></button>' +
            '<button type="button" style="width:64px;margin-left:5px" data-action-type="remove" class="btn btn-sm btn-success">Active</i></button>';
        }
        else {
          return '<button type="button" data-action-type="view" class="btn btn-sm btn-ghost-success"><i data-action-type="view" class="icon-eye"></i></button>' +
            '<button type="button" style="width:64px;margin-left:5px" data-action-type="remove" class="btn btn-sm btn-danger">Inactive</button>';
        }
      }
    }
  ];

  constructor(private managementService: ManagementService, private toastr: ToastrService, public route: Router, public router: ActivatedRoute) { }
  ngOnInit() {
    this.loadSites();
  }
  loadSites() {
    this.loading = true;
    this.managementService.filterSitesByUser().subscribe(data => {
    // this.managementService.getDashboardSiteReport().subscribe(data => {
      if (data.hasError === false) {
        this.loading = false;
        // this.siteData = data.dashboardSiteReportViewModels;
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
  precisionFormatter(params) {
    if(params.value > 0)
      return params.value.toFixed(2);
    else
      return params.value
  }
  onGridReady(params) {
    params.api.sizeColumnsToFit();
    var allColumnIds = [];
    this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
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
  }
  public onActionViewClick(data: any) {
    localStorage.setItem('siteDataNav', JSON.stringify(data));
    this.route.navigateByUrl('/management/reports/sitereports', { state: { data: data } } );

    // this.route.navigateByUrl('/management/reports/sitereportsnew', { state: { data: data } } );


    // this.route.navigate(['management/reports/sitereports'], { queryParams: { data: data.siteID } });
  }
  public onActionRemoveClick(data: any) {
  }

  onFilterTextBoxChanged() {
    this.gridOptions.api.setQuickFilter((<HTMLInputElement>document.getElementById('filter-text-box')).value);
  }

}
