import {
	log,
	copy,
	validateCSV,
	getFieldLabel,
	parseExpression,
	evaluateExpressionOnAgreement,
	negotiateData
} from '../utils/shared-service';

import {
	validateAddons,
	validateProduct,
	validateCharges,
	validateRateCardLines,
	CP_VALIDATION
} from '../utils/validation-service';

const initialState = {
	initialised: {
		fa_loaded: false,
		cp_loaded: false,
		of_loaded: false,
		settings_loaded: false
	},
	settings: {
		AuthLevels: {},
		DiscLevels: []
	},
	ignoreSettings: {},
	accounts: [],
	frameAgreements: {},
	currentFrameAgreement: {},
	commercialProducts: null,
	standaloneAddons: null,
	offers: [],
	productFields: [],
	faFields: [],
	activeFa: null,
	validation: {},
	validationOffersInfo: {},
	validationAddons: {},
	validationProduct: {},
	validationOffers: {},
	validationFaOffers: new Set(),
	// approvalNeeded: false, // true -> needs validation
	handlers: {},
	modals: {
		actionIframe: false,
		actionIframeUrl: '',
		productModal: false,
		addonModal: false,
		frameModal: false,
		negotiateModal: false,
		negotiateStandaloneModal: false,
		offersModal: false,
		negotiateOffersModal: false,
		createOffersModal: false
	},
	toasts: [],
	disableFrameAgreementOperations: false
	// activeId: null
};

const VOLUME_FIELDS = [
	{ label: window.SF.labels.products_volume_minVol, name: 'mv' },
	{ label: window.SF.labels.products_volume_minVolPeriod, name: 'mvp' },
	{ label: window.SF.labels.products_volume_minUsageComm, name: 'muc' },
	{ label: window.SF.labels.products_volume_minUsageCommPeriod, name: 'mucp' }
];

function makeId(n) {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < n; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function organizeHeaderFields(headerData, _activeFa) {
	// Organize the header grid
	var field_rows = [];
	var row = [];
	var row_grid_count = 0;

	headerData = headerData.filter(f => {
		if (f.hasOwnProperty('visible')) {
			if (f.visible === '') {
				return false;
			}

			return evaluateExpressionOnAgreement(parseExpression(f.visible), _activeFa);
		}

		return true;
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
}

function formatDiscThresh(dtList = []) {
	return dtList
		? dtList.reduce(function(acc, level) {
				(acc[level['cspmb__Authorization_Level__c']] =
					acc[level['cspmb__Authorization_Level__c']] || []).push(level);
				return acc;
		  }, {})
		: {};
}

function formatDiscLevels(dlList = []) {
	let _DiscLevels = [];

	let error = {
		message: '',
		targets: []
	};

	dlList.forEach(dl => {
		let discount = JSON.parse(JSON.stringify(dl));

		discount.discountLevel = {
			Id: dl.discountLevel.Id,
			Name: dl.discountLevel.Name,
			cspmb__Charge_Type__c: dl.discountLevel.cspmb__Charge_Type__c,
			cspmb__Discount_Type__c: dl.discountLevel.cspmb__Discount_Type__c
		};

		let failure = false;

		function discountValid(values) {
			let returnValues;
			try {
				returnValues = values
					.replace(/\s+/g, '')
					.split(',')
					.map(num => {
						let ret = +num;
						if (!isNaN(ret)) {
							return ret;
						} else {
							throw new Error();
						}
					});
			} catch (err) {
				error.message = 'Invalid discount values on ';
				error.targets.push(dl.discountLevel.Id);
				returnValues = false;
			}
			return returnValues;
		}

		if (!dl.discountLevel.cspmb__Discount_Type__c) {
			log.bg.red(
				'Discount level ' + dl.discountLevel.Id + ' does not contain cspmb__Discount_Type__c'
			);

			return;
		}

		if (
			dl.discountLevel.hasOwnProperty('cspmb__Minimum_Discount_Value__c') &&
			+dl.discountLevel.cspmb__Minimum_Discount_Value__c === 0
		) {
			dl.discountLevel.cspmb__Minimum_Discount_Value__c = +dl.discountLevel
				.cspmb__Discount_Increment__c;
		}

		if (
			dl.discountLevel.cspmb__Discount_Values__c &&
			discountValid(dl.discountLevel.cspmb__Discount_Values__c)
		) {
			discount.discountLevel.cspmb__Discount_Values__c = discountValid(
				dl.discountLevel.cspmb__Discount_Values__c
			);
		} else if (
			dl.discountLevel.cspmb__Discount_Increment__c &&
			dl.discountLevel.cspmb__Maximum_Discount_Value__c &&
			dl.discountLevel.cspmb__Minimum_Discount_Value__c
		) {
			if (
				dl.discountLevel.cspmb__Maximum_Discount_Value__c <
				dl.discountLevel.cspmb__Minimum_Discount_Value__c
			) {
				log.bg.red('Minimum greater then maximum on discount level:', dl.discountLevel.Id);
			}

			// validate increment
			if (
				!isNaN(+dl.discountLevel.cspmb__Discount_Increment__c) &&
				!isNaN(+dl.discountLevel.cspmb__Maximum_Discount_Value__c) &&
				!isNaN(+dl.discountLevel.cspmb__Minimum_Discount_Value__c)
			) {
				discount.discountLevel.cspmb__Discount_Values__c = [];

				for (
					let i = dl.discountLevel.cspmb__Minimum_Discount_Value__c;
					i <= dl.discountLevel.cspmb__Maximum_Discount_Value__c;
					i += +dl.discountLevel.cspmb__Discount_Increment__c
				) {
					discount.discountLevel.cspmb__Discount_Values__c.push(i);
				}
			} else {
				error.message = error.message || 'Invalid max/min/increment data on ';
				failure = true;
				error.targets.push(dl.discountLevel.Id);
			}
		} else {
			failure = true;
			error.message = 'Missing crucial fields on discount level ' + dl.discountLevel.Id;
			error.targets = [
				'cspmb__Discount_Increment__c',
				'cspmb__Maximum_Discount_Value__c',
				'cspmb__Minimum_Discount_Value__c'
			];
		}

		if (!failure) {
			_DiscLevels.push(discount);
		} else {
			log.red(error.message, error.targets);
		}
	});

	return _DiscLevels;
}

function getApprovalNeeded(cpValidation, addonValidation = [], offerValidation = {}) {
	return (
		getCpApprovalNeeded(cpValidation) ||
		getAddOnApprovalNeeded(addonValidation) ||
		getOfferApprovalNeeded(offerValidation)
	);
}

function getCpApprovalNeeded(cpValidation) {
	let _cpValidation = Object.keys(cpValidation).reduce((acc, key) => {
		let collection = [];
		if (cpValidation[key].addons) {
			Object.values(cpValidation[key].addons).forEach(item => {
				item.hasOwnProperty('oneOff') && collection.push(item.oneOff);
				item.hasOwnProperty('recurring') && collection.push(item.recurring);
			});
		}
		if (cpValidation[key].charges) {
			collection = [...collection, ...Object.values(cpValidation[key].charges)];
		}
		if (cpValidation[key].product) {
			collection = [...collection, ...Object.values(cpValidation[key].product)];
		}
		if (cpValidation[key].rated) {
			collection = [...collection, ...Object.values(cpValidation[key].rated)];
		}
		return [...acc, ...collection];
	}, []);

	return _cpValidation.some(r => r === true);
}

function getAddOnApprovalNeeded(addOnValidation) {
	let _addonValidation = Object.values(addOnValidation).reduce((acc, iter) => {
		return [...acc, ...Object.values(iter)];
	}, []);

	return _addonValidation.some(r => r === true);
}

function getOfferApprovalNeeded(offerValidation) {
	return getCpApprovalNeeded(offerValidation);
}

function getProductValidation(cpValidation) {
	let _productValidation = {};
	for (var key in cpValidation) {
		_productValidation[key] = getCpApprovalNeeded({
			[key]: cpValidation[key]
		});
	}
	return _productValidation;
}

function getOfferValidation(offerValidation) {
	let _productValidation = {};
	for (var key in offerValidation) {
		_productValidation[key] = getOfferApprovalNeeded({
			[key]: offerValidation[key]
		});
	}
	return _productValidation;
}

function getNewAttachment(headerData, fa) {
	return {
		commercialProducts: [],
		offers: [],
		standaloneAddons: [],
		faOffers: new Map(),
		approvalNeeded: false,
		headerRows: organizeHeaderFields(headerData, fa),
		attachment: null
	};
}

function initiateAddonsAttachment(add) {
	return {
		oneOff: add.cspmb__One_Off_Charge__c,
		recurring: add.cspmb__Recurring_Charge__c
	};
}

function enrichAttachment(cp) {
	let _att = {};
	// ****************************************
	_att._volume = {
		mv: null,
		mvp: null,
		muc: null,
		mucp: null
	};
	// ****************************************
	if (cp._addons.length) {
		_att._addons = {};
	}
	cp._addons.forEach(addon => {
		_att._addons[addon.Id] = {
			oneOff: addon.cspmb__One_Off_Charge__c,
			recurring: addon.cspmb__Recurring_Charge__c
		};
	});
	// ****************************************
	if (cp._charges.length) {
		_att._charges = {};
	} else {
		_att._product = {};
		if (cp.cspmb__One_Off_Charge__c) {
			_att._product.oneOff = cp.cspmb__One_Off_Charge__c;
		}
		if (cp.cspmb__Recurring_Charge__c) {
			_att._product.recurring = cp.cspmb__Recurring_Charge__c;
		}
	}

	cp._charges.forEach(charge => {
		_att._charges[charge.Id] = {};
		if (charge.chargeType === 'One-off Charge') {
			_att._charges[charge.Id].oneOff = charge.oneOff;
		}
		if (charge.chargeType === 'Recurring Charge') {
			_att._charges[charge.Id].recurring = charge.recurring;
		}
	});
	// ****************************************
	if (cp._rateCards.length) {
		_att._rateCards = {};
	}
	cp._rateCards.forEach(rc => {
		if (rc.rateCardLines.length) {
			_att._rateCards[rc.Id] = {};
			rc.rateCardLines.forEach(rcl => {
				_att._rateCards[rc.Id][rcl.Id] = rcl.cspmb__rate_value__c;
			});
		}
	});
	return _att;
}

function validateJSONData(data) {
	if (!data) {
		return [];
	}

	data.forEach(obj => {
		obj.type = obj.type || 'text';
		obj.grid = obj.grid || 3;
		obj.readOnly = obj.readOnly || false;
	});
	return data;
}

function convertCSVToArray(csv) {
	if (typeof csv !== 'string') {
		log.orange('Cannot convert "' + csv + '"" to array.');
		return [];
	}

	let returnArr = [];

	try {
		returnArr = csv.replace(/(?:\r\n|\r|\n|\s)/g, '').split(',');
	} catch (err) {
		log.orange('Cannot convert "' + csv + '"" to array.');
	}

	return returnArr;
}

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'REGISTER_METHOD':
			return {
				...state,
				handlers: {
					...state.handlers,
					[action.payload.name]: action.payload.method
				}
			};

		case 'VALIDATE_FA':
			var faId = action.payload.faId;
			var priceItemId = action.payload.priceItemId;
			var type = action.payload.type;
			var data = action.payload.data;

			if (faId === null && priceItemId === null) {
				return {
					...state,
					validation: {},
					frameAgreements: {
						...state.frameAgreements,
						[faId]: {
							...state.frameAgreements[faId],
							_ui: { ...state.frameAgreements[faId]._ui, approvalNeeded: false }
						}
					}
				};
			}

			var validation;
			var validationOffersInfo;

			if (priceItemId === null) {
				var _fa = state.frameAgreements[faId];
				var _products = _fa._ui.attachment.products;
				var _addons = _fa._ui.attachment.addons;
				var _offers = _fa._ui.attachment.offers;
				var bulkValidation = {};
				var _initialFrameAgreementStandaloneAddOn = state.currentFrameAgreement._ui.attachment?.addons;
				var validationAddons = validateAddons(
					_fa._ui.standaloneAddons,
					_addons,
					_initialFrameAgreementStandaloneAddOn || {},
					{
						frameAgreementStatus: _fa.csconta__Status__c,
						facApprovedStatus: state.settings.FACSettings.statuses.approved_status
					}
				);
				var _initialFrameAgreementProducts = state.currentFrameAgreement._ui.attachment?.products ?? {};

				_fa._ui.commercialProducts.forEach(cp => {
					bulkValidation[cp.Id] = {
						addons: validateAddons(
							cp._addons,
							_products[cp.Id]._addons || {},
							_initialFrameAgreementProducts[cp.Id]?._addons || {},
							{
								frameAgreementStatus: _fa.csconta__Status__c,
								facApprovedStatus: state.settings.FACSettings.statuses.approved_status
							}
						),
						rated: validateRateCardLines(
							cp._rateCards,
							_products[cp.Id]._rateCards || {},
							_initialFrameAgreementProducts[cp.Id]?._rateCards || {},
							{
								frameAgreementStatus: _fa.csconta__Status__c,
								facApprovedStatus: state.settings.FACSettings.statuses.approved_status
							}
						),
						charges: validateCharges(
							cp._charges,
							cp.cspmb__Authorization_Level__c,
							_products[cp.Id]._charges || {},
							_initialFrameAgreementProducts[cp.Id]?._charges || {},
							{
								frameAgreementStatus: _fa.csconta__Status__c,
								facApprovedStatus: state.settings.FACSettings.statuses.approved_status
							}
						)
					};

					if (_products[cp.Id]._product) {
						bulkValidation[cp.Id].product = validateProduct({
							oneOff: cp.cspmb__One_Off_Charge__c,
							negotiatedOneOff: _products[cp.Id]._product.oneOff,
							recurring: cp.cspmb__Recurring_Charge__c,
							negotiatedRecurring: _products[cp.Id]._product.recurring,
							authLevel: cp.cspmb__Authorization_Level__c || null,
							Name: cp.Name
						}, {
							negotiatedOneOff: _initialFrameAgreementProducts[cp.Id]?._product?.oneOff,
							negotiatedRecurring: _initialFrameAgreementProducts[cp.Id]?._product?.recurring,
						},
						{
							frameAgreementStatus: _fa.csconta__Status__c,
							facApprovedStatus: state.settings.FACSettings.statuses.approved_status
						});
					} else {
						// In case the prgId in standard price rule book is removed or modfied, this would ensure legacy charges are loaded
						bulkValidation[cp.Id].product = CP_VALIDATION;
					}
				});

				var _initialFrameAgreementOffers = state.currentFrameAgreement._ui.attachment?.offers ?? {};
				var bulkValidationOffers = {};

				_fa._ui.offers.forEach(offer => {
					bulkValidationOffers[offer.Id] = {
						addons: validateAddons(
							offer._addons,
							_offers[offer.Id]._addons || {},
							_initialFrameAgreementOffers[offer.Id]?._addons ||
								{},
							{
								frameAgreementStatus: _fa.csconta__Status__c,
								facApprovedStatus:
									state.settings.FACSettings.statuses
										.approved_status,
							}
						),
						rated: validateRateCardLines(
							offer._rateCards,
							_offers[offer.Id]._rateCards || {},
							_initialFrameAgreementOffers[offer.Id]?._rateCards || {},
							{
								frameAgreementStatus: _fa.csconta__Status__c,
								facApprovedStatus: state.settings.FACSettings.statuses.approved_status
							}
						),
						charges: validateCharges(
							offer._charges,
							offer.cspmb__Authorization_Level__c,
							_offers[offer.Id]._charges || {},
							_initialFrameAgreementOffers[offer.Id]?._charges || {},
							{
								frameAgreementStatus: _fa.csconta__Status__c,
								facApprovedStatus: state.settings.FACSettings.statuses.approved_status
							}
						),
					};

					if (_offers[offer.Id]._product) {
						bulkValidationOffers[offer.Id].product = validateProduct({
							oneOff: offer.cspmb__One_Off_Charge__c,
							negotiatedOneOff: _offers[offer.Id]._product.oneOff,
							recurring: offer.cspmb__Recurring_Charge__c,
							negotiatedRecurring: _offers[offer.Id]._product.recurring,
							authLevel: offer.cspmb__Authorization_Level__c || null,
							Name: offer.Name
						}, {
							negotiatedOneOff: _initialFrameAgreementOffers[offer.Id]?._product?.oneOff,
							negotiatedRecurring: _initialFrameAgreementOffers[offer.Id]?._product?.recurring,
						},
						{
							frameAgreementStatus: _fa.csconta__Status__c,
							facApprovedStatus: state.settings.FACSettings.statuses.approved_status
						});
					} else {
						// In case the prgId in standard price rule book is removed or modfied, this would ensure legacy charges are loaded
						bulkValidationOffers[offer.Id].product = CP_VALIDATION;
					}
				});

				validation = bulkValidation;
				validationOffersInfo = bulkValidationOffers;
			} else {
				if (state.validation[priceItemId]) {
					validation = {
						...state.validation,
						[priceItemId]: {
							...state.validation[priceItemId],
							[type]: {
								...state.validation[priceItemId][type],
								...data
							}
						}
					};
				}

				if (state.validationOffersInfo[priceItemId]) {
					validationOffersInfo = {
						...state.validationOffersInfo,
						[priceItemId]: {
							...state.validationOffersInfo[priceItemId],
							[type]: {
								...state.validationOffersInfo[priceItemId][type],
								...data
							}
						}
					};
				}
			}

			var approvalNeeded = getApprovalNeeded(
				validation,
				validationAddons,
				validationOffersInfo
			);
			var validationProduct = getProductValidation(validation);
			var validationOffers = getOfferValidation(validationOffersInfo);

			return {
				...state,
				validation,
				validationOffersInfo,
				validationProduct,
				validationOffers,
				validationAddons: { ...state.validationAddons, [faId]: validationAddons },
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: { ...state.frameAgreements[faId]._ui, approvalNeeded }
					}
				}
			};

		case 'SET_ADDON_VALIDATION':
			var { faId, data } = action.payload;
			var validation = {
				...state.validationAddons,
				[faId]: { ...state.validationAddons[faId], ...data }
			};

			return {
				...state,
				validationAddons: validation,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							approvalNeeded: getAddOnApprovalNeeded(validation)
						}
					}
				}
			};

		case 'SET_VALIDATION':
			var faId = action.payload.faId;

			var _addons = state.frameAgreements[faId]._ui.attachment.addons;
			var _initialFrameAgreementStandaloneAddOn = state.currentFrameAgreement._ui.attachment?.addons;
			var validationAddons = validateAddons(
				state.frameAgreements[faId]._ui.standaloneAddons,
				_addons,
				_initialFrameAgreementStandaloneAddOn || {},
				{
					frameAgreementStatus: state.frameAgreements[faId].csconta__Status__c,
					facApprovedStatus: state.settings.FACSettings.statuses.approved_status
				}
			);

			if (action.payload.priceItemId === null) {
				return {
					...state,
					validation: {},
					frameAgreements: {
						...state.frameAgreements,
						[faId]: {
							...state.frameAgreements[faId],
							_ui: { ...state.frameAgreements[faId]._ui, approvalNeeded: false }
						}
					}
				};
			} else if (action.payload.type === null) {
				var validation = {
					...state.validation,
					...action.payload.priceItemId,
				};
				var validationProduct = getProductValidation(validation);
				var validationOffersInfo = {
					...state.validationOffersInfo,
					...action.payload.priceItemId,
				};
				var validationOffers = getOfferValidation(validationOffersInfo);
				var approvalNeeded = getApprovalNeeded(
					validation,
					validationAddons,
					validationOffersInfo
				);

				return {
					...state,
					validation,
					validationOffersInfo,
					validationProduct,
					validationOffers,
					frameAgreements: {
						...state.frameAgreements,
						[faId]: {
							...state.frameAgreements[faId],
							_ui: { ...state.frameAgreements[faId]._ui, approvalNeeded }
						}
					}
				};
			} else {
				var validation = { ...state.validation }
				var validationOffersInfo = { ...state.validationOffersInfo }

				if (state.validation[action.payload.priceItemId]) {
					validation = {
						...state.validation,
						[action.payload.priceItemId]: {
							...state.validation[action.payload.priceItemId],
							[action.payload.type]: {
								...state.validation[action.payload.priceItemId][action.payload.type],
								...action.payload.data
							}
						}
					};
				}

				if (state.validationOffersInfo[action.payload.priceItemId]) {
					validationOffersInfo = {
						...state.validationOffersInfo,
						[action.payload.priceItemId]: {
							...state.validationOffersInfo[action.payload.priceItemId],
							[action.payload.type]: {
								...state.validationOffersInfo[action.payload.priceItemId][action.payload.type],
								...action.payload.data
							}
						}
					};
				}
				var approvalNeeded = getApprovalNeeded(
					validation,
					validationAddons,
					validationOffersInfo
				);
				var validationProduct = getProductValidation(validation);
				var validationOffers = getOfferValidation(validationOffersInfo);

				return {
					...state,
					validation,
					validationOffersInfo,
					validationProduct,
					validationOffers,
					frameAgreements: {
						...state.frameAgreements,
						[faId]: {
							...state.frameAgreements[faId],
							_ui: { ...state.frameAgreements[faId]._ui, approvalNeeded }
						}
					}
				};
			}

		// ASYNC RECIEVE
		case 'RECIEVE_FRAME_AGREEMENTS':
			let frameAgreementMap = {};
			action.payload.forEach(fa => {
				fa._ui = getNewAttachment(state.settings.HeaderData, fa);
				frameAgreementMap[fa.Id] = fa;
			});
			return {
				...state,
				...{ frameAgreements: frameAgreementMap },
				...{ initialised: { ...state.initialised, ...{ fa_loaded: true } } }
			};

		case 'LOAD_ACCOUNTS':
			return {
				...state,
				accounts: [...state.accounts, ...action.payload.data]
			};

		case 'LOAD_STANDALONE_ADDONS':
			var _addons = action.payload.addons;

			var _DiscLevels = formatDiscLevels(action.payload.alInfo.discLevels);

			// merge with existing DC
			_DiscLevels = [...state.settings.DiscLevels, ..._DiscLevels];

			// Remove duplicates
			_DiscLevels = [...new Set(_DiscLevels.map(dc => JSON.stringify(dc)))].map(dc =>
				JSON.parse(dc)
			);

			var _AuthLevels = state.settings.AuthLevels;

			_AuthLevels = {
				..._AuthLevels,
				...formatDiscThresh(action.payload.alInfo.dcList)
			};

			var addonVsDiscount = {};

			_DiscLevels.forEach(lv => {
				addonVsDiscount[lv.addonId] = addonVsDiscount[lv.addonId] || [];
				addonVsDiscount[lv.addonId].push(lv);
			});

			function formatAddons(addon) {
				let _addon = { ...addon };

				_addon.cspmb__One_Off_Charge__c = _addon.hasOwnProperty('cspmb__One_Off_Charge__c')
					? addon.cspmb__One_Off_Charge__c
					: null;
				_addon.cspmb__Recurring_Charge__c = _addon.hasOwnProperty('cspmb__Recurring_Charge__c')
					? addon.cspmb__Recurring_Charge__c
					: null;

				if (addonVsDiscount[addon.Id]) {
					_addon._discountLvIds = addonVsDiscount[addon.Id];
				}

				delete _addon.cspmb__Add_On_Price_Item__r;
				delete _addon.cspmb__Price_Item__r;

				return _addon;
			}

			_addons = _addons.map(formatAddons);

			return {
				...state,
				settings: {
					...state.settings,
					DiscLevels: _DiscLevels,
					AuthLevels: _AuthLevels
				},
				standaloneAddons: _addons
			};

		case 'TOGGLE_MODALS':
			// action.payload
			return {
				...state,
				modals: { ...state.modals, ...action.payload }
			};

		case 'ADD_TOAST':
			// action.payload.type;
			// action.payload.title;
			// action.payload.message;
			// action.payload.timeout;

			return {
				...state,
				toasts: [...state.toasts, ...[{ ...action.payload, id: makeId(8) }]]
			};

		case 'REMOVE_TOAST':
			return {
				...state,
				toasts: [...state.toasts.filter(t => t.id !== action.payload.id)]
			};

		case 'CLEAR_TOAST_QUEUE':
			return { ...state, toasts: [] };

		case 'RECIEVE_CLONE_FA':
			// action.payload;
			let clonedFa = action.payload;
			clonedFa._ui = getNewAttachment(state.settings.HeaderData, clonedFa);

			return {
				...state,
				frameAgreements: { ...state.frameAgreements, [clonedFa.Id]: clonedFa }
			};

		case 'TOGGLE_FIELD_VISIBILITY':
			var index = action.payload;
			return {
				...state,
				productFields: state.productFields.map((f, i) =>
					i === index ? { ...f, visible: !f.visible } : f
				)
			};

		case 'TOGGLE_FA_FIELD_VISIBILITY':
			var index = action.payload;
			return {
				...state,
				faFields: state.faFields.map((f, i) => (i === index ? { ...f, visible: !f.visible } : f))
			};

		case 'SET_DISABLE_DISCOUNT':
			var faId = action.payload.faId;
			var config = action.payload.disableConfig;

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							...config
						}
					}
				}
			};

		case 'RECIEVE_COMMERCIAL_PRODUCTS':
			var commercialProducts = action.payload;

			// validate
			commercialProducts.forEach(cp => {
				if (!cp.hasOwnProperty('cspmb__Is_One_Off_Discount_Allowed__c')) {
					cp.cspmb__Is_One_Off_Discount_Allowed__c = false;
				}

				if (!cp.hasOwnProperty('cspmb__Is_Recurring_Discount_Allowed__c')) {
					cp.cspmb__Is_Recurring_Discount_Allowed__c = false;
				}
			});

			return {
				...state,
				...{ commercialProducts: commercialProducts },
				...{ initialised: { ...state.initialised, ...{ cp_loaded: true } } }
			};

		case 'CREATE_FA':
			var upsertedFa = action.payload;
			// On error
			if (!upsertedFa) {
				return { ...state };
			}

			return {
				...state,
				...{ activeFa: upsertedFa },
				...{
					frameAgreements: {
						...state.frameAgreements,
						...{
							[upsertedFa.Id]: {
								...upsertedFa,
								_ui: {
									...upsertedFa._ui,
									headerRows: organizeHeaderFields(state.settings.HeaderData, upsertedFa)
								}
							}
						}
					}
				}
			};

		case 'GET_FA':
			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[action.payload.Id]: {
						...state.frameAgreements[action.payload.Id],
						csconta__Status__c: action.payload.csconta__Status__c
					}
				}
			};

		case 'REFRESH_FA':
			var updatedFa = {
				...state.frameAgreements[action.payload.Id],
				...action.payload
			};
			updatedFa = {
				...updatedFa,
				_ui: {
					...updatedFa._ui,
					headerRows: organizeHeaderFields(state.settings.HeaderData, updatedFa)
				}
			};

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[updatedFa.Id]: updatedFa
				}
			};

		case 'UPDATE_FA':
			var faId = action.payload.faId;
			var field = action.payload.field;
			var value = action.payload.value;

			// console.log(JSON.parse(JSON.stringify({ ...state.frameAgreements[faId], [field]: value })));

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						[field]: value,
						_ui: {
							...state.frameAgreements[faId]._ui,
							headerRows: organizeHeaderFields(state.settings.HeaderData, {
								...state.frameAgreements[faId],
								[field]: value
							})
						}
					}
				}
			};

		case 'UPDATE_IGNORE':
			return {
				...state,
				ignoreSettings: { ...state.ignoreSettings, ...action.payload }
			};

		case 'SET_CD':
			var faId = action.payload.faId;
			var data = action.payload.data;

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							attachment: {
								...state.frameAgreements[faId]._ui.attachment,
								custom: data
							}
						}
					}
				}
			};

		case 'DELETE_FA':
			var { [action.payload]: value, ...withoutRemoved } = state.frameAgreements;
			return { ...state, frameAgreements: withoutRemoved };

		case 'SET_CP_FILTER':
			var _faId = action.payload.faId;
			var _filterSet = action.payload.cpIdSet;

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[_faId]: {
						...state.frameAgreements[_faId],
						_ui: { ...state.frameAgreements[_faId]._ui, _filter: _filterSet }
					}
				}
			};

		case 'NEW_VERSION':
			let newVersion = action.payload;
			newVersion._ui = getNewAttachment(state.settings.HeaderData, newVersion);
			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[newVersion.Id]: newVersion
				}
			};

		case 'SAVE_FA':
			var _frameAgreement = action.payload;
			var upsertData = {
				..._frameAgreement,
				_ui: state.frameAgreements[_frameAgreement.Id]._ui
			};

			upsertData = {
				...upsertData,
				_ui: {
					...upsertData._ui,
					headerRows: organizeHeaderFields(state.settings.HeaderData, upsertData)
				}
			};

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[_frameAgreement.Id]: upsertData
				}
			};

		// *************************************
		case 'NEGOTIATE':
			var faId = action.payload.faId;
			var priceItemId = action.payload.priceItemId;
			var type = action.payload.type;
			var data = action.payload.data;

			var _attachment = state.frameAgreements[faId]._ui.attachment;

			if (!_attachment) {
				log.bg.red('Negotiation failed; attachment not loaded for FA:' + faId);
				return { ...state };
			}

			_attachment.products = {
				..._attachment.products,
				[priceItemId]: { ..._attachment.products[priceItemId], [type]: data }
			};

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: state.frameAgreements[faId]._ui,
						attachment: _attachment
					}
				}
			};

		case 'NEGOTIATE_ADDONS':
			var faId = action.payload.faId;
			var standaloneAddonId = action.payload.standaloneAddonId;
			var data = action.payload.data;

			var _attachment = state.frameAgreements[faId]._ui.attachment;

			if (!_attachment) {
				log.bg.red('Negotiation failed; attachment not loaded for FA:' + faId);
				return { ...state };
			}

			_attachment.addons = {
				..._attachment.addons,
				[standaloneAddonId]: {
					..._attachment.addons[standaloneAddonId],
					...data[standaloneAddonId]
				}
			};

			var _initialFrameAgreementStandaloneAddOn = state.currentFrameAgreement._ui.attachment?.addons;
			var validationAddons = validateAddons(
				state.frameAgreements[faId]._ui.standaloneAddons,
				_attachment.addons,
				_initialFrameAgreementStandaloneAddOn || {},
				{
					frameAgreementStatus: state.frameAgreements[faId].csconta__Status__c,
					facApprovedStatus: state.settings.FACSettings.statuses.approved_status
				}
			);

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							approvalNeeded: getApprovalNeeded(
								state.validation,
								validationAddons,
								state.validationOffersInfo
							),
							attachment: _attachment,
						},
					},
				},
			};

		case 'NEGOTIATE_BULK_ADDONS':
			var faId = action.payload.faId;
			var data = action.payload.data;

			var _addons = state.frameAgreements[faId]._ui.attachment.addons;

			for (var key in data) {
				_addons[key] = data[key];
			}

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: state.frameAgreements[faId]._ui,
						attachment: {
							...state.frameAgreements[faId]._ui.attachment,
							addons: _addons
						}
					}
				}
			};

		case 'NEGOTIATE_BULK':
			var faId = action.payload.faId;
			var data = action.payload.data;

			var _products = state.frameAgreements[faId]._ui.attachment.products;

			for (var key in _products) {
				if (data[key]._addons) {
					_products[key]._addons = _products[key]._addons || {};
					_products[key]._addons = {
						..._products[key]._addons,
						...data[key]._addons
					};
				}
				if (data[key]._charges) {
					_products[key]._charges = _products[key]._charges || {};
					_products[key]._charges = {
						..._products[key]._charges,
						...data[key]._charges
					};
				}
				if (data[key]._rateCards) {
					_products[key]._rateCards = _products[key]._rateCards || {};
					for (var rcId in data[key]._rateCards) {
						_products[key]._rateCards[rcId] = data[key]._rateCards[rcId];
					}
				}
				if (data[key]._product) {
					_products[key]._product = _products[key]._product || {};
					_products[key]._product = {
						..._products[key]._product,
						...data[key]._product,
					};
				}
			}

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: state.frameAgreements[faId]._ui,
						attachment: {
							...state.frameAgreements[faId]._ui.attachment,
							products: _products
						}
					}
				}
			};

		case 'NEGOTIATE_API':
			var faId = action.payload.faId;
			var data = action.payload.data;

			if (!state.frameAgreements[faId]._ui.attachment) {
				log.bg.red('Negotiation failed; attachment not loaded for FA:' + faId);
				return { ...state };
			}

			var _fa = state.frameAgreements[faId];
			var _products = _fa._ui.attachment.products;

			if (Array.isArray(data)) {
				data.forEach(dataObject => negotiateData(dataObject, _fa._ui.commercialProducts, _products));
			} else {
				negotiateData(data, _fa._ui.commercialProducts, _products);
			}

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: state.frameAgreements[faId]._ui,
						attachment: {
							...state.frameAgreements[faId]._ui.attachment,
							products: _products
						}
					}
				}
			};

		case 'RECIEVE_PICKLIST_OPTIONS':
			var options = action.payload;
			// {'fieldName': [{'label': optionlabel, 'value': optionValue}, ...]}

			var headerData = state.settings.HeaderData;

			headerData.forEach(f => {
				if (f.type === 'picklist' && options.hasOwnProperty(f.field)) {
					f.options = options[f.field];
				}
			});

			window.SF.fieldLabels.statuses = action.payload.csconta__Status__c.reduce((acc, iter) => {
				return { ...acc, [iter.value]: iter.label };
			}, {});

			try {
				window.SF.fieldLabels['misc'] = options.csconta__agreement_level__c.reduce(
					(acc, iter) => ({ ...acc, [iter.value.toLowerCase()]: iter.label }),
					{}
				);
			} catch (err) {}

			return {
				...state,
				settings: { ...state.settings, HeaderData: headerData },
				initialised: { ...state.initialised, ...{ settings_loaded: true } }
			};

		case 'RECIEVE_SETTINGS':
			action.payload.HeaderData = validateJSONData(action.payload.HeaderData);

			action.payload.HeaderData.forEach(data => {
				data.label = data.label || getFieldLabel('csconta__Frame_Agreement__c', data.field);
			});

			action.payload.CustomTabsData = validateJSONData(action.payload.CustomTabsData);

			let _productFields = [];
			let _faFields = [];
			// _productFields.push({name:"Name", visible: true})

			action.payload.FACSettings.input_minmax_restriction = !!action.payload.FACSettings
				.input_minmax_restriction;

			if (!action.payload.FACSettings.hasOwnProperty('new_frame_agreement')) {
				action.payload.FACSettings.new_frame_agreement = true;
			}

			if (!action.payload.FACSettings.hasOwnProperty('active_status_management__c')) {
				action.payload.FACSettings.active_status_management__c = true;
			}

			if (!action.payload.FACSettings.hasOwnProperty('decimal_places')) {
				action.payload.FACSettings.decimal_places = 2;
			} else if (action.payload.FACSettings.decimal_places < 2) {
				log.red('Minimal value for decimal places is 2!');
				action.payload.FACSettings.decimal_places = 2;
			}

			// Save globally
			window.SF.decimal_places = action.payload.FACSettings.decimal_places;

			if (
				action.payload.FACSettings.hasOwnProperty('rcl_fields') &&
				validateCSV(action.payload.FACSettings.rcl_fields)
			) {
				action.payload.FACSettings.rcl_fields = convertCSVToArray(
					action.payload.FACSettings.rcl_fields
				);
			} else {
				action.payload.FACSettings.rcl_fields = [];
			}

			if (
				action.payload.FACSettings.hasOwnProperty('standalone_addon_fields') &&
				validateCSV(action.payload.FACSettings.standalone_addon_fields)
			) {
				action.payload.FACSettings.standalone_addon_fields = convertCSVToArray(
					action.payload.FACSettings.standalone_addon_fields
				);
			} else {
				action.payload.FACSettings.standalone_addon_fields = ['Name'];
			}

			if (
				action.payload.FACSettings.hasOwnProperty('account_fields') &&
				validateCSV(action.payload.FACSettings.account_fields)
			) {
				action.payload.FACSettings.account_fields = convertCSVToArray(
					action.payload.FACSettings.account_fields
				);
			} else {
				action.payload.FACSettings.account_fields = ['Name'];
			}

			if (!action.payload.FACSettings.hasOwnProperty('approvers_revise')) {
				action.payload.FACSettings.approvers_revise = false;
			}

			if (
				action.payload.FACSettings.hasOwnProperty('usage_type_fields__c') &&
				validateCSV(action.payload.FACSettings.usage_type_fields__c)
			) {
				action.payload.FACSettings.usage_type_fields__c = convertCSVToArray(
					action.payload.FACSettings.usage_type_fields__c
				);
			} else {
				action.payload.FACSettings.usage_type_fields__c = [];
			}

			if (validateCSV(action.payload.FACSettings.price_item_fields)) {
				action.payload.FACSettings.price_item_fields = convertCSVToArray(
					action.payload.FACSettings.price_item_fields
				);

				action.payload.FACSettings.price_item_fields.forEach(f => {
					_productFields.push({ name: f, visible: true });
				});
			} else {
				console.warn('Price item fields is not valid CSV!');
				action.payload.FACSettings.price_item_fields = [];
			}

			if (
				action.payload.FACSettings.volume_fields_visibility &&
				validateCSV(action.payload.FACSettings.volume_fields_visibility)
			) {
				action.payload.FACSettings.volume_fields_visibility = convertCSVToArray(
					action.payload.FACSettings.volume_fields_visibility
				);
			} else {
				action.payload.FACSettings.volume_fields_visibility = VOLUME_FIELDS.map(vf => vf.name);
			}

			if (action.payload.FACSettings.show_volume_fields) {
				let _visibillity = new Set(action.payload.FACSettings.volume_fields_visibility);

				VOLUME_FIELDS.filter(vf => _visibillity.has(vf.name)).forEach(f => {
					_productFields.push({
						name: f.label,
						visible: true,
						volume: f.name
					});
				});
			}

			if (validateCSV(action.payload.FACSettings.frame_agreement_fields)) {
				action.payload.FACSettings.frame_agreement_fields = convertCSVToArray(
					action.payload.FACSettings.frame_agreement_fields
				);

				action.payload.FACSettings.frame_agreement_fields.forEach(f => {
					_faFields.push({ name: f, visible: true });
				});
			} else {
				action.payload.FACSettings.frame_agreement_fields = [];
			}

			if (validateCSV(action.payload.FACSettings.fa_editable_statuses)) {
				action.payload.FACSettings.fa_editable_statuses = action.payload.FACSettings.fa_editable_statuses
					.replace(/ ,/g, ',')
					.replace(/, /g, ',')
					.split(',');
				action.payload.FACSettings.fa_editable_statuses = new Set(
					action.payload.FACSettings.fa_editable_statuses
				);
				if (
					action.payload.FACSettings.fa_editable_statuses.delete(
						action.payload.FACSettings.statuses.active_status
					)
				) {
					console.warn('Active status excluded from list of editable statuses!');
				}
				if (
					action.payload.FACSettings.fa_editable_statuses.delete(
						action.payload.FACSettings.statuses.closed_status
					)
				) {
					console.warn('Closed status excluded from list of editable statuses!');
				}
			} else {
				console.warn(
					'FA editable statuses setting is not valid CSV! Defaulting to Draft and Requires Approval.'
				);

				action.payload.FACSettings.fa_editable_statuses = [
					action.payload.FACSettings.statuses.draft_status,
					action.payload.FACSettings.statuses.requires_approval_status
				];

				// If statuses are not defined
				action.payload.FACSettings.fa_editable_statuses.filter(status => !!status);

				action.payload.FACSettings.fa_editable_statuses = new Set(
					action.payload.FACSettings.fa_editable_statuses
				);
			}
			// ***************************************************************************************************************
			action.payload.FACSettings.decomposition_chunk_size =
				action.payload.FACSettings.decomposition_chunk_size || 1000;

			action.payload.FACSettings.product_chunk_size =
				action.payload.FACSettings.product_chunk_size || 100;

			// Temporary until actions get access to store values
			window.SF.product_chunk_size = action.payload.FACSettings.product_chunk_size;

			// Validate custom tabs
			action.payload.CustomTabsData.forEach((tab, i) => {
				tab.label = tab.label || 'Custom tab #' + i;
				tab.container_id = tab.container_id || 'tab-' + makeId(6);
				tab.onMount = tab.onMount || null;
				tab.onEnter = tab.onEnter || null;
			});
			// ***************************************************************************************************************
			// Validate standard buttons
			const standardButtonsDefault = [
				'Save',
				'SubmitForApproval',
				'Submit',
				'Delta',
				'DeleteProducts',
				'BulkNegotiate',
				'AddProducts',
				'BulkNegotiateAddons',
				'AddAddons',
				'DeleteAddons',
				'AddFrameAgreement',
				'NewVersion',
				'AddOffers',
				'DeleteOffers',
				'BulkNegotiateOffers',
				'CreateOffers'
			];

			const fullStatusSet = new Set(Object.values(action.payload.FACSettings.statuses));

			const alwaysVisibleExp = {
				operators: [],
				components: [
					{
						field: 'Id',
						comparison: '!=',
						value: 'null'
					}
				]
			};

			const neverVisibleExp = {
				operators: [],
				components: []
			};

			function convertStatusToParsedExp(status, comparison) {
				return {
					field: 'csconta__Status__c',
					comparison: comparison,
					value: status
				};
			}

			var _standardButtons = {};
			standardButtonsDefault.forEach(sb => {
				if (!action.payload.ButtonStandardData.hasOwnProperty(sb)) {
					console.warn(sb + ' not defined in "FA-Standard-Buttons"!');
					// Empty array mean it will never show
					_standardButtons[sb] = neverVisibleExp;
				} else {
					if (typeof action.payload.ButtonStandardData[sb] === 'string') {
						if (action.payload.ButtonStandardData[sb] === '*') {
							_standardButtons[sb] = alwaysVisibleExp;
							return;
						}

						_standardButtons[sb] = parseExpression(action.payload.ButtonStandardData[sb]);
					} else {
						// Legacy configuration
						if (action.payload.ButtonStandardData[sb][0] === '*') {
							_standardButtons[sb] = alwaysVisibleExp;
							return;
						}

						let _config = action.payload.ButtonStandardData[sb];

						let operators = new Array(_config.length ? _config.length - 1 : 0);
						operators.fill('||');

						_standardButtons[sb] = {
							operators,
							components: _config.map(status => convertStatusToParsedExp(status, '=='))
						};
					}
				}
			});

			action.payload.ButtonStandardData = _standardButtons;
			// ***************************************************************************************************************
			// Validate custom buttons
			action.payload.ButtonCustomData = action.payload.ButtonCustomData.filter(btn => {
				if (!btn.hasOwnProperty('type') || !btn.hasOwnProperty('label')) {
					console.warn('Invalid button configuration:', btn);
					return false;
				}
				return true;
			});

			const LOCATIONS = {
				Editor: true,
				Footer: true,
				List: true
			};

			action.payload.ButtonCustomData.forEach((cb, i) => {
				let _config = cb.hidden || [];

				let operators = new Array(_config.length ? _config.length - 1 : 0);
				operators.fill('&&');

				let _legacyVisible = {
					operators,
					components: _config.map(status => convertStatusToParsedExp(status, '!='))
				};

				let _newVisible = parseExpression(cb.visible);

				if (
					_legacyVisible.components.length > 0 &&
					_newVisible?.components?.length > 0
				) {
					_legacyVisible.operators.push("&&");
				}

				cb.expressions = {
					operators: [..._legacyVisible.operators, ..._newVisible.operators],
					components: [..._legacyVisible.components, ..._newVisible.components]
				};

				cb.id = cb.id || (cb.label || 'unlabeled-' + i).replace(/\s+/g, '').toLowerCase();

				if (!cb.location || !LOCATIONS[cb.location]) {
					cb.location = 'Editor';
				}
			});

			return {
				...state,
				settings: { ...state.settings, ...action.payload },
				productFields: _productFields,
				faFields: _faFields
			};

		case 'REPLACE_CHARGES':
			const replacementData = action.payload.replacementData;

			var faId = action.payload.faId;
			var _attachment = state.frameAgreements[faId]._ui.attachment;

			for (var key in replacementData) {
				// key -> old cp Id
				let new_cp = state.commercialProducts.find(cp => cp.Id === replacementData[key].new_cp.Id);

				let old_addons = copy(_attachment.products[key]._addons) || {};
				let new_addons = {};

				// since attachment is indexed by addon assoc id, we need to traverse the cp data to find addon -> addon assoc correlation
				new_cp._addons.forEach(add => {
					if (
						replacementData[key].addon_vs_addon_assoc.hasOwnProperty(
							add.cspmb__Add_On_Price_Item__c
						)
					) {
						// This addon is shared by both old and new products
						new_addons[add.Id] = copy(
							old_addons[replacementData[key].addon_vs_addon_assoc[add.cspmb__Add_On_Price_Item__c]]
						);
					}
				});

				_attachment.products[new_cp.Id]._addons = {
					..._attachment.products[new_cp.Id]._addons,
					...new_addons
				};

				//**************************************************************************
				let rcIdSet = new Set(replacementData[key].rc || []);

				let old_rc = copy(_attachment.products[key]._rateCards) || {};

				if (replacementData[key].rc) {
					replacementData[key].rc.forEach((rc) => {
						if (_attachment.products[new_cp.Id]._rateCards?.hasOwnProperty(rc.Id)) {
							_attachment.products[new_cp.Id]._rateCards[rc.Id] = {
								..._attachment.products[new_cp.Id]._rateCards[rc.Id],
								...old_rc[rc.Id]
							};
						}
					});
				}

				_attachment.products[new_cp.Id]._rateCards = {
					..._attachment.products[new_cp.Id]._rateCards,
					...old_rc
				};
				//**************************************************************************
				// remove old cp from attachment
				delete _attachment.products[key];
			}

			return {
				...state,
				attachment: _attachment
			};

		case 'RECIEVE_PRICE_ITEM_DATA':
			const productVsDiscount = {};

			var _DiscLevels = [
				...(state.settings.DiscLevels || []),
				...formatDiscLevels(action.payload.discLevels)
			];

			// Remove duplicates
			_DiscLevels = [...new Set(_DiscLevels.map(dc => JSON.stringify(dc)))].map(dc =>
				JSON.parse(dc)
			);

			var _AuthLevels = {
				...state.settings.AuthLevels,
				...formatDiscThresh(action.payload.discThresh)
			};

			_DiscLevels.forEach(lv => {
				if (lv.priceItemId) {
					productVsDiscount[lv.priceItemId] = productVsDiscount[lv.priceItemId] || [];
					productVsDiscount[lv.priceItemId].push(lv);
				}
			});

			var priceItemData = action.payload.cpData;
			// *********************************************************
			for (var key in priceItemData) {
				// *********************************************************
				var priceItemIndex = state.commercialProducts.findIndex(pi => {
					return pi.Id === key;
				});

				if (priceItemIndex === -1) {
					console.error(
						'Cannot find price item ' +
							key +
							' in:' +
							state.commercialProducts.map(cp => cp.Id).slice(0, 20) +
							'...'
					);
					// return { ...state };
					continue;
				}

				// **********************************************
				if (productVsDiscount[key]) {
					state.commercialProducts[priceItemIndex]._discountLvIds = productVsDiscount[key];
				}
				// **********************************************
				const addonVsDiscount = {};

				_DiscLevels.forEach(lv => {
					if (lv.addonId) {
						addonVsDiscount[lv.addonId] = addonVsDiscount[lv.addonId] || [];
						addonVsDiscount[lv.addonId].push(lv);
					}
				});

				function formatAddons(addon) {
					let _addon = { ...addon };

					_addon.cspmb__One_Off_Charge__c = _addon.hasOwnProperty('cspmb__One_Off_Charge__c')
						? addon.cspmb__One_Off_Charge__c
						: null;
					_addon.cspmb__Recurring_Charge__c = _addon.hasOwnProperty('cspmb__Recurring_Charge__c')
						? addon.cspmb__Recurring_Charge__c
						: null;

					_addon.cspmb__Authorization_Level__c =
						_addon.cspmb__Add_On_Price_Item__r.cspmb__Authorization_Level__c;
					_addon.Name = _addon.cspmb__Add_On_Price_Item__r.Name;

					if (addonVsDiscount[addon.cspmb__Add_On_Price_Item__c]) {
						_addon._discountLvIds = addonVsDiscount[addon.cspmb__Add_On_Price_Item__c];
					}

					// Keep allow fileds
					_addon.cspmb__Is_One_Off_Discount_Allowed__c = _addon.cspmb__Add_On_Price_Item__r.cspmb__Is_One_Off_Discount_Allowed__c;
					_addon.cspmb__Is_Recurring_Discount_Allowed__c = _addon.cspmb__Add_On_Price_Item__r.cspmb__Is_Recurring_Discount_Allowed__c;

					delete _addon.cspmb__Add_On_Price_Item__r;
					delete _addon.cspmb__Price_Item__r;

					return _addon;
				}

				// **********************************************

				state.commercialProducts[priceItemIndex]._addons = priceItemData[key].addons.map(addon =>
					formatAddons(addon)
				);

				// **********************************************
				state.commercialProducts[priceItemIndex]._charges = priceItemData[key].charges.map(
					charge => {
						let retCharge = { ...charge };
						if (
							charge.chargeType
								.toLowerCase()
								.replace(/\s+/g, '')
								.replace(/\W/g, '') === 'oneoffcharge'
						) {
							delete retCharge.recurring;
							retCharge._type = 'oneOff';
						} else if (
							charge.chargeType
								.toLowerCase()
								.replace(/\s+/g, '')
								.replace(/\W/g, '') === 'recurringcharge'
						) {
							delete retCharge.oneOff;
							retCharge._type = 'recurring';
						} else {
							retCharge = null;
						}
						return retCharge;
					}
				);

				state.commercialProducts[priceItemIndex]._charges = state.commercialProducts[
					priceItemIndex
				]._charges.filter(charge => {
					return charge != null;
				});

				// **********************************************
				state.commercialProducts[priceItemIndex]._rateCards = priceItemData[key].rateCards.map(
					rc => {
						rc.rateCardLines.forEach(rcl => {
							rcl.usageTypeName = rcl.hasOwnProperty('cspmb__usage_type__r')
								? rcl.cspmb__usage_type__r.Name
								: null;
						});
						return rc;
					}
				);

				// **********************************************

				priceItemData[key].allowances = priceItemData[key].allowances || [];

				priceItemData[key].allowances.forEach(all => {
					if (all.hasOwnProperty('cspmb__usage_type__r')) {
						all.mainUsageType = JSON.parse(JSON.stringify(all.cspmb__usage_type__r));
						delete all.cspmb__usage_type__r;
						delete all.mainUsageType.attributes;

						// Associate child UT
						if (
							action.payload.childUsageTypes &&
							action.payload.childUsageTypes.hasOwnProperty(all.mainUsageType.Id)
						) {
							all.mainUsageType.childUsageTypes =
								action.payload.childUsageTypes[all.mainUsageType.Id];
						} else {
							all.mainUsageType.childUsageTypes = [];
						}
					}
				});

				state.commercialProducts[priceItemIndex]._allowances = priceItemData[key].allowances || [];

				// **********************************************
				state.commercialProducts[priceItemIndex]._dataLoaded = true;
			}
			// **********************************************

			return {
				...state,
				settings: {
					...state.settings,
					DiscLevels: _DiscLevels,
					AuthLevels: _AuthLevels
				},
				...{ commercialProducts: state.commercialProducts }
			};

		case 'ADD_PRODUCTS':
			var faId = action.payload.faId;
			var productIds = new Set(action.payload.products);

			var _attachment = { ...state.frameAgreements[faId]._ui.attachment } || {
				custom: '',
				products: {}
			};

			var newCps = [];

			state.commercialProducts.forEach(cp => {
				if (productIds.has(cp.Id)) {
					if (!_attachment.products.hasOwnProperty(cp.Id)) {
						_attachment.products[cp.Id] = enrichAttachment(cp);
					}
					newCps.push(cp);
				}
			});

			newCps = new Set([...state.frameAgreements[faId]._ui.commercialProducts, ...newCps]);
			newCps = Array.from(newCps);

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							attachment: _attachment,
							commercialProducts: newCps
						}
					}
				}
			};

		case 'ADD_ADDONS':
			var faId = action.payload.faId;
			var addonIds = new Set(action.payload.addons);

			var _attachment = { ...state.frameAgreements[faId]._ui.attachment } || {
				custom: '',
				addons: {}
			};

			if (!_attachment.hasOwnProperty('addons')) {
				_attachment.addons = {};
			}

			var newAddons = [];

			state.standaloneAddons.forEach(add => {
				if (addonIds.has(add.Id)) {
					if (!_attachment.addons.hasOwnProperty(add.Id)) {
						_attachment.addons[add.Id] = initiateAddonsAttachment(add);
					}
					newAddons.push(add);
				}
			});

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							attachment: _attachment,
							standaloneAddons: [...state.frameAgreements[faId]._ui.standaloneAddons, ...newAddons]
						}
					}
				}
			};

		case 'LOAD_RL':
			var faId = action.payload.faId;
			var rlData = action.payload.rlData;

			rlData.forEach(rl => {
				rl.columns = validateCSV(rl.columns) ? convertCSVToArray(rl.columns) : [];
			});

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							relatedLists: rlData
						}
					}
				}
			};

		case 'ADD_FA':
			var faId = action.payload.faId;
			var agreements = action.payload.agreements;

			var _attachment = {
				...(state.frameAgreements[faId]._ui.attachment || {
					custom: '',
					products: {}
				})
			};

			agreements.forEach(fa => {
				_attachment.products[fa] = fa;
			});

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							attachment: _attachment
						}
					}
				}
			};

		case 'REMOVE_FA':
			var faId = action.payload.faId;
			var agreements = action.payload.agreements;

			var _attachment = {
				...(state.frameAgreements[faId]._ui.attachment || {
					custom: '',
					products: {}
				})
			};

			agreements.forEach(fa => {
				delete _attachment.products[fa];
			});

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							attachment: _attachment
						}
					}
				}
			};

		case 'RESET_NEGOTIATION':
			var faId = action.payload.faId;
			var entitiyMap = action.payload.entitiyMap;

			var _attachment = { ...state.frameAgreements[faId]._ui.attachment };

			if (!entitiyMap) {
				state.frameAgreements[faId]._ui.commercialProducts.forEach(cp => {
					// Save volume fields on override
					_attachment.products[cp.Id] = {
						...enrichAttachment(cp),
						_volume: _attachment.products[cp.Id]._volume,
					};
				});

				state.frameAgreements[faId]._ui.offers.forEach(offer => {
					// Save volume fields on override
					_attachment.offers[offer.Id] = {
						...enrichAttachment(offer),
						_volume: _attachment.offers[offer.Id]._volume
					};
				});
			} else {
				let itemCache = {};

				function getDefaultAttachmentForItemId(itemId) {
					if (!itemCache.hasOwnProperty(itemId)) {
						let _item = state.frameAgreements[
							faId
						]._ui.commercialProducts.find((cp) => cp.Id === itemId);

						// if it is null, then it has to be offer
						if (!_item) {
							_item = state.frameAgreements[faId]._ui.offers.find(
								(offer) => offer.Id === itemId
							);
						}
						itemCache[itemId] = enrichAttachment(_item);
					}

					return itemCache[itemId];
				}

				if (entitiyMap.product) {

					function resetChargesNegotiations(itemAttachement) {
						//itemAttachement = _attachment.products or _attachment.offers
						if (itemAttachement) {
							for (var key in itemAttachement) {
								let _defaultAttachment = getDefaultAttachmentForItemId(key);

								if (entitiyMap.product[key]) {
									// This entity is preset in attachment
									// reset its charges and productCharges
									if (_defaultAttachment._product) {
										itemAttachement[key]._product = _defaultAttachment._product;
									}

									if (_defaultAttachment._charges) {
										itemAttachement[key]._charges = _defaultAttachment._charges;
									}
								}
							}
						}
					}

					resetChargesNegotiations(_attachment.products);
					resetChargesNegotiations(_attachment.offers);
				}

				if (entitiyMap.rcl) {

					function resetRateCardNegotiations(itemAttachement) {
						//itemAttachement = _attachment.products or _attachment.offers
						for (var key in itemAttachement) {

							if (itemAttachement[key]._rateCards) {
								let _defaultAttachment = getDefaultAttachmentForItemId(key);

								for (var rateCardId in
									itemAttachement[key]._rateCards) {

									for (var rateCardLineId in
										itemAttachement[key]._rateCards[rateCardId]) {

										if (entitiyMap.rcl[rateCardLineId]) {
											// reset matching rate card line charges
											itemAttachement[key]._rateCards[
												rateCardId
											][rateCardLineId] =
												_defaultAttachment._rateCards[
													rateCardId
												][rateCardLineId];
										}
									}
								}
							}
						}
					}
					resetRateCardNegotiations(_attachment.products);
					resetRateCardNegotiations(_attachment.offers);
				}
			}

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							attachment: _attachment
						}
					}
				}
			};

		case 'REMOVE_PRODUCTS':
			var faId = action.payload.faId;
			var productIds = action.payload.products;

			var _products = state.frameAgreements[faId]._ui.attachment.products;

			var _commercialProducts = state.frameAgreements[faId]._ui.commercialProducts;
			_commercialProducts = _commercialProducts.filter(cp => !productIds.includes(cp.Id));

			productIds.forEach(cpId => {
				delete _products[cpId];
			});

			var _attachment = state.frameAgreements[faId]._ui.attachment;
			var _attachment = { ..._attachment, products: _products };

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							commercialProducts: _commercialProducts,
							attachment: _attachment
						}
					}
				}
			};

		case 'REMOVE_ADDONS':
			var faId = action.payload.faId;
			var addonIds = action.payload.addons;

			var addons = state.frameAgreements[faId]._ui.attachment.addons;

			var _standaloneAddons = state.frameAgreements[faId]._ui.standaloneAddons;
			_standaloneAddons = _standaloneAddons.filter(add => !addonIds.includes(add.Id));

			addonIds.forEach(addId => {
				delete addons[addId];
			});

			var _attachment = state.frameAgreements[faId]._ui.attachment;
			var _attachment = { ..._attachment, addons: addons };

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							standaloneAddons: _standaloneAddons,
							attachment: _attachment
						}
					}
				}
			};
		// **********************************************

		case 'RECIEVE_GET_ATTACHMENT':
			var faId = action.payload.faId;
			var attachment = action.payload.data || {};

			if (!attachment.offers) {
				attachment.offers = {};
			}

			if (!attachment.hasOwnProperty('addons')) {
				attachment.addons = {};
			}

			var _commercialProducts = state.commercialProducts.filter(cp => attachment.products[cp.Id]);
			var _standaloneAddons = state.standaloneAddons.filter(add => attachment.addons[add.Id]);
			var _offers = state.offers.filter(offer => attachment.offers[offer.Id]);

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							attachment,
							commercialProducts: _commercialProducts,
							standaloneAddons: _standaloneAddons,
							offers: _offers,
							faOffers: new Map()
						}
					}
				}
			};

		case 'GET_APPROVAL_HISTORY':
			var faId = action.payload.faId;
			var data = action.payload.data;

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: { ...state.frameAgreements[faId]._ui, approval: data }
					}
				}
			};

		case 'TOGGLE_FRAME_AGREEMENT_OPERATIONS':
			return {
				...state,
				disableFrameAgreementOperations: action.payload
			};

		case 'CLONE_FRAME_AGREEMENT':
			let frameAgreementId = action.payload;

			return {
				...state,
				currentFrameAgreement: JSON.parse(JSON.stringify(state.frameAgreements[frameAgreementId]))
			}

		case 'RESET_CURRENT_FRAME_AGREEMENT_CHANGES':
			frameAgreementId = action.payload;

			return {
				...state,
				frameAgreements : {
					...state.frameAgreements,
					[frameAgreementId]: JSON.parse(JSON.stringify(state.currentFrameAgreement))
				},
				currentFrameAgreement: {}
			}

		case 'CLEAR_FA_ATTACHMENT':
			frameAgreementId = action.payload;
			let attachmentClearedFrameAgreement = JSON.parse(JSON.stringify(state.frameAgreements[frameAgreementId]))
			attachmentClearedFrameAgreement._ui.attachment = null
			return {
				...state,
				frameAgreements : {
					...state.frameAgreements,
					[frameAgreementId]: { ...attachmentClearedFrameAgreement }
				}
			}

		case 'ADD_OFFERS':
			var faId = action.payload.faId;
			var offerIds = new Set(action.payload.offers);

			var _attachment = { ...state.frameAgreements[faId]._ui.attachment } || {
				custom: '',
				offers: {}
			};

			var newOffers = [];

			state.offers.forEach(offer => {
				if (offerIds.has(offer.Id)) {
					if (!_attachment.offers.hasOwnProperty(offer.Id)) {
						_attachment.offers[offer.Id] = enrichAttachment(offer);
					}
					newOffers.push(offer);
				}
			});

			newOffers = new Set([...state.frameAgreements[faId]._ui.offers, ...newOffers]);
			newOffers = Array.from(newOffers);

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							attachment: _attachment,
							offers: newOffers
						}
					}
				}
			};

		case 'REMOVE_OFFERS':
			var faId = action.payload.faId;
			var offerIds = action.payload.offers;

			var _offersAttachment = state.frameAgreements[faId]._ui.attachment.offers;

			var _offers = state.frameAgreements[faId]._ui.offers;
			_offers = _offers.filter(offer => !offerIds.includes(offer.Id));

			offerIds.forEach(cpId => {
				delete _offersAttachment[cpId];
			});

			var _attachment = state.frameAgreements[faId]._ui.attachment;
			var _attachment = { ..._attachment, offers: _offersAttachment };

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							offers: _offers,
							attachment: _attachment
						}
					}
				}
			};

		case 'RECEIVE_OFFERS':
			var offers = action.payload;

			// validate
			offers.forEach(offer => {
				if (!offer.hasOwnProperty('cspmb__Is_One_Off_Discount_Allowed__c')) {
					offer.cspmb__Is_One_Off_Discount_Allowed__c = false;
				}

				if (!offer.hasOwnProperty('cspmb__Is_Recurring_Discount_Allowed__c')) {
					offer.cspmb__Is_Recurring_Discount_Allowed__c = false;
				}
			});

			return {
				...state,
				...{ offers },
				...{ initialised: { ...state.initialised, ...{ of_loaded: true } } }
			};

		case 'RECIEVE_OFFER_DATA':
			const offerVsDiscount = {};

			var _DiscLevels = [
				...(state.settings.DiscLevels || []),
				...formatDiscLevels(action.payload.discLevels)
			];

			// Remove duplicates
			_DiscLevels = [...new Set(_DiscLevels.map(dc => JSON.stringify(dc)))].map(dc =>
				JSON.parse(dc)
			);

			var _AuthLevels = {
				...state.settings.AuthLevels,
				...formatDiscThresh(action.payload.discThresh)
			};

			_DiscLevels.forEach(lv => {
				if (lv.priceItemId) {
					offerVsDiscount[lv.priceItemId] = offerVsDiscount[lv.priceItemId] || [];
					offerVsDiscount[lv.priceItemId].push(lv);
				}
			});

			var offerData = action.payload.cpData;
			for (var key in offerData) {
				var offerIndex = state.offers.findIndex(pi => {
					return pi.Id === key;
				});

				if (offerIndex === -1) {
					console.error(
						'Cannot find offer ' +
							key +
							' in:' +
							state.offers.map(cp => cp.Id).slice(0, 20) +
							'...'
					);
					continue;
				}

				if (offerVsDiscount[key]) {
					state.offers[offerIndex]._discountLvIds = offerVsDiscount[key];
				}

				const offerAddonVsDiscount = {};

				_DiscLevels.forEach(lv => {
					if (lv.addonId) {
						offerAddonVsDiscount[lv.addonId] = offerAddonVsDiscount[lv.addonId] || [];
						offerAddonVsDiscount[lv.addonId].push(lv);
					}
				});

				function formatAddons(addon) {
					let _addon = { ...addon };

					_addon.cspmb__One_Off_Charge__c = _addon.hasOwnProperty('cspmb__One_Off_Charge__c')
						? addon.cspmb__One_Off_Charge__c
						: null;
					_addon.cspmb__Recurring_Charge__c = _addon.hasOwnProperty('cspmb__Recurring_Charge__c')
						? addon.cspmb__Recurring_Charge__c
						: null;

					_addon.cspmb__Authorization_Level__c =
						_addon.cspmb__Add_On_Price_Item__r.cspmb__Authorization_Level__c;
					_addon.Name = _addon.cspmb__Add_On_Price_Item__r.Name;

					if (offerAddonVsDiscount[addon.cspmb__Add_On_Price_Item__c]) {
						_addon._discountLvIds = offerAddonVsDiscount[addon.cspmb__Add_On_Price_Item__c];
					}

					// Keep allow fileds
					_addon.cspmb__Is_One_Off_Discount_Allowed__c = _addon.cspmb__Add_On_Price_Item__r.cspmb__Is_One_Off_Discount_Allowed__c;
					_addon.cspmb__Is_Recurring_Discount_Allowed__c = _addon.cspmb__Add_On_Price_Item__r.cspmb__Is_Recurring_Discount_Allowed__c;

					delete _addon.cspmb__Add_On_Price_Item__r;
					delete _addon.cspmb__Price_Item__r;

					return _addon;
				}

				state.offers[offerIndex]._addons = offerData[key].addons.map(addon =>
					formatAddons(addon)
				);

				state.offers[offerIndex]._charges = offerData[key].charges.map(
					charge => {
						let retCharge = { ...charge };
						if (
							charge.chargeType
								.toLowerCase()
								.replace(/\s+/g, '')
								.replace(/\W/g, '') === 'oneoffcharge'
						) {
							delete retCharge.recurring;
							retCharge._type = 'oneOff';
						} else if (
							charge.chargeType
								.toLowerCase()
								.replace(/\s+/g, '')
								.replace(/\W/g, '') === 'recurringcharge'
						) {
							delete retCharge.oneOff;
							retCharge._type = 'recurring';
						} else {
							retCharge = null;
						}
						return retCharge;
					}
				);

				state.offers[offerIndex]._charges = state.offers[
					offerIndex
				]._charges.filter(charge => {
					return charge != null;
				});

				state.offers[offerIndex]._rateCards = offerData[key].rateCards.map(
					rc => {
						rc.rateCardLines.forEach(rcl => {
							rcl.usageTypeName = rcl.hasOwnProperty('cspmb__usage_type__r')
								? rcl.cspmb__usage_type__r.Name
								: null;
						});
						return rc;
					}
				);

				offerData[key].allowances = offerData[key].allowances || [];

				offerData[key].allowances.forEach(all => {
					if (all.hasOwnProperty('cspmb__usage_type__r')) {
						all.mainUsageType = JSON.parse(JSON.stringify(all.cspmb__usage_type__r));
						delete all.cspmb__usage_type__r;
						delete all.mainUsageType.attributes;

						// Associate child UT
						if (
							action.payload.childUsageTypes &&
							action.payload.childUsageTypes.hasOwnProperty(all.mainUsageType.Id)
						) {
							all.mainUsageType.childUsageTypes =
								action.payload.childUsageTypes[all.mainUsageType.Id];
						} else {
							all.mainUsageType.childUsageTypes = [];
						}
					}
				});

				state.offers[offerIndex]._allowances = offerData[key].allowances || [];
				state.offers[offerIndex]._metadata = offerData[key].commercialProductMetadata || {};

				state.offers[offerIndex]._dataLoaded = true;
			}

			return {
				...state,
				settings: {
					...state.settings,
					DiscLevels: _DiscLevels,
					AuthLevels: _AuthLevels
				},
				...{ offers: state.offers }
			};

		case 'NEGOTIATE_OFFERS':
			var faId = action.payload.faId;
			var priceItemId = action.payload.priceItemId;
			var type = action.payload.type;
			var data = action.payload.data;

			var _attachment = state.frameAgreements[faId]._ui.attachment;

			if (!_attachment) {
				log.bg.red('Negotiation failed; attachment not loaded for FA:' + faId);
				return { ...state };
			}

			_attachment.offers = {
				..._attachment.offers,
				[priceItemId]: { ..._attachment.offers[priceItemId], [type]: data }
			};

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: state.frameAgreements[faId]._ui,
						attachment: _attachment
					}
				}
			};

		case 'NEGOTIATE_API_OFFER':
			var faId = action.payload.faId;
			var data = action.payload.data;

			if (!state.frameAgreements[faId]._ui.attachment) {
				log.bg.red('Negotiation failed; attachment not loaded for FA:' + faId);
				return { ...state };
			}

			var _fa = state.frameAgreements[faId];
			var offers = _fa._ui.attachment.offers;

			if (Array.isArray(data)) {
				data.forEach(dataObject => negotiateData(dataObject, _fa._ui.offers, offers));
			} else {
				negotiateData(data, _fa._ui.offers, offers);
			}

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: state.frameAgreements[faId]._ui,
						attachment: {
							...state.frameAgreements[faId]._ui.attachment,
							offers
						}
					}
				}
			};

		case 'NEGOTIATE_BULK_OFFERS':
			var faId = action.payload.faId;
			var data = action.payload.data;

			var _offers = state.frameAgreements[faId]._ui.attachment.offers;

			for (var key in _offers) {
				if (data[key]._addons) {
					_offers[key]._addons = _offers[key]._addons || {};
					_offers[key]._addons = {
						..._offers[key]._addons,
						...data[key]._addons
					};
				}
				if (data[key]._charges) {
					_offers[key]._charges = _offers[key]._charges || {};
					_offers[key]._charges = {
						..._offers[key]._charges,
						...data[key]._charges
					};
				}
				if (data[key]._rateCards) {
					_offers[key]._rateCards = _offers[key]._rateCards || {};
					for (var rcId in data[key]._rateCards) {
						_offers[key]._rateCards[rcId] = data[key]._rateCards[rcId];
					}
				}
				if (data[key]._product) {
					_offers[key]._product = _offers[key]._product || {};
					_offers[key]._product = {
						..._offers[key]._product,
						...data[key]._product,
					};
				}
			}

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: state.frameAgreements[faId]._ui,
						attachment: {
							...state.frameAgreements[faId]._ui.attachment,
							offers: _offers
						}
					}
				}
			};

		case 'SET_OFFER_FILTER':
			var _faId = action.payload.faId;
			var _filterSet = action.payload.offerIdSet;

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[_faId]: {
						...state.frameAgreements[_faId],
						_ui: { ...state.frameAgreements[_faId]._ui, _offerFilter: _filterSet }
					}
				}
			};

		case 'REPLACE_OFFER_CHARGES':
			const offerReplacementData = action.payload.replacementData;

			var faId = action.payload.faId;
			var _attachment = { ...state.frameAgreements[faId]._ui.attachment };

			for (var key in offerReplacementData) {
				// key -> old offer Id
				let new_cp = state.offers.find(offer => offer.Id === offerReplacementData[key].new_cp.Id);

				if (!new_cp) {
					continue;
				}

				let old_addons = copy(_attachment.offers[key]._addons);
				let new_addons = {};

				// since attachment is indexed by addon assoc id, we need to traverse the offer data to find addon -> addon assoc correlation
				new_cp._addons.forEach(add => {
					if (
						offerReplacementData[key].addon_vs_addon_assoc.hasOwnProperty(
							add.cspmb__Add_On_Price_Item__c
						)
					) {
						// This addon is shared by both old and new offers
						new_addons[add.Id] = copy(
							old_addons[offerReplacementData[key].addon_vs_addon_assoc[add.cspmb__Add_On_Price_Item__c]]
						);
					}
				});

				_attachment.offers[new_cp.Id]._addons = {
					..._attachment.offers[new_cp.Id]._addons,
					...new_addons
				};

				let rcIdSet = new Set(offerReplacementData[key].rc || []);

				let old_rc = copy(_attachment.offers[key]._rateCards);

				offerReplacementData[key].rc.forEach(rc => {
					if (_attachment.offers[new_cp.Id]._rateCards?.hasOwnProperty(rc.Id)) {
						_attachment.offers[new_cp.Id]._rateCards[rc.Id] = {
							..._attachment.offers[new_cp.Id]._rateCards[rc.Id],
							...old_rc[rc.Id]
						};
					}
				});

				_attachment.offers[new_cp.Id]._rateCards = {
					..._attachment.offers[new_cp.Id]._rateCards,
					...old_rc
				};
				// remove old offer from attachment
				delete _attachment.offers[key];
			}

			return {
				...state,
				attachment: _attachment
			};

		case 'SYNC_FA_OFFER_ATTACHMENT':

			var faId = action.payload.faId;
			var faOfferSavedAttachment = action.payload.attachment;

			var _initialAttachment = { ...state.currentFrameAgreement._ui.attachment };

			_initialAttachment.faOffers = faOfferSavedAttachment.faOffers;

			var _attachment = { ...state.frameAgreements[faId]._ui.attachment };

			_attachment.faOffers = JSON.parse(JSON.stringify(_initialAttachment.faOffers));

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							attachment: { ..._attachment }
						}
					}
				},
				currentFrameAgreement: {
					...state.currentFrameAgreement,
					_ui: {
						...state.currentFrameAgreement._ui,
						attachment: { ..._initialAttachment },
					}
				}
			};

		case 'ADD_FA_OFFER':

			var faId = action.payload.faId;
			var addedFaOffers = action.payload.addedFaOffers;

			var faOffersList = new Map(state.frameAgreements[faId]._ui.faOffers);

			var invalidFaOffers = new Set(state.validationFaOffers);
			if (!faOffersList.size) {
				invalidFaOffers = new Set();
			}
			addedFaOffers.forEach(faOffer => {
				faOffersList.set(faOffer.Id, faOffer);
				if (
					(!faOffer.cspmb__One_Off_Charge__c && faOffer.cspmb__One_Off_Charge__c != 0) &&
						(!faOffer.cspmb__Recurring_Charge__c && faOffer.cspmb__Recurring_Charge__c != 0)
				) {
					invalidFaOffers.add(faOffer.Id);
				} else {
					invalidFaOffers.delete(faOffer.Id);
				}
			});


			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							faOffers: faOffersList
						}
					}
				},
				validationFaOffers: invalidFaOffers
			};

		case 'DELETE_FA_OFFER':

			var faId = action.payload.faId;
			let deletedFaOffers = action.payload.deletedFaOffers;

			var faOffersList = new Map(state.frameAgreements[faId]._ui.faOffers);
			var invalidFaOffers = new Set(state.validationFaOffers);

			deletedFaOffers.forEach(faOffer => {
				faOffersList.delete(faOffer.Id);
				if (invalidFaOffers.has(faOffer.Id)) {
					invalidFaOffers.delete(faOffer.Id);
				}
			});

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							faOffers: faOffersList
						}
					}
				},
				validationFaOffers: invalidFaOffers
			};

		default:
			// SAVE_ATTACHMENT, RECIEVE_GET_ATTACHMENT, FILTER_COMMERCIAL_PRODUCTS, GET_APPROVAL_HISTORY
			return { ...state };
	}
};

export default rootReducer;
