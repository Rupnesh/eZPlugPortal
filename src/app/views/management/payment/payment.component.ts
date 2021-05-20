import { Component } from '@angular/core';

@Component({
  templateUrl: 'payment.component.html'
})
export class PaymentComponent {

  dtOptions: DataTables.Settings = {};

  public data1 = [
    {name: 'Rupnesh', email: 'rupnesh@gmail.com', website:'rupnesh.com'},
    {name: 'Amar', email: 'amar@gmail.com', website:'amar.com'},
    {name: 'Ajay', email: 'ajay@gmail.com', website:'ajay.com'},
    {name: 'Alok', email: 'alok@gmail.com', website:'alok.com'},
  ];

  constructor() { }

}
