import axios from 'axios';
import sharedService from '../utils/shared-service';

// export const toggleModal = data => ({ type: TOGGLE_MODAL, payload: data }); // DIRECTLY ACTIONED TO STORE

// ***********************************************************************
export const _registerMethod = (name, method) => ({
	type: 'REGISTER_METHOD',
	payload: { name, method }
});

export function registerMethod(name, method) {
	return function(dispatch) {
		dispatch(_registerMethod(name, method));
	};
}

export function performAction(className, params) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('performAction', [className, params]).then(
				response => {
					resolve(response);
					return response;
				}
			);
		});
	};
}
// ***********************************************************************

export const _createPricingRuleGroup = () => ({
	type: 'CREATEA_PRG',
	payload: {}
});

export const _decomposeAttachment = (data, prId) => ({
	type: 'DECOMPOSE_ATTACHMENT',
	payload: { data, prId }
});

export function createPricingRuleGroup() {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('createPricingRuleGroup').then(prId => {
				resolve(prId);
				return prId;
			});
		});
	};
}

export function decomposeAttachment(data, prId, faId) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('decomposeAttachment', [
				JSON.stringify(data),
				prId,
				faId
			]).then(message => {
				// dispatch(_decomposeAttachment(data, prId));
				resolve(message);
				return message;
			});
		});
	};
}

export function undoDecomposition(prId) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('undoDecomposition', [prId]).then(message => {
				// dispatch(_decomposeAttachment(data, prId));
				resolve(message);
				return message;
			});
		});
	};
}

// ***********************************************************************
export const recieveApprovalHistory = (faId, data) => ({
	type: 'GET_APPROVAL_HISTORY',
	payload: { faId, data }
});

export function getApprovalHistory(faId) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('getApprovalHistory', [faId.slice(0, 15)]).then(
				response => {
					try {
						response.listProcess = response.listProcess || [];
					} catch (err) {}
					dispatch(recieveApprovalHistory(faId, response));
					resolve(response);
					return response;
				}
			);
		});
	};
}

/*, Reject, Removed, Approve
 */
export function approveRejectRecallRecord(recordId, comments, action) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('approveRejectRecallRecord', [
				recordId.slice(0, 15),
				comments,
				action
			]).then(response => {
				resolve(response);
				return response;
			});
		});
	};
}

export const _getFrameAgreement = result => ({
	type: 'GET_FA',
	payload: result
});

export function getFrameAgreement(faId) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('getFrameAgreement', [faId]).then(response => {
				dispatch(_getFrameAgreement(response));
				resolve(response);
				return response;
			});
		});
	};
}

export function setFrameAgreementState(faId, newStatus) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('setFrameAgreementState', [faId, newStatus]).then(
				response => {
					dispatch(
						_getFrameAgreement({ Id: faId, csconta__Status__c: newStatus })
					);
					resolve(response);
					return response;
				}
			);
		});
	};
}

export const _createNewVersionOfFrameAgrement = newFa => ({
	type: 'NEW_VERSION',
	payload: newFa
});

export function createNewVersionOfFrameAgrement(faId) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('createNewVersionOfFrameAgrement', [faId]).then(
				response => {
					dispatch(_createNewVersionOfFrameAgrement(response));
					response._ui = {
						commercialProducts: [],
						attachment: null
					};
					resolve(response);
					return response;
				}
			);
		});
	};
}

export function reassignApproval(recordId, newActorId) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('reassignApproval', [
				recordId.slice(0, 15),
				newActorId
			]).then(response => {
				resolve(response);
				return response;
			});
		});
	};
}

export function submitForApproval(faId) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('submitForApproval', [faId.slice(0, 15)]).then(
				response => {
					resolve(response);
					return response;
				}
			);
		});
	};
}
// ***********************************************************************
export const toggleFieldVisibility = index => ({
	type: 'TOGGLE_FIELD_VISIBILITY',
	payload: index
});

// ***********************************************************************
export const setValidation = (
	priceItemId = null,
	type = null,
	data = null
) => ({
	type: 'SET_VALIDATION',
	payload: { priceItemId, type, data }
});

export const _removeToast = id => ({
	type: 'REMOVE_TOAST',
	payload: { id }
});

export const _clearToasts = () => ({
	type: 'CLEAR_TOAST_QUEUE',
	payload: {}
});

export const addToast = (type, title, message, timeout) => {
	return {
		type: 'ADD_TOAST',
		payload: { type, title, message, timeout }
	};
};

export function createToast(type, title, message, timeout = 3000) {
	return function(dispatch) {
		dispatch(addToast(type, title, message, timeout));
	};
}

export function removeToast(id) {
	return function(dispatch) {
		dispatch(_removeToast(id));
	};
}

export function clearToasts(id) {
	return function(dispatch) {
		dispatch(_clearToasts());
	};
}

// ***********************************************************************
export const recieveAppSettings = result => ({
	type: 'RECIEVE_SETTINGS',
	payload: result
});

export function getAppSettings() {
	return function(dispatch) {
		// dispatch(requestAppSettings());

		return new Promise((resolve, reject) => {
			window.SF.invokeAction('getAppSettings', [window.SF.param.account]).then(
				response => {
					setTimeout(() => {
						dispatch(recieveAppSettings(response));
						resolve(response);
						return response;
					}, 1000);
				}
			);
		});
	};
}

export const recieveCloneFrameAgreement = result => ({
	type: 'RECIEVE_CLONE_FA',
	payload: result
});

export function cloneFrameAgreement(faId) {
	return function(dispatch) {
		// dispatch(requestAppSettings());

		return new Promise((resolve, reject) => {
			window.SF.invokeAction('cloneFrameAgreement', [faId]).then(response => {
				dispatch(recieveCloneFrameAgreement(response));
				resolve(response);
				return response;
			});
		});
	};
}

// ***********************************************************************
export const recieveSaveAttachment = (parentId, data) => ({
	type: 'SAVE_ATTACHMENT',
	payload: { parentId, data }
});

export function saveAttachment(parentId, data) {
	console.log(parentId);
	console.log(data);

	return function(dispatch) {
		return new Promise((resolve, reject) => {
			if (typeof data !== 'string') {
				data = JSON.stringify(data);
			}
			window.SF.invokeAction('saveAttachment', [parentId, data]).then(
				response => {
					dispatch(recieveSaveAttachment(response));
					resolve(response);
					return response;
				}
			);
		});
	};
}
// ***********************************************************************

export const _deleteFrameAgreement = priceItemId => ({
	type: 'DELETE_FA',
	payload: priceItemId
});

export function deleteFrameAgreement(priceItemId) {
	return function(dispatch) {
		// dispatch(requestPriceItemData());

		return new Promise((resolve, reject) => {
			window.SF.invokeAction('deleteFrameAgreement', [priceItemId]).then(
				response => {
					if (response === 'Success') {
						dispatch(_deleteFrameAgreement(priceItemId));
					} else {
						console.error('Could not delete Frame Agreement', response);
					}
					resolve(response);
					return response;
				}
			);
		});
	};
}

// ***********************************************************************

export const recievePriceItemData = result => ({
	type: 'RECIEVE_PRICE_ITEM_DATA',
	payload: result
});

export function getCommercialProductData(priceItemIdList) {
	return async function(dispatch) {
		// dispatch(requestPriceItemData());

		let promiseArray = priceItemIdList.map(cpId => {
			return window.SF.invokeAction('getCommercialProductData', [cpId]);
		});

		let results = await Promise.all(promiseArray);
		let merged_result = results.reduce((acc, val) => {return {...acc, ...val}}, {});

		dispatch(recievePriceItemData(merged_result));
		
		return merged_result;
	};
}

// ***********************************************************************
export const _filterCommercialProducts = result => ({
	type: 'FILTER_COMMERCIAL_PRODUCTS',
	payload: result
});

export function filterCommercialProducts(filterData) {
	return function(dispatch) {
		// dispatch(requestPriceItemData());

		return new Promise((resolve, reject) => {
			window.SF.invokeAction('filterCommercialProducts', [
				JSON.stringify(filterData)
			]).then(response => {
				dispatch(_filterCommercialProducts(response));
				resolve(response);
				return response;
			});
		});
	};
}

// ***********************************************************************

export const recieveGetFrameAgreements = result => ({
	type: 'RECIEVE_FRAME_AGREEMENTS',
	payload: result
});

export function getFrameAgreements() {
	return function(dispatch) {
		// dispatch(requestGetFrameAgreements());

		return new Promise((resolve, reject) => {
			window.SF.invokeAction('getFrameAgreements', [
				window.SF.param.account
			]).then(response => {
				dispatch(recieveGetFrameAgreements(response));
				resolve(response);
				return response;
			});
		});
	};
}

// ***********************************************************************

export const recieveGetAttachment = (priceItemId, data) => ({
	type: 'RECIEVE_GET_ATTACHMENT',
	payload: { priceItemId, data }
});

export function getAttachment(priceItemId) {
	return function(dispatch) {
		// dispatch(requestGetAttachment());

		return new Promise((resolve, reject) => {
			window.SF.invokeAction('getAttachmentBody', [priceItemId]).then(
				response => {
					try {
						response = JSON.parse(atob(response));
					} catch (e) {
						// No attachment
						response = {};
					}
					dispatch(recieveGetAttachment(priceItemId, response));
					resolve(response);
					return response;
				}
			);
		});
	};
}

// ***********************************************************************

export const _saveFrameAgreement = result => ({
	type: 'SAVE_FA',
	payload: result
});

export function saveFrameAgreement(data, faId) {
	return function(dispatch) {
		// dispatch(requestUpsertFrameAgreements());

		if (faId === undefined) {
			console.error('No Frame agreement Id');
		}

		var ommited = [
			'csconta__Account__c',
			'csconta__Account__r',
			'Name',
			'_ui',
			'LastModifiedDate'
		];
		var SF_data = {};

		for (var key in data) {
			if (!ommited.includes(key)) {
				SF_data[key] = JSON.parse(JSON.stringify(data[key]));
			}
		}

		return new Promise(resolve => {
			window.SF.invokeAction('upsertFrameAgreements', [
				faId,
				JSON.stringify(SF_data)
			]).then(response => {
				dispatch(_saveFrameAgreement({ ...data, ...response }));
				resolve(response);
				return response;
			});
		});
	};
}
// ***********************************************************************
export const _createFrameAgreement = result => ({
	type: 'CREATE_FA',
	payload: result
});

export function createFrameAgreement(fieldData) {
	return function(dispatch) {
		// dispatch(requestUpsertFrameAgreements());

		var ommited = ['csconta__Account__r', 'Name', '_ui'];
		var SF_data = {};

		fieldData.csconta__Account__c = window.SF.param.account;

		for (var key in fieldData) {
			if (!ommited.includes(key)) {
				SF_data[key] = JSON.parse(JSON.stringify(fieldData[key]));
			}
		}

		return new Promise((resolve, reject) => {
			window.SF.invokeAction('upsertFrameAgreements', [
				null,
				JSON.stringify(SF_data)
			]).then(response => {
				dispatch(_createFrameAgreement(response));
				resolve({
					...response,
					_ui: { commercialProducts: [], attachment: {} }
				});
				return response;
			});
		});
	};
}

// ***********************************************************************

export const recieveCommercialProducts = result => ({
	type: 'RECIEVE_COMMERCIAL_PRODUCTS',
	payload: result
});

export function getCommercialProducts() {
	return function(dispatch) {
		// dispatch(requestCommercialProducts());

		return new Promise((resolve, reject) => {
			window.SF.invokeAction('getCommercialProducts', [null]).then(response => {
				dispatch(recieveCommercialProducts(response));
				resolve(response);
				return response;
			});
		});
	};
}
