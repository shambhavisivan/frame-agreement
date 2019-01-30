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
        obj.type = obj.type || 'text';
        obj.grid = obj.grid || 3;
        obj.readOnly = obj.readOnly || false;
    });
    return data;
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {

        case "SET_ACTIVE_FA":
            return { ...state, ...{activeFa: action.payload} };

        case "UPDATE_ACTIVE_FA":
            let fa = state.activeFa;
            fa[action.payload.field] = action.payload.value;
            return { ...state, ...{activeFa: fa} };

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
        // **********************************************
        // ASYNC RECIEVE
        case "RECIEVE_FRAME_AGREEMENTS":
            let frameAgreementMap = {};
            action.payload.forEach(fa => {
                frameAgreementMap[fa.Id] = fa;
            });
            return { ...state, ...{frameAgreements: frameAgreementMap}, ...{initialised: {...state.initialised, ...{fa_loaded: true}}}};

        case "RECIEVE_COMMERCIAL_PRODUCTS":
            let commercialProducts = action.payload;
            return { ...state, ...{commercialProducts: commercialProducts}, ...{initialised: {...state.initialised, ...{cp_loaded: true}}} };

        case "RECIEVE_UPSERT_FRAME_AGREEMENTS":
            let upsertedFa = action.payload;
            return { ...state, ...{activeFa: upsertedFa},...{frameAgreements: {...state.frameAgreements, ...{[upsertedFa.Id]: upsertedFa}}}};

        case "RECIEVE_SETTINGS":
            action.payload.JSONData = validateJSONData(action.payload.JSONData);
            return { ...state, ...{settings: action.payload}, ...{initialised: {...state.initialised, ...{settings_loaded: true}}} };
        // **********************************************

        default:
            return state;
    }
};

export default rootReducer;
