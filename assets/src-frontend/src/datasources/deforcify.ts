/* eslint-disable @typescript-eslint/ban-types */

type ToPascalCase<S extends string> = S extends `${infer Head}_${infer Tail}`
	? `${Capitalize<Head>}${Capitalize<ToPascalCase<Tail>>}`
	: S;

export type DeforcifiedKeyName<
	S extends string | unknown
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
> = S extends `${infer _PackagePrefix}__${infer Body}__${infer _FieldType}`
	? `${Uncapitalize<ToPascalCase<Body>>}`
	: S extends string
	? `${Uncapitalize<ToPascalCase<S>>}`
	: S;

type DeforcifiedObjectElement<T> = T extends (infer R)[] // Is it an array?
	? Deforcified<R>[] // deforcify each element of array
	: T extends object // or is it just an object
	? Deforcified<T> // deforcify the object
	: T; // if neither keep the type as is

export type Deforcified<T> = {
	[K in keyof T as DeforcifiedKeyName<K>]: DeforcifiedObjectElement<T[K]>;
};

const modifyFirstLetter = (modifier: (letter: string) => string) => (val: string): string => {
	const [firstLetter, ...rest] = Array.from(val);

	return [modifier(firstLetter), ...rest].join('');
};

const capitalize = modifyFirstLetter((s) => s.toUpperCase());
const uncapitalize = modifyFirstLetter((s) => s.toLowerCase());

function toCamel(val: string): string {
	return val
		.split('_')
		.map((word, index) => (index === 0 ? uncapitalize(word) : capitalize(word)))
		.join('');
}

function deforcifyKeyName<T extends string>(keyName: T): DeforcifiedKeyName<T> {
	const body = keyName.replace(/^[a-zA-Z0-9]*__|__[a-zA-Z0-9]$/g, '');

	return toCamel(body) as DeforcifiedKeyName<T>;
}

function isObject(value: object | unknown): value is object {
	return typeof value === 'object';
}

function isArray<T>(value: T[] | unknown): value is T[] {
	return Array.isArray(value);
}

function deforcifyObjectElement<T extends object | unknown>(e: T): DeforcifiedObjectElement<T> {
	if (isArray(e)) {
		return e.map(deforcifyObjectElement) as DeforcifiedObjectElement<T>;
	}

	if (isObject(e)) {
		return deforcify(e) as DeforcifiedObjectElement<T>;
	}

	return e as DeforcifiedObjectElement<T>;
}

export function deforcify<T extends object>(obj: T): Deforcified<T> {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => {
			return [deforcifyKeyName(key), deforcifyObjectElement(value)];
		})
	) as Deforcified<T>;
}
