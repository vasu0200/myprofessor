import { UserRoleType, UserStatusType } from './enum';

export interface TypeOrmError {
	query: string;
	parameters: [];
	driverError: object;
	code: string;
	errno: number;
	sqlMessage: string;
	sqlState: string;
	index: number;
	sql: string;
}

export interface AuthEvents {
	ignoreAuthToken: boolean;
	role: UserRoleType;
}

export interface GoogleUserInfo {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	picture: string;
	locale: string;
}

export interface FacebookAccessToken {
	access_token: string;
	token_type: string;
	expires_in: string;
}

export interface FacebookUserInfo {
	id: string;
	email: string;
	first_name: string;
	last_name: string;
}

export interface LiveSession {
	meetingId: string;
	moderatorPass: string;
	attendeePass: string;
	name: string;
	meetingUrl: string;
}

export interface JoinMeetingModerator {
	meetingURL: string;
	internalMeetingID: string;
}
export interface UserInfoForLogin {
	userId: string;
	firstName: string;
	lastName: string;
	middleName: string;
	email: string;
	accountStatus: UserStatusType;
	gender: string;
	dob: Date;
	mobileNumber: string;
	profile_pic: string;
	roleId: string;
	roleName: string;
	roleDescription: string;
	universityId: string;
	collegeId: string;
	branchId: string;
	semesterId: string;
	sectionId: string;
	universityName: string;
	branchName: string;
	semesterName: string;
	password: string;
}

export interface SMSGatewayResponseData {
	Id: string;
	Ack: string;
	mobileNo: string;
}
