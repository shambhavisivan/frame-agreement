import sharedService from "../utils/shared-service";

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
    obj.type = obj.type || "text";
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
      str.replace(/ /g, "")
    );
  } catch (e) {
    console.warn(e);
  }
  return returnStr;
}

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ACTIVE_FA":
      return { ...state, ...{ activeFa: action.payload } };

    case "UPDATE_ACTIVE_FA":
      let fa = state.activeFa;
      fa[action.payload.field] = action.payload.value;
      return { ...state, ...{ activeFa: fa } };

    case "SET_ADDED_PRODUCTS":
      let activeProducts = state.commercialProducts.filter(cp => {
        return action.payload.includes(cp.Id);
      });
      console.log("SET_ADDED_PRODUCTS");
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

    case "APPLY_DISCOUNT":
      console.log("reducer:", action.payload);

      var priceItemIndex = state.activeFa._ui.commercialProducts.findIndex(
        cp => {
          return cp.Id === action.payload.priceItemId;
        }
      );

      var updatedCharge = [
        ...state.activeFa._ui.commercialProducts[priceItemIndex][action.payload.charge]
      ];

      updatedCharge.forEach(ch => {
        if (action.payload.data[ch.Id]) {

          if (action.payload.charge === "_addons" || action.payload.charge === "_charges") {
            if (action.payload.data[ch.Id].hasOwnProperty('oneOff')) {
              ch._negotiatedOneOff = action.payload.data[ch.Id].oneOff;
            }
            if (action.payload.data[ch.Id].hasOwnProperty('reccuring')) {
              ch._negotiatedRecurring = action.payload.data[ch.Id].reccuring;
            }
          }
          if (action.payload.charge === "_rateCards") {
            ch.rateCardLines.forEach(rcl => {
              if (action.payload.data[ch.Id].hasOwnProperty(rcl.Id)) {
                rcl._negotiated = action.payload.data[ch.Id][rcl.Id];
              }
            })
          }

        }
      });

      var updatedCommercialProducts = state.activeFa._ui.commercialProducts.map(
        (cp, i) => {
          if (i === priceItemIndex) {
            cp[action.payload.charge] = updatedCharge;
          }
          return cp;
        }
      );

      return {
        ...state,
        activeFa: {
          ...state.activeFa,
          _ui: {
            ...state.activeFa._ui,
            commercialProducts: updatedCommercialProducts
          }
        }
      };
    // **********************************************
    // ASYNC REQUEST
    case "REQUEST_FRAME_AGREEMENTS":
      return { ...state };

    case "REQUEST_UPSERT_FRAME_AGREEMENTS":
      return { ...state };

    case "REQUEST_COMMERCIAL_PRODUCTS":
      return { ...state };

    case "REQUEST_SETTINGS":
      return { ...state };

    // case 'REQUEST_RATE_CARDS':
    //   return { ...state };

    // case 'REQUEST_GET_ADDONS':
    //   return { ...state };

    case "REQUEST_PRICE_ITEM_DATA":
      return { ...state };
    // **********************************************
    // ASYNC RECIEVE
    case "RECIEVE_FRAME_AGREEMENTS":
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

    case "RECIEVE_COMMERCIAL_PRODUCTS":
      var commercialProducts = action.payload;
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

    case "RECIEVE_UPSERT_FRAME_AGREEMENTS":
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

    case "RECIEVE_SETTINGS":
      action.payload.JSONData = validateJSONData(action.payload.JSONData);

      if (validateCSV(action.payload.FACSettings.Price_Item_Fields)) {
        action.payload.FACSettings.Price_Item_Fields = action.payload.FACSettings.Price_Item_Fields.replace(/ /g, "").split(",");
      } else {
        console.warn("Price item fields is not valid CSV!");
        action.payload.FACSettings.Price_Item_Fields = [];
      }
      
      if (validateCSV(action.payload.FACSettings.FA_Editable_Statuses)) {
        action.payload.FACSettings.FA_Editable_Statuses = action.payload.FACSettings.FA_Editable_Statuses.replace(/ /g, "").split(",");
      } else {
        console.warn("Price item fields is not valid CSV!");
        action.payload.FACSettings.FA_Editable_Statuses = [];
      }

      return {
        ...state,
        ...{ settings: action.payload },
        ...{
          initialised: { ...state.initialised, ...{ settings_loaded: true } }
        }
      };

    // case 'RECIEVE_GET_ADDONS':
    //   var addons = action.payload.response;
    //   var priceItemId = action.payload.priceItemId;
    //   var commercialProducts = state.commercialProducts;

    //   var priceItemIndex = state.commercialProducts.findIndex(pi => {
    //     return pi.Id === priceItemId;
    //   });

    //   commercialProducts[priceItemIndex]._addons = addons;

    //   return {...state, ...{commercialProducts}}

    // case 'RECIEVE_RATE_CARDS':
    //   var rateCards = action.payload.response;
    //   var priceItemId = action.payload.priceItemId;
    //   var commercialProducts = state.commercialProducts;

    //   var priceItemIndex = state.commercialProducts.findIndex(pi => {
    //     return pi.Id === priceItemId;
    //   });

    //   commercialProducts[priceItemIndex]._rateCards = rateCards;

    //   return {...state, ...{commercialProducts}}

    case "RECIEVE_PRICE_ITEM_DATA":
      var priceItemData = action.payload;
      // var commercialProducts = [...state.commercialProducts];
      console.warn(priceItemData);
      for (var key in priceItemData) {
        var priceItemIndex = state.commercialProducts.findIndex(pi => {
          return pi.Id === key;
        });

        if (priceItemIndex === -1) {
          console.error(
            "Cannot find price item " +
              key +
              " in:" +
              state.commercialProducts.map(cp => cp.Id)
          );
          return { ...state };
        }
        state.commercialProducts[priceItemIndex]._addons =
          priceItemData[key].addons;
        state.commercialProducts[priceItemIndex]._charges = priceItemData[key].charges.charges;
        state.commercialProducts[priceItemIndex]._rateCards =
          priceItemData[key].rateCards;
      }

      return { ...state, ...{ commercialProducts: state.commercialProducts } };

    // **********************************************

    default:
      return state;
  }
};

export default rootReducer;
