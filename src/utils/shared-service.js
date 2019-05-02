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

export const decodeEntities = (() => {
	// this prevents any overhead from creating the object each time
	var element = document.createElement('div');

	function decodeHTMLEntities(str) {
		let flagString = true;

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

export const log = {
	blue: log => {
		console.log('%c' + log, 'color: #0070d2');
	},
	green: log => {
		console.log('%c' + log, 'color: #4bca81');
	}
};

export default sharedService;
