import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
// import { environment } from '../../../environment';
import { environment } from '../../../environments/environment';
import { constString } from '../../const_string';

@Injectable({
	providedIn: 'root'
})
export class ManagementService {
	httpOptions: any;
	httpOptionsMulti:any;

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

				this.httpOptionsMulti = {
					headers: new HttpHeaders({
						'Authorization': `Bearer ${token}`
					})
				}
			}
		})
	}

	getData() {
		return this.http.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
	}

	//STATION
	public checkStationExists(stationName): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_STATION}${constString.IS_STATION_EXISTS}/${stationName}`, this.httpOptions);
	}
	public addStation(data): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH_STATION}${constString.ADD_STATION}`, data, this.httpOptions);
	}
	public updateStation(data): Observable<any> {
		return this.http.put<any>(`${environment.testUrl}${constString.PATH_STATION}${constString.UPDATE_STATION}`, data, this.httpOptions);
	}
	public deleteStation(data): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH_STATION}${constString.DELETE_STATION}`, data, this.httpOptions);
	}
	public getAllStations(): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_STATION}${constString.GET_ALL_STATION}`, this.httpOptions);
	}
	public getStationByID(stationId): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_STATION}${constString.GET_STATION_BY_ID}/${stationId}`, this.httpOptions);
	}
	public getAllStationTypes(): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_STATION}${constString.GET_ALL_STATION_TYPES}`, this.httpOptions);
	}
	public registerStationOnIOTHub(stationName): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_STATION}${constString.REGISTER_STATION_ON_IOT}/${stationName}`, this.httpOptions);
	}
	public getStationsWithPendingSites(): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_STATION}${constString.GET_STATIONS_WITH_PENDING_SITES}`, this.httpOptions);
	}
	public getStationsWithPendingUser(): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_STATION}${constString.GET_STATIONS_WITH_PENDING_USER}`, this.httpOptions);
	}

	//SITES
	public checkSiteExists(siteName): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.IS_SITE_EXISTS}/${siteName}`, this.httpOptions);
	}
	public getAllSites(): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.GET_ALL_SITES}`, this.httpOptions);
	}
	public filterSitesByUser(): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.FILTER_SITES_BY_USER}`, this.httpOptions);
	}
	public getSiteByID(siteID): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.GET_SITE_BY_ID}/${siteID}`, this.httpOptions);
	}
	public addSite(data): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.ADD_SITE}`, data, this.httpOptions);
	}
	public uploadSitePhoto(data, siteName): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.UPLOAD_PHOTO}/${siteName}`, data, this.httpOptionsMulti);
	}
	public getAllPhotosForSite(siteName): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.GET_ALL_PHOTOS}/${siteName}`, this.httpOptions);
	}
	public updateSite(data): Observable<any> {
		return this.http.put<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.UPDATE_SITE}`, data, this.httpOptions);
	}
	public deleteSite(data): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.DELETE_SITE}`, data, this.httpOptions);
	}
	public assignStationsToSite(data): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.ASSIGN_STATION_TO_SITE}`, data, this.httpOptions);
	}
	public unAssignStationsFromSite(data): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.UNASSIGN_STATION_FROM_SITE}`, data, this.httpOptions);
	}
	public assignUserToSite(data): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.ASSIGN_USERS_TO_SITE}`, data, this.httpOptions);
	}
	public unAssignUserFromSite(data): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.UNASSIGN_USERS_FROM_SITE}`, data, this.httpOptions);
	}

	public getAllPricingTypes(): Observable<any> {
    return this.http.get<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.GET_ALL_PRICING_TYPES}`, this.httpOptions);
  }
	public getAllSiteStationPricingRules(siteID): Observable<any> {
    return this.http.get<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.GET_ALL_SITE_STATION_PRICING_RULES}/${siteID}`, this.httpOptions);
  }
	public getAllSiteStationPricingRulesByID(id): Observable<any> {
    return this.http.get<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.GET_SITE_STATION_PRICING_RULE_BY_ID}/${id}`, this.httpOptions);
  }
	public addSiteStationPricingRules(data): Observable<any> {
    return this.http.post<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.ADD_SITE_STATION_PRICING_RULE}`, data, this.httpOptions);
  }
	public updateSiteStationPricingRules(data): Observable<any> {
    return this.http.put<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.UPDATE_SITE_STATION_PRICING_RULE}`, data, this.httpOptions);
  }
	public getAllTransactionsForSite(siteID, startDate, endDate, StationId): Observable<any> {
		if(startDate === 'Invalid date' || endDate === 'Invalid date')
			return this.http.get<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.GET_ALL_TRANSACTION_FOR_SITE}?SiteId=${siteID}&FromDate=&ToDate=&StationId=${StationId ? StationId : ''}`, this.httpOptions);
    else
			return this.http.get<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.GET_ALL_TRANSACTION_FOR_SITE}?SiteId=${siteID}&FromDate=${startDate ? startDate : ''}&ToDate=${endDate ? endDate : ''}&StationId=${StationId ? StationId : ''}`, this.httpOptions);

		// return this.http.get<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.GET_ALL_TRANSACTION_FOR_SITE}?SiteId=${siteID}&FromDate=${startDate ? startDate : ''}&ToDate=${endDate ? endDate : ''}&StationId=${StationId ? StationId : ''}`, this.httpOptions);
  }

	//RFID
	public getRFIDTransactionsForSite(siteID, startDate, endDate, StationId): Observable<any> {
		if(startDate === 'Invalid date' || endDate === 'Invalid date')
			return this.http.get<any>(`${environment.testUrl}${constString.PATH_RFID}${constString.GET_RFID_TRANSACTIONS_FOR_SITE}?SiteId=${siteID}&FromDate=&ToDate=&StationId=${StationId ? StationId : ''}`, this.httpOptions);
    else
			return this.http.get<any>(`${environment.testUrl}${constString.PATH_RFID}${constString.GET_RFID_TRANSACTIONS_FOR_SITE}?SiteId=${siteID}&FromDate=${startDate ? startDate : ''}&ToDate=${endDate ? endDate : ''}&StationId=${StationId ? StationId : ''}`, this.httpOptions);

		// return this.http.get<any>(`${environment.testUrl}${constString.PATH_RFID}${constString.GET_RFID_TRANSACTIONS_FOR_SITE}?SiteId=${siteID}`, this.httpOptions);
	}


	public deleteSiteStationPricingRules(data): Observable<any> {
    return this.http.put<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.DELETE_SITE_STATION_PRICING_RULE}`, data, this.httpOptions);
  }
	public getStationList(siteID): Observable<any> {
    return this.http.get<any>(`${environment.testUrl}${constString.PATH_STATION}${constString.GET_STATIONBY_SITEID}/${siteID}`, this.httpOptions);
  }

	public getUnitsConsumedDataForSite(siteID): Observable<any> {
    return this.http.get<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.GET_UNITS_CONSUMED_SITE}/${siteID}`, this.httpOptions);
  }
	public getRevenueGeneratedDataForSite(siteID): Observable<any> {
    return this.http.get<any>(`${environment.testUrl}${constString.PATH_SITE}${constString.GET_REVENUE_GENERATED_SITE}/${siteID}`, this.httpOptions);
  }


	

	//USERS
	public getAllUsersData(): Observable<any> { 
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_USER}${constString.FILTER_USER_LIST}`, this.httpOptions);
		// return this.http.get<any>(`${environment.testUrl}${constString.PATH_USER}${constString.GET_ALL_USERS}`, this.httpOptions);
	}
	public getUserByName(data): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_USER}${constString.GET_USERS_BY_NAME}/${data}`, this.httpOptions);
	}
	public getUsersForRole(): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_USER}${constString.GET_USERS_FOR_ROLE}/Distributor`, this.httpOptions);
	}
	public deleteUser(data): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH_USER}${constString.DELETE_USER}`, data, this.httpOptions);
	}
	public getDashboardSiteReport(): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_USER}${constString.GET_DASHBOARD_SITE_REPORT}`, this.httpOptions);
	}
	public filterRoleList(): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_USER}${constString.FILTER_ROLE_LIST}`, this.httpOptions);
	}

	public addUserData(data): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH_USER}${constString.ADD_USER}`, data, this.httpOptions);
	}
	public updateUserData(data): Observable<any> {
		return this.http.post<any>(`${environment.testUrl}${constString.PATH_USER}${constString.UPDATE_USER}`, data, this.httpOptions);
	}
	public getSiteAssignedToUser(userId): Observable<any> {
		return this.http.get<any>(`${environment.testUrl}${constString.PATH_USER}${constString.GET_SITE_ASSIGNED_TO_USER}/${userId}`, this.httpOptions);
	}

	
	

	async getObject(key) {
		const ret = await localStorage.getItem(key)
		return JSON.parse(ret);
	}

}
