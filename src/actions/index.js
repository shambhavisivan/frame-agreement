import { decodeEntities } from '../utils/shared-service';

// export const toggleModal = data => ({ type: TOGGLE_MODAL, payload: data }); // DIRECTLY ACTIONED TO STORE
const _defaultModals = {
	actionIframe: false,
	actionIframeUrl: '',
	productModal: false,
	negotiateModal: false
};

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
export const _loadAccounts = data => ({
	type: 'LOAD_ACCOUNTS',
	payload: { data }
});

export function loadAccounts(params) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('getLookupRecords', [JSON.stringify(params)]).then(
				data => {
					data = decodeEntities(data);
					dispatch(_loadAccounts(data));
					resolve(data);
					return data;
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

export function createPricingRuleGroup(faId) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('createPricingRuleGroup', [faId]).then(prId => {
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
// ***********************************************************************
export const _setCustomData = (faId, data) => ({
	type: 'SET_CD',
	payload: { faId, data }
});

export function setCustomData(faId, data) {
	return function(dispatch) {
		dispatch(_setCustomData(faId, data));
	};
}
// ***********************************************************************
export const negotiate = (faId, priceItemId, type, data) => ({
	type: 'NEGOTIATE',
	payload: { faId, priceItemId, type, data }
});

export const apiNegotiate = (faId, data) => ({
	type: 'NEGOTIATE_API',
	payload: { faId, data }
});

export const bulkNegotiate = (faId, data) => ({
	type: 'NEGOTIATE_BULK',
	payload: { faId, data }
});

// export function negotiate(priceItemId, type, data) {
// 	return function(dispatch) {
// 		dispatch(_negotiate(priceItemId, type, data));
// 	};
// }

// export function apiNegotiate(faId, data) {
// 	return function(dispatch) {
// 		dispatch(_apiNegotiate(faId, data));
// 	};
// }
// ***********************************************************************

export const _refreshFrameAgreement = result => ({
	type: 'REFRESH_FA',
	payload: result
});

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

export function refreshFrameAgreement(faId) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('getFrameAgreement', [faId]).then(response => {
				dispatch(_refreshFrameAgreement(response));
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
// ***********************************************************************
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
	faId,
	priceItemId = null,
	type = null,
	data = null
) => ({
	type: 'SET_VALIDATION',
	payload: { faId, priceItemId, type, data }
});

export const validateFrameAgreement = (
	faId = null,
	priceItemId = null,
	type = null,
	data = null
) => ({
	type: 'VALIDATE_FA',
	payload: { faId, priceItemId, type, data }
});

export const _toggleModals = data => ({
	type: 'TOGGLE_MODALS',
	payload: data
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

export function toggleModals(data = _defaultModals) {
	return function(dispatch) {
		dispatch(_toggleModals(data));
	};
}

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
					if (!response) {
						reject('Cannot get app settings!');
						return response;
					}
					setTimeout(() => {
						dispatch(recieveAppSettings(response));
						resolve(response);
						return response;
					});
				}
			);
		});
	};
}
// ***********************************************************************
export const recievePicklistOptions = result => ({
	type: 'RECIEVE_PICKLIST_OPTIONS',
	payload: result
});

export function getPicklistOptions(picklistFields) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('getPicklistOptions', [picklistFields]).then(
				response => {
					setTimeout(() => {
						dispatch(recievePicklistOptions(response));
						resolve(response);
						return response;
					});
				}
			);
		});
	};
}
// ***********************************************************************
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

export const _recievePriceItemData = result => ({
	type: 'RECIEVE_PRICE_ITEM_DATA',
	payload: { result }
});

const _getCommercialProductData = priceItemIdList => {
	return new Promise(async (resolve, reject) => {
		let priceItemChunks = priceItemIdList.chunk(
			window.SF.product_chunk_size || 100
		);

		let promiseArray = priceItemChunks.map(cpChunk => {
			return window.SF.invokeAction('getCommercialProductData', [cpChunk]);
		});

		let results = await Promise.all(promiseArray);

		let merged_result = results.reduce((acc, val) => {
			return { ...acc, ...val };
		}, {});

		resolve(merged_result);
	});
};

export const getCommercialProductData = priceItemIdList => {
	return function(dispatch) {
		return _getCommercialProductData(priceItemIdList).then(
			merged_result => {
				dispatch(_recievePriceItemData(merged_result));
			},
			error => {}
		);
	};
};

// ***********************************************************************

export const _addProductsToFa = (faId, products) => ({
	type: 'ADD_PRODUCTS',
	payload: { faId, products }
});

export function addProductsToFa(faId, products) {
	return function(dispatch) {
		return new Promise(async (resolve, reject) => {
			dispatch(_addProductsToFa(faId, products));
			resolve(products);
		});
	};
}

// ***********************************************************************

export const _resetNegotiation = faId => ({
	type: 'RESET_NEGOTIATION',
	payload: { faId }
});

export function resetNegotiation(faId) {
	return function(dispatch) {
		dispatch(_resetNegotiation(faId));
	};
}

// ***********************************************************************

export const _removeProductsFromFa = (faId, products) => ({
	type: 'REMOVE_PRODUCTS',
	payload: { faId, products }
});

export function removeProductsFromFa(faId, products) {
	return function(dispatch) {
		return new Promise(async (resolve, reject) => {
			dispatch(_removeProductsFromFa(faId, products));
			resolve(products);
		});
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

export const recieveGetAttachment = (faId, data) => ({
	type: 'RECIEVE_GET_ATTACHMENT',
	payload: { faId, data }
});

export function getAttachment(faId) {
	return function(dispatch) {
		// dispatch(requestGetAttachment());

		return new Promise((resolve, reject) => {
			window.SF.invokeAction('getAttachmentBody', [faId]).then(response => {
				try {
					response = JSON.parse(atob(response));
				} catch (e) {
					// No attachment
					response = {};
				}

				if (!response.hasOwnProperty('custom')) {
					let _attachment = {};
					_attachment.products = JSON.parse(JSON.stringify(response));
					_attachment.custom = '';
					response = _attachment;
				}

				dispatch(recieveGetAttachment(faId, response));
				resolve(response);
				return response;
			});
		});
	};
}

// ***********************************************************************
// export const recieveSaveAttachment = (parentId, data) => ({
// 	type: "SAVE_ATTACHMENT",
// 	payload: { parentId, data }
// });

// export function saveAttachment(parentId, data) {
// 	return function(dispatch) {
// 		return new Promise((resolve, reject) => {
// 			if (typeof data !== "string") {
// 				data = JSON.stringify(data);
// 			}
// 			window.SF.invokeAction("saveAttachment", [parentId, data]).then(response => {
// 				dispatch(recieveSaveAttachment(response));
// 				resolve(response);
// 				return response;
// 			});
// 		});
// 	};
// }
// ***********************************************************************

export const _saveFrameAgreement = upsertedFa => ({
	type: 'SAVE_FA',
	payload: upsertedFa
});

export function saveFrameAgreement(frameAgreement) {
	return function(dispatch) {
		// dispatch(requestUpsertFrameAgreements());

		if (frameAgreement === undefined) {
			console.error('No Frame agreement!');
		}

		var ommited = new Set([
			'csconta__Account__r',
			'Name',
			'_ui',
			'LastModifiedDate'
		]);

		var SF_data = {};

		for (var key in frameAgreement) {
			if (!ommited.has(key)) {
				SF_data[key] = JSON.parse(JSON.stringify(frameAgreement[key]));
			}
		}

		let promiseArray = [];

		promiseArray.push(
			window.SF.invokeAction('upsertFrameAgreements', [
				frameAgreement.Id || null,
				JSON.stringify(SF_data)
			])
		);

		if (frameAgreement.Id) {
			promiseArray.push(
				window.SF.invokeAction('saveAttachment', [
					frameAgreement.Id,
					JSON.stringify(frameAgreement._ui.attachment)
				])
			);
		}

		return Promise.all(promiseArray).then(
			response => {
				dispatch(_saveFrameAgreement(response[0]));
				return response;
			},
			error => {}
		);
	};
}
// ***********************************************************************

export const _updateFrameAgreement = (faId, field, value) => ({
	type: 'UPDATE_FA',
	payload: { faId, field, value }
});

export function updateFrameAgreement(faId, field, value) {
	return function(dispatch) {
		dispatch(_updateFrameAgreement(faId, field, value));
	};
}
// ***********************************************************************
export const _createFrameAgreement = result => ({
	type: 'CREATE_FA',
	payload: result
});

export function createFrameAgreement(faData) {
	return function(dispatch) {
		return new Promise(async (resolve, reject) => {
			let newFa = await window.SF.invokeAction('upsertFrameAgreements', [
				null,
				JSON.stringify(faData)
			]);
			newFa = {
				...newFa,
				_ui: {
					commercialProducts: [],
					attachment: { custom: '', products: [] }
				}
			};

			dispatch(_createFrameAgreement(newFa));
			resolve(newFa);
			return newFa;
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
