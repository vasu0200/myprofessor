import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import moment from 'moment';
import { ErrorHelper } from './error-helper';
import { ContextWrapper } from './molecular-helper';
import uuidv1 from 'uuid/v1';
import randomstring from 'randomstring';
import { OtpSourceType } from '@Utility/enum';
import { GenericObject } from 'moleculer';
import { EmailTemplates } from 'src/configs/email-templates';
import { SMSTemplates } from 'src/configs/sms-templates';
import bcrypt from "bcrypt";

export default class SystemHelper {
	constructor() {}

	public static getDateTime(): string {
		return moment().format('DD-MM-YYYY HH:mm:ss');
	}

	public static getUUID(): string {
		return uuidv1();
	}

	public static getOffsetAndLimit(offset: number, limit: number): { offset: number; limit: number } {
		offset = offset ? offset : 0;
		limit = limit ? limit : Constants.DEFAULT_QUERY_LIMIT;
		return { offset, limit };
	}

	public static checkAndExtractDataURL(
		dataUrl: string,
		ctx: ContextWrapper,
		targetContentTypes: string[] = [],
		targetSize: number = 10,
	): { base64Url: string; contentType: string } {
		let base64Url = '';
		let contentType = ctx.params.contentType ? ctx.params.contentType : 'application/pdf';

		if (dataUrl.split(',').length <= 1) {
			base64Url = dataUrl.split(',')[0];
			return { base64Url, contentType };
		}
		base64Url = dataUrl.split(',')[1];
		contentType = dataUrl.split(',')[0].split(':')[1].split(';')[0];

		// check file size
		this.checkFileSize(base64Url, targetSize);

		// check file type
		this.checkFileType(contentType, targetContentTypes);

		return { base64Url, contentType };
	}

	public static checkFileSize(base64: string, targetSize: number = 10) {
		const actualSize: number = Math.ceil((Buffer.from(base64).byteLength / 1024) * (3 / 4));
		if (Math.ceil(actualSize / 1000) > targetSize) {
			ErrorHelper.throwError(Messages.FILE_SIZE_LIMIT_EXCEEDED, 400);
		}
	}

	public static checkFileType(contentType: string, targetContentTypes: string[]) {
		if (!targetContentTypes.length) {
			return;
		}

		if (!targetContentTypes.some((e) => e == contentType)) {
			ErrorHelper.throwError('Invalid file format', 401, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}
	}

	public static checkUrl(targetString: string): boolean {
		if (!targetString) return true;

		const urlPattern = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
		return urlPattern.test(targetString);
	}

	public static ignoreLoggerFields(reqBody: any) {
		const fieldsToIgnore: string[] = ['image', 'logo', 'fileData'];
		if (typeof reqBody == 'object') {
			if (Array.isArray(reqBody.items)) {
				reqBody.items.forEach((e, index) => {
					fieldsToIgnore.forEach((f) => {
						delete reqBody.items[index][f];
					});
				});
			} else {
				fieldsToIgnore.forEach((e) => {
					delete reqBody[e];
				});
			}
		}

		return reqBody;
	}

	public static getMessageBodyWithParams(body: string, params: Map<string, any>): string {
		let bodyWithParams = body;

		params.forEach((value: any, key: string) => {
			bodyWithParams = bodyWithParams.replace(new RegExp(`{%${key}%}`, 'g'), value);
		});

		return bodyWithParams;
	}

	public static getRandomNumber(length: number): string {
		return randomstring.generate({
			length: length,
			charset: 'numeric',
		});
	}

	public static handleEmailAndSmsMessageBody(sourceType: OtpSourceType, targetParams: GenericObject, messageCode: string) {
		const keys: string[] = Object.keys(targetParams);
		const params: Map<string, any> = new Map();
		let messageBody: string = '';
		let messageSubject: string = '';

		if (sourceType == OtpSourceType.Email) {
			const emailTemplate = EmailTemplates.find((e) => e.code == messageCode);
			messageBody = emailTemplate?.body || '';
			messageSubject = emailTemplate?.subject || '';
		}

		if (sourceType == OtpSourceType.Mobile) {
			const smsTemplate = SMSTemplates.find((e) => e.code == messageCode);
			messageBody = smsTemplate?.message || '';
		}

		keys.forEach((key) => {
			params.set(key, targetParams[key]);
		});

		messageBody = this.getMessageBodyWithParams(messageBody, params);
		return { messageBody, messageSubject };
	}

	public static async axiosApiCall(ctx: ContextWrapper, requestType: string, body: GenericObject) {
		try {
			// log external api calls
		} catch (err) {
			// log errors
		}
	}

	public static generateUniqueCode(): string {
		return Math.random().toString(36).substring(7).toUpperCase();
	}

	public static async convertFileStreamToBase64(stream): Promise<string> {
		const chunks: any[] = [];

		for await (const chunk of stream) {
			chunks.push(Buffer.from(chunk));
		}

		return Buffer.concat(chunks).toString('base64');
	}

	public static getHashSalt() {
		return bcrypt.genSaltSync(Constants.SALT_ROUNDS);
	}

	public static generatePassword(length: number): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let password = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * chars.length);
			password += chars[randomIndex];
		}

		return password;
	}
}
