import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../_services';

import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  show: boolean = false;
  showcp: boolean = false;
  isPasswordSame: any;

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  };

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}')]],
      confirmPassword: ['', Validators.required]
    },
      { validator: this.checkPassword('password', 'confirmPassword') }
    );
  }

  checkPassword(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        this.isPasswordSame = (matchingControl.status == 'VALID') ? true : false;
      } else {
        matchingControl.setErrors(null);
        this.isPasswordSame = (matchingControl.status == 'VALID') ? true : false;
      }
    }
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    
    if (this.registerForm.invalid) {
      return;
    }
    this.registerForm.patchValue({phone: this.registerForm.value.phone.substr(0, 16).replace(/\D+/g, '')})

    this.loading = true;
    this.authenticationService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data.hasError === false) {
            this.loading = false;
            this.toastr.info('Please validate your email address. Kindly check your inbox.','Confirm')
          }
          else {
          }
        },
        error => {
          this.error = error;
          this.toastr.error(error.error.errorDescription, 'Error');
          this.loading = false;
        });
  }

  textOpen(type) {
    if(type === 'p')
      this.show = !this.show;
    if(type === 'cp')
      this.showcp = !this.showcp;
  }

}


