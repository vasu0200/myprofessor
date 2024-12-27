import { Constants } from '@Utility/constants';

const SMSTemplates = [
	{
		code: Constants.SMSCode.MY_PROFESSOR_MOBILE_NUMBER_VERIFY,
		message: `{%Otp%} is the OTP for your Authentication with My Professor App - Via SmartGen`,
	},
	{
		code: Constants.SMSCode.MY_PROFESSOR_FORGOT_PASSWORD,
		message: `{%Otp%} is the OTP for your Authentication with My Professor App - Via SmartGen`,
	},
	{
		code: Constants.SMSCode.MY_PROFESSOR_WELCOME_MESSAGE,
		message: `Welcome to My Professor - Your Edvantage App. Your login info: {%UserInfo%} To download the android app or iOS {%AppDownloadInfo%} respectively Via SmartGen`,
	},
];
export { SMSTemplates };
