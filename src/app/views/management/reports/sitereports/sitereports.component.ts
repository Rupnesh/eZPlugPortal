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
export class SiteReportsComponent {
  private gridApi;
  private gridColumnApi;
  private rowClassRules;

  siteDataNav:any = [];
  siteData:any = [];
  stationData:any = [];
  loading:any;
  selected = {startDate: new Date(), endDate: new Date()};

  unitsLoaded:any = false;
  revenueLoaded:any = false;
  unitsConsumedData:any;
  revenueGeneratedData:any;

  todaysDate:any = new Date()
  isRFID:any;

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
    filter: true,
    floatingFilter: true,
    autoSizeColumn: true
  };

  columnDefsRFID = [
    { headerName: 'Station', field: 'stationName' },
    { headerName: 'Units Consumed', field: 'unitsConsumed', sortable: true, valueFormatter: this.precisionFormatter, filter: 'agNumberColumnFilter', },
    { headerName: 'Transaction Amount', field: 'transactionAmount', sortable: true, valueFormatter: this.precisionFormatter, filter: 'agNumberColumnFilter', },
    { headerName: 'User Email', field: 'userEmail' },
    { headerName: 'User Contact', field: 'userPhone' },
    { headerName: 'Transaction Start Time', field: 'transactionStartTime', sortable: true, valueFormatter: this.dateTimeFormatter,
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: function(filterLocalDateAtMidnight, cellValue) {
            var formatedCellValue = moment(cellValue).format('DD/MM/YYYY')
            var dateAsString = formatedCellValue;
            if (dateAsString == null) {
                return 0;
            }
            var dateParts = dateAsString.split('/');
            var day = Number(dateParts[0]);
            var month = Number(dateParts[1]) - 1;
            var year = Number(dateParts[2]);
            var cellDate = new Date(year, month, day);
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
            return 0;
        }


      }
      
    },
    { headerName: 'Transaction End Time', field: 'transactionEndTime', sortable: true, valueFormatter: this.dateTimeFormatter },
    { headerName: 'Payment Status', field: 'isFullyPaid', sortable: true, valueFormatter: this.statusFormatter, 
      cellStyle: function(params) {
        if (params.value === false) {
          return { background: 'lightcoral', color: '#fff' };
        }
        else {
          return { background: 'lightgreen', color: '#fff' };
        }
      }
    }
  ]
  

  columnDefs = [
    { headerName: 'Invoice ID', field: 'invoiceId' },
    { headerName: 'Station', field: 'stationName' },
    { headerName: 'Units Consumed', field: 'unitsConsumed', sortable: true, valueFormatter: this.precisionFormatter, filter: 'agNumberColumnFilter', },
    { headerName: 'Transaction Amount', field: 'transactionAmount', sortable: true, valueFormatter: this.precisionFormatter, filter: 'agNumberColumnFilter', },
    { headerName: 'User Email', field: 'userEmail' },
    { headerName: 'User Contact', field: 'userPhone' },
    { headerName: 'Transaction Start Time', field: 'transactionStartTime', sortable: true, valueFormatter: this.dateTimeFormatter,
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: function(filterLocalDateAtMidnight, cellValue) {
            var formatedCellValue = moment(cellValue).format('DD/MM/YYYY')
            var dateAsString = formatedCellValue;
            if (dateAsString == null) {
                return 0;
            }
            var dateParts = dateAsString.split('/');
            var day = Number(dateParts[0]);
            var month = Number(dateParts[1]) - 1;
            var year = Number(dateParts[2]);
            var cellDate = new Date(year, month, day);
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
            return 0;
        }


      }
      
    },
    { headerName: 'Transaction End Time', field: 'transactionEndTime', sortable: true, valueFormatter: this.dateTimeFormatter },
    { headerName: 'Payment Status', field: 'isFullyPaid', sortable: true, valueFormatter: this.statusFormatter, 
      cellStyle: function(params) {
        if (params.value === false) {
          return { background: 'lightcoral', color: '#fff' };
        }
        else {
          return { background: 'lightgreen', color: '#fff' };
        }
      }
    },
  ];
  loadingRFID: boolean;
  siteDataRFID: any = [];
  constructor(private toastr: ToastrService, private managementService: ManagementService, 
    private router: Router, private route: ActivatedRoute) {
  }

  async ngOnInit() {

    let navData = await localStorage.getItem('siteDataNav');
    
    if(history.state.data) {
      this.siteDataNav = history.state.data
    }
    else {
      this.siteDataNav = JSON.parse(navData);
    }

    this.loadReports(null, null, null);
    this.loadSiteStations();
    this.getUnitsConsumedDataForSite();
    this.getRevenueGeneratedDataForSite();

    this.rowClassRules = {
      'paid': function (params) {
        return params.data.isFullyPaid === true;
      },
      'unpaid': function (params) {
        return params.data.isFullyPaid === false;
      }
    };
    
  }

  datesUpdated(e) {
    var startDate = moment(e.startDate).format('MM-DD-YYYY');
    var endDate = moment(e.endDate).format('MM-DD-YYYY');
    if(!this.isRFID)
      this.loadReports(startDate, endDate, null);
    else
    this.loadReportsRFID(startDate, endDate, null);
  }
  searchByStation(e) {
    if(!this.isRFID)
      this.loadReports(null, null, e.target.value);
    else
      this.loadReportsRFID(null, null, e.target.value);
  }
  precisionFormatter(params) {
    if(params.value > 0)
      return params.value.toFixed(2);
    else
      return params.value
  }
  dateTimeFormatter(params) {
    let dateVal = new Date(params.value + 'Z')
    return moment(dateVal).format("DD, MMM YYYY hh:mm A");
  }
  statusFormatter(params) {
    let dateVal = new Date(params.value + 'Z')
    return params.value ? 'Paid' : 'Pending'
  }

  async onGridReady(params) {
    var allColumnIds = [];
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, false);
  }

  async loadReports(startDate, endDate, stationId) {
    // let siteID = this.route.snapshot.queryParamMap.get('data')
    // this.siteDataNav = history.state.data;
    this.siteData = []
    this.loading = true;
    if(this.siteDataNav.siteID) {
      this.managementService.getAllTransactionsForSite(this.siteDataNav.siteID, startDate, endDate, stationId).subscribe(data => {
        if (data.hasError === false) {
          this.loading = false;
          this.siteData = data.transactionSiteStationViewModels;
        }
      }, (error: any) => {
        if(error.status === 401) {
          this.toastr.error(error.name, 'Error');
          this.loading = false;
        }
        else {
          this.loading = false;
          this.siteData = []
        }
      })
    }

    
  }

  loadReportsRFID(startDate, endDate, stationId) {
    this.loadingRFID = true;
    this.managementService.getRFIDTransactionsForSite(this.siteDataNav.siteID, startDate, endDate, stationId).subscribe(data => {
      if (data.hasError === false) {
        this.loadingRFID = false;
        this.siteDataRFID = data.transactionSiteStationViewModels;
      }
    }, (error: any) => {
      if(error.status === 401) {
        this.toastr.error(error.name, 'Error');
        this.loadingRFID = false;
      }
      else {
        this.loadingRFID = false;
        this.siteDataRFID = []
      }
    })
  }

  returnNumberPrice(number) {
    if (number === null)
      return 0.00
    return parseFloat(number).toFixed(2)
  }

  loadSiteStations() {
    this.stationData = []
    this.managementService.getStationList(this.siteDataNav.siteID).subscribe(data => {
      if (data.hasError === false) {
        this.stationData = data.stationViewModels
      }
    }, (error: any) => {
    })
  }

  getUnitsConsumedDataForSite() {
    this.managementService.getUnitsConsumedDataForSite(this.siteDataNav.siteID).subscribe(data => { 
      if(data.hasError === false) {
        this.unitsLoaded = true;
        this.unitsConsumedData = data;
      }
    })
  }
  getRevenueGeneratedDataForSite() {
    this.managementService.getRevenueGeneratedDataForSite(this.siteDataNav.siteID).subscribe(data => {
      if(data.hasError === false) {
        this.revenueLoaded = true;
        this.revenueGeneratedData = data;
      }
    })
  }

  onFilterTextBoxChanged() {
    this.gridOptions.api.setQuickFilter((<HTMLInputElement>document.getElementById('filter-text-box')).value);
  }


  onBtExport() {
    var fileName = 'Report_' + this.siteDataNav.siteName.replace(/\s/g, '') + '_' + moment(new Date()).format('DDMMHHmmss')
    var params = {
      suppressTextAsCDATA: true,
      allColumns:true,
      onlySelected: false,
      columnGroups: true,
      fileName: fileName,
      columnWidth: 100,
      rowHeight: 30,
    };
    this.gridApi.exportDataAsCsv(params);


    // var params = getParams();
    // this.gridApi.exportDataAsCsv(params);

  }

  checkRFID(isRFID) {
    console.log(isRFID)
    if(isRFID) {
      this.loadReportsRFID(null, null, null)
    }
    else {
      this.loadReports(null,null,null)
    }
  }
  
}



function getBooleanValue(checkboxSelector) {
  return document.querySelector(checkboxSelector).checked;
}
function getValue(inputSelector) {
  var text = inputSelector;
  console.log(text)
  switch (text) {
    case 'none':
      return;
    case 'tab':
      return '\t';
    case 'true':
      return true;
    case 'none':
      return;
    default:
      return text;
  }
}
function getParams() {
  return {
    suppressQuotes: getValue('default'),
    columnSeparator: '\t',
    suppressTextAsCDATA: true,
    columnWidth: 100,
    rowHeight: 30,
    columnGroups: true,
  };
}
