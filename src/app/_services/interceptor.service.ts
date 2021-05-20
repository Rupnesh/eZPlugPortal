import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { User, Role } from '../_models';
import { Observable, of, throwError, BehaviorSubject } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{
  private currentUserSubject: BehaviorSubject<User>;
  constructor(public router: Router) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
  }
    handleError(error: HttpErrorResponse){
    return throwError(error);
  }
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>>{
    return next.handle(req).pipe(
      catchError((error) => {
        let handled: boolean = false;
        console.error(error);
        if (error instanceof HttpErrorResponse) {
          if (error.error instanceof ErrorEvent) {
            console.error("Error Event");
          } else {
            // console.log(`error status : ${error.status} ${error.statusText}`);
            switch (error.status) {
              case 401:      //login
                // this.router.navigateByUrl("/login");
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userData');
                localStorage.removeItem('token');
                this.currentUserSubject.next(null);
                this.router.navigateByUrl("/login");
                location.reload(true)
                handled = true;
                break;
              case 403:     //forbidden
                handled = true;
                break;
              
            }
          }
        }
        else {
          // console.error("Other Errors");
        }
 
        if (handled) {
          // console.log('return back ');
          return of(error);
        } else {
          // console.log('throw error back to to the subscriber');
          return throwError(error);
        }
 
      })
    )


  };
}