import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// import { environment } from '../../../environment';
import { environment } from '../../../environments/environment';
import { constString } from '../../const_string';

@Injectable({ providedIn: 'root' })
export class ProfileService {
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
	public getUserData(userId): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH}${constString.GET_USER_BY_ID}/${userId}`, this.httpOptions);
	}
	public updateUserData(data): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH}${constString.UPDATE_USER}`, data, this.httpOptions);
	}
	public updateUserPassword(data): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH}${constString.UPDATE_PASSWORD}`, data, this.httpOptions);
	}

	// updateUserData(data) {
	// 	return this.http.post<any>(`${environment.testUrl}${constString.PATH}${constString.UPDATE_USER}`, data)
	// 		.pipe(map(user => {
	// 			if (user && user.token) {
	// 			}
	// 			return user;
	// 		}));
	// }

	async getObject(key) {
		const ret = await localStorage.getItem(key)
		return JSON.parse(ret);
	}

}