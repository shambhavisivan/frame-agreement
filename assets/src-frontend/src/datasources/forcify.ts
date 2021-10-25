/* eslint-disable @typescript-eslint/ban-types */

import { capitalize, isArray, isObject } from './deforcify';

type ForcifiedObjectElement<T> = T extends (infer R)[] // Is it an array?
	? Forcified<R>[] // forcify each element of array
	: T extends object // or is it just an object
	? Forcified<T> // forcify the object
	: T; // if neither keep the type as is

export type Forcified<T> = {
	[K in keyof T as string]: ForcifiedObjectElement<T[K]>;
};

const standardSfFields = ['id', 'name', 'createdById', 'lastModifiedById', 'ownerId'];

function forcifyKeyName<T extends string>(keyName: T, prefix: string): string {
	const keys = keyName.split(/(?=[A-Z])/g);
	return `${prefix}__${keys.map(capitalize).join('_')}__c`;
}

function forcifyObjectElement<T extends object | unknown>(
	e: T,
	prefix: string
): ForcifiedObjectElement<T> {
	if (isArray(e)) {
		return e.map((arrayElement) =>
			forcifyObjectElement(arrayElement, prefix)
		) as ForcifiedObjectElement<T>;
	}

	if (isObject(e)) {
		return forcify(e, prefix) as ForcifiedObjectElement<T>;
	}

	return e as ForcifiedObjectElement<T>;
}

export function forcify<T extends object>(obj: T, packagePrefix: string): Forcified<T> {
	return Object.fromEntries(
		Object.entries(obj).map(([key, value]) => {
			const forcifiedKeyName = standardSfFields.includes(key)
				? capitalize(key)
				: forcifyKeyName(key, packagePrefix);
			const forcifiedObjectElement = forcifyObjectElement(value, packagePrefix);
			return [forcifiedKeyName, forcifiedObjectElement];
		})
	) as Forcified<T>;
}
