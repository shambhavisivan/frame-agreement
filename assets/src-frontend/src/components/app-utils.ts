import { FrameAgreement } from '../datasources';
import { forcify } from '../datasources/forcify';

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

/**
 * parses the input logic to show custom buttons
 */
export function parseConditionalExpression(conditionalString: string): ParsedCondition {
	if (!conditionalString) {
		throw new Error('conditionalString is empty');
	}
	const filterValueRegex = /(?<=(!=|==))(.*?)(?=(&& | \|\| | &|$))/g;
	const valueArray = conditionalString.match(filterValueRegex)?.map((value) => value.trim());

	conditionalString = conditionalString.replace(/( |\(|\))/g, '');
	let operatorsArray = [];
	try {
		const filterOperatorArray = /[\w.]+[!=]=[\w']+/g;
		let operatorsString = conditionalString.replace(filterOperatorArray, ',');

		if (operatorsString.startsWith(',')) {
			operatorsString = operatorsString.substring(1);
		}

		if (operatorsString.endsWith(',')) {
			operatorsString = operatorsString.slice(0, -1);
		}

		operatorsArray = operatorsString.split(',');

		operatorsArray = operatorsArray[0] === '' ? [] : operatorsArray;
	} catch (error) {
		throw new Error(`Cannot parse expression: ${conditionalString}`);
	}

	const logicArray: { comparison: string; field: string; value: string }[] = [];
	let logicComponens = conditionalString.split(/&&|\|\|/);
	logicComponens = logicComponens[0] === '' ? [] : logicComponens;

	logicComponens.forEach((logic, i) => {
		let comparisonOperator;

		if (logic.includes('==')) {
			comparisonOperator = '==';
		} else if (logic.includes('!=')) {
			comparisonOperator = '!=';
		} else {
			return;
		}

		const fieldValuePair = logic.split(comparisonOperator);
		logicArray.push({
			field: fieldValuePair[0],
			comparison: comparisonOperator,
			value: (!!valueArray && valueArray[i]) || fieldValuePair[1]
		});
	});

	return {
		operators: operatorsArray || [],
		components: logicArray || []
	};
}

export function isStandardButtonVisible(
	inputConfig: string[] | string | undefined,
	activeFa: FrameAgreement
): boolean {
	if (!inputConfig?.length) {
		return false;
	}
	const forcifiedFa = forcify(activeFa, 'csfam');
	if (Array.isArray(inputConfig)) {
		// show everytime backwards compatibility
		if (inputConfig.includes('*')) {
			return true;
		}

		return inputConfig.includes(activeFa.status || '');
	} else if (typeof inputConfig === 'string') {
		if (inputConfig.indexOf('*') !== -1) {
			return true;
		}
		const { components, operators } = parseConditionalExpression(inputConfig);
		if (!components?.length) {
			return false;
		}
		operators.unshift('&&');

		const result = components.reduce((result, component): boolean => {
			let fieldComparison: boolean;
			const { field, comparison, value } = component;

			const fieldValue = forcifiedFa[field as keyof SfGlobal.FrameAgreement] || 'null';

			if (comparison === '!=') {
				fieldComparison = fieldValue.toString() !== value;
			} else {
				fieldComparison = fieldValue.toString() === value;
			}

			const conditionalOperator = operators.shift();
			if (!conditionalOperator) {
				return result;
			} else if (conditionalOperator === '&&') {
				return result && fieldComparison;
			} else {
				return result || fieldComparison;
			}
		}, true);

		return result;
	}
	return false;
}
