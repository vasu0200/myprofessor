import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';
import moment from 'moment';

export class PackageDao extends BaseDao {
	public static async getPackages(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
														p.id,
														p.name,
														p.academic_year as academicYear,
														p.academic_month as academicMonth,
														p.to_year as toYear,
														p.to_month as toMonth,
														p.key,
														p.cost,
														u.id as universityId,
														u.name as universityName,
														b.id as branchId,
														b.name as branchName
												 from packages p
												 left join universities u on u.id = p.university_id
												 left join branches b on b.id = p.branch_id
                         where p.deleted = false
												 order by p.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
														 from packages p
														 where p.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async searchPackages(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const searchValue: string = ctx.params.searchValue;
		const searchSql: string = searchValue
			? `and (
				p.name like '%${searchValue}%' or
				p.key like '%${searchValue}%' or
				p.cost like '%${searchValue}%' or
				u.name like '%${searchValue}%' or
				b.name like '%${searchValue}%'
				)`
			: '';
		const sql: string = `select p.id,
														p.name,
														p.academic_year as academicYear,
														p.academic_month as academicMonth,
														p.to_year as toYear,
														p.to_month as toMonth,
														p.key,
														p.cost,
														u.id as universityId,
														u.name as universityName,
														b.id as branchId,
														b.name as branchName
													from packages p
												 left join universities u on u.id = p.university_id
												 left join branches b on b.id = p.branch_id
                         where p.deleted = false ${searchSql}
												 order by p.created_at desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
														 	from packages p
															left join universities u on u.id = p.university_id
												 			left join branches b on b.id = p.branch_id
                         			where p.deleted = false ${searchSql}`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getPackagesByBranch(ctx: ContextWrapper): Promise<any> {

		const sql: string = `select
														p.id,
														p.name,
														p.academic_year as academicYear,
														p.academic_month as academicMonth,
														p.to_year as toYear,
														p.to_month as toMonth,
														p.key,
														p.cost,
														u.id as universityId,
														u.name as universityName,
														b.id as branchId,
														b.name as branchName,
														GROUP_CONCAT(s.name SEPARATOR ', ') as semesters
												 from packages p
												 left  join universities u on u.id = p.university_id
												 left  join branches b on b.id = p.branch_id
												 inner join semesters s on find_in_set(s.id, semesters) != 0
                         where
												 		p.deleted = false and
														p.branch_id = '${ctx.params.branchId}' and
														p.to_year >= '${moment().format('YYYY')}' and
														((p.academic_year < '${moment().format('YYYY')}' or
														(p.academic_year = '${moment().format('YYYY')}' and
														p.academic_month <= '${moment().format('MM')}')) and
       											(p.to_year > '${moment().format('YYYY')}' or
														(p.to_year = '${moment().format('YYYY')}' and
														 p.to_month >= '${moment().format('MM')}')))
												 group by p.id
												 order by p.id desc`;

		const response = await this.runSql(sql);
		return { groupPackage: response };
	}
}
