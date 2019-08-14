/*
  props.loading -> bool
  props.children -> React
*/
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { FaTabs } from '../src/components/FaEditor/FaTabs';
import { getMockStore } from './testUtils';

// const mockStore = configureMockStore();
// const store = mockStore();
// const store = mockStore(props);

function setup(loading = false) {
	const props = {
		loading,
		children: null,
		...getMockStore(['settings', 'handlers'])
	};

	const enzymeWrapper = shallow(<FaTabs {...props} />);

	return {
		props,
		enzymeWrapper
	};
}

describe('FaTabs component', () => {
	it('should render without errors', () => {
		const { enzymeWrapper } = setup();
		const instance = enzymeWrapper.instance();

		expect(enzymeWrapper.find('Tabs').exists()).toBeTruthy();

		// instance.callTabHandler("csconta__Agreement_Name__c", "testingText"); //TEST THIS USING ACTION/REDUCERS TESTS
	});

	it('should render skeleton when loading is false', () => {
		let { enzymeWrapper, props } = setup(true);
		props.settings.CustomTabsData = [];

		enzymeWrapper = shallow(<FaTabs {...props} />);

		// const instance = enzymeWrapper.instance();

		expect(enzymeWrapper.is('CommercialProductSkeleton')).toBeTruthy();
	});
});
