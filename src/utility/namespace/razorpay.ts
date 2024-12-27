import {
	PaymentRequestType,
	RazorpayOrderStatusType,
	RazorpayPaymentMethodType,
	RazorpayPaymentRefundStatusType,
	RazorpayPaymentStatusType,
} from '@Utility/enum';

export namespace RazorpayUtils {
	export interface PaymentRequestParams {
		requesterId: string;
		requestType: PaymentRequestType;
		requestTypeId: string;
	}

	export interface CreateOrderRequestParams {
		amount: number;
		currency: string;
		receipt: string;
		notes: PaymentRequestParams;
	}

	export interface CreateOrderResponseParams {
		id: string;
		entity: string;
		amount: number;
		amount_paid: number;
		amount_due: number;
		currency: string;
		receipt: string;
		status: RazorpayOrderStatusType;
		attempts: number;
		notes: PaymentRequestParams;
		created_at: number;
	}

	export interface WebhookEventParams {
		entity: string;
		account_id: string;
		event: string;
		contains: string[];
		created_at: number;
	}

	export interface OrderWebhookParams extends WebhookEventParams {
		payload: {
			payment: {
				entity: PaymentResponseParams;
			};
			order: {
				entity: CreateOrderResponseParams;
			};
		};
	}

	export interface PaymentWebhookParams extends WebhookEventParams {
		payload: {
			payment: {
				entity: PaymentResponseParams;
			};
		};
	}

	export interface PaymentResponseParams {
		id: string;
		entity: string;
		amount: number;
		currency: string;
		status: RazorpayPaymentStatusType;
		order_id: string;
		invoice_id: string;
		international: boolean;
		method: RazorpayPaymentMethodType;
		amount_refunded: number;
		refund_status: RazorpayPaymentRefundStatusType;
		captured: boolean;
		description: string;
		card_id: string;
		bank: string;
		wallet: null;
		vpa: string;
		email: string;
		contact: string;
		notes: PaymentRequestParams;
		fee: number;
		tax: number;
		error_code: string;
		error_description: string;
		error_source: string;
		error_step: string;
		error_reason: string;
		acquirer_data: object;
		created_at: number;
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
