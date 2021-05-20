import { AuthenticationService } from './_services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { User, Role } from './_models';
import { constString } from './const_string';
import { environment } from './../environments/environment';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  currentUser: User;
  title = environment.title;

  // constructor(private router: Router) { }
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x
    });
  }

  get isAdmin() {
    return this.currentUser && this.currentUser.roles === Role.Admin;
  }

  

  async ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    // let user = await this.authenticationService.getObject(constString.TOKEN)
    // if(user) {
    //   this.router.navigate(['/'])
    // }
  }
}
