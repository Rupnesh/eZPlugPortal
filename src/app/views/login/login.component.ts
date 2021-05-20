import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../_services';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;

  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  userRoles: string[] = ['Super Admin', 'Admin', 'Distributor', 'Sales'];
  default: string = 'Super Admin';
  show: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      // userType: ['', Validators.required],
      rememberMe: ['',]

      // username: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      // password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}')]],
      
    });
    this.loginForm.controls['rememberMe'].setValue(true, {onlySelf: true});

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // console.log("return...", this.returnUrl)
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authenticationService.login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        data => {
          if(data.hasError === false ) {
            this.router.navigate(['/dashboard']);
            // this.router.navigate([this.returnUrl]);
            this.loading = false;
          }
        },
        error => {
          if(error.status === 0) {
            this.loading = false;
            this.toastr.error('Internet diconnected...', 'Error');
          }
          else {
            this.error = error;
            this.toastr.error(error.error.errorDescription, 'Error');
            this.loading = false;
          }
        });
  }

  btnClick() {
    this.router.navigateByUrl('/register');
  }

  textOpen() {
    this.show = !this.show;
  }

}
