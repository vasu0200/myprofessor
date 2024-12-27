import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class ActivationCardDao extends BaseDao {
	public static async getActivationCards(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
														ac.id,
														ac.channel_partner_id as channelPartnerId,
														ac.activation_code as activationCode,
														ac.redeem_user_id as redeemUserId,
														ac.university_id as universityId,
														ac.created_at as createdAt,
														ac.updated_at as updatedAt,
														ac.status,
														ucp.first_name as channelPartnerFirstName,
														ucp.last_name as channelPartnerLastName,
														uru.first_name as redeemUserFirstName,
														uru.last_name as redeemUserLastName,
														uru.email as redeemUserEmail,
														uru.mobile_number as redeemUserMobile,
														u.name as universityName
												 from activation_cards ac
												 left join users ucp on ucp.id = ac.channel_partner_id
												 left join users uru on uru.id = ac.redeem_user_id
												 left join universities u on u.id = ac.university_id
                         where
												 		ac.deleted = false and
														-- ucp.deleted = false and
														-- uru.deleted = false and
														u.deleted = false
												 order by ac.created_at desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
														 from activation_cards ac
														 left join universities u on u.id = ac.university_id
														 where
														    u.deleted = false and
														 		ac.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async searchActivationCards(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const searchValue: string = ctx.params.searchValue;
		const offsetLimitSql: string = ctx.params.isExport ? `` : `limit ${limit} offset ${offset}`;
		const searchSql: string = searchValue
			? `									and (
													ucp.first_name like '%${searchValue}%' or
													ucp.last_name like '%${searchValue}%' or
													ac.activation_code like '%${searchValue}%' or
													uru.first_name like '%${searchValue}%' or
													uru.last_name like '%${searchValue}%' or
													uru.email like '%${searchValue}%' or
													uru.mobile_number like '%${searchValue}%' or
													u.name like '%${searchValue}%' or
													b.name like '%${searchValue}%' or
													s.name like '%${searchValue}%' or
													ac.channel_partner_id ='${searchValue}'
													)`
			: '';
		const sql: string = `select
													ac.id,
													ac.channel_partner_id as channelPartnerId,
													ac.activation_code as activationCode,
													ac.redeem_user_id as redeemUserId,
													ac.branch_id as branchId,
													ac.university_id as universityId,
													ac.semester_id as semesterId,
													ac.created_at as createdAt,
													ac.updated_at as updatedAt,
													ac.status,
													ucp.first_name as channelPartnerFirstName,
													ucp.last_name as channelPartnerLastName,
													uru.first_name as redeemUserFirstName,
													uru.last_name as redeemUserLastName,
													uru.email as redeemUserEmail,
													uru.mobile_number as redeemUserMobile,
													u.name as universityName,
													b.name as branchName,
													s.name as semesterName
												 from activation_cards ac
												 left join users ucp on ucp.id = ac.channel_partner_id
												 left join users uru on uru.id = ac.redeem_user_id
												 left join universities u on u.id = ac.university_id
												 left join branches b on b.id = ac.branch_id
												 left join semesters s on s.id = ac.semester_id
                         where ac.deleted = false ${searchSql}
												 order by ac.created_at desc
                         ${offsetLimitSql}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
															 from activation_cards ac
															 left join users ucp on ucp.id = ac.channel_partner_id
												 		   left join users uru on uru.id = ac.redeem_user_id
												 			 left join universities u on u.id = ac.university_id
												 			 left join branches b on b.id = ac.branch_id
												 			 left join semesters s on s.id = ac.semester_id
                         			where
																ac.deleted = false ${searchSql}`;
		response.totalCount = await this.runSqlGetCount(countSql);

		return response;
	}
}
