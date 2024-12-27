import { BaseDto } from "./base.dto";
export class SubjectSyllabusDto extends BaseDto{
  static softDeleteResource: any;
}

export class SubjectSyllabusMapper {
	id: string;
	idx: number;
	universityId: string;
	branchId: string;
  subjectId: string;
  chapterId: string;
  subjectName: string;
  chapterName: string;
	universityName: string;
	branchName: string;
	description: string;

	constructor() {
		this.id = '';
    this.idx = 0;
    this.universityId = '';
    this.branchId = '';
    this.subjectId = '';
    this.chapterId = '';
		this.universityName = '';
		this.branchName = '';
    this.subjectName = '';
    this.chapterName = '';
    this.description = '';
	}
}
