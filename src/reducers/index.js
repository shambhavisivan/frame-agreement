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
  return /^[a-zA-Z0-9-_]+(?:, ?[a-zA-Z0-9-_]+)*$/gm.test(str.replace(/ /g, ''));
}

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_FA':
      return { ...state, ...{ activeFa: action.payload } };

    case 'UPDATE_ACTIVE_FA':
      let fa = state.activeFa;
      fa[action.payload.field] = action.payload.value;
      return { ...state, ...{ activeFa: fa } };

    case 'SET_ADDED_PRODUCTS':
      let activeProducts = state.commercialProducts.filter(cp => {
        return action.payload.includes(cp.Id);
      });
      console.log('SET_ADDED_PRODUCTS');
      return {
        ...state,
        ...{
          activeFa: {
            ...state.activeFa,
            ...{
              _ui: {
                ...state.activeFa._ui,
                ...{ commercialProducts: activeProducts }
              }
            }
          }
        }
      };

    // **********************************************
    // ASYNC REQUEST
    case 'REQUEST_FRAME_AGREEMENTS':
      return { ...state };

    case 'REQUEST_UPSERT_FRAME_AGREEMENTS':
      return { ...state };

    case 'REQUEST_COMMERCIAL_PRODUCTS':
      return { ...state };

    case 'REQUEST_SETTINGS':
      return { ...state };

    case 'REQUEST_GET_ADDONS':
      return { ...state };
    // **********************************************
    // ASYNC RECIEVE
    case 'RECIEVE_FRAME_AGREEMENTS':
      let frameAgreementMap = {};
      action.payload.forEach(fa => {
        fa._ui = {
          commercialProducts: []
        };
        frameAgreementMap[fa.Id] = fa;
      });
      return {
        ...state,
        ...{ frameAgreements: frameAgreementMap },
        ...{ initialised: { ...state.initialised, ...{ fa_loaded: true } } }
      };

    case 'RECIEVE_COMMERCIAL_PRODUCTS':
      let commercialProducts = action.payload;
      // commercialProducts.forEach( cp => {
      //     cp._ui = {
      //         selected: false
      //     }
      // });
      return {
        ...state,
        ...{ commercialProducts: commercialProducts },
        ...{ initialised: { ...state.initialised, ...{ cp_loaded: true } } }
      };

    case 'RECIEVE_UPSERT_FRAME_AGREEMENTS':
      let upsertedFa = action.payload;
      // On error
      if (!upsertedFa) {
        return { ...state };
      }
      // GET THIS FROM ATTACHMENT
      upsertedFa._ui = {
        commercialProducts: []
      };
      return {
        ...state,
        ...{ activeFa: upsertedFa },
        ...{
          frameAgreements: {
            ...state.frameAgreements,
            ...{ [upsertedFa.Id]: upsertedFa }
          }
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

      return {
        ...state,
        ...{ settings: action.payload },
        ...{
          initialised: { ...state.initialised, ...{ settings_loaded: true } }
        }
      };

    case 'RECIEVE_GET_ADDONS':
      let addons = action.payload.response;
      let priceItemId = action.payload.priceItemId;
      let addon_commercialProducts = state.commercialProducts;

      let priceItemIndex = state.commercialProducts.findIndex(pi => {
        return pi.Id === priceItemId;
      });

      addon_commercialProducts[priceItemIndex]._addons = addons;

      return {...state, ...{addon_commercialProducts}}

    // **********************************************

    default:
      return state;
  }
};

export default rootReducer;
