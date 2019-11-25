'use strict';

let SF = {};

let sharedService = {
	SF: SF
};

export const toTitleCase = str => {
	var splitStr = str.toLowerCase().split(' ');
	for (var i = 0; i < splitStr.length; i++) {
		// You do not need to check if i is larger than splitStr length, as your for does that for you
		// Assign it back to the array
		splitStr[i] =
			splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	// Directly return the joined string
	return splitStr.join(' ');
};

export const truncateCPField = (field, titleCase) => {
	if (!redux_store.getState().settings.FACSettings.truncate_product_fields) {
		return field;
	}

	var returnString = field;
	try {
		let count = (returnString.match(/__/g) || []).length;

		if (count === 1) {
			returnString = field.split('__')[0].replace(/_/g, ' ');
		} else {
			returnString = field.split('__')[1].replace(/_/g, ' ');
		}
	} catch (err) {}

	return titleCase ? toTitleCase(returnString) : returnString;
};

export const isJson = str => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

export const openSFLink = Id => {
	var win = window.open(window.location.origin + '/' + Id, '_blank');
	win.focus();
};

export const isObject = a => !!a && a.constructor === Object;

export const copy = obj => JSON.parse(JSON.stringify(obj));

export const isOneOff = type => {
	if (typeof type !== 'string' || !type) {
		return false;
	}

	if (type === 'NRC') {
		return true;
	}

	let _type = type.toLowerCase().replace(/\s/g, '');
	return _type === 'oneoff' || _type === 'oneoffcharge';
};

export const isRecurring = type => {
	if (typeof type !== 'string' || !type) {
		return false;
	}

	if (type === 'RC') {
		return true;
	}

	let _type = type.toLowerCase().replace(/\s/g, '');
	return _type === 'recurring' || _type === 'recurringcharge';
};

export const decodeEntities = (() => {
	// this prevents any overhead from creating the object each time
	var element = document.createElement('div');

	function decodeHTMLEntities(str) {
		let flagString = true;

		if (!str) {
			return str;
		}

		if (typeof str !== 'string') {
			flagString = false;
			str = JSON.stringify(str);
		}

		if (str && typeof str === 'string') {
			// strip script/html tags
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, '');
			str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, '');
			element.innerHTML = str;
			str = element.textContent;
			element.textContent = '';
		}

		return flagString ? str : JSON.parse(str);
	}

	return decodeHTMLEntities;
})();

export const makeId = (n = 8) => {
	var text = '';
	var possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < n; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
};

export const parseExpression = (expString = '') => {
	let _parseExpression = {};

	// Extract operators
	let operatorsArray = [];

	// Remove spaces, parentheses, quotes
	expString = expString.replace(/( |'|"|\(|\))/g, '');

	try {
		let operatorsString = expString.replace(/\w+(!=|==)(\w|')+/g, ',');

		if (operatorsString.startsWith(',')) {
			operatorsString = operatorsString.substring(1);
		}

		if (operatorsString.endsWith(',')) {
			operatorsString = operatorsString.slice(0, -1);
		}

		operatorsArray = operatorsString.split(',');

		operatorsArray = operatorsArray[0] === '' ? [] : operatorsArray;
	} catch (err) {
		console.group('Cannot parse expression:');
		console.log(expString);
		console.log(err);
		console.groupEnd();
	}

	let logic = [];
	let logicComponens = expString.split(/&&|\|\|/);
	logicComponens = logicComponens[0] === '' ? [] : logicComponens;

	logicComponens.forEach(log => {
		let _comparisonOperator;

		if (log.includes('==')) {
			_comparisonOperator = '==';
		} else if (log.includes('!=')) {
			_comparisonOperator = '!=';
		} else {
			return;
		}

		let _fnv = log.split(_comparisonOperator);
		logic.push({
			field: _fnv[0],
			comparison: _comparisonOperator,
			value: _fnv[1]
		});
	});

	_parseExpression.operators = operatorsArray || [];
	_parseExpression.components = logic || [];

	return _parseExpression;
};

export const evaluateExpressionOnAgreement = (
	expressionObj = {},
	fa = window.mandatory('evaluateExpressionOnAgreement')
) => {
	if (!expressionObj.components || !expressionObj.components.length) {
		return false;
	}

	let components = copy(expressionObj.components);
	let operators = copy(expressionObj.operators);

	// For complexity reduction we added && operator on the beginning
	// to evaluate first component with default accumulator value of reduce method
	operators.unshift('&&');

	return components.reduce((final, component) => {
		let _fieldValue;
		let _fieldComparison;
		// Detect relation
		if (component.field.includes('__r.')) {
			let _relation = component.field.split('.');

			if (_relation.length > 2) {
				_fieldComparison = false;
				console.warn(
					'Additional expression evaluation supports two levels of relation: ',
					component.field
				);
			}

			try {
				_fieldValue = fa[_relation[0]][_relation[1]] || 'null';
			} catch (err) {
				console.warn(
					'Cannot evaluate expression: ',
					Object.values(component).join(' ')
				);
				console.warn(err);
			}
		} else {
			_fieldValue = fa[component.field] || 'null';
		}

		if (component.comparison === '!=') {
			_fieldComparison = _fieldValue.toString() != component.value;
		} else {
			_fieldComparison = _fieldValue.toString() == component.value;
		}

		let nextOperator = operators.shift();

		if (!nextOperator) {
			return final;
		} else if (nextOperator === '&&') {
			return final && _fieldComparison;
		} else if (nextOperator === '||') {
			return final || _fieldComparison;
		}
	}, true);
};

export const isMaster = fa => {
	// "Master Agreement" / "Frame Agreement"
	return (
		fa.hasOwnProperty('csconta__agreement_level__c') &&
		fa.csconta__agreement_level__c === 'Master Agreement'
	);
};

export const log = {
	blue: log => {
		console.log('%c' + log, 'color: #0070d2');
	},
	green: log => {
		console.log('%c' + log, 'color: #4bca81');
	},
	red: log => {
		console.log('%c' + log, 'color: #d9675d');
	},
	orange: log => {
		console.log('%c' + log, 'color: #ffa429');
	},
	bg: {
		blue: log => {
			console.log(
				'%c' + log,
				'background: #0070d2; color: white; padding: 1px 4px 1px 2px'
			);
		},
		green: log => {
			console.log(
				'%c' + log,
				'background: #4bca81; color: white; padding: 1px 4px 1px 2px'
			);
		},
		red: log => {
			console.log(
				'%c' + log,
				'background: #d9675d; color: white; padding: 1px 4px 1px 2px'
			);
		},
		orange: log => {
			console.log(
				'%c' + log,
				'background: #ffa429; color: white; padding: 1px 4px 1px 2px'
			);
		}
	}
};

export default sharedService;
