import { Method } from "moleculer-decorators";
import { ContextWrapper } from "@Helpers/molecular-helper";
import { SubjectSyllabus } from "@Models/subject-syllabus";

export class SubjectSyllabusHelper {
	@Method
	public static async setSubjectSyllabus(ctx: ContextWrapper, target: SubjectSyllabus) {
		target.universityId = ctx.params.universityId;
		target.branchId = ctx.params.branchId;
		target.subjectId = ctx.params.subjectId;
		target.chapterId = ctx.params.chapterId;
		target.idx = ctx.params.idx;
		return target;
	}
}
