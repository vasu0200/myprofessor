export class Constants {
	public static MY_PROFESSOR_BOT = 'MY_PROFESSOR_BOT';
	public static MAX_LIMIT_FOR_LIST = 1000000;
	public static DEFAULT_QUERY_LIMIT = 20;
	public static SORT_ORDER_ASC: string = 'ASC';
	public static SORT_ORDER_DESC: string = 'DESC';
	public static DEFAULT_SECTION_NAME = 'Class A';
	public static RAZORPAY_BASE_CURRENCY = 'INR';
	public static JWT_TOKEN_EXPIRY_DAYS = 7;
	public static DEFAULT_PRE_AND_POST_ASSESSMENTS_QUESTIONS = 5;
	public static MAX_ATTEMPTS_FOR_TEST = 2;
	public static DEFAULT_USER_PRACTICE_QUESTIONS = 20;
	public static DEFAULT_REFERRAL_POINTS = 100;
	public static MIN_POINTS_FOR_PAYOUT = 500;
	public static DEFAULT_PASSWORD = 'Smart@123';
	public static SALT_ROUNDS = 10;

	// Error Exceptions
	public static SYSTEM_EXCEPTION_TYPES = {
		VALIDATION_ERROR: 'VALIDATION_ERROR',
		DATA_NOT_FOUND: 'DATA_NOT_FOUND',
		DUPLICATE_DATA: 'DUPLICATE_DATA',
		UNAUTHORIZED: 'UNAUTHORIZED',
		EXTERNAL_SERVICES_ERROR: 'EXTERNAL_SERVICES_ERROR',
		DEPENDENCY_ERROR: 'DEPENDENCY_ERROR',
	};

	public static Roles = {
		COLLEGE_ADMIN: 'College Admin',
		STUDENT: 'Student',
		GENERAL_STUDENT: 'General Student',
	};
	// Param Validators
	public static ParamValidator = {
		name: { type: 'string', min: 1, max: 200, pattern: '^([^0-9]*)$' },
		numericString: [
			{ type: 'string', numeric: true },
			{ type: 'number', positive: true, integer: true },
		],
		numericStringOptional: [
			{ type: 'string', numeric: true, optional: true },
			{ type: 'number', positive: true, integer: true, optional: true },
		],
	};

	// default pagination or serach parms
	public static DEFAULT_PAGINATION_PARAMS = {
		offset: Constants.ParamValidator.numericStringOptional,
		limit: Constants.ParamValidator.numericStringOptional,
	};

	public static FileTypes = {
		images: ['image/png', 'image/jpeg', 'image/jpg'],
	};

	public static StandardDbErrorCodes = {
		ER_DUP_ENTRY: 'Found Duplicate Entry for ',
		ER_NO_REFERENCED_ROW_2: 'Cannot perform this action, resource you are trying is not available, please referesh and try again.',
		ER_ROW_IS_REFERENCED_2: 'Cannot perform this action, this might impact data loss for another resources.',
		ER_DATA_TOO_LONG: 'Data too long for',
		UNKNOWN: 'Unknown DB Exception',
	};

	public static EmailCodes = {
		MY_PROFESSOR_EMAIL_VERIFY: 'MY_PROFESSOR_EMAIL_VERIFY',
		MY_PROFESSOR_FORGET_PASSWORD_VERIFY: 'MY_PROFESSOR_FORGET_PASSWORD_VERIFY',
		MY_PROFESSOR_CONFIRM_EMAIL: 'MY_PROFESSOR_CONFIRM_EMAIL',
		MY_PROFESSOR_WELCOME_EMAIL: 'MY_PROFESSOR_WELCOME_EMAIL',
		MY_PROFESSOR_PAYMENT_CONFIRMATION_EMAIL: 'MY_PROFESSOR_PAYMENT_CONFIRMATION_EMAIL',
		MY_PROFESSOR_CONTACT_EMAIL: 'MY_PROFESSOR_CONTACT_EMAIL',
	};

	public static SMSCode = {
		MY_PROFESSOR_MOBILE_NUMBER_VERIFY: 'MOBILE_NUMBER_VERIFY',
		MY_PROFESSOR_FORGOT_PASSWORD: 'FORGOT_PASSWORD',
		MY_PROFESSOR_WELCOME_MESSAGE: 'MY_PROFESSOR_WELCOME_MESSAGE',
	};

	public static NOTIFICATION_EVENTS = {
		PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
		PAYMENT_FAILED: 'PAYMENT_FAILED',
	};

	public static EventEmitters = {
		ManageUserAnalytics: 'manage.userAnalytics',
	};

	public static LeaderBoardRuleCodes = {
		TOPIC_COMPLETE: 'TOPIC_COMPLETE',
		DOC_COMPLETE: 'DOC_COMPLETE',
		ASSESSMENT_FAILURE: 'ASSESSMENT_FAILURE',
		EVERY_LOGIN: 'EVERY_LOGIN',
		FIRST_LOGIN: 'FIRST_LOGIN',
		VIDEO_COMPLETE: 'VIDEO_COMPLETE',
		OBJ_TYPE_ASSESSMENT: 'OBJ_TYPE_ASSESSMENT',
		YT_VIDEO_COMPLETE: 'YT_VIDEO_COMPLETE',
		TEACHING_VIDEO_COMPLETE: 'TEACHING_VIDEO_COMPLETE',
	};
}
