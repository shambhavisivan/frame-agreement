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

export const IsJsonString = str => {
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

export const organizeHeaderFields = (headerData, _activeFa) => {
	// Organize the header grid
	var field_rows = [];
	var row = [];
	var row_grid_count = 0;

	headerData = headerData.filter(f => {
		let retValue = true;

		if (f.hasOwnProperty('visible')) {
			if (f.visible === '') {
				return false;
			}

			// logic component
			f.visible
				.replace(/\s/g, '')
				.split(';')
				.forEach(lc => {
					let _b;
					let _operator;

					if (lc.includes('==')) {
						_operator = '==';
						_b = lc.split('==');
					} else {
						_operator = '!=';
						_b = lc.split('!=');
					}

					if (['true', 'false'].includes(_b[1])) {
						_b[1] = JSON.parse(_b[1]);
					}

					let _fieldValue = _activeFa[_b[0]];
					if ((_operator = '==')) {
						retValue = retValue && _fieldValue == _b[1];
					} else {
						retValue = retValue && _fieldValue != _b[1];
					}
				});
		}

		return retValue;
	});

	headerData.forEach(f => {
		if (row_grid_count + f.grid > 12) {
			field_rows.push([...row]);
			row = [];
			row_grid_count = 0;
		}
		row_grid_count += f.grid;
		row.push(f);
	});

	if (row.length) {
		field_rows.push(row);
	}

	return field_rows;
};

export const makeId = (n = 8) => {
	var text = '';
	var possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < n; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
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
