import { LeaderBoardDao } from '@Dao/leader-board.dao';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { LeaderBoard } from '@Models/leader-board';
import { LeaderBoardLog } from '@Models/leader-board-logs';
import { LeaderBoardRule } from '@Models/leader-board-rule';
import { Method } from 'moleculer-decorators';

export class LeaderBoardHelper {
	@Method
	public static async logLeaderBoardRule(ctx: ContextWrapper, leaderBoardRule: LeaderBoardRule) {
		const leaderBoardLog = this.setLeaderBoardLog(ctx, new LeaderBoardLog(), leaderBoardRule);
		await LeaderBoardDao.saveGenericResource(ctx, leaderBoardLog);
	}

	@Method
	public static setLeaderBoardLog(ctx: ContextWrapper, source: LeaderBoardLog, leaderBoardRule: LeaderBoardRule) {
		source.universityId = ctx.params.universityId;
		source.collegeId = ctx.params.collegeId;
		source.points = parseFloat(leaderBoardRule.points.toString());
		source.branchId = ctx.params.branchId;
		source.semesterId = ctx.params.semesterId;
		source.userId = ctx.params.userId;
		source.leaderBoardRuleId = leaderBoardRule.id;

		return source;
	}

	@Method
	public static async handleLeaderBoard(ctx: ContextWrapper, leaderBoardRule: LeaderBoardRule) {
		// log leader board
		await LeaderBoardHelper.logLeaderBoardRule(ctx, leaderBoardRule);

		// update leader board points accordingly
		let leaderBoard: LeaderBoard = await LeaderBoardDao.getGenericResource(ctx, LeaderBoard, {
			where: {
				userId: ctx.params.userId,
				universityId: ctx.params.universityId,
			},
		});

		if (!leaderBoard) {
			// create leaderBoard
			leaderBoard = this.setLeaderBoardDetails(ctx, new LeaderBoard(), parseFloat(leaderBoardRule.points.toString()));
		} else {
			// update the leaderBoard points
			leaderBoard = this.setLeaderBoardDetails(ctx, leaderBoard, parseFloat(leaderBoardRule.points.toString()));
		}

		await LeaderBoardDao.saveGenericResource(ctx, leaderBoard);
	}

	@Method
	public static setLeaderBoardDetails(ctx: ContextWrapper, source: LeaderBoard, points: number) {
		source.universityId = ctx.params.universityId;
		source.collegeId = ctx.params.collegeId;
		source.points = parseFloat(source.points.toString()) + parseFloat(points.toString());
		source.branchId = ctx.params.branchId;
		source.semesterId = ctx.params.semesterId;
		source.userId = ctx.params.userId;

		return source;
	}
}
