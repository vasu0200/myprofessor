import { PackageDao } from '@Dao/package.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { PackageHelper } from '@Helpers/service-helpers/package.helper';
import { Package } from '@Models/package';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { PackageDto, PackageMapper, UserPackageMapper } from 'src/dto/package.dto';
import AuthSchema from './auth';
import async from 'async';
import { OtpSourceType, PromoCodeRedeemStatus, RazorpayPaymentStatusType, UserPackageStatusType, UserRoleType } from '@Utility/enum';
import { In } from 'typeorm';
import { Semester } from '@Models/semester';
import { ActivationCard } from '@Models/activation-card';
import { Payment } from '@Models/payment';
import { UserPackage } from '@Models/user-package';
import { UserBranch } from '@Models/user-branch';
import { RazorpayPayment } from '@Models/razorpay-payment';
import SystemHelper from '@Helpers/system-helpers';
import { User } from '@Models/user';
const appConfig = require('../app-config.json');

export default class PackageService extends AuthSchema {
	public name: string = 'package';

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getPackages(ctx: ContextWrapper): Promise<PagedResponse<PackageMapper>> {
		const packages = await PackageDao.getPackages(ctx);
		packages.items = PackageDto.transformResources(packages.items, new PackageMapper());
		return packages;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
	})
	public async getPackagesByBranch(ctx: ContextWrapper): Promise<PackageMapper> {
		let packages = await PackageDao.getPackagesByBranch(ctx);
		packages.groupPackage = PackageDto.transformResources(packages.groupPackage, new PackageMapper());
		return packages;
	}

	@Action({
		params: {
			universityId: { type: 'string' },
			branchId: { type: 'string' },
			academicMonth: { type: 'number' },
			academicYear: { type: 'number' },
			packages: {
				type: 'array',
				items: {
					type: 'object',
					props: {
						name: 'string',
						active: 'boolean',
						cost: 'number',
						duration: 'number',
						semesters: 'string',
						toYear: 'number',
						toMonth: 'number',
						key: 'number',
					},
				},
			},
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async createPackage(ctx: ContextWrapper): Promise<PackageMapper[]> {
		const packages: PackageMapper[] = [];
		const paramsPackages = ctx.params.packages as {
			name: string;
			active: boolean;
			cost: number;
			duration: number;
			semesters: string;
			toYear: number;
			toMonth: number;
			key: number;
		}[];

		if (!paramsPackages.length) {
			ErrorHelper.throwError(Messages.EMPTY_PACKAGES, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		await async.forEachLimit(paramsPackages, 1, async (packageData) => {
			ctx.params = { ...ctx.params, ...packageData };
			let newPackage = await PackageHelper.setPackageDetails(ctx, new Package());
			newPackage = await PackageDao.saveGenericResource(ctx, newPackage);
			packages.push(PackageDto.transformResource(newPackage, new PackageMapper()));
		});

		return packages;
	}

	@Action({
		params: {
			packageId: { type: 'string' },
			universityId: { type: 'string' },
			branchId: { type: 'string' },
			name: { type: 'string' },
			cost: { type: 'number' },
			toYear: { type: 'number' },
			toMonth: { type: 'number' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async updatePackage(ctx: ContextWrapper): Promise<PackageMapper> {
		let packageData: Package = await PackageDao.getGenericResource(ctx, Package, { where: { id: ctx.params.packageId } });

		if (!packageData) {
			ErrorHelper.throwError(Messages.INVALID_PACKAGE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		packageData = await PackageHelper.setPackageDetails(ctx, packageData);
		packageData = await PackageDao.saveGenericResource(ctx, packageData);
		const semestersInfo: string[] = packageData.semesters.split(',');
		const dbSemesters: Semester[] = await PackageDao.getGenericResources(ctx, Semester, { where: { id: In(semestersInfo) } }, true);
		packageData.semestersInfo = dbSemesters.map((e) => e.name);

		return PackageDto.transformResource(packageData, new PackageMapper());
	}

	@Action({
		params: {
			packageId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getPackage(ctx: ContextWrapper): Promise<PackageMapper> {
		const packageInfo: Package = await PackageDao.getGenericResource(ctx, Package, { where: { id: ctx.params.packageId } });

		if (!packageInfo) {
			ErrorHelper.throwError(Messages.INVALID_PACKAGE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const semestersInfo: string[] = packageInfo.semesters.split(',');
		const dbSemesters: Semester[] = await PackageDao.getGenericResources(ctx, Semester, { where: { id: In(semestersInfo) } }, true);
		packageInfo.semestersInfo = dbSemesters.map((e) => e.name);

		return PackageDto.transformResource(packageInfo, new PackageMapper());
	}

	@Action({
		params: {
			packageId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async deletePackage(ctx: ContextWrapper): Promise<boolean> {
		const packageData: Package = await PackageDao.getGenericResource(ctx, Package, { where: { id: ctx.params.packageId } });

		if (!packageData) {
			ErrorHelper.throwError(Messages.INVALID_PACKAGE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await PackageDao.softDeleteResource(ctx, packageData);
		return true;
	}

	@Action({
		params: {
			searchValue: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async search(ctx: ContextWrapper) {
		return await PackageDao.searchPackages(ctx);
	}

	@Action({
		params: {
			userId: { type: 'string' },
			subscriptionStatus: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async handleUserPackages(ctx: ContextWrapper) {
		const user: User = await PackageDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });
		const activationCard: ActivationCard = ctx.params.activationCard;
		const paymentInfo: Payment = ctx.params.paymentInfo;

		// get user package , if not create one
		let userPackage: UserPackage = await PackageDao.getGenericResource(ctx, UserPackage, {
			where: {
				userId: ctx.params.userId,
				subscriptionStatus: In([UserPackageStatusType.Free, UserPackageStatusType.Active]),
			},
		});

		if (!userPackage) {
			const userBranch: UserBranch = await PackageDao.getGenericResource(ctx, UserBranch, {
				where: {
					userId: ctx.params.userId,
				},
			});
			userPackage = PackageHelper.setUserPackageDetails(ctx, new UserPackage(), userBranch);
		}

		userPackage.packageId = paymentInfo.packageId;
		userPackage.userId = ctx.params.userId;
		userPackage.packageName = paymentInfo.packageName;
		userPackage.promoCodeId = paymentInfo.promoCodeId;
		userPackage.activationCardId = activationCard ? activationCard.id : '';
		userPackage.subscriptionStatus = ctx.params.subscriptionStatus || UserPackageStatusType.Active;
		userPackage.paymentStatus = paymentInfo.paymentStatus;
		userPackage.paymentId = paymentInfo.id;
		userPackage.totalPaymentCost = paymentInfo.totalPrice;
		userPackage.razorpayOrderId = paymentInfo.razorpayOrderId;

		userPackage = await PackageDao.saveGenericResource(ctx, userPackage);

		// Payment confirmation email
		if (userPackage.subscriptionStatus === UserPackageStatusType.Active) {
			// get email body and subject
			const { messageBody, messageSubject } = SystemHelper.handleEmailAndSmsMessageBody(
				OtpSourceType.Email,
				{ email: user.email, name: `${user.firstName} ${user.lastName}`, ...appConfig.emailTemplate },
				Constants.EmailCodes.MY_PROFESSOR_PAYMENT_CONFIRMATION_EMAIL,
			);

			// send email
			await ctx.broker.call('email.sendEmail', { email: user.email, subject: messageSubject, body: messageBody });
		}

		return PackageDto.transformResource(userPackage, new UserPackageMapper());
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async getSubscriptionStatus(ctx: ContextWrapper) {
		const userPackage: UserPackage = await PackageDao.getGenericResource(ctx, UserPackage, { where: { userId: ctx.params.userId } });

		if (!userPackage) {
			return null;
			// ErrorHelper.throwError(Messages.INVALID_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return PackageDto.transformResource(userPackage, new UserPackageMapper());
	}

	@Action({
		params: {
			packageId: { type: 'string' },
			userId: { type: 'string' },
			paymentStatus: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async handlePackagesOnPayment(ctx: ContextWrapper) {
		// based on razorpay payment status
		const razorpayPaymentInfo: RazorpayPayment = ctx.params.razorpayPaymentInfo;
		const paymentStatus: RazorpayPaymentStatusType = ctx.params.paymentStatus;
		let promoCodeStatus: PromoCodeRedeemStatus = PromoCodeRedeemStatus.Pending;
		const packageData: Package = await PackageDao.getGenericResource(ctx, Package, { where: { id: ctx.params.packageId } });
		let subscriptionStatus: UserPackageStatusType = UserPackageStatusType.Free;

		// create payment record
		const paymentInfo: Payment = await ctx.call('payment.capturePayment', {
			packageId: ctx.params.packageId,
			userId: ctx.params.userId,
			razorpayPaymentInfo: razorpayPaymentInfo,
			paymentStatus: paymentStatus,
		});

		switch (paymentStatus) {
			case RazorpayPaymentStatusType.Captured:
				// payment successful
				subscriptionStatus = UserPackageStatusType.Active;
				promoCodeStatus = PromoCodeRedeemStatus.Success;

				// handle referral points
				ctx.broadcast('user.captureReferralPoints', { userId: ctx.params.userId });
				break;
			case RazorpayPaymentStatusType.Failed:
				// payment failed
				subscriptionStatus = UserPackageStatusType.Free;
				promoCodeStatus = PromoCodeRedeemStatus.Failed;
			case RazorpayPaymentStatusType.Refunded:
			// TODO:Handle refunds
			case RazorpayPaymentStatusType.Attempted:
			case RazorpayPaymentStatusType.Created:
				break;
			default:
				break;
		}

		// handle promo code redeem
		if (paymentInfo && paymentInfo.promoCodeId && paymentInfo.promoCode) {
			await ctx.call('promoCode.redeemUserPromoCode', {
				promoCodeId: paymentInfo.promoCodeId,
				promoCode: paymentInfo.promoCode,
				userId: ctx.params.userId,
				status: promoCodeStatus,
			});
		}

		// handle user packages
		return await ctx.call('package.handleUserPackages', {
			subscriptionStatus: subscriptionStatus,
			paymentInfo: paymentInfo,
			userId: ctx.params.userId,
		});
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getPackagesByBranchForWeb(ctx: ContextWrapper): Promise<PackageMapper> {
		let packages = await PackageDao.getPackagesByBranch(ctx);
		packages.groupPackage = PackageDto.transformResources(packages.groupPackage, new PackageMapper());
		return packages;
	}
}

module.exports = new PackageService();
