import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class UniversalTopicDao extends BaseDao {
	public static async getTopics(ctx: ContextWrapper, subjectId: string, searchValue: string = ''): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const searchSqlStmt: string = searchValue
			? `and (ut.topic_name like '%${searchValue}%' or ut.topic_desc  like '%${searchValue}%' or ut.topic_code like '%${searchValue}%')`
			: ``;
		const sql: string = `with assignedActivityInfo as (
													 select count(*) as total_activities, aa.universal_topic_id
													 from assigned_activities aa
													 where aa.deleted = false
													 group by aa.universal_topic_id )
													select ut.id, ut.subject_id as "subjectId", ut.topic_name as "topicName", ut.topic_desc as "topicDesc", ut.topic_code as "topicCode", ut.image , aai.total_activities as "noOfActivities", ut.dependency_topics as dependencyTopics
													from uni_topics ut
													left join assignedActivityInfo aai on aai.universal_topic_id = ut.id
													where ut.deleted = false and ut.subject_id = '${subjectId}' ${searchSqlStmt}
													order by ut.id desc
                         	limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);
		const countSql: string = `select count(*) as count
															from uni_topics ut
															where ut.deleted = false and ut.subject_id = '${subjectId}' ${searchSqlStmt}`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async globalTopicSearch(ctx: ContextWrapper) {
		const sql: string = `select
													ut.id as universalTopicId,
													ut.topic_name as universalTopicName,
													ut.topic_code as universalTopicCode,
													ut.image as universalTopicImage,
													ut.dependency_topics as universalDependencyTopics
												 from uni_topics ut
												 where
												 	ut.deleted = false and
												 	(
													 ut.topic_name like '%${ctx.params.searchValue}%' or
													 ut.topic_desc  like '%${ctx.params.searchValue}%' or
													 ut.topic_code like '%${ctx.params.searchValue}%'
													)`;
		return await this.runSql(sql);
	}

	public static async checkTopic(ctx: ContextWrapper, idCheck: boolean = false) {
		const idCheckSql: string = idCheck ? `and ut.id != '${ctx.params.topicId}'` : ``;
		const sql: string = `select * from uni_topics ut
												 where
												 		lower(ut.topic_code) = lower('${ctx.params.code}') and
														ut.deleted = false ${idCheckSql}
													limit 1`;
		return await this.runSqlFindOne(sql);
	}

	public static async getAssignedActivitiesByUniversalTopicId(ctx: ContextWrapper, universalTopicId: string) {
		const sql: string = `select * from assigned_activities aa
												 where
													aa.universal_topic_id = '${universalTopicId}' and
													aa.topic_id is null and
													aa.resource_type = 'admin' and
													aa.deleted = false`;
		return await this.runSql(sql)
	}
}
