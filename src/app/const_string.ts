export const constString = {
	PATH: '/api/Account',

	//Authorization
	LOGIN: '/Login',
	REGISTER: '/Register',
	CONFIRM_EMAIL: '/ConfirmEmail',
	FORGOT_PASSWORD: '/ForgotPassword',
	RESET_PASSWORD: '/ResetPassword',
	UPDATE_USER: '/UpdateUserDetails',
	ADD_USER: '/CreateUser',
	UPDATE_PASSWORD: '/ChangePassword',
	LOGOUT: '/Logout',

	//Management USER
	GET_ALL_USERS: '/GetAllUsers',
	FILTER_USER_LIST :'/FilterUserList',
	GET_USERS_BY_NAME: '/GetUsersByName',
	DELETE_USER: '/DeleteUser',

	//Management STATION
	PATH_STATION: '/api/Station',
	IS_STATION_EXISTS: '/IsStationExists',
	ADD_STATION: '/AddStation',
	UPDATE_STATION: '/UpdateStation',
	DELETE_STATION: '/DeleteStation',
	GET_ALL_STATION: '/GetAllStations',
	GET_STATION_BY_ID: '/GetStationByStationId',
	GET_STATION_BY_NAME: '/GetStationsByStationName',
	GET_ALL_STATION_TYPES: '/GetAllStationTypes',
	REGISTER_STATION_ON_IOT: '/RegisterStationOnIoTHub',
	GET_STATIONBY_SITEID: "/GetStationsBySiteId",
	GET_STATIONS_WITH_PENDING_SITES: '/GetStationsWithPendingSiteAssignment',
	GET_STATIONS_WITH_PENDING_USER: '/GetStationsWithPendingUserAssignment',

	//Management SITE
	PATH_SITE: '/api/Site',
	IS_SITE_EXISTS: '/IsSiteExists',
	GET_ALL_SITES:'/GetAllSites',
	ADD_SITE: '/AddSite',
	UPLOAD_SITE_PHOTO: '/UploadSitePhoto',
	UPLOAD_PHOTO: '/UploadPhoto',
	GET_ALL_PHOTOS: '/GetAllPhotosForSite',
	UPDATE_SITE: '/UpdateSite',
	DELETE_SITE: '/DeleteSite',
	GET_SITE_BY_ID: '/GetSiteById',
	ASSIGN_STATION_TO_SITE: '/AssignStationsToSite',
	UNASSIGN_STATION_FROM_SITE: '/UnassignStationsFromSite',
	FILTER_SITES_BY_USER: '/FilterSitesByUser',
	ASSIGN_USERS_TO_SITE: '/AssignUsersToSite',
	UNASSIGN_USERS_FROM_SITE: '/UnassignUsersFromSite',
	GET_ALL_TRANSACTION_FOR_SITE: '/GetAllTransactionsForSite',

	GET_ALL_PRICING_TYPES: '/GetAllPricingTypes',
	ADD_SITE_STATION_PRICING_RULE: '/AddSiteStationPricingRule',
	UPDATE_SITE_STATION_PRICING_RULE: '/UpdateSiteStationPricingRule',
	DELETE_SITE_STATION_PRICING_RULE: '/DeleteSiteStationPricingRule',
	GET_SITE_STATION_PRICING_RULE_BY_ID: '/GetSiteStationPricingRuleById',
	GET_ALL_SITE_STATION_PRICING_RULES: '/GetAllSiteStationPricingRules',

	GET_UNITS_CONSUMED_SITE: '/GetUnitsConsumedDataForSite',
	GET_REVENUE_GENERATED_SITE: '/GetRevenueGeneratedDataForSite',


	//USER API
	PATH_USER: '/api/User',
	GET_USERS_FOR_ROLE: '/GetAllUsersForRole',
	ASSIGN_ROLE: '/AssignRole',
	UNASSIGN_ROLE: '/UnassignRole',
	GET_ROLES_ASSIGNED_TO_USER: '/GetRolesAssignedToUser',
	FILTER_ROLE_LIST: '/FilterRoleList',
	GET_DASHBOARD_SUMMARY: "/GetDashboardSummary",
	GET_DASHBOARD_SITE_REPORT: "/GetDashboardSiteReport",
	GET_SITE_ASSIGNED_TO_USER: "/GetSitesAssignedToUser",


	//Management Profile
	GET_USER_BY_ID: '/GetUserById',

	//RFID
	PATH_RFID: '/api/RFID',
	GET_RFID_TRANSACTIONS_FOR_SITE: '/GetRFIDTransactionsForSite',

	//Storage Keys
	TOKEN: 'token',
	USER_DATA: 'userData',
	CURRENT_USER: 'currentUser' 
}