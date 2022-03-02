import { deforcifyKeyName } from '../datasources/deforcify';
import { FAMClientError } from '../error/fam-client-error-handler';

interface ConfigExpression {
	expression: Array<ExpressionComponent>;
	operators: Array<string>;
}

interface ExpressionComponent {
	field: string;
	comparison: string;
	value: string;
}

export const evaluateConditionalExpression = <T, U extends keyof T>(
	expString: string,
	objectToEvaluate: T
): boolean => {
	const configExpression: ConfigExpression = parseConditionExpression(expString);

	if (!configExpression.expression || !configExpression.expression.length) {
		return false;
	}

	const expression = configExpression.expression;
	const operators = configExpression.operators;

	/*
	 *	1. For complexity reduction we added && operator on the beginning
	 *	2. To evaluate first component with default accumulator value of reduce method
	 */
	operators.unshift('&&');

	const result = expression.reduce((final, component) => {
		let fieldValue = 'null';
		let fieldComparison: boolean;
		// Detect relation
		if (component.field.includes('__r.') || component.field.includes('.')) {
			const relation = component.field.split('.');

			//Additional expression evaluation supports two levels of relation
			if (relation.length > 2) {
				fieldComparison = false;
			}

			if (objectToEvaluate[relation[0] as U]) {
				const subObject = objectToEvaluate[relation[0] as U];

				if (relation[1] && subObject[relation[1] as keyof T[U]]) {
					fieldValue = String(subObject[relation[1] as keyof T[U]]);
				}
			}
		} else {
			fieldValue = String(objectToEvaluate[component.field as keyof T]) || 'null';
		}

		if (component.comparison === '!=') {
			fieldComparison = fieldValue != component.value;
		} else {
			fieldComparison = fieldValue == component.value;
		}

		const nextOperator = operators.shift();

		if (nextOperator === '&&') {
			return final && fieldComparison;
		} else if (nextOperator === '||') {
			return final || fieldComparison;
		}

		return final;
	}, true);

	return result;
};

const parseConditionExpression = (expString: string): ConfigExpression => {
	const parsedConfigExpression = {} as ConfigExpression;

	// Extract operators
	let operatorsArray: Array<string> = [];

	// Remove parentheses, quotes
	expString = expString.replace(/('|"|\(|\))/g, '');

	let valuesArray = expString.match(/(?<=(!=|==))(.*?)(?=(&& | \|\| | &|$))/g) || [];
	valuesArray = valuesArray.map((str) => str.trim());

	// Remove spaces
	expString = expString.replace(/( |\(|\))/g, '');

	try {
		let operatorsString = expString.replace(/[\w.]+[!=]=[\w']+/g, ',');

		if (operatorsString.startsWith(',')) {
			operatorsString = operatorsString.substring(1);
		}

		if (operatorsString.endsWith(',')) {
			operatorsString = operatorsString.slice(0, -1);
		}

		operatorsArray = operatorsString.split(',');

		operatorsArray = operatorsArray[0] === '' ? [] : operatorsArray;
	} catch (err) {
		throw new FAMClientError('Cannot parse Expression');
	}

	const logic: Array<ExpressionComponent> = [];
	let logicComponents = expString.split(/&&|\|\|/);
	logicComponents = logicComponents[0] === '' ? [] : logicComponents;

	logicComponents.forEach((logicalOperator, index) => {
		let comparisonOperator: string;

		if (logicalOperator.includes('==')) {
			comparisonOperator = '==';
		} else if (logicalOperator.includes('!=')) {
			comparisonOperator = '!=';
		} else {
			return;
		}

		const fieldsCompared = logicalOperator.split(comparisonOperator);
		const field = fieldsCompared[0].includes('__r')
			? fieldsCompared[0]
					.split('.')
					.map((field) => deforcifyKeyName(field))
					.join('.')
			: deforcifyKeyName(fieldsCompared[0]);

		logic.push({
			field: field,
			comparison: comparisonOperator,
			value: valuesArray[index] || fieldsCompared[1]
		});
	});

	parsedConfigExpression.operators = operatorsArray || [];
	parsedConfigExpression.expression = logic || [];

	return parsedConfigExpression;
};
