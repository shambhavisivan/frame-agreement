'use strict';

let SF = {};

let sharedService = {
	SF: SF
};

export const truncateCPField = field => {
	var returnString = field;
	try {
		returnString = field.split('__')[1].replace(/_/g, ' ');
	} catch (err) {}
	return returnString;
};

export const log = {
	blue: log => {
		console.log('%c' + log, 'color: #0070d2');
	},
	green: log => {
		console.log('%c' + log, 'color: #4bca81');
	}
};

export default sharedService;
