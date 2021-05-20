import { Component, OnInit } from '@angular/core';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

import { ToastrService } from 'ngx-toastr';
import { constString } from '../../const_string';
import { ManagementService } from '../management/management.service';

@Component({
	templateUrl: 'table.actions.html',
})
export class TableActionsComponent implements OnInit {
	data: any;
	params: any;
	constructor(private confirmationDialogService: ConfirmationDialogService,
		private service: ManagementService,
    private toastr: ToastrService,) { }

	agInit(params) {
		this.params = params;
		this.data = params.value;
	}

	ngOnInit() { }

	editRow() {
		this.params.clicked(this.params.value);
		// let rowData = this.params;
		// let i = rowData.rowIndex;
		// console.log(rowData);
	}

	public deleteRow(ev) {
		let rowData = this.params;
		this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete ?')
			.then((confirmed) => {

				this.service.deleteUser(rowData.data.userId).subscribe(data => {
          if (data.hasError === false) {
						this.toastr.success('Record Deleted!!!', 'Success');
          }
        }, (error: any) => {
          this.toastr.error(error.error, 'Error');
        });
			
			})
			.catch(() => console.log('User dismissed the dialog'));
	}
	onClick(ev) {

	}

	// deleteRow() {
	// 	let rowData = this.params;
	// 	console.log(rowData);
	// }
}