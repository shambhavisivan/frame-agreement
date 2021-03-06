'use strict';

let SF = {};
let orgUrl = null;

let sharedService = {
	SF: SF
};

let getDecimals = function(value) {
	if (value % 1 != 0) return value.toString().split('.')[1].length;
	return 0;
};

export const percIncrease = (a, b) => {
	let percent;
	if (b !== 0) {
		if (a !== 0) {
			percent = ((b - a) / a) * 100;
		} else {
			percent = b * 100;
		}
	} else {
		percent = -a * 100;
	}
	return percent.toFixedNumber();
};

export const isNumber = num => {
	let result = false;

	if (typeof num === 'boolean') {
		return false;
	}

	try {
		result = Number.isInteger(Math.floor(num)) && num !== null;
	} catch (err) {}
	return result;
};

export const toTitleCase = str => {
	var splitStr = str.toLowerCase().split(' ');
	for (var i = 0; i < splitStr.length; i++) {
		// You do not need to check if i is larger than splitStr length, as your for does that for you
		// Assign it back to the array
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
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

//Partner Community has path-prefix else fallback with window location
export const openSFLink = async (Id) => {

	if (!orgUrl) {
		orgUrl = await window.SF.invokeAction('getOrgUrl', []).then(response => {
			return response;
		});
	}

	let url = orgUrl;

	if (url) {
		url = url + '/' + Id;
	} else {
		url = window.location.origin + '/' + Id
	}

	if (window.sforce && window.sforce.one) {
		window.sforce.one.navigateToSObject(Id);
	} else {
		var win = window.open(url, '_blank');
		win.focus();
	}
};

export const validateCSV = str => {
	if (typeof str !== 'string') {
		return false;
	}

	let returnBoolean = str;
	try {
		returnBoolean = /^[a-zA-Z0-9-_]+(?:, ?[a-zA-Z0-9-_]+)*$/gm.test(
			str.replace(/(?:\r\n|\r|\n|\s)/g, '')
		);
	} catch (e) {
		console.warn(e);
	}
	return returnBoolean;
};

export const isObject = a => !!a && a.constructor === Object;

export const copy = (obj) => {
	try {
		return JSON.parse(JSON.stringify(obj));
	} catch (e) {
		return obj;
	}
};

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
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < n; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
};

export const parseExpression = (expString = '') => {
	let _parseExpression = {};

	// Extract operators
	let operatorsArray = [];

	// Remove parentheses, quotes
	expString = expString.replace(/('|")/g, '');

	let valuesArray = expString.match(/(?<=(!=|==))(.*?)(?=(&& | \|\| | &|$))/g) || [];
	valuesArray = valuesArray.map(str => str.trim());

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
		console.group('Cannot parse expression:');
		console.log(expString);
		console.log(err);
		console.groupEnd();
	}

	let logic = [];
	let logicComponens = expString.split(/&&|\|\|/);
	logicComponens = logicComponens[0] === '' ? [] : logicComponens;

	logicComponens.forEach((log, i) => {
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
			value: valuesArray[i] || _fnv[1]
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
				console.warn('Cannot evaluate expression: ', Object.values(component).join(' '));
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

export const getFieldLabel = (obj, field) => {
	let retVal;
	try {
		retVal = window.SF.fieldLabels[obj][field.toLowerCase()];
	} catch (err) {
		// console.error(err);
	}
	return retVal;
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
			console.log('%c' + log, 'background: #0070d2; color: white; padding: 1px 4px 1px 2px');
		},
		green: log => {
			console.log('%c' + log, 'background: #4bca81; color: white; padding: 1px 4px 1px 2px');
		},
		red: log => {
			console.log('%c' + log, 'background: #d9675d; color: white; padding: 1px 4px 1px 2px');
		},
		orange: log => {
			console.log('%c' + log, 'background: #ffa429; color: white; padding: 1px 4px 1px 2px');
		}
	}
};

export function isDiscountAllowed(chargeType, productOrAddon) {
	const chargeAllowed = {
		oneOff: productOrAddon.cspmb__Is_One_Off_Discount_Allowed__c,
		recurring: productOrAddon.cspmb__Is_Recurring_Discount_Allowed__c
	};

	return chargeAllowed[chargeType];
}

export function negotiateData(dataObject, productList, productsInAttachment) {
	const cp = productList.find(_cp => _cp.Id === dataObject.priceItemId);

	if (!cp) {
		console.error(
			"Cannot find commercial product with Id " +
				dataObject.priceItemId +
				" in active Frame Agreement!"
		);
		return;
	}
	if (!dataObject.hasOwnProperty("value")) {
		console.error("No value provided for negotiation!");
		return;
	}
	// ********************************** Addons
	if (dataObject.hasOwnProperty("cpAddon")) {
		if (dataObject.value.hasOwnProperty("oneOff")) {
			productsInAttachment[dataObject.priceItemId]._addons[
				dataObject.cpAddon
			].oneOff = dataObject.value.oneOff;
		}
		if (dataObject.value.hasOwnProperty("recurring")) {
			productsInAttachment[dataObject.priceItemId]._addons[
				dataObject.cpAddon
			].recurring = dataObject.value.recurring;
		}
	}
	// ********************************* Charge
	else if (dataObject.hasOwnProperty("charge")) {
		// Charge validation
		let charge = cp._charges.find((_ch) => _ch.Id === dataObject.charge);
		let type;
		if (charge.chargeType === "One-off Charge") {
			type = "oneOff";
		}
		if (charge.chargeType === "Recurring Charge") {
			type = "recurring";
		}
		if (!dataObject.value.hasOwnProperty(type)) {
			console.error(
				"Pricing element " + charge.Id + " has invalid charge type!"
			);
			return;
		}

		productsInAttachment[dataObject.priceItemId]._charges[dataObject.charge][type] =
			dataObject.value[type];
	}
	// *********************************
	else if (dataObject.hasOwnProperty("rateCard")) {
		// RCL
		if (!dataObject.hasOwnProperty("rateCardLine")) {
			console.error("No rate card line Id provided!");
			return;
		}

		dataObject.value = +dataObject.value;

		if (
			typeof dataObject.value !== "number" &&
			!Number.isNaN(dataObject.value)
		) {
			console.error("Value for RCL not integer!");
			return;
		}

		productsInAttachment[dataObject.priceItemId]._rateCards[dataObject.rateCard][
			dataObject.rateCardLine
		] = dataObject.value;
	}
	// *********************************
	else {
		// Product negotiation
		productsInAttachment[dataObject.priceItemId]._product = {
			...productsInAttachment[dataObject.priceItemId]._product,
			...dataObject.value,
		};
	}
	// *********************************
}

const renameAddonFields = (addonObject, addonAssocId) => {
	const result = {
		Id: addonAssocId,
		cspmb__Add_On_Price_Item__c: addonObject.id,
		cspmb__One_Off_Charge__c: addonObject.pricing?.listOneOffPrice,
		cspmb__Recurring_Charge__c: addonObject.pricing?.listRecurringPrice,
		cspmb__Add_On_Price_Item__r: {
			Id: addonObject.id,
			Name: addonObject.name,
			cspmb__Effective_End_Date__c: addonObject.effectiveEndDate,
			cspmb__Effective_Start_Date__c: addonObject.effectiveStartDate,
			cspmb__One_Off_Charge__c: addonObject.pricing?.listOneOffPrice,
			cspmb__Recurring_Charge__c: addonObject.pricing?.listRecurringPrice,
			cspmb__Add_On_Price_Item_Code__c: addonObject.commercialProductCode
		},
	};

	if (addonObject.customFields) {
		addonObject.customFields.forEach(field => {
			try {
			    result.cspmb__Add_On_Price_Item__r[field.key] = JSON.parse(field.value);
		    } catch(e) {
				result.cspmb__Add_On_Price_Item__r[field.key] = field.value;
			}
		})
	}

	return result;
}

const restructureAddonData = availableChildProducts => {
	const addons = [];

	const getAssocId = product => {
		const assocId = product.externalIds.find(
			(id) => id.key === "associationSfId"
		)?.value;

		if (!assocId) {
			throw new Error("Unable to find addon association ID");
		}

		return assocId;
	};

	availableChildProducts.forEach(productOrGroup => {
		if (productOrGroup.product) {
			const assocId = getAssocId(productOrGroup);
			addons.push(renameAddonFields(productOrGroup.product, assocId));
		} else if (productOrGroup.group && productOrGroup.group.members) {
			productOrGroup.group.members.forEach(member => {
				const assocId = getAssocId(member);
				addons.push(renameAddonFields(member.product, assocId));
			})
		}
	});

	return addons;
}

export const restructureProductData = productData => {
	return productData.reduce((result, product) => {
		result[product.id] = {
			addons: restructureAddonData(product.availableChildProducts),
		};

		return result;
	}, {});
}

export const sortDynamicGroupsBySequence = (aDynamicGroup, bDynamicGroup) => {
	if (
		aDynamicGroup.csfamext__sequence__c ==
		bDynamicGroup.csfamext__sequence__c
	) {
		return 0;
	} else if (
		isNaN(aDynamicGroup.csfamext__sequence__c) ||
		(aDynamicGroup.csfamext__sequence__c !== 0 &&
			!aDynamicGroup.csfamext__sequence__c)
	) {
		return 1;
	} else if (
		isNaN(bDynamicGroup.csfamext__sequence__c) ||
		(bDynamicGroup.csfamext__sequence__c !== 0 &&
			!bDynamicGroup.csfamext__sequence__c)
	) {
		return -1;
	}
	return aDynamicGroup.csfamext__sequence__c - bDynamicGroup.csfamext__sequence__c;
}

//no numeric props can have such high values, so assuming this to be date starting from 01/01/2000
export const convertMillisToLocaleDateString = (timeInMillis) => {
	return new Date(timeInMillis).toLocaleDateString('en-GB');
}

export const hasValidExpression = (data) => {
	if (!data.csfamext__expression__c)  {
		return false;
	}

	if (isJson(data.csfamext__expression__c)) {
		const parsedExpression = JSON.parse(data.csfamext__expression__c);

		return Object.keys(parsedExpression).some(
			(key) => parsedExpression[key]
		);
	}
}

export const mergePrsPpdmProductInfo = (prsProducts, ppdmProducts) => {
	let prsMap = prsProducts.reduce((mapAccumulator, product) => {
		mapAccumulator.set(product.id, product);

		return mapAccumulator;
	  }, new Map());

	ppdmProducts.forEach(product => {
		const prsProduct = prsMap.get(product.Id);
		product.commercialProductCode = prsProduct.commercialProductCode;

		if (prsProduct.offerCode) {
			product.offerCode = prsProduct.offerCode;
		}
	});

	return ppdmProducts;
}

export const restructureReplacementCp = (cpReplacementPrsData, replacementCpCodes) => {
	let prsMap = cpReplacementPrsData.reduce((mapAccumulator, product) => {
		mapAccumulator.set(product.id, product);

		return mapAccumulator;
	  }, new Map());
	let restructuredCpData = restructureProductData(cpReplacementPrsData);

	let replacementDataMap = Object.keys(restructuredCpData).reduce((replacementDataMap, productId) => {
		let replacementData = {};
		const commercialProduct = prsMap.get(productId);
		const commercialProductAddOn = restructuredCpData[productId];
		replacementData.new_cp = {
			Id: commercialProduct.id,
			Name: commercialProduct.name,
			cspmb__Price_Item_Code__c: commercialProduct.commercialProductCode,
			commercialProductCode: commercialProduct.commercialProductCode,
		};
		replacementDataMap[
			replacementCpCodes.get(commercialProduct.commercialProductCode)
		] = replacementData;

		return replacementDataMap;
	}, {});

	return replacementDataMap;
}

export const isFalsyExceptZero = (value) => {
	return !(value || value === 0);
}

export default sharedService;