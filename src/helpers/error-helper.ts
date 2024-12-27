import { Constants } from '@Utility/constants';
import { Errors } from 'moleculer';

export class ErrorHelper {
	public static throwError(errorMessage: string, statusCode: number, errorType: string = '', data: any = {}) {
		throw new Errors.MoleculerError(errorMessage, statusCode, errorType, { ...data });
	}

	public static getDbExceptionErrorMessage(sqlMessage: string, code: string): string {
		let errorMessage: string = '';

		switch (code) {
			case 'ER_DUP_ENTRY':
				const errorMessagesWithInQuotes: string[] = sqlMessage.match(/\'(.*?)\'/) || [];
				errorMessage += Constants.StandardDbErrorCodes[code] + errorMessagesWithInQuotes[0];
				break;
			case 'ER_NO_REFERENCED_ROW_2':
			case 'ER_ROW_IS_REFERENCED_2':
				errorMessage += Constants.StandardDbErrorCodes[code];
				break;
			default:
				errorMessage += Constants.StandardDbErrorCodes.UNKNOWN;
				break;
		}

		return errorMessage;
	}
}
