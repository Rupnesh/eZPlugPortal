// Author: T4professor

import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams, IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-button-renderer',
  templateUrl: 'table.actions.html',
//   template: `
//     <button type="button" (click)="onClick($event)">{{label}}</button>
//     `
})

export class ButtonRendererComponent implements ICellRendererAngularComp {

  params;
  label: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      const params = {
        event: $event,
        rowData: this.params.node.data
      }
      this.params.onClick(params);

    }
  }

  deleteRow($event) {
    this.params.context.componentParent.editUser(this.params.data.id);
    
    // if (this.params.onClick instanceof Function) {
    //     const params = {
    //       event: $event,
    //       rowData: this.params.node.data
    //     }
    //     this.params.onClick(params);
    //     return true
    //   }

  }
}