import React from 'react';
import { isNumber } from '~/src/utils/shared-service';

const NumberFormat = ({ value }) => {
	if (typeof value === 'string') {
		if (isNaN(Number(value))) {
			return value;
		} else {
			value = Number(value);
		}
	}

	return isNumber(value) ? value.toFixedNumber().toLocaleString(navigator.language) : 'N/A';
};

export const getLocaleNumber = value => {
	let result = value;

	try {
		result = value.toFixedNumber().toLocaleString(navigator.language);
	} catch (err) {}

	return result;
};

export default NumberFormat;
