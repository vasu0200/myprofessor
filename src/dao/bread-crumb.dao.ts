import { ContextWrapper } from '@Helpers/molecular-helper';
import { BaseDao } from './base.dao';

export class BreadCrumbDao extends BaseDao {
	public static async getBreadCrumbs(ctx: ContextWrapper): Promise<any> {
		const response: any = {};
		let sql, data;
		if (ctx.params.universityId && ctx.params.universityId != '-1') {
			sql = `select u.id, u.name
                         from universities u
												 where u.deleted = false and u.id = '${ctx.params.universityId}'`;
			data = await this.runSql(sql);
			if (data && data.length) {
				response.universityId = data[0].id;
				response.universityName = data[0].name;
			}
		}

		if (ctx.params.branchId && ctx.params.branchId != '-1') {
			sql = `select b.id, b.name
                         from branches b
												 where b.deleted = false and b.id = '${ctx.params.branchId}'`;
			data = await this.runSql(sql);
			if (data && data.length) {
				response.branchId = data[0].id;
				response.branchName = data[0].name;
			}
		}

		if (ctx.params.semesterId && ctx.params.semesterId != '-1') {
			sql = `select s.id, s.name
                         from semesters s
												 where s.deleted = false and s.id = '${ctx.params.semesterId}'`;
			data = await this.runSql(sql);
			if (data && data.length) {
				response.semesterId = data[0].id;
				response.semesterName = data[0].name;
			}
		}

		if (ctx.params.subjectId && ctx.params.subjectId != '-1') {
			sql = `select s.id, s.name
                         from subjects s
												 where s.deleted = false and s.id = '${ctx.params.subjectId}'`;
			data = await this.runSql(sql);
			if (data && data.length) {
				response.subjectId = data[0].id;
				response.subjectName = data[0].name;
			}
		}

		if (ctx.params.chapterId && ctx.params.chapterId != '-1') {
			sql = `select c.id, c.name
                         from chapters c
												 where c.deleted = false and c.id = '${ctx.params.chapterId}'`;
			data = await this.runSql(sql);
			if (data && data.length) {
				response.chapterId = data[0].id;
				response.chapterName = data[0].name;
			}
		}

		if (ctx.params.topicId && ctx.params.topicId != '-1') {
			sql = `select t.id, t.name
                         from topics t
												 where t.deleted = false and t.id = '${ctx.params.topicId}'`;
			data = await this.runSql(sql);
			if (data && data.length) {
				response.topicId = data[0].id;
				response.topicName = data[0].name;
			}
		}

		if (ctx.params.section && ctx.params.section != '-1') {
			sql = `select s.id, s.name
                         from sections s
												 where s.deleted = false and s.id = '${ctx.params.section}'`;
			data = await this.runSql(sql);
			if (data && data.length) {
				response.sectionId = data[0].id;
				response.sectionName = data[0].name;
			}
		}

		if (ctx.params.activityId && ctx.params.activityId != '-1') {
			sql = `select s.id, s.name
                         from assigned_activities s
												 where s.deleted = false and s.id = '${ctx.params.activityId}'`;
			data = await this.runSql(sql);
			if (data && data.length) {
				response.activityId = data[0].id;
				response.activityName = data[0].name;
			}
		}

		if (ctx.params.activityDimId && ctx.params.activityDimId != '-1') {
			sql = `select ad.id, ad.name
                         from activity_dim ad
												 where ad.deleted = false and ad.id = '${ctx.params.activityDimId}'`;
			data = await this.runSql(sql);
			if (data && data.length) {
				response.activityId = data[0].id;
				response.activityName = data[0].name;
			}
		}

		if (ctx.params.uniSubjectId && ctx.params.uniSubjectId != '-1') {
			sql = `select us.id, us.subject_name
                         from uni_subjects us
												 where us.deleted = false and us.id = '${ctx.params.uniSubjectId}'`;
			data = await this.runSql(sql);
			if (data && data.length) {
				response.uniSubId = data[0].id;
				response.uniSubName = data[0].subject_name;
			}
		}

		if (ctx.params.uniTopicId && ctx.params.uniTopicId != '-1') {
			sql = `select ut.id, ut.topic_name
                         from uni_topics ut
												 where ut.deleted = false and ut.id = '${ctx.params.uniTopicId}'`;
			data = await this.runSql(sql);
			if (data && data.length) {
				response.uniTopicId = data[0].id;
				response.uniTopicName = data[0].topic_name;
			}
		}

		if (ctx.params.school && ctx.params.school != '-1') {
			sql = `select s.id, s.name
                         from schools s
												 where s.deleted = false and s.id = '${ctx.params.school}'`;
			data = await this.runSql(sql);
			if (data && data.length) {
				response.schoolId = data[0].id;
				response.schoolName = data[0].name;
			}
		}

		return response;
	}
}
