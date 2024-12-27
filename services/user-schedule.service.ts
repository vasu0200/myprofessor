import { UserScheduleDao } from '@Dao/user-schedule.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { UserScheduleHelper } from '@Helpers/service-helpers/user-schedule.helper';
import SystemHelper from '@Helpers/system-helpers';
import { UserSchedule } from '@Models/user-schedule';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { UserScheduleDto, UserScheduleMapper } from 'src/dto/user-schedule.dto';
import AuthSchema from './auth';

export default class UserScheduleService extends AuthSchema {
	public name: string = 'userScheduler';

	@Action({
		params: {
			userId: { type: 'string' },
			scheduleType: { type: 'string' },
			scheduleTypeId: { type: 'string' },
			scheduleDate: { type: 'string' }, //YYY-MM-DD
			additionalInfo: { type: 'string', optional: true },
		},
	})
	public async saveUserSchedule(ctx: ContextWrapper) {
		let userScheduler: UserSchedule = await UserScheduleDao.getGenericResource(ctx, UserSchedule, {
			where: { userId: ctx.params.userId, scheduleType: ctx.params.scheduleType, scheduleTypeId: ctx.params.scheduleTypeId },
		});

		if (userScheduler) {
			ErrorHelper.throwError(Messages.SCHEDULE_ALREADY_CREATED, 404, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		userScheduler = UserScheduleHelper.setUserScheduleDetails(ctx, userScheduler ? userScheduler : new UserSchedule());
		userScheduler = await UserScheduleDao.saveGenericResource(ctx, userScheduler);

		return UserScheduleDto.transformResource(userScheduler, new UserScheduleMapper());
	}

	@Action({
		params: {
			userId: { type: 'string' },
			userScheduleId: { type: 'string' },
			scheduleType: { type: 'string' },
			scheduleTypeId: { type: 'string' },
			scheduleDate: { type: 'string' }, //YYY-MM-DD
			additionalInfo: { type: 'string', optional: true },
		},
	})
	public async updateUserSchedule(ctx: ContextWrapper) {
		let userScheduler: UserSchedule = await UserScheduleDao.getGenericResource(ctx, UserSchedule, {
			where: { id: ctx.params.userScheduleId },
		});

		if (!userScheduler) {
			ErrorHelper.throwError(Messages.INVALID_SCHEDULE, 404, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		userScheduler = UserScheduleHelper.setUserScheduleDetails(ctx, userScheduler);
		userScheduler = await UserScheduleDao.saveGenericResource(ctx, userScheduler);

		return UserScheduleDto.transformResource(userScheduler, new UserScheduleMapper());
	}

	@Action({
		params: {
			userId: { type: 'string' },
			scheduleType: { type: 'string' },
			scheduleTypeId: { type: 'string' },
		},
	})
	public async getUserSchedule(ctx: ContextWrapper) {
		const userScheduler: UserSchedule = await UserScheduleDao.getGenericResource(ctx, UserSchedule, {
			where: { userId: ctx.params.userId, scheduleType: ctx.params.scheduleType, scheduleTypeId: ctx.params.scheduleTypeId },
		});

		if (userScheduler) {
			return UserScheduleDto.transformResource(userScheduler, new UserScheduleMapper());
		}

		return false;
	}

	@Action({
		params: {
			userId: { type: 'string' },
			fromDate: { type: 'string' },
			toDate: { type: 'string' },
		},
	})
	public async getUserSchedules(ctx: ContextWrapper) {
		return await UserScheduleDao.getUserSchedules(ctx);
	}

	@Action({
		params: {
			userScheduleId: { type: 'string' },
		},
	})
	public async deleteUserSchedule(ctx: ContextWrapper) {
		let userScheduler: UserSchedule = await UserScheduleDao.getGenericResource(ctx, UserSchedule, {
			where: { id: ctx.params.userScheduleId },
		});

		if (!userScheduler) {
			ErrorHelper.throwError(Messages.INVALID_SCHEDULE, 404, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// soft delete
		await UserScheduleDao.softDeleteResource(ctx, userScheduler);

		return true;
	}
}
module.exports = new UserScheduleService();
