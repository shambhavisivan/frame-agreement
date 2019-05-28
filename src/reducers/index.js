import sharedService from '../utils/shared-service';

const initialState = {
	initialised: {
		fa_loaded: false,
		cp_loaded: false,
		settings_loaded: false
	},
	settings: {},
	frameAgreements: {},
	commercialProducts: null,
	productFields: [],
	activeFa: null,
	validation: {},
	validationProduct: {},
	approvalFlag: false, // true -> needs validation
	handlers: {},
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

function validateCSV(str) {
	if (typeof str !== 'string') {
		return false;
	}

	let returnStr = str;
	try {
		returnStr = /^[a-zA-Z0-9-_]+(?:, ?[a-zA-Z0-9-_]+)*$/gm.test(
			str.replace(/ /g, '')
		);
	} catch (e) {
		console.warn(e);
	}
	return returnStr;
}

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'REGISTER_METHOD':
			/*
            window.FAM.registerMethod("ActionFunction", () => {
            	 return new Promise(resolve => {
            		 setTimeout(() => {resolve("ActionFunction result")}, 2000);
            	 });
            })
            */
			return {
				...state,
				handlers: {
					...state.handlers,
					[action.payload.name]: action.payload.method
				}
			};

		case 'SET_VALIDATION':
			function getApprovalFlag(validation) {
				return Object.keys(validation)
					.reduce((acc, key) => {
						let collection = [];
						if (validation[key].addons) {
							Object.values(validation[key].addons).forEach(item => {
								item.hasOwnProperty('oneOff') && collection.push(item.oneOff);
								item.hasOwnProperty('recurring') &&
									collection.push(item.recurring);
							});
						}
						if (validation[key].charges) {
							collection = [
								...collection,
								...Object.values(validation[key].charges)
							];
						}
						if (validation[key].rated) {
							collection = [
								...collection,
								...Object.values(validation[key].rated)
							];
						}
						return [...acc, ...collection];
					}, [])
					.some(r => r === true);
			}

			function getProductValidation(validation) {
				let _productValidation = {};
				for (var key in validation) {
					_productValidation[key] = getApprovalFlag({
						[key]: validation[key]
					});
				}
				return _productValidation;
			}

			if (action.payload.priceItemId === null) {
				return { ...state, validation: {}, approvalFlag: false };
			} else if (action.payload.type === null) {
				var validation = { ...state.validation, ...action.payload.priceItemId };
				var approvalFlag = getApprovalFlag(validation);
				var validationProduct = getProductValidation(validation);

				return { ...state, validation, approvalFlag, validationProduct };
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
				var approvalFlag = getApprovalFlag(validation);
				var validationProduct = getProductValidation(validation);
				return { ...state, validation, approvalFlag, validationProduct };
			}

		// ASYNC RECIEVE
		case 'RECIEVE_FRAME_AGREEMENTS':
			let frameAgreementMap = {};
			action.payload.forEach(fa => {
				fa._ui = {
					commercialProducts: [],
					attachment: null
				};
				frameAgreementMap[fa.Id] = fa;
			});
			return {
				...state,
				...{ frameAgreements: frameAgreementMap },
				...{ initialised: { ...state.initialised, ...{ fa_loaded: true } } }
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
			clonedFa._ui = {
				commercialProducts: [],
				attachment: null
			};

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

		case 'RECIEVE_COMMERCIAL_PRODUCTS':
			var commercialProducts = action.payload;

			// validate
			commercialProducts.forEach(cp => {
				if (!cp.hasOwnProperty('cspmb__Is_One_Off_Discount_Allowed__c')) {
					cp.cspmb__Is_One_Off_Discount_Allowed__c = true;
				}

				if (!cp.hasOwnProperty('cspmb__Is_Recurring_Discount_Allowed__c ')) {
					cp.cspmb__Is_One_Off_Discount_Allowed__c = true;
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

			upsertedFa._ui = {
				commercialProducts: [],
				attachment: null
			};

			return {
				...state,
				...{ activeFa: upsertedFa },
				...{
					frameAgreements: {
						...state.frameAgreements,
						...{
							[upsertedFa.Id]: upsertedFa
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

		case 'DELETE_FA':
			var {
				[action.payload]: value,
				...withoutRemoved
			} = state.frameAgreements;
			return { ...state, frameAgreements: withoutRemoved };

		case 'NEW_VERSION':
			let newVersion = action.payload;
			newVersion._ui = {
				commercialProducts: [],
				attachment: null
			};
			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[action.payload.Id]: newVersion
				}
			};

		case 'SAVE_FA':
			var upsertedFa = action.payload;
			upsertedFa._ui = {
				commercialProducts: [],
				attachment: null
			};
			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[upsertedFa.Id]: {
						...upsertedFa,
						_ui: state.frameAgreements[upsertedFa.Id]._ui
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

			return {
				...state,
				settings: { ...state.settings, HeaderData: headerData },
				initialised: { ...state.initialised, ...{ settings_loaded: true } }
			};

		case 'RECIEVE_SETTINGS':
			action.payload.HeaderData = validateJSONData(action.payload.HeaderData);
			action.payload.CustomTabsData = validateJSONData(
				action.payload.CustomTabsData
			);

			let _productFields = [];
			// _productFields.push({name:"Name", visible: true})

			if (
				action.payload.FACSettings.hasOwnProperty('rcl_fields') &&
				validateCSV(action.payload.FACSettings.rcl_fields)
			) {
				action.payload.FACSettings.rcl_fields = action.payload.FACSettings.rcl_fields
					.replace(/ /g, '')
					.split(',');
			} else {
				action.payload.FACSettings.rcl_fields = [];
			}

			if (validateCSV(action.payload.FACSettings.price_item_fields)) {
				action.payload.FACSettings.price_item_fields = action.payload.FACSettings.price_item_fields
					.replace(/ /g, '')
					.split(',');

				action.payload.FACSettings.price_item_fields.forEach(f => {
					_productFields.push({ name: f, visible: true });
				});

				if (action.payload.FACSettings.show_volume_fields) {
					VOLUME_FIELDS.forEach(f => {
						_productFields.push({
							name: f.label,
							visible: true,
							volume: f.name
						});
					});
				}
			} else {
				console.warn('Price item fields is not valid CSV!');
				action.payload.FACSettings.price_item_fields = [];
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
			}

			// ***************************************************************************************************************
			action.payload.FACSettings.decomposition_chunk_size =
				action.payload.FACSettings.decomposition_chunk_size || 1000;

			action.payload.FACSettings.product_chunk_size =
				action.payload.FACSettings.product_chunk_size || 100;

			// Temporary until actions get access to store values
			window.SF.product_chunk_size =
				action.payload.FACSettings.product_chunk_size;
			// ***************************************************************************************************************
			action.payload.AuthLevels = action.payload.AuthLevels
				? action.payload.AuthLevels.reduce(function(acc, level) {
						(acc[level['cspmb__Authorization_Level__c']] =
							acc[level['cspmb__Authorization_Level__c']] || []).push(level);
						return acc;
				  }, {})
				: {};

			// ***************************************************************************************************************
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
				'DeleteProducts',
				'BulkNegotiate',
				'AddProducts',
				'NewVersion'
			];

			var _standardButtons = {};
			standardButtonsDefault.forEach(sb => {
				if (!action.payload.ButtonStandardData.hasOwnProperty(sb)) {
					console.warn(sb + ' not defined in "FA-Standard-Buttons"!');
					_standardButtons[sb] = new Set([]);
				} else {
					if (!action.payload.ButtonStandardData[sb].length) {
						console.warn('No visible status for ' + sb + ' button.');
					}

					_standardButtons[sb] = new Set(
						action.payload.ButtonStandardData[sb] || []
					);
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

			action.payload.ButtonCustomData.forEach(cb => {
				cb.hidden = new Set(cb.hidden || []);
				cb.id = cb.id || cb.label.replace(/ /g, '').toLowerCase();

				if (!cb.location || !LOCATIONS[cb.location]) {
					cb.location = 'Editor';
				}
			});

			// ***************************************************************************************************************
			let DiscLevels = {};

			let error = {
				message: '',
				targets: []
			};

			(() => {
				action.payload.DiscLevels.forEach(dl => {
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
								.replace(/ /g, '')
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
							error.targets.push(dl.levelId);
							returnValues = false;
						}
						return returnValues;
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
							error.message =
								error.message || 'Invalid max/min/increment data on ';
							failure = true;
							error.targets.push(dl.levelId);
						}
					} else {
						failure = true;
					}

					if (!failure) {
						DiscLevels[discount.levelId] = discount;
					} else {
						console.error(error.message, error.targets);
					}
				});
			})();

			action.payload.DiscLevels = DiscLevels;

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
				initialised: { ...state.initialised, settings_loaded: settings_loaded }
			};

		case 'RECIEVE_PRICE_ITEM_DATA':
			const productVsDiscount = {};

			for (let lv in state.settings.DiscLevels) {
				if (state.settings.DiscLevels[lv].priceItemId) {
					productVsDiscount[state.settings.DiscLevels[lv].priceItemId] =
						productVsDiscount[state.settings.DiscLevels[lv].priceItemId] || [];
					productVsDiscount[state.settings.DiscLevels[lv].priceItemId].push(lv);
				}
			}

			var priceItemData = action.payload;
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
							state.commercialProducts.map(cp => cp.Id)
					);
					return { ...state };
				}

				// **********************************************
				if (productVsDiscount[key]) {
					state.commercialProducts[priceItemIndex]._levelId =
						productVsDiscount[key];
				}
				// **********************************************
				const addonVsDiscount = {};
				for (let lv in state.settings.DiscLevels) {
					if (state.settings.DiscLevels[lv].addonId) {
						addonVsDiscount[state.settings.DiscLevels[lv].addonId] =
							addonVsDiscount[state.settings.DiscLevels[lv].addonId] || [];
						addonVsDiscount[state.settings.DiscLevels[lv].addonId].push(lv);
					}
				}

				function formatAddons(addon) {
					let _addon = { ...addon };
					_addon.cspmb__One_Off_Charge__c =
						_addon.cspmb__One_Off_Charge__c ||
						_addon.cspmb__Add_On_Price_Item__r.cspmb__One_Off_Charge__c;
					_addon.cspmb__Recurring_Charge__c =
						_addon.cspmb__Recurring_Charge__c ||
						_addon.cspmb__Add_On_Price_Item__r.cspmb__Recurring_Charge__c;
					_addon.cspmb__Authorization_Level__c =
						_addon.cspmb__Add_On_Price_Item__r.cspmb__Authorization_Level__c;
					_addon.Name = _addon.cspmb__Add_On_Price_Item__r.Name;

					if (addonVsDiscount[addon.cspmb__Add_On_Price_Item__c]) {
						_addon.levelId = addonVsDiscount[addon.cspmb__Add_On_Price_Item__c];
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
							.replace(/ /g, '')
							.replace(/\W/g, '') === 'oneoffcharge'
					) {
						delete retCharge.recurring;
						retCharge._type = 'oneOff';
					} else if (
						charge.chargeType
							.toLowerCase()
							.replace(/ /g, '')
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
				state.commercialProducts[priceItemIndex]._rateCards =
					priceItemData[key].rateCards;

				// **********************************************
				state.commercialProducts[priceItemIndex].dataLoaded = true;
			}
			// **********************************************

			return { ...state, ...{ commercialProducts: state.commercialProducts } };

		// **********************************************

		case 'RECIEVE_GET_ATTACHMENT':
			var priceItemId = action.payload.priceItemId;
			var attachment = action.payload.data || {};

			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[priceItemId]: {
						...state.frameAgreements[priceItemId],
						_ui: { ...state.frameAgreements[priceItemId]._ui, attachment }
					}
				}
			};

		default:
			// SAVE_ATTACHMENT, RECIEVE_GET_ATTACHMENT, FILTER_COMMERCIAL_PRODUCTS, GET_APPROVAL_HISTORY
			return { ...state };
	}
};

export default rootReducer;
