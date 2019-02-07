import sharedService from '../utils/shared-service';

// export const toggleModal = data => ({ type: TOGGLE_MODAL, payload: data }); // DIRECTLY ACTIONED TO STORE

// ***********************************************************************

export const setActiveFa = result => ({
  type: 'SET_ACTIVE_FA',
  payload: result
});

export const updateActiveFa = (field, value) => ({
  type: 'UPDATE_ACTIVE_FA',
  payload: { field, value }
});

export const setAddedProducts = productIds => ({
  type: 'SET_ADDED_PRODUCTS',
  payload: productIds
});

// ***********************************************************************

export const requestAppSettings = () => ({
  type: 'REQUEST_SETTINGS'
});

export const recieveAppSettings = result => ({
  type: 'RECIEVE_SETTINGS',
  payload: result
});

export function getAppSettings() {
  return function(dispatch) {
    dispatch(requestAppSettings());

    return new Promise((resolve, reject) => {
      window.SF.invokeAction('getAppSettings').then(response => {
        dispatch(recieveAppSettings(response));
        resolve(response);
        return response;
      });
    });
  };
}
// ***********************************************************************

// export const requestRateCards = () => ({
//   type: 'REQUEST_RATE_CARDS'
// });

// export const recieveRateCards = result => ({
//   type: 'RECIEVE_RATE_CARDS',
//   payload: result
// });

// export function getRateCards(priceItemId) {
//   return function(dispatch) {
//     dispatch(requestRateCards());

//     return new Promise((resolve, reject) => {
//       window.SF.invokeAction('getRateCards', [priceItemId]).then(response => {
//         dispatch(recieveRateCards({response, priceItemId}));
//         resolve(response);
//         return response;
//       });
//     });
//   };
// }
// ***********************************************************************

// export const request = () => ({
//     type: REQUEST_FRAME_AGREEMENTS
// });

// export const recieve = result => ({
//     type: RECIEVE_FRAME_AGREEMENTS,
//     payload: result
// });

// export function xxx() {
//     return function(dispatch) {

//         dispatch(requestGetFrameAgreements());

//         return new Promise((resolve, reject) => {
//             window.SF.invokeAction('getFrameAgreements')
//             .then(response => {
//                     dispatch(recieveGetFrameAgreements(response));
//                     resolve(response);
//                     return response;
//             });

//         });
//     };
// }

// ***********************************************************************

// export const requestGetAddons = () => ({
//   type: 'REQUEST_GET_ADDONS'
// });

// export const recieveGetAddons = result => ({
//   type: 'RECIEVE_GET_ADDONS',
//   payload: result
// });

// export function getAddons(priceItemId) {
//   return function(dispatch) {
//     dispatch(requestGetAddons());

//     return new Promise((resolve, reject) => {
//       window.SF.invokeAction('getAddons', [priceItemId]).then(response => {
//         dispatch(recieveGetAddons({response, priceItemId}));
//         resolve(response);
//         return response;
//       });
//     });
//   };
// }

// ***********************************************************************

export const requestPriceItemData = () => ({
  type: 'REQUEST_PRICE_ITEM_DATA'
});

export const recievePriceItemData = result => ({
  type: 'RECIEVE_PRICE_ITEM_DATA',
  payload: result
});

export function getCommercialProductData(priceItemIdList) {
  return function(dispatch) {
    dispatch(requestPriceItemData());

    return new Promise((resolve, reject) => {
      window.SF.invokeAction('getCommercialProductData', [priceItemIdList]).then(response => {
        dispatch(recievePriceItemData(response));
        resolve(response);
        return response;
      });
    });
  };
}

// ***********************************************************************

export const requestGetFrameAgreements = () => ({
  type: 'REQUEST_FRAME_AGREEMENTS'
});

export const recieveGetFrameAgreements = result => ({
  type: 'RECIEVE_FRAME_AGREEMENTS',
  payload: result
});

export function getFrameAgreements() {
  return function(dispatch) {
    dispatch(requestGetFrameAgreements());

    return new Promise((resolve, reject) => {
      window.SF.invokeAction('getFrameAgreements').then(response => {
        dispatch(recieveGetFrameAgreements(response));
        resolve(response);
        return response;
      });
    });
  };
}

// ***********************************************************************

export const requestUpsertFrameAgreements = () => ({
  type: 'REQUEST_UPSERT_FRAME_AGREEMENTS'
});

export const recieveUpsertFrameAgreements = result => ({
  type: 'RECIEVE_UPSERT_FRAME_AGREEMENTS',
  payload: result
});

export function upsertFrameAgreements(fieldData, faId = null) {
  return function(dispatch) {
    dispatch(requestUpsertFrameAgreements());

    return new Promise((resolve, reject) => {
      window.SF.invokeAction('upsertFrameAgreements', [faId, JSON.stringify(fieldData)])
      .then(response => {
        dispatch(recieveUpsertFrameAgreements(response));
        resolve(response);
        return response;
      });
    });
  };
}

// ***********************************************************************

export const requestCommercialProducts = () => ({
  type: 'REQUEST_COMMERCIAL_PRODUCTS'
});

export const recieveCommercialProducts = result => ({
  type: 'RECIEVE_COMMERCIAL_PRODUCTS',
  payload: result
});

export function getCommercialProducts(page = 1) {
  return function(dispatch) {
    dispatch(requestCommercialProducts());

    return new Promise((resolve, reject) => {
      window.SF.invokeAction('getCommercialProducts', [page]).then(response => {
        dispatch(recieveCommercialProducts(response));
        resolve(response);
        return response;
      });
    });
  };
}
