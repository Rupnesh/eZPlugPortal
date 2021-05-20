import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'resetpassword.component.html',
  styleUrls: ['resetpassword.scss']
})
export class ResetPasswordComponent {
  resetForm: FormGroup;

  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  resetEmail:any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({ 
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
    this.route.queryParams.subscribe(params => {
			this.resetEmail = params;
		});
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.resetForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }
    this.loading = true;
    
    let data = {email: this.resetEmail.email, token: this.resetEmail.token}
    data = {...data, ...this.resetForm.value}

    this.authenticationService.resetPassword(data)
      .pipe(first())
      .subscribe(
        data => {
        },
        error => {
          this.error = error;
          this.toastr.error(error.error.errorDescription, 'Error');
          this.loading = false;
        });
  }
}