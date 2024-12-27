import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { RazorpayXPayoutStatusType } from '@Utility/enum';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class RegistrationInviteDao extends BaseDao {
	public static async getUserRegistrationInvites(ctx: ContextWrapper) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
                          u.id as inviteeId,
                          u.first_name as inviteeFirstName,
                          u.last_name as inviteeLastName,
                          u.email as inviteeEmail,
                          u.mobile_number as inviteeMobile,
                          u.account_status as accountStatus,
                          ri.registration_status as registrationStatus,
                          up.payment_status as paymentStatus,
                          up.subscription_status as subscriptionStatus
                        from registration_invites ri
                        join users u on u.id = ri.user_id
                        left join user_packages up on up.user_id = u.id
                        where
                          ri.inviter_id = '${ctx.params.userId}' and
                          ri.deleted = false
                      limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
														 from registration_invites ri
                             join users u on u.id = ri.user_id
                             left join user_packages up on up.user_id = u.id
                             where
                              ri.inviter_id = '${ctx.params.userId}' and
                              ri.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getAllUsersRegistrationMetrics(ctx: ContextWrapper) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `with regInfo as (
                          select ri.inviter_id , count(*) as totalInvites from registration_invites ri
                          where ri.deleted = false
                          group by ri.inviter_id
                          )
                        select
	                        u.email,
	                        u.id as userId,
	                        u.first_name,
	                        u.last_name,
	                        u.mobile_number as mobile,
	                        ri.totalInvites
                        from regInfo ri
                        join users u on u.id = ri.inviter_id
                        where u.deleted = false
                        limit ${limit} offset ${offset}`;

		response.items = await this.runSql(sql);

		const countSql: string = `with regInfo as (
                          select ri.inviter_id , count(*) as totalInvites from registration_invites ri
                          where ri.deleted = false
                          group by ri.inviter_id
                          )
                        select
	                        count(*) as count
                        from regInfo ri
                        join users u on u.id = ri.inviter_id
                        where u.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getAllUsersRegistrations(ctx: ContextWrapper) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `with regInfo as (
                          select ri.inviter_id , count(*) as totalInvites from registration_invites ri
                          where ri.deleted = false
                          group by ri.inviter_id
                          )
                        select
	                        u.email,
	                        u.id as userId,
	                        u.first_name as firstName,
	                        u.last_name as lastName,
	                        u.mobile_number as mobile,
	                        ri.totalInvites
                        from regInfo ri
                        join users u on u.id = ri.inviter_id
                        where u.deleted = false
                        limit ${limit} offset ${offset}`;

		response.items = await this.runSql(sql);

		const countSql: string = `with regInfo as (
                          select ri.inviter_id , count(*) as totalInvites from registration_invites ri
                          where ri.deleted = false
                          group by ri.inviter_id
                          )
                        select
	                        count(*) as count
                        from regInfo ri
                        join users u on u.id = ri.inviter_id
                        where u.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}
}
