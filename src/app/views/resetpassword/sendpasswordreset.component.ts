import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'sendpasswordreset.component.html',
  styleUrls: ['resetpassword.scss']
})
export class SendPasswordResetComponent {
  resetForm: FormGroup;

  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  userRoles: string[] = ['Super Admin', 'Admin', 'Distributor', 'Sales'];
  default: string = 'Super Admin';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', Validators.required]
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
    // this.router.navigateByUrl('/reset_email_sent', { state: { email: this.resetForm.controls.email.value } });

    this.loading = true;
    this.authenticationService.forgotPassword(this.resetForm.value)
      .pipe(first())
      .subscribe(
        data => {
          if(data.hasError === false)
            this.router.navigateByUrl('/reset_email_sent', { state: { email: this.resetForm.controls.email.value } });
        },
        error => {
          this.error = error;
          this.toastr.error(error.error.errorDescription, 'Error');
          this.loading = false;
        });
  }

  btnClick() {
    this.router.navigate(['register'], { queryParams: { email: this.resetForm.controls.email.value } });
    // this.router.navigateByUrl('/register');
  }
}
