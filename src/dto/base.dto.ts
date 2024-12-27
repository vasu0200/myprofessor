export class BaseDto {
	public static transformResource<E>(source: any, target: E): E {
		const targetKeys: string[] = Object.keys(target);
		targetKeys.forEach((e) => {
			target[e] = source[e];
		});
		return target;
	}

	public static transformResources<E>(source: any[], target: E): E[] {
		const targetKeys: string[] = Object.keys(target);
		const returnValue: E[] = [];
		source.forEach((e) => {
			targetKeys.forEach((tk) => {
				target[tk] = e[tk];
			});
			returnValue.push({ ...target });
		});
		return returnValue;
	}
}

export class PagedResponse<T> {
	totalCount: number;
	items: T[];

	constructor() {
		this.totalCount = 0;
		this.items = [];
	}
}
