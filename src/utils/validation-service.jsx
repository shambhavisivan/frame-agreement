'use strict';
import { log } from './shared-service';
// FALSE means valid

const getMinValue = (value, discount, type) => {
	let returnValue = 0;
	if (type === 'Percentage') {
		try {
			returnValue = ((100 - discount) * value) / 100;
		} catch (err) {}
	} else if (type === 'Amount') {
		try {
			returnValue = value - discount;
		} catch (err) {}
	}
	return returnValue;
};

export const validateAddons = (data, attachment) => {
	let validation = window.SF.getAuthLevels();

	let detailedMap = {};

	if (Array.isArray(data)) {
		data.forEach(addon => {
			let negotiationFormat = {
				addon
			};

			if (
				attachment[addon.Id] &&
				typeof attachment[addon.Id].oneOff !== 'undefined'
			) {
				negotiationFormat.negotiatedOneOff = attachment[addon.Id].oneOff;
			}

			if (
				attachment[addon.Id] &&
				typeof attachment[addon.Id].recurring !== 'undefined'
			) {
				negotiationFormat.negotiatedRecurring = attachment[addon.Id].recurring;
			}

			detailedMap = { ...detailedMap, ...validate(negotiationFormat) };
		});
	} else {
		return validate(data);
	}

	function validate(negotiationFormat) {
		let addon = negotiationFormat.addon;
		let errataMap = { [addon.Id]: { oneOff: false, recurring: false } };

		if (!negotiationFormat.addon.cspmb__Authorization_Level__c) {
			return errataMap;
		}

		let _logMessages = [];

		validation[negotiationFormat.addon.cspmb__Authorization_Level__c] &&
			validation[negotiationFormat.addon.cspmb__Authorization_Level__c].forEach(
				thresh => {
					// Validate threshold
					if (!thresh.hasOwnProperty('cspmb__Discount_Threshold__c')) {
						console.log('No discount on threshold ', thresh.Name);
					} else {
						let minOneOff =
							getMinValue(
								addon.cspmb__One_Off_Charge__c,
								thresh.cspmb__Discount_Threshold__c,
								thresh.cspmb__Discount_Type__c
							) || 0;
						let minRecurring =
							getMinValue(
								addon.cspmb__Recurring_Charge__c,
								thresh.cspmb__Discount_Threshold__c,
								thresh.cspmb__Discount_Type__c
							) || 0;

						if (
							negotiationFormat.negotiatedOneOff != null &&
							negotiationFormat.negotiatedOneOff < minOneOff.toFixedNumber()
						) {
							_logMessages.push(
								'Minimal value for oneOff on ' +
									addon.Name +
									' is ' +
									minOneOff.toFixedNumber() +
									' (-' +
									thresh.cspmb__Discount_Threshold__c +
									'' +
									(thresh.cspmb__Discount_Type__c === 'Percentage'
										? '%'
										: ' units') +
									') -> inputed value: ' +
									negotiationFormat.negotiatedOneOff
							);
							errataMap[addon.Id].oneOff = true;
						}

						if (
							negotiationFormat.negotiatedRecurring != null &&
							negotiationFormat.negotiatedRecurring <
								minRecurring.toFixedNumber()
						) {
							_logMessages.push(
								'Minimal value for recurring on ' +
									addon.Name +
									' is ' +
									minRecurring.toFixedNumber() +
									' (-' +
									thresh.cspmb__Discount_Threshold__c +
									'' +
									(thresh.cspmb__Discount_Type__c === 'Percentage'
										? '%'
										: ' units') +
									') -> inputed value: ' +
									negotiationFormat.negotiatedRecurring
							);
							errataMap[addon.Id].recurring = true;
						}
					}
				}
			);

		if (_logMessages.length > 1) {
			console.group('Validation warnings:');
			_logMessages.forEach(log.orange);
			console.groupEnd();
		} else {
			_logMessages.forEach(log.orange);
		}

		return errataMap;
	}
	return detailedMap;
};

export const validateProduct = data => {
	/*
    {
    	oneOff: Integer,
    	negotiatedOneOff: Integer,
    	recurring: Integer,
    	negotiatedRecurring: Integer,
    	authLevel: String.
    	Name: String
    }
    */
	let validation = window.SF.getAuthLevels();

	let errataMap = {
		oneOff: false,
		recurring: false
	};

	if (!data.authLevel) {
		return errataMap;
	}

	let _logMessages = [];

	validation[data.authLevel] &&
		validation[data.authLevel].forEach(thresh => {
			// Validate threshold
			if (!thresh.hasOwnProperty('cspmb__Discount_Threshold__c')) {
				// detailedMap[verdict] = true;
				console.log('No discount on threshold ', thresh.Name);
			} else {
				let minOneOff =
					getMinValue(
						data.oneOff,
						thresh.cspmb__Discount_Threshold__c,
						thresh.cspmb__Discount_Type__c
					) || 0;
				let minRecurring =
					getMinValue(
						data.recurring,
						thresh.cspmb__Discount_Threshold__c,
						thresh.cspmb__Discount_Type__c
					) || 0;

				if (
					data.negotiatedOneOff != null &&
					data.negotiatedOneOff < minOneOff.toFixedNumber()
				) {
					_logMessages.push(
						'Minimal value for oneOff on ' +
							data.Name +
							' is ' +
							minOneOff.toFixedNumber() +
							' (-' +
							thresh.cspmb__Discount_Threshold__c +
							'' +
							(thresh.cspmb__Discount_Type__c === 'Percentage'
								? '%'
								: ' units') +
							') -> inputed value: ' +
							data.negotiatedOneOff
					);
					errataMap.oneOff = true;
				}

				if (
					data.negotiatedRecurring != null &&
					data.negotiatedRecurring < minRecurring.toFixedNumber()
				) {
					_logMessages.push(
						'Minimal value for recurring on ' +
							data.Name +
							' is ' +
							minRecurring.toFixedNumber() +
							' (-' +
							thresh.cspmb__Discount_Threshold__c +
							'' +
							(thresh.cspmb__Discount_Type__c === 'Percentage'
								? '%'
								: ' units') +
							') -> inputed value: ' +
							data.negotiatedRecurring
					);
					errataMap.recurring = true;
				}
			}
		});

	if (_logMessages.length > 1) {
		console.group('Validation warnings:');
		_logMessages.forEach(log.orange);
		console.groupEnd();
	} else {
		_logMessages.forEach(log.orange);
	}

	return errataMap;
};

export const validateCharges = (data, authLevel, attachment) => {
	let validation = window.SF.getAuthLevels();

	/*
	/*
      let negotiationFormat = {
        charge: Charge
        negotiatedValue: Integer,
      }
	*/

	/*
		a1I1t000001WkzjEAC: {reccuring: 9}
		a1I1t000001WkzoEAC: {oneOff: 4}
	*/

	/*
        chargeLabel: charge.Name,
        chargeId: charge.Id,
        type: charge._type
        value: charge[charge._type],
	*/

	let detailedMap = {};

	if (attachment) {
		data.forEach(charge => {
			let negotiatedValue;
			try {
				negotiatedValue = attachment[charge.Id][charge._type];
			} catch (err) {}

			let negotiationFormat = {
				charge,
				negotiatedValue
			};

			detailedMap = {
				...detailedMap,
				...validate(negotiationFormat, authLevel)
			};
		});
	} else if (!Array.isArray(data)) {
		return validate(data, authLevel);
	}

	function validate(negotiationFormat, authLevel) {
		let charge = negotiationFormat.charge;
		let errataMap = { [charge.Id]: false };

		if (!authLevel || !validation[authLevel]) {
			return errataMap;
		}

		let _logMessages = [];

		validation[authLevel] &&
			validation[authLevel].forEach(thresh => {
				// Validate threshold
				if (!thresh.hasOwnProperty('cspmb__Discount_Threshold__c')) {
					console.log('No discount on threshold ', thresh.Name);
				} else if (thresh.Name === charge.Name) {
					let minValue =
						getMinValue(
							charge[charge._type],
							thresh.cspmb__Discount_Threshold__c,
							thresh.cspmb__Discount_Type__c
						) || 0;

					if (
						typeof negotiationFormat.negotiatedValue !== 'undefined' &&
						negotiationFormat.negotiatedValue < minValue.toFixedNumber()
					) {
						_logMessages.push(
							'Minimal value for oneOff on ' +
								charge.Name +
								' is ' +
								minValue.toFixedNumber() +
								' (-' +
								thresh.cspmb__Discount_Threshold__c +
								'' +
								(thresh.cspmb__Discount_Type__c === 'Percentage'
									? '%'
									: ' units') +
								') -> inputed value: ' +
								negotiationFormat.negotiatedValue
						);
						errataMap[charge.Id] = true;
					}
				}
			});

		if (_logMessages.length > 1) {
			console.group('Validation warnings:');
			_logMessages.forEach(log.orange);
			console.groupEnd();
		} else {
			_logMessages.forEach(log.orange);
		}

		return errataMap;
	}
	return detailedMap;
};

export const validateRateCardLines = (data, data2) => {
	let validation = window.SF.getAuthLevels();

	let detailedMap = {};
	let rcArr, rcl, attachment, authLevel;

	if (Array.isArray(data)) {
		rcArr = data;
		attachment = data2;
	} else {
		rcl = data;
		authLevel = data2;
	}

	if (rcArr) {
		rcArr.forEach(_rc => {
			_rc.rateCardLines.forEach(_rcl => {
				let negotiationFormat = {
					rcl: _rcl,
					negotiatedValue: attachment[_rc.Id] && attachment[_rc.Id][_rcl.Id]
				};

				if (negotiationFormat.negotiatedValue != null) {
					detailedMap = {
						...detailedMap,
						...validate(negotiationFormat, _rc.authId)
					};
				}
			});
		});
	} else if (rcl) {
		return validate(data, authLevel);
	}

	function validate(negotiationFormat, authLevel) {
		let rcl = negotiationFormat.rcl;
		let errataMap = { [rcl.Id]: false };

		if (!authLevel || !validation[authLevel]) {
			return errataMap;
		}

		let _logMessages = [];

		validation[authLevel] &&
			validation[authLevel].forEach(thresh => {
				// Validate threshold
				if (!thresh.hasOwnProperty('cspmb__Discount_Threshold__c')) {
					console.log('No discount on threshold ', thresh.Name);
				} else if (thresh.Name === rcl.Name) {
					let minValue =
						getMinValue(
							rcl.cspmb__rate_value__c,
							thresh.cspmb__Discount_Threshold__c,
							thresh.cspmb__Discount_Type__c
						) || 0;

					if (negotiationFormat.negotiatedValue < minValue.toFixedNumber()) {
						_logMessages.push(
							'Minimal value for  ' +
								rcl.Name +
								' is ' +
								minValue.toFixedNumber() +
								' (-' +
								thresh.cspmb__Discount_Threshold__c +
								'' +
								(thresh.cspmb__Discount_Type__c === 'Percentage'
									? '%'
									: ' units') +
								') -> inputed value: ' +
								negotiationFormat.negotiatedValue
						);
						errataMap[rcl.Id] = true;
					}
				}
			});

		if (_logMessages.length > 1) {
			console.group('Validation warnings:');
			_logMessages.forEach(log.orange);
			console.groupEnd();
		} else {
			_logMessages.forEach(log.orange);
		}

		return errataMap;
	}
	return detailedMap;
};
