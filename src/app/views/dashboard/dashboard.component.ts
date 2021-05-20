import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { HttpClient } from '@angular/common/http';

import { DashboardService } from './dashboard.service'
import { GridOptions } from 'ag-grid-community';


@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {

  radioModel: string = 'Month';
  dtOptions: DataTables.Settings = {};
  dashboardSummary: any;
  dashboardSiteReport: any;

  summaryLoaded = false;
  siteReportLoaded = false;

  public gridOptions: any = {
    defaultColDef: {
      resizable: true
    },
    animateRows: true,
    pagination: true,
    paginationPageSize: 10,
  };
  columnDefs = [
    { headerName: 'Site', field: 'siteName', editable: true, sortable: true, filter: true, suppressSizeToFit: false },
    { headerName: 'Stations', field: 'stationCount', filter: "agTextColumnFilter", suppressSizeToFit: false },
    { headerName: 'Transactions', field: 'transactionCount', filter: "agNumberColumnFilter", suppressSizeToFit: false },
    { headerName: 'Revenue', field: 'revenueGenerated', suppressSizeToFit: false, valueFormatter: this.precisionFormatter },
    { headerName: 'Units Consumed', field: 'unitsConsumed', suppressSizeToFit: false, valueFormatter: this.precisionFormatter },
    { headerName: 'Last Updated', field: 'lastUpdated', filter: "agTextColumnFilter", suppressSizeToFit: false },
  ];

  constructor(private http: HttpClient, private service: DashboardService) {

  }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      lengthMenu: [5, 10, 15, 20],
    };
    this.service.getDashboardSummary().subscribe(data => {
      if (data.hasError === false) {
        this.summaryLoaded = true;
        this.dashboardSummary = data
      }
    }, (error: any) => {
      this.summaryLoaded = false;
    })

    this.service.getDashboardSiteReport().subscribe(data => {
      if (data.hasError === false) {
        this.siteReportLoaded = true;
        this.dashboardSiteReport = data.dashboardSiteReportViewModels
      }
    }, (error: any) => {
      this.siteReportLoaded = false;
    })
  }
  precisionFormatter(params) {
    if(params.value > 0)
      return params.value.toFixed(2);
    else
      return params.value
  }
  precisionFormatterDash(value) {
    if(value > 0)
      return value.toFixed(2);
    else
     return 0.00;
  }
  onGridReady(params) {
    params.api.sizeColumnsToFit();
    var allColumnIds = [];
    this.gridOptions.columnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
  }
  onFilterTextBoxChanged() {
    this.gridOptions.api.setQuickFilter((<HTMLInputElement>document.getElementById('filter-text-box')).value);
  }

}
