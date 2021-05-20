import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'resetemailsent.component.html',
  styleUrls: ['resetpassword.scss']
})
export class ResetEmailSentComponent {
  userEmail: any;
  constructor(
    private router: ActivatedRoute,
    private route: Router,
  ) { }

  ngOnInit() {
    this.userEmail = history.state.email;
  }

  censorWord = (str) => {
    return str[0] + "*".repeat(str.length - 2) + str.slice(-1);
  }

  censorEmail = (email) => {
    var arr = email.split("@");
    return this.censorWord(arr[0]) + "@" + this.censorWord(arr[1]);
  }
}
