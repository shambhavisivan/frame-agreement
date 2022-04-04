type CapitalizeString<T extends string> = Capitalize<Lowercase<T>>;
export type ParsedCondition = {
	components: { comparison: string; field: string; value: string }[];
	operators: string[];
};
export function capitalizeString<T extends string>(
	inputString: T
): CapitalizeString<T> | undefined {
	if (!inputString) {
		return;
	}
	const stringVal = inputString.toLowerCase(); // normalise input to lower case.
	return `${stringVal[0].toLocaleUpperCase()}${stringVal.slice(1)}` as CapitalizeString<T>;
}

export function isNotUndefinedOrNull(value: number | null | undefined): boolean {
	return value !== undefined && value !== null;
}
