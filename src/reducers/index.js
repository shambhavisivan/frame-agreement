import sharedService from "../utils/shared-service";

const initialState = {
    initialised: {
        fa_loaded: false,
        cp_loaded: false,
        settings_loaded: false
    },
    settings: {},
    frameAgreements: {},
    commercialProducts: null
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {

        // **********************************************
        // ASYNC REQUEST
        case "REQUEST_FRAME_AGREEMENTS":
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
            console.warn("*From reducer* Frame Agreements:", frameAgreementMap);
            return { ...state, ...{frameAgreements: frameAgreementMap}, ...{initialised: {...state.initialised, ...{fa_loaded: true}}}};

        case "RECIEVE_COMMERCIAL_PRODUCTS":
            let commercialProducts = action.payload;
            console.warn("*From reducer* Commercial Products:", commercialProducts);
            return { ...state, ...{commercialProducts: commercialProducts}, ...{initialised: {...state.initialised, ...{cp_loaded: true}}} };

        case "RECIEVE_SETTINGS":
            console.warn("*From reducer* Settings:", action.payload);
            return { ...state, ...{settings: action.payload}, ...{initialised: {...state.initialised, ...{settings_loaded: true}}} };
        // **********************************************

        default:
            return state;
    }
};

export default rootReducer;
