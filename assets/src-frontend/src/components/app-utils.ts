type CapitalizeString<T extends string> = Capitalize<Lowercase<T>>;

export function capitalizeString<T extends string>(
	inputString: T
): CapitalizeString<T> | undefined {
	if (!inputString) {
		return;
	}
	const stringVal = inputString.toLowerCase(); // normalise input to lower case.
	return `${stringVal[0].toLocaleUpperCase()}${stringVal.slice(1)}` as CapitalizeString<T>;
}
