import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { User } from './UserModal';
import { map } from 'rxjs/operators';
// import { environment } from '../../../environment';
import { environment } from '../../../environments/environment';
import { constString } from '../../const_string';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  publicUrl:any = "https://jsonplaceholder.typicode.com/todos?_limit=5";
  httpOptions: any;
  constructor(private http: HttpClient) {
		this.getObject(constString.TOKEN).then(data => {
			if (data) {
				let token = data.token;
				this.httpOptions = {
					headers: new HttpHeaders({
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${token}`
					})
				}
			}
		})
	}


  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .pipe(map((users: User[]) => users.map(user => new User(user))));
  }
  getDashboardSummary1(): Observable<User[]> {
    return this.http
      .get<User[]>('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .pipe(map((users: User[]) => users.map(user => new User(user))));
  }
  public getDashboardSiteReport(): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_USER}${constString.GET_DASHBOARD_SITE_REPORT}`, this.httpOptions);
	}
  public getDashboardSummary(): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_USER}${constString.GET_DASHBOARD_SUMMARY}`, this.httpOptions);
	}
  

  async getObject(key) {
		const ret = await localStorage.getItem(key)
		return JSON.parse(ret);
	}


}
