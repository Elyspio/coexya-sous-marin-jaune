export function groupBy<T, U extends keyof T>(array: T[], key: U) {
	const ret: Record<string, T[]> = {};

	array.forEach((elem) => {
		const val = elem[key];
		ret[val!.toString()] ??= [];
		ret[val!.toString()].push(elem);
	});

	return ret;
}
