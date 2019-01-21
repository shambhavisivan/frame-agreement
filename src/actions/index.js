import sharedService from "../utils/shared-service";

const REQUEST_FRAME_AGREEMENTS = "REQUEST_FRAME_AGREEMENTS";
const RECIEVE_FRAME_AGREEMENTS = "RECIEVE_FRAME_AGREEMENTS";

const REQUEST_COMMERCIAL_PRODUCTS = "REQUEST_COMMERCIAL_PRODUCTS";
const RECIEVE_COMMERCIAL_PRODUCTS = "RECIEVE_COMMERCIAL_PRODUCTS";

const UPDATE_RCM_DATA = "UPDATE_RCM_DATA";
const UPDATE_GROUP_DATA = "UPDATE_GROUP_DATA";

const ADD_RCL = "ADD_RCL";
const REMOVE_RCL = "REMOVE_RCL";
const EDIT_RCL = "EDIT_RCL";

const TOGGLE_RATE_CARD = "TOGGLE_RATE_CARD";

// export const toggleModal = data => ({ type: TOGGLE_MODAL, payload: data }); // DIRECTLY ACTIONED TO STORE

export const updateRcmData = data => ({ type: UPDATE_RCM_DATA, payload: data });
export const addCustomRcl = (rcId, newRcl) => ({
    type: ADD_RCL,
    payload: { rcId, newRcl }
});
export const removeCustomRcl = (rcId, crclId) => ({
    type: REMOVE_RCL,
    payload: { rcId, crclId }
});
export const editCustomRcl = rcl => ({ type: EDIT_RCL, payload: rcl });
export const updateGroupData = data => ({
    type: UPDATE_GROUP_DATA,
    payload: data
});

// ***********************************************************************

// ***********************************************************************

export const requestAppSettings = () => ({
    type: "REQUEST_SETTINGS"
});

export const recieveAppSettings = result => ({
    type: "RECIEVE_SETTINGS",
    payload: result
});

export function getAppSettings() {
    return function(dispatch) {

        dispatch(requestAppSettings());

        return new Promise((resolve, reject) => {
            window.SF.invokeAction('getAppSettings')
            .then(response => {
                    dispatch(recieveAppSettings(response));
                    resolve(response);
                    return response;
            });

        });
    };
}
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

export const requestGetFrameAgreements = () => ({
    type: REQUEST_FRAME_AGREEMENTS
});

export const recieveGetFrameAgreements = result => ({
    type: RECIEVE_FRAME_AGREEMENTS,
    payload: result
});

export function getFrameAgreements() {
    return function(dispatch) {

        dispatch(requestGetFrameAgreements());

        return new Promise((resolve, reject) => {
            window.SF.invokeAction('getFrameAgreements')
            .then(response => {
                    dispatch(recieveGetFrameAgreements(response));
                    resolve(response);
                    return response;
            });

        });
    };
}

// ***********************************************************************

export const requestCommercialProducts = () => ({
    type: REQUEST_COMMERCIAL_PRODUCTS
});

export const recieveCommercialProducts = result => ({
    type: RECIEVE_COMMERCIAL_PRODUCTS,
    payload: result
});

export function getCommercialProducts(page = 1) {
    return function(dispatch) {

        dispatch(requestCommercialProducts());

        return new Promise((resolve, reject) => {
            window.SF.invokeAction('getCommercialProducts', [page])
            .then(response => {
                    dispatch(recieveCommercialProducts(response));
                    resolve(response);
                    return response;
            });

        });
    };
}
