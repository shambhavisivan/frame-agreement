'use strict';

let SF = {};

let sharedService = {
	SF: SF
};

export const truncateCPField = field => {
    var returnString = field;
    try {
 
        let count = (returnString.match(/__/g) || []).length;
 
        if (count === 1) {
            returnString = field.split('__')[0].replace(/_/g, ' ');
        } else {
            returnString = field.split('__')[1].replace(/_/g, ' ');
        }
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
