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

export default sharedService;
