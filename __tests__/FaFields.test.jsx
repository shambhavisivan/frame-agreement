/*
  props.onActionTaken -> function
  props.faId -> string
*/
import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import { FaFields } from '../src/components/FaEditor/FaFields';
import { getMockStore } from './testUtils';

// const mockStore = configureMockStore();
// const store = mockStore();
// const store = mockStore(props);

function setup() {
	const props = {
		faId: 'a1t1t0000009wpQAAQ',
		onActionTaken: function(data) {
			console.log(data);
			return data;
		},
		...getMockStore(['settings', 'frameAgreements']),
		updateFrameAgreement: jest.fn()
	};

	const enzymeWrapper = shallow(<FaFields {...props} />);

	return {
		props,
		enzymeWrapper
	};
}

describe('FaFields component', () => {
	it('should render without errors', () => {
		const { enzymeWrapper } = setup();
		// console.log(enzymeWrapper.debug());

		expect(enzymeWrapper.find('section').hasClass('card basket-details-card')).toBe(true);

		enzymeWrapper.instance().onFieldChange('csconta__Agreement_Name__c', 'testingText');
	});
});
