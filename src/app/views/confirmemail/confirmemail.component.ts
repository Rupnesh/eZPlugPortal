import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../_services';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../environment';
import { constString } from '../../const_string';
@Component({
	selector: 'app-dashboard',
	templateUrl: 'confirmemail.component.html',
	styleUrls: ['confirmemail.component.scss']
})
export class ConfirmEmailComponent {
	confirmEmail: any = [];
	loading = false;
	redirectMessage: any;
	confirmationLink:any;
	constructor(
		private router: ActivatedRoute,
		private route: Router,
		private authenticationService: AuthenticationService,
		private toastr: ToastrService
	) {

	}

	ngOnInit() {
		this.router.queryParams.subscribe(params => {
			this.confirmEmail = params;
		});
		// this.confirmEmail = {
		// 	token: "CfDJ8Eh7aMD6pbtIsLbq6Eu%2FgjOEolMGDU4svm0ePd6A2XK62P0LYv1i%2FoHCG1YT2LuWH188nHos%2FhX7zn9YaR1zgGhFJhvLmtH4zp8xe3Sr4NX80E9FPIFABZGQDa3QbTQAGhlOZkZ7BTKIhWcnM2LAJRdxEGsOUobXBUNB2Pen4wcuyDl%2BGPSPHXqnw6g%2BqwgWnJbCGqZJXGV9rxAXOgav2NWkvn2JmSofaNqEja6CY5cjAlNYPYhljSplTI4Eg7T0WQ%3D%3D",
		// 	email: "rupnesh@ztric.com"
		// }
		this.confirmationLink = `${environment.testUrl}${constString.PATH}${constString.CONFIRM_EMAIL}?token=${this.confirmEmail.token}&email=${this.confirmEmail.email}`
	}

	onSubmit() {
		this.loading = true;
		this.authenticationService.confirmEmail(this.confirmEmail)
			.pipe(first())
			.subscribe(
				data => {
					if (data.hasError === false) {
						this.loading = false;
						this.toastr.success('Email verified!!!', 'Success');
						this.redirectMessage = "Email successfully verified, click here to "
						// setTimeout(() => {
						// 	this.route.navigate(['/login']);
						// }, 3000)

					}
					else {
					}
				},
				error => {
					this.toastr.error(error.error.errorDescription, 'Error');
					this.loading = false;
				});
	}
}