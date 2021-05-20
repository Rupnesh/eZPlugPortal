import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from './profile.service';

import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'profile.component.html'
})
export class ProfileComponent {

  profileForm: FormGroup;
  passwordForm: FormGroup;
  loading = false;
  loadingPassword = false;
  submitted = false;
  submittedPassword = false;
  returnUrl: string;
  error = '';
  show: boolean = false;
  isPasswordSame: any;
  profileLoaded: boolean = false;
  userID: any;

  showop: boolean = false;
  shownp: boolean = false;
  showcp: boolean = false;
  activeTab:string = "Profile"

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private toastr: ToastrService
  ) {



  }
  async ngOnInit() {

    this.profileForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      phone: ['', Validators.required], 
    });

    this.passwordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{6,}')]],
      confirmPassword: ['', Validators.required]
    },
      { validator: this.checkPassword('newPassword', 'confirmPassword') }
    );

    const userID = await JSON.parse(localStorage.getItem('userData'))

    this.profileLoaded = true;
    this.profileService.getUserData(userID.userId).subscribe(data => {
      if (data.hasError === false) {
        this.profileLoaded = false;
        this.userID = data.userId;
        this.profileForm.setValue({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email
        });
      }
    }, (error: any) => {
      this.toastr.error(error.error, 'Error');
      this.profileLoaded = false;
    })
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

  get f() { return this.profileForm.controls; }
  get p() { return this.passwordForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }
    this.profileForm.patchValue({ phone: this.profileForm.value.phone.substr(0, 16).replace(/\D+/g, '') })

    let data = { userId: this.userID, firstName: this.f.firstName.value, lastName: this.f.lastName.value, phone: this.f.phone.value }

    this.loading = true;
    this.profileService.updateUserData(data).subscribe(data => {
      if (data.hasError === false) {
        this.loading = false;
        this.toastr.success('Profile Updated', 'Success');
      }
    }, (error: any) => {
      this.toastr.error(error.error, 'Error');
      this.loading = false;
    })
  }

  onPasswordSubmit() {
    this.submittedPassword = true;

    if (this.passwordForm.invalid) {
      return;
    }
    this.loadingPassword = true;
    this.profileService.updateUserPassword(this.passwordForm.value).subscribe(data => {
      if (data.hasError === false) {
        this.loadingPassword = false;
        this.toastr.success('Password Updated', 'Success');
      }
    }, (error: any) => {
      this.toastr.error(error.error, 'Error');
      this.loadingPassword = false;
    })

  }

  textOpen(type) {
    if(type === 'op')
      this.showop = !this.showop;
    if(type === 'np')
      this.shownp = !this.shownp;
    if(type === 'cp')
      this.showcp = !this.showcp;
  }
}
