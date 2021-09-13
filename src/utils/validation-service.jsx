'use strict';
import { isFalsyExceptZero, log } from './shared-service';
// FALSE means valid

export const CP_VALIDATION = {
	oneOff: false,
	recurring: false
};

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
	// to avoid JS rounding errors
	return +returnValue.toFixed(8);
};

export const validateAddons = (data, attachment, initialFrameAgreementAttachment, status) => {
	let validation = window.SF.getAuthLevels();

	let detailedMap = {};

	if (Array.isArray(data)) {
		data.forEach(addon => {
			let negotiationFormat = {
				addon
			};

			if (isFalsyExceptZero(attachment[addon.Id]?.oneOff)) {
				negotiationFormat.negotiatedOneOff = attachment[addon.Id].oneOff;

				if (isFalsyExceptZero(initialFrameAgreementAttachment[addon.Id]?.oneOff)) {
					negotiationFormat.initialNegotiatedOneOff = initialFrameAgreementAttachment[addon.Id].oneOff;
				}
			}

			if (isFalsyExceptZero(attachment[addon.Id]?.recurring)) {
				negotiationFormat.negotiatedRecurring = attachment[addon.Id].recurring;

				if (isFalsyExceptZero(initialFrameAgreementAttachment[addon.Id]?.recurring)) {
					negotiationFormat.initialNegotiatedRecurring = initialFrameAgreementAttachment[addon.Id].recurring;
				}
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
			validation[negotiationFormat.addon.cspmb__Authorization_Level__c].forEach(thresh => {
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
						isFalsyExceptZero(negotiationFormat.negotiatedOneOff) &&
						!isIgnoreAuthorization(
							negotiationFormat.initialNegotiatedOneOff,
							negotiationFormat.negotiatedOneOff,
							status
						) &&
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
								(thresh.cspmb__Discount_Type__c === 'Percentage' ? '%' : ' units') +
								') -> inputed value: ' +
								negotiationFormat.negotiatedOneOff
						);
						errataMap[addon.Id].oneOff = true;
					}

					if (
						isFalsyExceptZero(negotiationFormat.negotiatedRecurring) &&
						!isIgnoreAuthorization(
							negotiationFormat.initialNegotiatedRecurring,
							negotiationFormat.negotiatedRecurring,
							status
						) &&
						negotiationFormat.negotiatedRecurring < minRecurring.toFixedNumber()
					) {
						_logMessages.push(
							'Minimal value for recurring on ' +
								addon.Name +
								' is ' +
								minRecurring.toFixedNumber() +
								' (-' +
								thresh.cspmb__Discount_Threshold__c +
								'' +
								(thresh.cspmb__Discount_Type__c === 'Percentage' ? '%' : ' units') +
								') -> inputed value: ' +
								negotiationFormat.negotiatedRecurring
						);
						errataMap[addon.Id].recurring = true;
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

export const validateProduct = (data, initialFrameAgreementData, status) => {
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

	let errataMap = CP_VALIDATION;

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
					isFalsyExceptZero(data.negotiatedOneOff) &&
					!isIgnoreAuthorization(
						initialFrameAgreementData?.negotiatedOneOff,
						data.negotiatedOneOff,
						status
					) &&
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
							(thresh.cspmb__Discount_Type__c === 'Percentage' ? '%' : ' units') +
							') -> inputed value: ' +
							data.negotiatedOneOff
					);
					errataMap.oneOff = true;
				}

				if (
					isFalsyExceptZero(data.negotiatedRecurring) &&
					!isIgnoreAuthorization(
						initialFrameAgreementData?.negotiatedRecurring,
						data.negotiatedRecurring,
						status
					) &&
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
							(thresh.cspmb__Discount_Type__c === 'Percentage' ? '%' : ' units') +
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

export const validateCharges = (data, authLevel, attachment, initialFrameAgreementAttachment, status) => {
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
			let initialNegotiatedValue;
			try {
				negotiatedValue = attachment[charge.Id][charge._type];

				if (initialFrameAgreementAttachment[charge.Id]) {
					initialNegotiatedValue = initialFrameAgreementAttachment[charge.Id][charge._type];
				}
			} catch (err) {}

			let negotiationFormat = {
				charge,
				negotiatedValue,
				initialNegotiatedValue
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
						isFalsyExceptZero(negotiationFormat.negotiatedValue) &&
						!isIgnoreAuthorization(
							negotiationFormat.initialNegotiatedValue,
							negotiationFormat.negotiatedValue,
							status
						) &&
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
								(thresh.cspmb__Discount_Type__c === 'Percentage' ? '%' : ' units') +
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

export const validateRateCardLines = (rcData, data2, initialFrameAgreementAttachment, status) => {
	let validation = window.SF.getAuthLevels();

	let detailedMap = {};
	let rcArr, rcl, attachment, authLevel;

	if (Array.isArray(rcData)) {
		rcArr = rcData;
		attachment = data2;
	} else {
		rcl = rcData;
		authLevel = data2;
	}

	if (rcArr) {
		rcArr.forEach(_rc => {
			_rc.rateCardLines.forEach(_rcl => {
				let negotiationFormat = {
					rcl: _rcl,
					negotiatedValue: attachment[_rc.Id] && attachment[_rc.Id][_rcl.Id]
				};

				if (isFalsyExceptZero(negotiationFormat.negotiatedValue)) {

					if (initialFrameAgreementAttachment[_rc.Id]) {
						negotiationFormat.initialNegotiatedValue = initialFrameAgreementAttachment[_rc.Id][_rcl.Id]
					}
					detailedMap = {
						...detailedMap,
						...validate(negotiationFormat, _rc.authId)
					};
				}
			});
		});
	} else if (rcl) {
		return validate(rcData, authLevel);
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

					if (!isIgnoreAuthorization(
							negotiationFormat.initialNegotiatedValue,
							negotiationFormat.negotiatedValue,
							status
						) &&
						negotiationFormat.negotiatedValue.toFixedNumber() < minValue.toFixedNumber()) {
						_logMessages.push(
							'Minimal value for  ' +
								rcl.Name +
								' is ' +
								minValue.toFixedNumber() +
								' (-' +
								thresh.cspmb__Discount_Threshold__c +
								'' +
								(thresh.cspmb__Discount_Type__c === 'Percentage' ? '%' : ' units') +
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

/*
 * Check initial negotiated value(before user making changes) and current negotiateData(after user making any changes)
 * to prevent approval needed flag being flipped to true
 */
const isIgnoreAuthorization = (initialNegotiatedValue, currentNegotiatedValue, status) => {
	let ignoreAuthorization = false;

	if (status?.facApprovedStatus && status.frameAgreementStatus === status.facApprovedStatus) {

		if (initialNegotiatedValue === currentNegotiatedValue) {
			ignoreAuthorization = true;
		}
	}
	return ignoreAuthorization;
}