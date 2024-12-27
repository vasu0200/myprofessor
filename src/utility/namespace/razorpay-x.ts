import {
	RazorpayPayoutModeType,
	RazorpayXContactType,
	RazorpayXFundAccountType,
	RazorpayXPayoutPurposeType,
	RazorpayXPayoutStatusType,
	RazorpayXPayoutUrlStatusType,
} from '@Utility/enum';
import { RazorpayUtils } from './razorpay';

export namespace RazorpayXUtils {
	export interface CreateContactRequestParams {
		name: string;
		email: string;
		contact: string;
		type: RazorpayXContactType;
		reference_id: string;
		notes: {};
	}

	export interface CreateContactResponseParams {
		id: string;
		entity: string;
		name: string;
		contact: string;
		email: string;
		type: RazorpayXContactType;
		reference_id: string;
		batch_id: string;
		active: boolean;
		notes: {};
		created_at: number;
	}

	export interface CreateBankFundAccountRequestParams {
		contact_id: string;
		account_type: RazorpayXFundAccountType;
		bank_account: {
			name: string;
			ifsc: string;
			account_number: string;
		};
	}

	export interface CreateVpaFundAccountRequestParams {
		contact_id: string;
		account_type: RazorpayXFundAccountType;
		vpa: {
			address: string;
		};
	}

	export interface CreateFundAccountResponseParams {
		id: string;
		entity: string;
		contact_id: string;
		account_type: RazorpayXFundAccountType;
		bank_account: {
			name: string;
			ifsc: string;
			account_number: string;
			bank_name: string;
			notes: [];
		};
		vpa: {
			username: string;
			handle: string;
			address: string;
		};
		active: boolean;
		batch_id: string;
		created_at: number;
	}

	export interface CreatePayoutUrlRequestParams {
		account_number: string;
		contact: {
			name: string;
			email: string;
			contact: string;
			type: RazorpayXContactType;
		};
		amount: number;
		currency: string;
		purpose: RazorpayXPayoutPurposeType;
		description: string;
		receipt: string;
		send_sms: boolean;
		send_email: boolean;
		notes: {};
		expire_by: number;
	}

	export interface CreatePayoutUrlResponseParams {
		id: string;
		entity: string;
		contact_id: string;
		contact: {
			name: string;
			email: string;
			contact: string;
			type: RazorpayXContactType;
		};
		fund_account_id: null;
		purpose: RazorpayXPayoutPurposeType;
		status: RazorpayXPayoutUrlStatusType;
		amount: number;
		currency: string;
		description: string;
		attempt_count: number;
		receipt: string;
		notes: {};
		short_url: string;
		send_sms: boolean;
		send_email: boolean;
		cancelled_at: number;
		created_at: number;
		expire_by: number;
		expired_at: number;
	}

	export interface CreatePayoutRequestParams {
		account_number: string;
		fund_account_id: string;
		amount: number;
		currency: string;
		mode: RazorpayPayoutModeType;
		purpose: RazorpayXPayoutPurposeType;
		queue_if_low_balance: boolean;
		reference_id: string;
		narration: string;
		notes: {};
	}

	export interface CreatePayoutResponseParams {
		id: string;
		entity: string;
		fund_account_id: string;
		amount: number;
		currency: string;
		notes: {};
		fees: number;
		tax: number;
		status: RazorpayXPayoutStatusType;
		utr: string;
		mode: RazorpayPayoutModeType;
		purpose: RazorpayXPayoutPurposeType;
		reference_id: string;
		narration: string;
		batch_id: string;
		failure_reason: string;
		status_details: {
			description: string;
			source: string;
			reason: string;
		};
		created_at: number;
	}

	export interface CapturePayoutWebhookParams extends RazorpayUtils.WebhookEventParams {
		payload: {
			payout: {
				entity: CreatePayoutResponseParams;
			};
		};
	}

	export interface ErrorResponse {
		statusCode: number;
		error: Error;
	}

	interface Error {
		code: string;
		description: string;
		source: string;
		step: string;
		reason: string;
		metadata: {};
		field: string;
	}
}
