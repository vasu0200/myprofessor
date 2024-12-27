export enum UserStatusType {
	Active = 'active',
	Disabled = 'disabled',
	InActive = 'in_active',
	RegistrationInProgress = 'registration_inprogress',
	AccountSetupInProgress = 'account_setup_inprogress',
	WebAccountSetupInProgress='web_account_setup_inprogress',
}

export enum SessionStatusType {
	Active = 'active',
	LoggedOut = 'logged_out',
	Expired = 'expired',
	Superceded = 'superceded',
}

export enum RegistrationSource {
	System = 'system',
	Gmail = 'gmail',
	Facebook = 'facebook',
	LinkedIn = 'linkedin',
}

export enum DeviceType {
	Web = 'web',
	Android = 'android',
	IOS = 'ios',
}

export enum LoginResponseType {
	SessionExists = 'session_exists',
}

export enum PlatformType {
	Web = 'web',
	Mobile = 'mobile',
}

export enum PushNotificationType {
	Notification = 'notification',
	Announcement = 'announcement',
}

export enum ActivityCodeType {
	Post = 'post',
	Pre = 'pre',
	Pdf = 'pdf',
	Web = 'web',
	Obj = 'obj',
	Video = 'video',
	Youtube = 'youtube',
	Game = 'game',
	Sub = 'sub',
	Html5 = 'html5',
	ConceptualVideo = 'conceptual_video',
	ExploratoryLearning = 'exploratory_learning',
}

export enum QuestionType {
	Remember = 'remember',
	Understand = 'understand',
	Apply = 'apply',
	Analyze = 'analyze',
	Evaluate = 'evaluate',
	Create = 'create',
}

export enum DiffLevel {
	Easy = 'easy', // 30sec
	Medium = 'medium', // 45sec
	Hard = 'hard', // 60 sec
}

export enum UserRoleType {
	GeneralStudent = 'General Student',
	Student = 'Student',
	Professor = 'Professor',
	CollegeAdmin = 'College Admin',
	SuperAdmin = 'Super Admin',
	CEO = 'CEO',
	SubjectMatterExpert = 'Subject Matter Expert',
	ChannelPartner = 'Channel Partner',
}

export enum PromoCodeType {
	Money = 'money',
	Percentage = 'percentage',
}

export enum PromoCodeRedeemStatus {
	Pending = 'pending',
	Failed = 'failed',
	Success = 'success',
}

export enum QuestionAnswerType {
	YesNo = 'YesNo',
	Star5 = '5Star',
	Star10 = '10Star',
}

export enum AttendeesRegisterType {
	Login = 'login',
	Logout = 'logout',
}

export enum NotificationTypeEnum {
	Notification = 'notification',
	Announcement = 'announcement',
}

export enum NotificationType {
	AnnouncementCreated = 'announcement_created',
	AnnouncementUpdated = 'announcement_updated',
	LiveClassCreated = 'liveclass_created',
	LiveClassUpdated = 'liveclass_updated',
	TopicCreated = 'topic_created',
}

export enum NotificationActionType {
	Create = 'create',
	Update = 'update',
	Delete = 'delete',
	Warning = 'warning',
	Error = 'Error',
}

export enum LoggerRequestType {
	APIRequest = 'request',
	APIResponse = 'response',
	APIError = 'error',
}

export enum SSOType {
	Google = 'google',
	Facebook = 'facebook',
}

export enum OtpStatus {
	Sent = 'sent',
	Validated = 'validated',
	Expired = 'expired',
}

export enum OtpSourceType {
	Mobile = 'mobile',
	Email = 'email',
}

export enum SMSStatus {
	Sent = 'sent',
	Failure = 'failure',
}

export enum ExternalServiceType {
	Razorpay = 'razorpay',
}

export enum PaymentRequestType {
	Subscription = 'subscription',
}

export enum RazorpayOrderStatusType {
	Created = 'created',
	Attempted = 'attempted',
	Paid = 'paid',
}

export enum PreviousQuestionPaperMapperStatus {
	Active = 'active',
	InActive = 'in_active',
}

export enum PreviousQuestionPaperTestType {
	Objective = 'objective',
	Subjective = 'subjective',
}

export enum RazorpayPaymentStatusType {
	Created = 'created',
	Attempted = 'authorized',
	Captured = 'captured',
	Refunded = 'refunded',
	Failed = 'failed',
}

export enum RazorpayPaymentMethodType {
	Card = 'card',
	NetBanking = 'netbanking',
	Wallet = 'wallet',
	EMI = 'emi',
	UPI = 'upi',
}

export enum RazorpayPaymentRefundStatusType {
	Null = 'null',
	Partial = 'partial',
	Full = 'full',
}

export enum ActivityStatus {
	NotStarted = 'not_started',
	InProgress = 'in_progress',
	Completed = 'completed',
}

export enum UserTestType {
	Subject = 'Subject',
	Chapter = 'Chapter',
	Topic = 'Topic',
	Video = 'Video',
	QuestionPaper = 'QuestionPaper',
}

export enum TestAnalysisType {
	Poor = 'Poor',
	Average = 'Average',
	Fair = 'Fair',
	Good = 'Good',
}

export enum QuestionAnalysisType {
	Fast = 'Lightning Fast',
	OnTime = 'What a Timing/ Shot',
	ExtraInnings = 'Extra Innings/ Time',
	Lost = 'Lost',
	ExtraTime = 'Extra Time',
	UnAnswered = 'Un Answered',
}

export enum CronStatus {
	Success = 'success',
	Failure = 'failure',
}

export enum StepupProductType {
	StepUp = 'StepUp',
	StepUpPro = 'StepUpPro',
	FourteenDaysTrail = '14 Days Trail',
}

export enum SchoolStatusType {
	Active = 'active',
	InActive = 'in_active',
}

export enum ActivationCardStatusType {
	Active = 'active',
	InActive = 'in_active',
	Used = 'used',
	Expired = 'expired',
}

export enum PaymentModeType {
	Razorpay = 'razorpay',
	ActivationCard = 'activation_card',
}

export enum UserPackageStatusType {
	Free = 'free',
	Active = 'active',
	Expired = 'expired',
}

export enum UserPaymentStatusType {
	NotStarted = 'payment_not_started',
	Initiated = 'payment_initiated',
	InProgress = 'payment_in_progress',
	Success = 'payment_success',
	Failed = 'payment_failed',
	Refund = 'payment_refunded',
}

export enum PaymentRequestType {
	Package = 'package',
}

export enum CampaignStatus {
	NotStarted = 'not_started',
	Active = 'active',
	Expired = 'expired',
	Paused = 'paused',
}

export enum CampaignType {
	TimeBound = 'time_bound',
	Infinite = 'infinite',
}

export enum RewardType {
	Cash = 'cash',
	Discount = 'discount',
	RewardPoints = 'reward_points',
}

export enum CommissionType {
	Fixed = 'fixed',
	Percentage = 'percentage',
}

export enum CashWithdrawableType {
	WithDrawable = 'withdrawable',
	NonWithDrawable = 'non_withdrawable',
}

export enum MarketingType {
	ReferAndEarn = 'refer_and_earn',
	InfluencersMarketing = 'influencers_marketing',
}

export enum RegistrationInviteStatusType {
	Sent = 'sent',
	Accepted = 'accepted',
}

export enum RazorpayXContactType {
	Vendor = 'vendor',
	Customer = 'customer',
	Employee = 'employee',
	Self = 'self',
}

export enum RazorpayXFundAccountType {
	BankAccount = 'bank_account',
	Vpa = 'vpa',
	Card = 'cards',
	Wallet = 'wallet',
}

export enum RazorpayXPayoutPurposeType {
	Refund = 'refund',
	cashback = 'cashback',
	Payout = 'payout',
	Salary = 'salary',
	UtilityBill = 'utility bill',
	VendorBill = 'vendor bill',
}

export enum RazorpayXPayoutUrlStatusType {
	Pending = 'pending',
	Issued = 'issued',
	Processing = 'processing',
	Processed = 'processed',
	Cancelled = 'cancelled',
	Rejected = 'rejected',
}

export enum RazorpayPayoutModeType {
	NEFT = 'NEFT',
	RTGS = 'RTGS',
	IMPS = 'IMPS',
	Card = 'card',
	UPI = 'UPI',
	AmazonPay = 'amazonpay',
}

export enum RazorpayXPayoutStatusType {
	Queued = 'queued',
	Pending = 'pending',
	Rejected = 'rejected',
	Processing = 'processing',
	Processed = 'processed',
	Cancelled = 'cancelled',
	Reversed = 'reversed',
}

export enum UserScheduleType {
	Topic = 'topic',
}

export enum ImportType {
	Student = 'Student',
	Professor = 'Professor',
}

export enum ImportStatusType {
	NotStarted = 'not_started',
	InProgress = 'in_progress',
	Completed = 'completed',
	Failed = 'failed',
}

export enum TargetSourceType {
	Admin = 'admin',
	Professor = 'professor'
}

export enum UserProgressAnalyticsType {
	Topic = 'topic',
	Chapter = 'chapter',
}
