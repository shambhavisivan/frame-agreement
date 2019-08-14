/*
  props.onActionTaken -> function
  props.faId -> string
*/
import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import { FaEditor } from '../src/components/FaEditor';
import { FaMaster } from '../src/components/FaMaster';
import { App } from '../src/App';
import { getMockStore, getInitStore, getFa } from './testUtils';

import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import * as actions from '../src/actions/index';

import { Provider } from 'react-redux';

function setupApp(pathname) {
	const mockStore = configureStore();
	const store = mockStore(getInitStore());

	const appProps = {
		history: {
			location: {
				pathname
			}
		},
		addProductsToFa: actions.addProductsToFa,
		apiNegotiate: actions.apiNegotiate,
		clearToasts: actions.clearToasts,
		cloneFrameAgreement: actions.cloneFrameAgreement,
		createToast: actions.createToast,
		getAppSettings: () => actions.getAppSettings()(store.dispatch),
		getApprovalHistory: actions.getApprovalHistory,
		getAttachment: actions.getAttachment,
		getCommercialProductData: actions.getCommercialProductData,
		getCommercialProducts: actions.getCommercialProducts,
		getFrameAgreements: actions.getFrameAgreements,
		getPicklistOptions: () => actions.getPicklistOptions()(store.dispatch),
		performAction: actions.performAction,
		registerMethod: actions.registerMethod,
		refreshFrameAgreement: actions.refreshFrameAgreement,
		resetNegotiation: actions.resetNegotiation,
		removeProductsFromFa: actions.removeProductsFromFa,
		saveFrameAgreement: () => actions.saveFrameAgreement(getFa())(store.dispatch),
		setCustomData: actions.setCustomData,
		setFrameAgreementState: actions.setFrameAgreementState,
		submitForApproval: actions.submitForApproval,
		validateFrameAgreement: actions.validateFrameAgreement,
		...getMockStore(['frameAgreements', 'commercialProducts', 'initialised'])
	};

	const enzymeWrapper_app = shallow(<App store={store} {...appProps} />);
	// const enzymeWrapper_app = shallow(<App store={store});
	// const enzymeWrapper_app = shallow(<App />).dive();
	// const enzymeWrapper = mount(<App {...appProps} />);
	// const enzymeWrapper_app = mount(
	// 	<Provider store={store}>
	// 		<App />
	// 	</Provider>
	// );

	return {
		appProps,
		enzymeWrapper_app
	};
}

describe('FaEditor component', () => {
	beforeEach(() => {});

	it('should render landing without errors', () => {
		const { enzymeWrapper_app } = setupApp('/');
	});

	it('should render editor without errors', () => {
		const { enzymeWrapper_app } = setupApp('/a1t1t0000009wpQAAQ');
	});

	it('should render editor without errors', () => {
		const { enzymeWrapper_app } = setupApp('/a1t1t0000009wpQAAQ');

		for (var key in window.FAM.api) {
			window.FAM.api[key]('a1t1t0000009wpQAAQ', []);
		}
	});

	// it('should render without errors', () => {});
	// it('should render without errors', () => {});
});
