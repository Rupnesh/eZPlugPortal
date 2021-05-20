import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// import { environment } from '../../environment';
import { environment } from '../../environments/environment';
import { User } from '../_models';
import { constString } from '../const_string';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;

	private currentUserRoleSubject: BehaviorSubject<User>;
	public currentUserRole: Observable<User>;
	httpOptions: any;

	constructor(private http: HttpClient) {
		this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('token')));
		this.currentUser = this.currentUserSubject.asObservable();

		this.currentUserRoleSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('userData')));
		this.currentUserRole = this.currentUserRoleSubject.asObservable();

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

	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}
	public get currentUserRoleValue(): User {
		return this.currentUserRoleSubject.value;
	}
	async getObject(key) {
		const ret = await localStorage.getItem(key)
		return JSON.parse(ret);
	}

	public filterRoleList(): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_USER}${constString.FILTER_ROLE_LIST}`, this.httpOptions);
	}

	login(data) {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH}${constString.LOGIN}`, data)
			.pipe(map(user => {
				if (user && user.accessToken.token) {
					localStorage.setItem('token', JSON.stringify(user.accessToken));
					localStorage.setItem('userData', JSON.stringify(user.user));
					this.currentUserSubject.next(user);
				}
				return user;
			}));
	}

	// login(username: string, password: string) {
	// 	console.log(username, ' ', password)
	//     return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
	//         .pipe(map(user => {
	//             if (user && user.token) {
	//                 localStorage.setItem('currentUser', JSON.stringify(user));
	//                 this.currentUserSubject.next(user);
	//             }

	//             return user;
	//         }));
	// }

	

	register(data) {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH}${constString.REGISTER}`, data)
			.pipe(map(user => {
				if (user && user.token) {
					localStorage.setItem('currentUser', JSON.stringify(user));
					this.currentUserSubject.next(user);
				}
				return user;
			}));
	}

	confirmEmail(data) {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH}${constString.CONFIRM_EMAIL}?token=${data.token}&email=${data.email}`)
			.pipe(map(res => {
				if (res)
					return res;
			}));
	}
	forgotPassword(data) {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH}${constString.FORGOT_PASSWORD}`, data)
			.pipe(map(res => {
				if (res)
					return res;
			}));
	} 
	resetPassword(data) {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH}${constString.RESET_PASSWORD}`, data)
			.pipe(map(res => {
				if (res)
					return res;
			}));
	}


	logout(token): Observable<any> {
		this.currentUserSubject.next(null);
		this.httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			})
		}
		return this.http.post<any>(`${environment.testUrl}${constString.PATH}${constString.LOGOUT}`, null, this.httpOptions);
	}

}