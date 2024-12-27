import { TargetSourceType } from '@Utility/enum';
import { BaseDao } from './base.dao';

export class ActivityDao extends BaseDao {
	public static async getAssignedActivites(topicId: string, resourceType: TargetSourceType) {
		const sql: string = `with questionCount as (
                            select q.assigned_activity_id, count(*) as totalQuestions
                            from questions q
                            where q.deleted = false
                            group by q.assigned_activity_id
                          )
                        select
                          aa.id,
                          aa.name,
                          aa.topic_id as topicId,
                          aa.seq,
                          aa.activity_id as activityId,
                          a.faIcon,
                          ai.id as activityInfoId,
                          a.activity_type as activityType,
                          qc.totalQuestions,
                          ai.duration
                         from assigned_activities aa
                         left join activities a on a.id = aa.activity_id and a.deleted = false
                         left join questionCount qc on qc.assigned_activity_id = aa.id
                         left join activity_info ai on ai.assigned_activity_id = aa.id and ai.deleted = false
                         where
                          aa.deleted = false
                          and aa.topic_id = '${topicId}'
                          and aa.resource_type = '${resourceType}'
                         order by aa.seq`;
		return await this.runSql(sql);
	}

	public static async getUniversalTopicAssignedActivites(universalTopicId: string) {
		const sql: string = `with questionCount as (
                            select q.assigned_activity_id, count(*) as totalQuestions
                            from questions q
                            where q.deleted = false
                            group by q.assigned_activity_id
                          )
                        select
                          aa.id,
                          aa.name,
                          aa.universal_topic_id as universalTopicId,
                          aa.seq,
                          aa.activity_id as activityId,
                          a.faIcon,
                          ai.id as activityInfoId,
                          a.activity_type as activityType,
                          qc.totalQuestions,
                          ai.duration
                         from assigned_activities aa
                         left join activities a on a.id = aa.activity_id and a.deleted = false
                         left join questionCount qc on qc.assigned_activity_id = aa.id
                         left join activity_info ai on ai.assigned_activity_id = aa.id and ai.deleted = false
                         where
                          aa.deleted = false
                          and aa.universal_topic_id = '${universalTopicId}'
                          and aa.topic_id is null
                         order by aa.seq`;
		return await this.runSql(sql);
	}
}
