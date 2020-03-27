import {
	log,
	validateCSV,
	getFieldLabel,
	parseExpression,
	evaluateExpressionOnAgreement
} from '../utils/shared-service';

import {
	validateAddons,
	validateProduct,
	validateCharges,
	validateRateCardLines
} from '../utils/validation-service';

const initialState = {
	initialised: {
		fa_loaded: false,
		cp_loaded: false,
		settings_loaded: false
	},
	settings: {
		AuthLevels: {},
		DiscLevels: {}
	},
	ignoreSettings: {},
	accounts: [],
	frameAgreements: {},
	commercialProducts: null,
	productFields: [],
	faFields: [],
	activeFa: null,
	validation: {},
	validationProduct: {},
	// approvalNeeded: false, // true -> needs validation
	handlers: {},
	modals: {
		actionIframe: false,
		actionIframeUrl: '',
		productModal: false,
		frameModal: false,
		negotiateModal: false
	},
	toasts: []
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
	var possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < n; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

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

			return evaluateExpressionOnAgreement(
				parseExpression(f.visible),
				_activeFa
			);
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
	let _DiscLevels = {};

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
				log.red(
					'Minimum greater then maximum on discount level:',
					dl.discountLevel.Id
				);
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
			error.message =
				'Missing crucial fields on discount level ' + dl.discountLevel.Id;
			error.targets = [
				'cspmb__Discount_Increment__c',
				'cspmb__Maximum_Discount_Value__c',
				'cspmb__Minimum_Discount_Value__c'
			];
		}

		if (!failure) {
			_DiscLevels[discount.discountLevel.Id] = discount;
		} else {
			log.red(error.message, error.targets);
		}
	});

	return _DiscLevels;
}

function getapprovalNeeded(validation) {
	return Object.keys(validation)
		.reduce((acc, key) => {
			let collection = [];
			if (validation[key].addons) {
				Object.values(validation[key].addons).forEach(item => {
					item.hasOwnProperty('oneOff') && collection.push(item.oneOff);
					item.hasOwnProperty('recurring') && collection.push(item.recurring);
				});
			}
			if (validation[key].charges) {
				collection = [...collection, ...Object.values(validation[key].charges)];
			}
			if (validation[key].product) {
				collection = [...collection, ...Object.values(validation[key].product)];
			}
			if (validation[key].rated) {
				collection = [...collection, ...Object.values(validation[key].rated)];
			}
			return [...acc, ...collection];
		}, [])
		.some(r => r === true);
}

function getProductValidation(validation) {
	let _productValidation = {};
	for (var key in validation) {
		_productValidation[key] = getapprovalNeeded({
			[key]: validation[key]
		});
	}
	return _productValidation;
}

function getNewAttachment(headerData, fa) {
	return {
		commercialProducts: [],
		approvalNeeded: false,
		headerRows: organizeHeaderFields(headerData, fa),
		attachment: null
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

			if (priceItemId === null) {
				var _fa = state.frameAgreements[faId];
				var _products = _fa._ui.attachment.products;
				var bulkValidation = {};

				_fa._ui.commercialProducts.forEach(cp => {
					bulkValidation[cp.Id] = {
						addons: validateAddons(cp._addons, _products[cp.Id]._addons || {}),
						rated: validateRateCardLines(
							cp._rateCards,
							_products[cp.Id]._rateCards || {}
						),
						charges: validateCharges(
							cp._charges,
							cp.cspmb__Authorization_Level__c,
							_products[cp.Id]._charges || {}
						)
					};

					if (_products[cp.Id].hasOwnProperty('_product')) {
						bulkValidation[cp.Id].product = validateProduct({
							oneOff: cp.cspmb__One_Off_Charge__c,
							negotiatedOneOff: _products[cp.Id]._product.oneOff,
							recurring: cp.cspmb__Recurring_Charge__c,
							negotiatedRecurring: _products[cp.Id]._product.recurring,
							authLevel: cp.cspmb__Authorization_Level__c || null,
							Name: cp.Name
						});
					}
				});

				validation = bulkValidation;
			} else {
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

			var approvalNeeded = getapprovalNeeded(validation);
			var validationProduct = getProductValidation(validation);

			return {
				...state,
				validation,
				validationProduct,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: { ...state.frameAgreements[faId]._ui, approvalNeeded }
					}
				}
			};

		case 'SET_VALIDATION':
			var faId = action.payload.faId;

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
				var validation = { ...state.validation, ...action.payload.priceItemId };
				var approvalNeeded = getapprovalNeeded(validation);
				var validationProduct = getProductValidation(validation);

				return {
					...state,
					validation,
					validationProduct,
					frameAgreements: {
						...state.frameAgreements,
						[faId]: {
							...state.frameAgreements[faId],
							_ui: { ...state.frameAgreements[faId]._ui, approvalNeeded }
						}
					}
				};
			} else {
				var validation = {
					...state.validation,
					[action.payload.priceItemId]: {
						...state.validation[action.payload.priceItemId],
						[action.payload.type]: {
							...state.validation[action.payload.priceItemId][
								action.payload.type
							],
							...action.payload.data
						}
					}
				};
				var approvalNeeded = getapprovalNeeded(validation);
				var validationProduct = getProductValidation(validation);
				return {
					...state,
					validation,
					validationProduct,
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
				faFields: state.faFields.map((f, i) =>
					i === index ? { ...f, visible: !f.visible } : f
				)
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
					cp.cspmb__Is_One_Off_Discount_Allowed__c = true;
				}

				if (!cp.hasOwnProperty('cspmb__Is_Recurring_Discount_Allowed__c ')) {
					cp.cspmb__Is_Recurring_Discount_Allowed__c = true;
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
									headerRows: organizeHeaderFields(
										state.settings.HeaderData,
										upsertedFa
									)
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
			var {
				[action.payload]: value,
				...withoutRemoved
			} = state.frameAgreements;
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
					headerRows: organizeHeaderFields(
						state.settings.HeaderData,
						upsertData
					)
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

			function negotiateData(dataObject) {
				let cp = _fa._ui.commercialProducts.find(
					_cp => _cp.Id === dataObject.priceItemId
				);

				if (!cp) {
					console.error(
						'Cannot find commercial product with Id ' +
							dataObject.priceItemId +
							' in active Frame Agreement!'
					);
					return;
				}
				if (!dataObject.hasOwnProperty('value')) {
					console.error('No value provided for negotiation!');
					return;
				}
				// ********************************** Addons
				if (dataObject.hasOwnProperty('cpAddon')) {
					if (dataObject.value.hasOwnProperty('oneOff')) {
						_products[dataObject.priceItemId]._addons[
							dataObject.cpAddon
						].oneOff = dataObject.value.oneOff;
					}
					if (dataObject.value.hasOwnProperty('recurring')) {
						_products[dataObject.priceItemId]._addons[
							dataObject.cpAddon
						].recurring = dataObject.value.recurring;
					}
				}
				// ********************************* Charge
				else if (dataObject.hasOwnProperty('charge')) {
					// Charge validation
					let charge = cp._charges.find(_ch => _ch.Id === dataObject.charge);
					let type;
					if (charge.chargeType === 'One-off Charge') {
						type = 'oneOff';
					}
					if (charge.chargeType === 'Recurring Charge') {
						type = 'recurring';
					}
					if (!dataObject.value.hasOwnProperty(type)) {
						console.error(
							'Pricing element ' + charge.Id + ' has invalid charge type!'
						);
						return;
					}

					_products[dataObject.priceItemId]._charges[dataObject.charge][type] =
						dataObject.value[type];
				}
				// *********************************
				else if (dataObject.hasOwnProperty('rateCard')) {
					// RCL
					if (!dataObject.hasOwnProperty('rateCardLine')) {
						console.error('No rate card line Id provided!');
						return;
					}

					dataObject.value = +dataObject.value;

					if (
						typeof dataObject.value !== 'number' &&
						!Number.isNaN(dataObject.value)
					) {
						console.error('Value for RCL not integer!');
						return;
					}

					_products[dataObject.priceItemId]._rateCards[dataObject.rateCard][
						dataObject.rateCardLine
					] = dataObject.value;
				}
				// *********************************
				else {
					// Product negotiation
					_products[dataObject.priceItemId]._product = {
						..._products[dataObject.priceItemId]._product,
						...dataObject.value
					};
				}
				// *********************************
			}

			if (Array.isArray(data)) {
				data.forEach(negotiateData);
			} else {
				negotiateData(data);
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
		// *************************************

		case 'RECIEVE_PICKLIST_OPTIONS':
			var options = action.payload;
			// {'fieldName': [{'label': optionlabel, 'value': optionValue}, ...]}

			var headerData = state.settings.HeaderData;

			headerData.forEach(f => {
				if (f.type === 'picklist' && options.hasOwnProperty(f.field)) {
					f.options = options[f.field];
				}
			});

			try {
				window.SF.fieldLabels[
					'misc'
				] = options.csconta__agreement_level__c.reduce(
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
				data.label =
					data.label ||
					getFieldLabel('csconta__Frame_Agreement__c', data.field);
			});

			action.payload.CustomTabsData = validateJSONData(
				action.payload.CustomTabsData
			);

			let _productFields = [];
			let _faFields = [];
			// _productFields.push({name:"Name", visible: true})

			if (!action.payload.FACSettings.hasOwnProperty('new_frame_agreement')) {
				action.payload.FACSettings.new_frame_agreement = true;
			}

			if (
				!action.payload.FACSettings.hasOwnProperty(
					'active_status_management__c'
				)
			) {
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
				action.payload.FACSettings.rcl_fields = action.payload.FACSettings.rcl_fields
					.replace(/(?:\r\n|\r|\n|\s)/g, '')
					.split(',');
			} else {
				action.payload.FACSettings.rcl_fields = [];
			}

			if (
				action.payload.FACSettings.hasOwnProperty('account_fields') &&
				validateCSV(action.payload.FACSettings.account_fields)
			) {
				action.payload.FACSettings.account_fields = action.payload.FACSettings.account_fields
					.replace(/(?:\r\n|\r|\n|\s)/g, '')
					.split(',');
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
				action.payload.FACSettings.usage_type_fields__c = action.payload.FACSettings.usage_type_fields__c
					.replace(/(?:\r\n|\r|\n|\s)/g, '')
					.split(',');
			} else {
				action.payload.FACSettings.usage_type_fields__c = [];
			}

			if (validateCSV(action.payload.FACSettings.price_item_fields)) {
				action.payload.FACSettings.price_item_fields = action.payload.FACSettings.price_item_fields
					.replace(/(?:\r\n|\r|\n|\s)/g, '')
					.split(',');

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
				action.payload.FACSettings.volume_fields_visibility = action.payload.FACSettings.volume_fields_visibility
					.replace(/(?:\r\n|\r|\n|\s)/g, '')
					.split(',');
			} else {
				action.payload.FACSettings.volume_fields_visibility = VOLUME_FIELDS.map(
					vf => vf.name
				);
			}

			if (action.payload.FACSettings.show_volume_fields) {
				let _visibillity = new Set(
					action.payload.FACSettings.volume_fields_visibility
				);

				VOLUME_FIELDS.filter(vf => _visibillity.has(vf.name)).forEach(f => {
					_productFields.push({
						name: f.label,
						visible: true,
						volume: f.name
					});
				});
			}

			if (validateCSV(action.payload.FACSettings.frame_agreement_fields)) {
				action.payload.FACSettings.frame_agreement_fields = action.payload.FACSettings.frame_agreement_fields
					.replace(/(?:\r\n|\r|\n|\s)/g, '')
					.split(',');

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
					console.warn(
						'Active status excluded from list of editable statuses!'
					);
				}
				if (
					action.payload.FACSettings.fa_editable_statuses.delete(
						action.payload.FACSettings.statuses.closed_status
					)
				) {
					console.warn(
						'Closed status excluded from list of editable statuses!'
					);
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
				action.payload.FACSettings.fa_editable_statuses.filter(
					status => !!status
				);

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
			window.SF.product_chunk_size =
				action.payload.FACSettings.product_chunk_size;

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
				'AddFrameAgreement',
				'NewVersion'
			];

			const fullStatusSet = new Set(
				Object.values(action.payload.FACSettings.statuses)
			);

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

						_standardButtons[sb] = parseExpression(
							action.payload.ButtonStandardData[sb]
						);
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
							components: _config.map(status =>
								convertStatusToParsedExp(status, '==')
							)
						};
					}
				}
			});

			action.payload.ButtonStandardData = _standardButtons;
			// ***************************************************************************************************************
			// Validate custom buttons
			action.payload.ButtonCustomData = action.payload.ButtonCustomData.filter(
				btn => {
					if (!btn.hasOwnProperty('type') || !btn.hasOwnProperty('label')) {
						console.warn('Invalid button configuration:', btn);
						return false;
					}
					return true;
				}
			);

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
					components: _config.map(status =>
						convertStatusToParsedExp(status, '!=')
					)
				};

				let _newVisible = parseExpression(cb.visible);

				cb.expressions = {
					operators: [..._legacyVisible.operators, ..._newVisible.operators],
					components: [..._legacyVisible.components, ..._newVisible.components]
				};

				cb.id =
					cb.id ||
					(cb.label || 'unlabeled-' + i).replace(/\s+/g, '').toLowerCase();

				if (!cb.location || !LOCATIONS[cb.location]) {
					cb.location = 'Editor';
				}
			});

			// ***************************************************************************************************************
			var settings_loaded = true;

			var _atLeastOnePicklist = action.payload.HeaderData.find(
				f => f.type === 'picklist'
			);

			if (_atLeastOnePicklist) {
				settings_loaded = false;
			}

			// ***************************************************************************************************************

			return {
				...state,
				settings: action.payload,
				productFields: _productFields,
				faFields: _faFields,
				initialised: { ...state.initialised, settings_loaded: settings_loaded }
			};

		case 'RECIEVE_PRICE_ITEM_DATA':
			const productVsDiscount = {};

			var _DiscLevels = state.settings.DiscLevels;
			_DiscLevels = {
				..._DiscLevels,
				...formatDiscLevels(action.payload.discLevels)
			};

			var _AuthLevels = state.settings.AuthLevels;
			_AuthLevels = {
				..._AuthLevels,
				...formatDiscThresh(action.payload.discThresh)
			};

			for (let lv in _DiscLevels) {
				if (_DiscLevels[lv].priceItemId) {
					productVsDiscount[_DiscLevels[lv].priceItemId] =
						productVsDiscount[_DiscLevels[lv].priceItemId] || [];
					productVsDiscount[_DiscLevels[lv].priceItemId].push(lv);
				}
			}

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
					state.commercialProducts[priceItemIndex]._discountLvIds =
						productVsDiscount[key];
				}
				// **********************************************
				const addonVsDiscount = {};
				for (let lv in _DiscLevels) {
					if (_DiscLevels[lv].addonId) {
						addonVsDiscount[_DiscLevels[lv].addonId] =
							addonVsDiscount[_DiscLevels[lv].addonId] || [];
						addonVsDiscount[_DiscLevels[lv].addonId].push(lv);
					}
				}

				function formatAddons(addon) {
					let _addon = { ...addon };

					_addon.cspmb__One_Off_Charge__c =
						_addon.cspmb__One_Off_Charge__c || null;
					_addon.cspmb__Recurring_Charge__c =
						_addon.cspmb__Recurring_Charge__c || null;

					_addon.cspmb__Authorization_Level__c =
						_addon.cspmb__Add_On_Price_Item__r.cspmb__Authorization_Level__c;
					_addon.Name = _addon.cspmb__Add_On_Price_Item__r.Name;

					if (addonVsDiscount[addon.cspmb__Add_On_Price_Item__c]) {
						_addon._discountLvIds =
							addonVsDiscount[addon.cspmb__Add_On_Price_Item__c];
					}

					delete _addon.cspmb__Add_On_Price_Item__r;
					delete _addon.cspmb__Price_Item__r;

					return _addon;
				}

				// **********************************************

				state.commercialProducts[priceItemIndex]._addons = priceItemData[
					key
				].addons.map(addon => formatAddons(addon));

				// **********************************************
				state.commercialProducts[priceItemIndex]._charges = priceItemData[
					key
				].charges.map(charge => {
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
				});

				state.commercialProducts[
					priceItemIndex
				]._charges = state.commercialProducts[priceItemIndex]._charges.filter(
					charge => {
						return charge != null;
					}
				);

				// **********************************************
				state.commercialProducts[priceItemIndex]._rateCards = priceItemData[
					key
				].rateCards.map(rc => {
					rc.rateCardLines.forEach(rcl => {
						rcl.usageTypeName = rcl.hasOwnProperty('cspmb__usage_type__r')
							? rcl.cspmb__usage_type__r.Name
							: null;
					});
					return rc;
				});

				// **********************************************

				priceItemData[key].allowances = priceItemData[key].allowances || [];

				priceItemData[key].allowances.forEach(all => {
					if (all.hasOwnProperty('cspmb__usage_type__r')) {
						all.mainUsageType = JSON.parse(
							JSON.stringify(all.cspmb__usage_type__r)
						);
						delete all.cspmb__usage_type__r;
						delete all.mainUsageType.attributes;

						// Associate child UT
						if (
							action.payload.childUsageTypes &&
							action.payload.childUsageTypes.hasOwnProperty(
								all.mainUsageType.Id
							)
						) {
							all.mainUsageType.childUsageTypes =
								action.payload.childUsageTypes[all.mainUsageType.Id];
						} else {
							all.mainUsageType.childUsageTypes = [];
						}
					}
				});

				state.commercialProducts[priceItemIndex]._allowances =
					priceItemData[key].allowances || [];

				// **********************************************
				state.commercialProducts[priceItemIndex]._dataLoaded = true;
			}
			// **********************************************

			return {
				...state,
				settings: {
					...state.settings,
					DiscLevels: { ...state.settings.DiscLevels, ..._DiscLevels },
					AuthLevels: { ...state.settings.AuthLevels, ..._AuthLevels }
				},
				...{ commercialProducts: state.commercialProducts }
			};

		// **********************************************
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

			newCps = new Set([
				...state.frameAgreements[faId]._ui.commercialProducts,
				...newCps
			]);
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

		case 'LOAD_RL':
			var faId = action.payload.faId;
			var rlData = action.payload.rlData;

			rlData.forEach(rl => {
				rl.columns = validateCSV(rl.columns)
					? convertCSVToArray(rl.columns)
					: [];
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
						_volume: _attachment.products[cp.Id]._volume
					};
				});
			} else {
				let _cpCache = {};

				function getDefaultAttachmentForProductId(cpId) {
					if (!_cpCache.hasOwnProperty(cpId)) {
						let _cp = state.frameAgreements[faId]._ui.commercialProducts.find(
							cp => cp.Id === cpId
						);
						_cpCache[cpId] = enrichAttachment(_cp);
					}

					return _cpCache[cpId];
				}

				if (
					entitiyMap.hasOwnProperty('product') &&
					_attachment.hasOwnProperty('products')
				) {
					for (var key in _attachment.products) {
						let _defaultAttachment = getDefaultAttachmentForProductId(key);

						if (_attachment.products.hasOwnProperty(key)) {
							// This entity is preset in attachment
							// reset its charges and productCharges
							_attachment.products[key]._product = _defaultAttachment._product;
							_attachment.products[key]._charges = _defaultAttachment._charges;
						}
					}
				}

				if (entitiyMap.hasOwnProperty('rcl')) {
					for (var key in _attachment.products) {
						if (_attachment.products[key].hasOwnProperty('_rateCards')) {
							let _defaultAttachment = getDefaultAttachmentForProductId(key);

							for (var rcId in _attachment.products[key]._rateCards) {
								for (var rclId in _attachment.products[key]._rateCards[rcId]) {
									if (entitiyMap.rcl.hasOwnProperty(rclId)) {
										// match; reset
										_attachment.products[key]._rateCards[rcId][rclId] =
											_defaultAttachment._rateCards[rcId][rclId];
									}
								}
							}
						}
					}
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
		// **********************************************
		case 'REMOVE_PRODUCTS':
			var faId = action.payload.faId;
			var productIds = action.payload.products;

			var _products = state.frameAgreements[faId]._ui.attachment.products;

			var _commercialProducts =
				state.frameAgreements[faId]._ui.commercialProducts;
			_commercialProducts = _commercialProducts.filter(
				cp => !productIds.includes(cp.Id)
			);

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
		// **********************************************

		case 'RECIEVE_GET_ATTACHMENT':
			var faId = action.payload.faId;
			var attachment = action.payload.data || {};

			var _commercialProducts = state.commercialProducts.filter(
				cp => attachment.products[cp.Id]
			);

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[faId]: {
						...state.frameAgreements[faId],
						_ui: {
							...state.frameAgreements[faId]._ui,
							attachment,
							commercialProducts: _commercialProducts
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

		default:
			// SAVE_ATTACHMENT, RECIEVE_GET_ATTACHMENT, FILTER_COMMERCIAL_PRODUCTS, GET_APPROVAL_HISTORY
			return { ...state };
	}
};

export default rootReducer;
