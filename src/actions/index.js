import * as actions from "./frameAgreementActions";
import {
	queryCpIdsInCatalogue,
	queryCpDataByIds,
	queryOfferIdsInCatalogue,
	queryCategoriesInCatalogue
} from '../graphql-actions/api-actions-graphql';
import { decodeEntities, getFieldLabel, restructureProductData } from '../utils/shared-service';
import * as Constants from '~/src/utils/constants';

// export const toggleModal = data => ({ type: TOGGLE_MODAL, payload: data }); // DIRECTLY ACTIONED TO STORE
const _defaultModals = {
	actionIframe: false,
	actionIframeUrl: '',
	productModal: false,
	addonModal: false,
	frameModal: false,
	deltaModal: false,
	negotiateStandaloneModal: false,
	negotiateModal: false,
	offersModal: false,
	negotiateOffersModal: false,
	createOffersModal: false,
};
// appsettings will be cached when the app loads
let appSettingsCache;
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

// ***********************************************************************
export const _loadAccounts = data => ({
	type: 'LOAD_ACCOUNTS',
	payload: { data }
});

export function loadAccounts(params) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('getLookupRecords', [JSON.stringify(params)]).then(data => {
				data = decodeEntities(data);
				dispatch(_loadAccounts(data));
				resolve(data);
				return data;
			});
		});
	};
}

// ***********************************************************************
export const _recieveApprovalHistory = (faId, data) => ({
	type: 'GET_APPROVAL_HISTORY',
	payload: { faId, data }
});

export function getApprovalHistory(faId) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('getApprovalHistory', [faId.slice(0, 15)]).then(response => {
				try {
					response.listProcess = response.listProcess || [];
				} catch (err) {}
				dispatch(_recieveApprovalHistory(faId, response));
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

export const negotiateAddons = (faId, standaloneAddonId, data) => ({
	type: 'NEGOTIATE_ADDONS',
	payload: { faId, standaloneAddonId, data }
});

export const apiNegotiate = (faId, data) => ({
	type: 'NEGOTIATE_API',
	payload: { faId, data }
});

export const bulkNegotiate = (faId, data) => ({
	type: 'NEGOTIATE_BULK',
	payload: { faId, data }
});

export const bulkNegotiateAddons = (faId, data) => ({
	type: 'NEGOTIATE_BULK_ADDONS',
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

export const _loadRelatedLists = (faId, rlData) => ({
	type: 'LOAD_RL',
	payload: { faId, rlData }
});

export function getRelatedLists(faId) {
	return function(dispatch) {
		return new Promise(async (resolve, reject) => {
			window.SF.invokeAction('getRelatedLists', [faId]).then(async response => {
				// Load field labels if not loaded already
				for (const list of response) {
					if (!window.SF.fieldLabels.hasOwnProperty(list.object)) {
						await window.SF.invokeAction('getFieldLabels', [list.object]).then(r => {
							window.SF.fieldLabels[list.object] = r;
						});
					}
				}

				dispatch(_loadRelatedLists(faId, response));
				resolve(response);
				return response;
			});
		});
	};
}

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

				return window.SF.invokeAction('getAttachmentBody', [faId]).then(response => {
					try {
						response = JSON.parse(atob(response));
						// In case of manual malicious modifications
						response = response || {};
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
					dispatch(validateFrameAgreement(faId));
					resolve(response);
					return response;
				});
			});
		});
	};
}

export function setFrameAgreementState(faId, newStatus) {
	return function(dispatch) {
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('setFrameAgreementState', [faId, newStatus]).then(response => {
				dispatch(_getFrameAgreement({ Id: faId, csconta__Status__c: newStatus }));
				resolve(response);
				return response;
			});
		});
	};
}

const _createNewVersionOfFrameAgreement = newFa => ({
	type: 'NEW_VERSION',
	payload: newFa
});

export function createNewVersionOfFrameAgreement(faId) {
	return function(dispatch) {
		dispatch(toggleFrameAgreementOperations(true));
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('createNewVersionOfFrameAgreement', [faId]).then(response => {
				dispatch(_createNewVersionOfFrameAgreement(response));
				resolve(response);
				return response;
			}).finally(() => {
				dispatch(toggleFrameAgreementOperations(false));
			});
		});
	};
}

export function submitForApproval(faId) {
	return new Promise((resolve, reject) => {
		window.SF.invokeAction('submitForApproval', [faId.slice(0, 15)]).then(response => {
			resolve(response);
			return response;
		});
	});
}
// ***********************************************************************
export const toggleFieldVisibility = index => ({
	type: 'TOGGLE_FIELD_VISIBILITY',
	payload: index
});

export const toggleFaFieldVisibility = index => ({
	type: 'TOGGLE_FA_FIELD_VISIBILITY',
	payload: index
});

// ***********************************************************************
export const setValidation = (faId, priceItemId = null, type = null, data = null) => ({
	type: 'SET_VALIDATION',
	payload: { faId, priceItemId, type, data }
});

export const setAddonValidation = (faId, data) => ({
	type: 'SET_ADDON_VALIDATION',
	payload: { faId, data }
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

export const addToast = (type, title, message, timeout) => ({
	type: 'ADD_TOAST',
	payload: { type, title, message, timeout }
});

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
			window.SF.invokeAction('getAppSettings', [window.SF.param.account]).then(response => {
				if (!response) {
					reject('Cannot get app settings!');
					return response;
				}
				setTimeout(() => {
					dispatch(recieveAppSettings(response));
					resolve(response);
					appSettingsCache = response;
					return response;
				});
			});
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
			window.SF.invokeAction('getPicklistOptions', [picklistFields]).then(response => {
				setTimeout(() => {
					dispatch(recievePicklistOptions(response));
					resolve(response);
					return response;
				});
			});
		});
	};
}

const recieveCloneFrameAgreement = result => ({
	type: 'RECIEVE_CLONE_FA',
	payload: result
});

export function cloneFrameAgreement(faId) {
	return function(dispatch) {
		// dispatch(requestAppSettings());
		dispatch(toggleFrameAgreementOperations(true));
		return new Promise(async (resolve, reject) => {
			const isPsEnabled = await getPsSwitch();
			let clonePromise = null;

			if (isPsEnabled) {
				clonePromise = new Promise(async (resolve, reject) => {
					const linkedFa = await dispatch(linkFrameAgreementCatalogue({Id: faId}, actions.CLONE));
					resolve(linkedFa.frameAgreement);
				});
			} else {
				clonePromise = cloneFrameAgreementAction(faId, actions.CLONE);
			}
			clonePromise.then(response => {
				dispatch(recieveCloneFrameAgreement(response));
				resolve(response);
				return response;
			}).finally(() => {
				dispatch(toggleFrameAgreementOperations(false));
			});
		});
	};
}

const _deleteFrameAgreement = faId => ({
	type: 'DELETE_FA',
	payload: faId
});

export function deleteFrameAgreement(faId) {
	return function(dispatch) {
		// dispatch(requestPriceItemData());
		dispatch(toggleFrameAgreementOperations(true));
		return new Promise((resolve, reject) => {
			window.SF.invokeAction('deleteFrameAgreement', [faId]).then(response => {
				if (response === 'Success') {
					dispatch(_deleteFrameAgreement(faId));
				} else {
					console.error('Could not delete Frame Agreement', response);
				}
				resolve(response);
				return response;
			}).finally(() => {
				dispatch(toggleFrameAgreementOperations(false));
			});
		});
	};
}

// ***********************************************************************

export const setFrameAgreementCpFilter = (faId, cpIdSet) => ({
	type: 'SET_CP_FILTER',
	payload: { faId, cpIdSet }
});

// ***********************************************************************

export const setDisableDiscount = (faId, disableConfig) => ({
	type: 'SET_DISABLE_DISCOUNT',
	payload: { faId, disableConfig }
});

// ***********************************************************************

const _recievePriceItemData = result => ({
	type: 'RECIEVE_PRICE_ITEM_DATA',
	payload: result
});

const _getCommercialProductData = priceItemIdList => {
	return new Promise(async (resolve, reject) => {
		let priceItemChunks = priceItemIdList.chunk(window.SF.product_chunk_size || 100);
		const isPsEnabled = await getPsSwitch();
		let promiseArray = [];
		let cpData;

		if (isPsEnabled) {
			const addonData = await queryCpDataByIds(priceItemIdList);
			cpData = restructureProductData(addonData);
			promiseArray = priceItemChunks.map((cpChunk) => {
				let addonIdList = cpChunk.flatMap((productId) =>
					cpData[productId]
						? cpData[productId].addons.map(
								(addon) => addon.cspmb__Add_On_Price_Item__c
						  )
						: []
				);
				return window.SF.invokeAction("getCommercialProductData", [
					cpChunk,
					addonIdList,
				]);
			});
		} else {
			promiseArray = priceItemChunks.map((cpChunk) => {
				return window.SF.invokeAction("getCommercialProductData", [
					cpChunk,
					null,
				]);
			});
		}

		let results = await Promise.all(promiseArray);

		let merged_result = results.reduce((acc, val) => {
			return { ...acc, ...val };
		}, {});

		if (isPsEnabled) {

			for (let id in cpData) {
				if (merged_result.cpData[id]) {
					merged_result.cpData[id].addons = cpData[id].addons;
				}
			}
		}

		resolve(merged_result);
	});
};

export const getCommercialProductData = priceItemIdList => {
	return function(dispatch) {
		return _getCommercialProductData(priceItemIdList).then(
			merged_result => {
				dispatch(_recievePriceItemData(merged_result));
				return merged_result;
			},
			error => {}
		);
	};
};

export const receiveOfferData = result => ({
	type: 'RECIEVE_OFFER_DATA',
	payload: result
});

export const getOfferData = offerIdList => {
	return async function(dispatch) {
		const offerChunks = offerIdList.chunk(window.SF.product_chunk_size || 100);
		try {
			const offerMeta = await queryCpDataByIds(offerIdList);
			const offerData = restructureProductData(offerMeta);

			const promiseArray = offerChunks.map((cpChunk) => {
				const addonIdList = cpChunk.flatMap((productId) =>
					offerData[productId]
						? offerData[productId].addons.map(
								(addon) => addon.cspmb__Add_On_Price_Item__c
						  )
						: []
				);
				return window.SF.invokeAction("getOfferData", [cpChunk, addonIdList]);
			});

			const results = await Promise.all(promiseArray);

			const merged_result = results.reduce((acc, val) => {
				return { ...acc, ...val };
			}, {});

			for (const offerId in merged_result.cpData) {
				merged_result.cpData[
					offerId
				].commercialProductMetadata = offerMeta.find(
					(product) => product.id === offerId
				)?.commercialProductMetadata;

				merged_result.cpData[offerId].addons = offerData[offerId]
					? offerData[offerId].addons
					: [];
			}

			dispatch(receiveOfferData(merged_result));
		} catch(e) {
			throw new Error(e.message);
		}
	}
}

const _addFaToMaster = (faId, agreements) => ({
	type: 'ADD_FA',
	payload: { faId, agreements }
});

export function addFaToMaster(faId, agreements) {
	return function(dispatch) {
		return new Promise(async resolve => {
			await window.SF.invokeAction('addFaToMaster', [faId, agreements]);
			dispatch(_addFaToMaster(faId, agreements));
			resolve(agreements);
		});
	};
}

const _removeFaFromMaster = (faId, agreements) => ({
	type: 'REMOVE_FA',
	payload: { faId, agreements }
});

export function removeFaFromMaster(faId, agreements) {
	return function(dispatch) {
		return new Promise(async resolve => {
			await window.SF.invokeAction('removeFaFromMaster', [faId, agreements]);
			dispatch(_removeFaFromMaster(faId, agreements));
			resolve(agreements);
		});
	};
}

// ***********************************************************************

const _replaceCpEntities = (faId, replacementData) => ({
	type: 'REPLACE_CHARGES',
	payload: { faId, replacementData }
});

export function replaceCpEntities(faId, replacementData) {
	return function(dispatch) {
		return new Promise(async (resolve, reject) => {
			dispatch(_replaceCpEntities(faId, replacementData));
			resolve();
		});
	};
}

// ***********************************************************************

const _addProductsToFa = (faId, products) => ({
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

const _addAddonsToFa = (faId, addons) => ({
	type: 'ADD_ADDONS',
	payload: { faId, addons }
});

export function addAddonsToFa(faId, addons) {
	return function(dispatch) {
		return new Promise(async (resolve, reject) => {
			dispatch(_addAddonsToFa(faId, addons));
			resolve(addons);
		});
	};
}

// ***********************************************************************

const _resetNegotiation = (faId, entitiyMap) => ({
	type: 'RESET_NEGOTIATION',
	payload: { faId, entitiyMap }
});

export function resetNegotiation(faId, entitiyMap) {
	return function(dispatch) {
		dispatch(_resetNegotiation(faId, entitiyMap));
	};
}

// ***********************************************************************

const _removeProductsFromFa = (faId, products) => ({
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



const _removeAddonsFromFa = (faId, addons) => ({
	type: 'REMOVE_ADDONS',
	payload: { faId, addons }
});

export function removeAddonsFromFa(faId, addons) {
	return function(dispatch) {
		return new Promise(async (resolve, reject) => {
			dispatch(_removeAddonsFromFa(faId, addons));
			resolve(addons);
		});
	};
}

export const recieveGetFrameAgreements = result => ({
	type: 'RECIEVE_FRAME_AGREEMENTS',
	payload: result
});

export function getFrameAgreements() {
	return function(dispatch) {
		// dispatch(requestGetFrameAgreements());

		return new Promise((resolve, reject) => {
			window.SF.invokeAction('getFrameAgreements', [window.SF.param.account]).then(response => {
				dispatch(recieveGetFrameAgreements(response));
				resolve(response);
				return response;
			});
		});
	};
}

// ***********************************************************************

const recieveGetAttachment = (faId, data) => ({
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
					// In case of manual malicious modifications
					response = response || {};
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

const _saveFrameAgreement = upsertedFa => ({
	type: 'SAVE_FA',
	payload: upsertedFa
});

export function saveFrameAgreement(frameAgreement) {
	return function(dispatch) {
		dispatch(toggleFrameAgreementOperations(true));
		if (frameAgreement === undefined) {
			console.error('No Frame agreement!');
		}

		var ommited = new Set(['csconta__Account__r', 'Name', '_ui', 'LastModifiedDate']);

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
				JSON.stringify(SF_data),
				null
			])
		);

		if (frameAgreement.Id) {
			let _attachment = frameAgreement._ui.attachment;

			frameAgreement._ui.commercialProducts.forEach(cp => {
				_attachment.products[cp.Id]._allowances = {};
				cp._allowances.forEach(all => {
					_attachment.products[cp.Id]._allowances[all.Id] = {
						Name: all.Name,
						value: all.cspmb__amount__c || null
					};
				});
			});

			frameAgreement._ui.offers.forEach(offer => {
				_attachment.offers[offer.Id]._allowances = {};
				offer._allowances.forEach(all => {
					_attachment.offers[offer.Id]._allowances[all.Id] = {
						Name: all.Name,
						value: all.cspmb__amount__c || null
					};
				});
			});

			promiseArray.push(
				window.SF.invokeAction('saveAttachment', [frameAgreement.Id, JSON.stringify(_attachment)])
			);
		}

		return Promise.all(promiseArray).then(
			response => {
				dispatch(_saveFrameAgreement(response[0]));
				dispatch(executeFrameAgreementAction(frameAgreement.Id, actions.CLONE));
				return response;
			},
			error => {}
		).finally(() => {
			dispatch(toggleFrameAgreementOperations(false));
		});
	};
}
// ***********************************************************************

const _updateFrameAgreement = (faId, field, value) => ({
	type: 'UPDATE_FA',
	payload: { faId, field, value }
});

export function updateFrameAgreement(faId, field, value) {
	return function(dispatch) {
		dispatch(_updateFrameAgreement(faId, field, value));
	};
}
// ***********************************************************************

const _updateIgnoreSettings = data => ({
	type: 'UPDATE_IGNORE',
	payload: data
});

export function updateIgnoreSettings(newIgnoreSettings) {
	return function(dispatch) {
		dispatch(_updateIgnoreSettings(newIgnoreSettings));
	};
}

const _createFrameAgreement = result => ({
	type: 'CREATE_FA',
	payload: result
});

export function createFrameAgreement(faData) {
	return function(dispatch) {
		dispatch(toggleFrameAgreementOperations(true));
		return new Promise(async (resolve, reject) => {
			const isPsEnabled = await getPsSwitch();
			let newFa = {};

			if (isPsEnabled) {
				const linkedFa = await dispatch(linkFrameAgreementCatalogue(faData, actions.CREATE_FA));
				newFa = linkedFa.frameAgreement;
				faData._ui.attachment = { ...linkedFa.faAttachment };
			} else {
				newFa = await executeSaveFrameAgreementAction(faData, actions.CREATE_FA);
				await window.SF.invokeAction('saveAttachment', [
					newFa.Id,
					JSON.stringify(faData._ui.attachment)
				]);
			}

			newFa = {
				...newFa,
				_ui: faData._ui
			};

			dispatch(_createFrameAgreement(newFa));
			resolve(newFa);
			return newFa;
		}).finally(() => {
			dispatch(toggleFrameAgreementOperations(false));
		});
	};
}

export const recieveStandaloneAddons = (addons, alInfo) => ({
	type: 'LOAD_STANDALONE_ADDONS',
	payload: { addons, alInfo }
});

export function getStandaloneAddons() {
	return function(dispatch) {
		// dispatch(requestCommercialProducts());

		return new Promise((resolve, reject) => {
			Promise.all([
				window.SF.invokeAction('getStandaloneAddons', []),
				window.SF.invokeAction('getAddonDiscountInformation', [])
			]).then(response => {
				dispatch(recieveStandaloneAddons(response[0], response[1]));
				resolve(response);
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
	return async function (dispatch) {
		const isPsEnabled = await getPsSwitch();
		const cpIdsInCatalogue = isPsEnabled ? await queryCpIdsInCatalogue() : null;
		const response = await window.SF.invokeAction("getCommercialProducts", [
			cpIdsInCatalogue,
		]);
		dispatch(recieveCommercialProducts(response));
		return response;
	};
}

const recieveOffers = result => ({
	type: "RECEIVE_OFFERS",
	payload: result,
});

export function getOffers() {
	return async function (dispatch) {
		const offerIdsInCatalogue = await queryOfferIdsInCatalogue();
		return window.SF.invokeAction("getOffers", [offerIdsInCatalogue]).then((response) => {
			dispatch(recieveOffers(response));
		});
	};
}

const _addOffersToFa = (faId, offers) => ({
	type: 'ADD_OFFERS',
	payload: { faId, offers }
});

export function addOffersToFa(faId, offers) {
	return function(dispatch) {
		return new Promise(async (resolve, reject) => {
			dispatch(_addOffersToFa(faId, offers));
			resolve(offers);
		});
	};
}

const _removeOffersFromFa = (faId, offers) => ({
	type: 'REMOVE_OFFERS',
	payload: { faId, offers }
});

export function removeOffersFromFa(faId, offers) {
	return function(dispatch) {
		return new Promise(async (resolve, reject) => {
			dispatch(_removeOffersFromFa(faId, offers));
			resolve(offers);
		});
	};
}

export function toggleFrameAgreementOperations(disableFlag) {
	return function(dispatch) {
		return new Promise(async (resolve, reject) => {
			dispatch(_toggleFrameAgreementOperations(disableFlag));
			resolve();
		});
	};
}

const _toggleFrameAgreementOperations = disableFlag => ({
	type: 'TOGGLE_FRAME_AGREEMENT_OPERATIONS',
	payload: disableFlag
})

// ***********************************************************************

const _cloneAgreementBeforeChanges = frameAgreementId => ({
	type: 'CLONE_FRAME_AGREEMENT',
	payload: frameAgreementId
})

// ***********************************************************************

const _resetAgreementChanges = frameAgreementId => ({
	type: 'RESET_CURRENT_FRAME_AGREEMENT_CHANGES',
	payload: frameAgreementId
})

// ***********************************************************************

const _clearFrameAgreementAttachment = frameAgreementId => ({
	type: 'CLEAR_FA_ATTACHMENT',
	payload: frameAgreementId
})

export function executeFrameAgreementAction(frameAgreementId, action) {
	return (dispatch) => {
		switch (action) {
			case actions.CLONE:
				return new Promise(async (resolve, reject) => {
					dispatch(_cloneAgreementBeforeChanges(frameAgreementId));
					resolve();
				});
			case actions.RESET:
				return new Promise(async (resolve, reject) => {
					dispatch(_resetAgreementChanges(frameAgreementId));
					resolve();
				});
			case actions.CLEAR_ATTACHMENT:
				return new Promise(async (resolve, reject) => {
					dispatch(_clearFrameAgreementAttachment(frameAgreementId));
					resolve();
				});
		}
	}
}

export const negotiateOffers = (faId, priceItemId, type, data) => ({
	type: 'NEGOTIATE_OFFERS',
	payload: { faId, priceItemId, type, data }
});

export const bulkNegotiateOffers = (faId, data) => ({
	type: 'NEGOTIATE_BULK_OFFERS',
	payload: { faId, data }
});

export const apiNegotiateOffer = (faId, data) => ({
	type: 'NEGOTIATE_API_OFFER',
	payload: { faId, data }
});

export const setFrameAgreementOfferFilter = (faId, offerIdSet) => ({
	type: 'SET_OFFER_FILTER',
	payload: { faId, offerIdSet }
});

const _replaceOfferEntities = (faId, replacementData) => ({
	type: 'REPLACE_OFFER_CHARGES',
	payload: { faId, replacementData }
});

export function replaceOfferEntities(faId, replacementData) {
	return function(dispatch) {
		return new Promise(async (resolve, reject) => {
			dispatch(_replaceOfferEntities(faId, replacementData));
			resolve();
		});
	};
}

const syncFaOffersAttachment = (faId, attachment) => ({
	type: 'SYNC_FA_OFFER_ATTACHMENT',
	payload: { faId, attachment }
});

export function createFaOffer(frameAgreement, cpId) {
	return function(dispatch) {
		dispatch(toggleFrameAgreementOperations(true));
		return new Promise(async (resolve, reject) => {
			const faId = frameAgreement.Id;
			let attachment = { ...frameAgreement._ui.attachment };
			const newFaOffer = await window.SF.invokeAction("createFaOffer", [
				faId,
				cpId,
				attachment.faOffers.categoryId
			]);
			attachment.faOffers.offerIdsCharges[newFaOffer.Id] = {
				oneOffCharge: newFaOffer.cspmb__One_Off_Charge__c,
				recurringCharge: newFaOffer.cspmb__Recurring_Charge__c,
			};
			await window.SF.invokeAction('saveAttachment', [faId, JSON.stringify(attachment)]);
			dispatch(syncFaOffersAttachment(faId, attachment));
			resolve(newFaOffer);
		}).finally(() => {
			dispatch(toggleFrameAgreementOperations(false));
		});
	};
}

const _addFaOfferToFa = (faId, addedFaOffers) => ({
	type: 'ADD_FA_OFFER',
	payload: { faId, addedFaOffers }
});

export function addFaOffersToFa(faId, newFaOfferIds) {
	return function (dispatch) {
		return new Promise(async (resolve, reject) => {
			const faOffer = await window.SF.invokeAction("getOffers", [Array.from(newFaOfferIds)]);
			dispatch(_addFaOfferToFa(faId, faOffer));
			resolve(faOffer);
		});
	};
};

const _deleteFaOffers = (faId, deletedFaOffers) => ({
	type: 'DELETE_FA_OFFER',
	payload: { faId, deletedFaOffers }
});

export function deleteFaOffers(frameAgreement, faOfferIdList) {
	return function (dispatch) {
		dispatch(toggleFrameAgreementOperations(true));
		return new Promise(async (resolve, reject) => {
			let promiseArray = [];

			promiseArray.push(
				window.SF.invokeAction("deleteFaOffers", [
					Array.from(faOfferIdList),
				])
			);
			const faId = frameAgreement.Id;
			let attachment = { ...frameAgreement._ui.attachment };

			for (var key in attachment.faOffers.offerIdsCharges) {
				if (faOfferIdList.has(key)) {
					delete attachment.faOffers.offerIdsCharges[key];
				}
			}
			promiseArray.push(
				window.SF.invokeAction("saveAttachment", [
					faId,
					JSON.stringify(attachment),
				])
			);
			const result = await Promise.all(promiseArray);
			dispatch(syncFaOffersAttachment(faId, JSON.parse(result[1])));
			dispatch(_deleteFaOffers(faId, result[0]));
			resolve();
		}).finally(() => {
			dispatch(toggleFrameAgreementOperations(false));
		});
	};
}

export const _filterCommercialProducts = (result) => ({
	type: "FILTER_COMMERCIAL_PRODUCTS",
	payload: result,
});

export function filterCommercialProducts(filterData) {
	return function (dispatch) {
		return new Promise((resolve) => {
			window.SF.invokeAction("filterCommercialProducts", [
				JSON.stringify(filterData),
			]).then((response) => {
				dispatch(_filterCommercialProducts(response));
				resolve(response);
				return response;
			});
		});
	};
}

const getPsSwitch = () => {
	return new Promise((resolve, reject) => {

		if (!appSettingsCache) {
			appSettingsCache =  getAppSettings();
		}
		const { FACSettings } = appSettingsCache;
		resolve(FACSettings.isPsEnabled);
	});

}

export function migrateFrameAgreement(faData) {
	return function(dispatch) {
		return new Promise(async (resolve, reject) => {
			const linkedFa = await dispatch(linkFrameAgreementCatalogue(faData, actions.MIGRATE, true));
			faData._ui.attachment = { ...linkedFa.faAttachment };
			const migratedFa = {
				...linkedFa.frameAgreement,
				_ui: faData._ui
			};

			dispatch(_createFrameAgreement(migratedFa));

			resolve(migratedFa);
			return migratedFa;
		});
	};
}

const linkFrameAgreementCatalogue = (faData, actionType) => async (dispatch) => {
	return new Promise(async (resolve, reject) => {
		let response = {};
		const isPsEnabled = await getPsSwitch();
		const newFa = await executeSaveFrameAgreementAction(faData, actionType);
		let attachment = { ...faData._ui?.attachment };

		if (isPsEnabled) {
			const offerCategory = await window.SF.invokeAction('createFaOfferCategory', [
				newFa.Id
			]);

			if (!attachment || !Object.keys(attachment).length) {
				attachment = await dispatch(getAttachment(faData.Id));
			}

			attachment.faOffers = Constants.FA_OFFERS;
			attachment.faOffers.categoryId = offerCategory.Id;
			await window.SF.invokeAction('saveAttachment', [
				newFa.Id,
				JSON.stringify(attachment)
			]);
		}
		response.frameAgreement = newFa;
		response.faAttachment = attachment;

		resolve(response);
	}).catch((error) => {
		reject(error)
	});
}

const executeSaveFrameAgreementAction = (faData, actionType) => {
	return new Promise(async (resolve, reject) => {
		let newFa = null;
		const stdCatalogueCategories = await getStdCatalogueCategories();

		switch(actionType) {

			case actions.CREATE_FA:
				newFa = await window.SF.invokeAction('upsertFrameAgreements', [
					null,
					JSON.stringify(faData),
					stdCatalogueCategories
				]);
				break;

			case actions.MIGRATE:
				newFa = await window.SF.invokeAction('migrateFrameAgreements', [
					faData.Id,
					stdCatalogueCategories
				]);
				break;

			case actions.CLONE:
				newFa = await cloneFrameAgreementAction(faData.Id);
				break;
		}

		resolve(newFa);
	}).catch((error) => {
		reject(error)
	});
}

const cloneFrameAgreementAction = async (faId) => {

	const stdCatalogueCategories = await getStdCatalogueCategories();

	return new Promise(async (resolve, reject) => {
		const newFa = await window.SF.invokeAction('cloneFrameAgreement', [
			faId,
			stdCatalogueCategories
		]);
		resolve(newFa);
	}).catch((error) => {
		reject(error)
	});
}

const getStdCatalogueCategories = () => {
	return new Promise(async(resolve, reject) => {
		const isPsEnabled = await getPsSwitch();
		const stdCatalogueCategories = isPsEnabled ? await queryCategoriesInCatalogue() : null;

		resolve(stdCatalogueCategories);
	})

}