import { LeaderBoardDao } from '@Dao/leader-board.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { LeaderBoardHelper } from '@Helpers/service-helpers/leader-board.helper';
import { LeaderBoardRule } from '@Models/leader-board-rule';
import { Constants } from '@Utility/constants';
import { UserRoleType } from '@Utility/enum';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { LeaderBoardDto, LeaderBoardRuleMapper } from 'src/dto/leader-board.dto';
import AuthSchema from './auth';

export default class LeaderBoardService extends AuthSchema {
	public name: string = 'leaderBoard';

	@Action({})
	public async getLeaderBoardRules(ctx: ContextWrapper) {
		const leaderBoardRules: LeaderBoardRule[] = await LeaderBoardDao.getGenericResources(ctx, LeaderBoardRule, { where: {} }, true);
		return LeaderBoardDto.transformResources(leaderBoardRules, new LeaderBoardRuleMapper());
	}

	@Action({
		params: {
			userId: { type: 'string' },
			universityId: { type: 'string' },
			branchId: { type: 'string', optional: true },
			semesterId: { type: 'string', optional: true },
			collegeId: { type: 'string', optional: true },
			role: { type: 'string' },
		},
	})
	public async getLeaderBoardStats(ctx: ContextWrapper) {
		const role: UserRoleType = ctx.params.role;

		if (role != UserRoleType.Student && role != UserRoleType.GeneralStudent) {
			ErrorHelper.throwError(Messages.INVALID_USER_ROLE, 404, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}

		return await LeaderBoardDao.getLeaderBoardStats(ctx, role);
	}

	@Action({
		params: {
			userId: { type: 'string' },
			universityId: { type: 'string' },
			collegeId: { type: 'string', optional: true },
			ruleCode: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async captureLeaderBoardRule(ctx: ContextWrapper) {
		const leaderBoardRule: LeaderBoardRule = await LeaderBoardDao.getGenericResource(ctx, LeaderBoardRule, {
			where: {
				code: ctx.params.ruleCode,
			},
		});

		if (!leaderBoardRule) {
			return;
		}

		await LeaderBoardHelper.handleLeaderBoard(ctx, leaderBoardRule);
	}

	@Action({
		params: {
			userId: { type: 'string' },
			universityId: { type: 'string' },
			collegeId: { type: 'string', optional: true },
		},
	})
	public async getUserLeaderBoardLogs(ctx: ContextWrapper) {
		return await LeaderBoardDao.getLeaderBoardLogs(ctx);
	}
}

module.exports = new LeaderBoardService();
