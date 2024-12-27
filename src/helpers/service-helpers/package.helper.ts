import { ContextWrapper } from '@Helpers/molecular-helper';
import { Package } from '@Models/package';
import { RazorpayPayment } from '@Models/razorpay-payment';
import { UserBranch } from '@Models/user-branch';
import { UserPackage } from '@Models/user-package';
import { UserPackageStatusType } from '@Utility/enum';
import { Method } from 'moleculer-decorators';

export class PackageHelper {
	@Method
	public static setPackageDetails(ctx: ContextWrapper, target: Package): Package {
		target.name = ctx.params.name || target.name;
		target.universityId = ctx.params.universityId || target.universityId;
		target.branchId = ctx.params.branchId || target.branchId;
		target.active = ctx.params.active || target.active;
		target.cost = ctx.params.cost || target.cost;
		target.duration = ctx.params.duration || target.duration;
		target.semesters = ctx.params.semesters || target.semesters;
		target.academicYear = ctx.params.academicYear || target.academicYear;
		target.academicMonth = ctx.params.academicMonth || target.academicMonth;
		target.toYear = ctx.params.toYear || target.toYear;
		target.toMonth = ctx.params.toMonth || target.toMonth;
		target.key = ctx.params.key || target.key;

		return target;
	}

	@Method
	public static setUserPackageDetails(ctx: ContextWrapper, target: UserPackage, userBranch: UserBranch): UserPackage {
		target.universityId = userBranch.universityId;
		target.branchId = userBranch.branchId;
		target.subscriptionStatus = UserPackageStatusType.Active;
		return target;
	}
}
