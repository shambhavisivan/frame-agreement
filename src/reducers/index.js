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
	activeFa: null
	// activeId: null
};

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

		case 'RECIEVE_COMMERCIAL_PRODUCTS':
			var commercialProducts = action.payload;

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
				commercialProducts: []
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

		case 'SAVE_FA':
			var upsertedFa = action.payload;
			return {
				...state,
				frameAgreements: {
					...state.frameAgreements,
					[upsertedFa.Id]: upsertedFa
				}
			};

		case 'RECIEVE_SETTINGS':
			action.payload.JSONData = validateJSONData(action.payload.JSONData);

			if (validateCSV(action.payload.FACSettings.Price_Item_Fields)) {
				action.payload.FACSettings.Price_Item_Fields = action.payload.FACSettings.Price_Item_Fields.replace(
					/ /g,
					''
				).split(',');
			} else {
				console.warn('Price item fields is not valid CSV!');
				action.payload.FACSettings.Price_Item_Fields = [];
			}

			if (validateCSV(action.payload.FACSettings.FA_Editable_Statuses)) {
				action.payload.FACSettings.FA_Editable_Statuses = action.payload.FACSettings.FA_Editable_Statuses.replace(
					/ /g,
					''
				).split(',');
			} else {
				console.warn('Price item fields is not valid CSV!');
				action.payload.FACSettings.FA_Editable_Statuses = [];
			}

			action.payload.AuthLevels = action.payload.AuthLevels.reduce(function(
				acc,
				level
			) {
				(acc[level['cspmb__Authorization_Level__c']] =
					acc[level['cspmb__Authorization_Level__c']] || []).push(level);
				return acc;
			},
			{});

			return {
				...state,
				...{ settings: action.payload },
				...{
					initialised: { ...state.initialised, ...{ settings_loaded: true } }
				}
			};

		case 'RECIEVE_PRICE_ITEM_DATA':
			var priceItemData = action.payload;
			// var commercialProducts = [...state.commercialProducts];
			console.warn(priceItemData);
			for (var key in priceItemData) {
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

				state.commercialProducts[priceItemIndex]._addons =
					priceItemData[key].addons;

				state.commercialProducts[priceItemIndex]._charges = priceItemData[
					key
				].charges.charges.map(charge => {
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

				state.commercialProducts[priceItemIndex]._rateCards =
					priceItemData[key].rateCards;

				state.commercialProducts[priceItemIndex].attachmentLoaded = true;
			}

			return { ...state, ...{ commercialProducts: state.commercialProducts } };

		// **********************************************

		default:
			// SAVE_ATTACHMENT, RECIEVE_GET_ATTACHMENT,
			return { ...state };
	}
};

export default rootReducer;
