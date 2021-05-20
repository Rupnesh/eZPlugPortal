import { AuthenticationService } from './../../_services/authentication.service';
import { LocationStrategy } from '@angular/common';
import { Component } from '@angular/core';
import { navItems } from '../../_nav';
import { distributorNavItems } from '../../distributor_nav';
import { siteUserNavItems } from '../../siteuser_nav';
import { siteOwnerNavItems } from '../../siteowner_nav';

// import { AuthenticationService } from '../../_services';
import { Router, ActivatedRoute } from '@angular/router';

import { User, Role } from '../../_models';
import { ToastrService } from 'ngx-toastr';
import { constString } from '../../const_string';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;

  public navItems: any;
  // public navItems = navItems;
  // currentUser: User;

  private currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;
  loadedUserRoles:any = []

  constructor(
    private router: Router, private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService
  ) {

    // this.authenticationService.currentUser.subscribe(x => {
    //   this.currentUser = x
    // });

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('userData')));
		this.currentUser = this.currentUserSubject.asObservable();

  }

  async ngOnInit() {
    let rolesArray = ["EV User", "Admin", "Site User", "Site Owner", "Super Admin", "Distributor"];

    // this.navItems = navItems;
    let userRole = this.currentUserSubject.value    
      
    if (userRole.roles[0] === rolesArray[0]) {
      this.navItems = navItems;
    }
    else if (userRole.roles[0] === rolesArray[1]) {
      this.navItems = navItems;
    }
    else if (userRole.roles[0] === rolesArray[2]) {
      this.navItems = siteUserNavItems;
    }
    else if (userRole.roles[0] === rolesArray[3]) {
      this.navItems = siteOwnerNavItems;
    }
    else if (userRole.roles[0] === rolesArray[4]) {
      this.navItems = navItems;
    }
    else if (userRole.roles[0] === rolesArray[5]) {
      this.navItems = distributorNavItems;
    }
    else if (userRole.roles[0] === rolesArray[6]) {
      this.navItems = distributorNavItems;
    }
  }

  getUserType() {
    return localStorage.getItem('user')
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  async logout() {
    let token = await JSON.parse(localStorage.getItem(constString.TOKEN))

    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to Logout ?')
			.then((confirmed) => { 
        if(confirmed) {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('userData');
          localStorage.removeItem('token');
          this.currentUserSubject.next(null);
          
          this.router.navigate(['/'], { replaceUrl: true});
          // window.location.reload()
        }

        // this.authenticationService.logout(token.token).subscribe(data => {
        //   if (data.hasError === false) {
        //     localStorage.removeItem('currentUser');
        //     localStorage.removeItem('userData');
        //     localStorage.removeItem('token');
            
        //     this.currentUserSubject.next(null);
        //     this.router.navigate(['/login']);
        //   }
        // }, (error: any) => {
        //   this.toastr.error(error.error, 'Error');
        // });
      })
      .catch(() => console.log('User dismissed the dialog.'));
      
    

  }

}
