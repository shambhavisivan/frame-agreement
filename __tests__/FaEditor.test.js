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

// const mockStore = configureMockStore();
// const store = mockStore();
// const store = mockStore(props);

function setup() {
	const mockStore = configureStore();
	const store = mockStore(getInitStore());

	const props = {
		history: [],
		match: {
			params: {
				id: 'a1t1t0000009wpQAAQ'
			}
		},
		...getMockStore(['settings', 'frameAgreements', 'commercialProducts']),
		createToast: jest.fn(),
		validateFrameAgreement: jest.fn(),
		getAttachment: jest.fn(),
		getApprovalHistory: jest.fn(),
		saveFrameAgreement: () => actions.saveFrameAgreement(getFa())(store.dispatch),
		addProductsToFa: jest.fn(),
		removeProductsFromFa: jest.fn(),
		negotiate: jest.fn(),
		getCommercialProductData: jest.fn()
	};

	// const enzymeWrapper_app = shallow(<App {...props} />);
	const enzymeWrapper = shallow(<FaEditor {...props} />);

	return {
		props,
		enzymeWrapper
	};
}

function setupApp() {
	const mockStore = configureStore();
	const store = mockStore(getInitStore());

	const appProps = {
		history: {
			location: {
				pathname: '/'
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
		getPicklistOptions: actions.getPicklistOptions,
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

	actions
		.getAppSettings()(store.dispatch)
		.then(r => {
			console.log(r);
		});

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

	it('should render without errors', () => {
		const { enzymeWrapper } = setup();
		const instance = enzymeWrapper.instance();

		instance.componentWillMount();
		instance.componentWillUpdate();

		expect(enzymeWrapper.is('div')).toBe(true);
		expect(enzymeWrapper.first('div').hasClass('fa-app')).toBe(true);

		// enzymeWrapper.instance().onFieldChange('csconta__Agreement_Name__c', 'testingText');
	});

	it('should execute class function without errors', async () => {
		const { enzymeWrapper } = setup();
		const instance = enzymeWrapper.instance();

		expect(enzymeWrapper.state().actionTaken).toBe(false);
		instance.onActionTaken();
		expect(enzymeWrapper.state().actionTaken).toBe(true);

		const _product = {
			Id: 'a1F1t00000017Y0EAI',
			Name: 'Mobile L',
			cspmb__Effective_Start_Date__c: 1545264000000,
			cspmb__Recurring_Charge__c: 269,
			cspmb__Authorization_Level__c: 'a0x1t000001RjBzAAK',
			cspmb__Is_Authorization_Required__c: false,
			cspmb__Is_One_Off_Discount_Allowed__c: true,
			cspmb__Is_Recurring_Discount_Allowed__c: false,
			cspmb__Price_Item_Description__c: '30 Gb Internet + 5000 minutes/SMS',
			cspmb__Contract_Term__c: '24 Months'
		};

		instance.onSelectProduct(_product);
		expect(Object.keys(enzymeWrapper.state().selectedProducts).length).toBe(1);

		// Test remove modal
		instance.onRemoveProducts();

		expect(document.querySelectorAll('.modal.fa-modal').length).toBe(1);

		await instance._removeProducts();
		expect(Object.keys(enzymeWrapper.state().selectedProducts).length).toBe(0);

		instance.onSelectAllProducts([
			{ Id: 'a1F1t0000001JBjEAM' },
			{ Id: 'a1F1t0000001JCDEA2' },
			{ Id: 'a1F1t0000001JC8EAM' },
			{ Id: 'a1F1t00000017Y0EAI' }
		]);

		enzymeWrapper.update();
		expect(Object.keys(enzymeWrapper.state().selectedProducts).length).toBe(4);
	});

	it('should execute upsertFrameAgreements without error', async () => {
		const { enzymeWrapper } = setup();
		const instance = enzymeWrapper.instance();

		let res = await instance.upsertFrameAgreements();
		expect(res).toBe('Success');
	});

	it('should execute onNegotiate without error', async () => {
		const { enzymeWrapper } = setup();
		const instance = enzymeWrapper.instance();

		let res = await instance.onNegotiate();
		expect(enzymeWrapper.state().actionTaken).toBe(true);
	});

	// it.skip('should render without errors', () => {
	// 	const { enzymeWrapper_app } = setupApp();
	// });
	// it('should render without errors', () => {});
	// it('should render without errors', () => {});
});
