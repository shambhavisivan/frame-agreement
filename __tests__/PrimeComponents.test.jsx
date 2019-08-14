import React from 'react';
import Enzyme, { shallow } from 'enzyme';

import { AddAgreementsCTA } from '../src/components/FaEditor/AddAgreementsCTA';
import { AddProductCTA } from '../src/components/FaEditor/AddProductCTA';

import { getMockStore } from './testUtils';

// const mockStore = configureMockStore();
// const store = mockStore();
// const store = mockStore(props);

describe('AddAgreementsCTA component', () => {
	it('should render without errors', () => {
		let _toggleModalsCalled = false;

		const props = {
			render: true,
			toggleModals: data => {
				_toggleModalsCalled = true;
			}
			// ...getMockStore(["settings","handlers"])
		};

		const enzymeWrapper = shallow(<AddAgreementsCTA {...props} />);
		const instance = enzymeWrapper.instance();

		expect(enzymeWrapper.is('.add-product-box')).toBeTruthy();

		instance.onAddClick({ stopPropagation: jest.fn() });
		expect(_toggleModalsCalled).toBeTruthy();
	});
});

describe('AddProductCTA component', () => {
	it('should render without errors', () => {
		let _toggleModalsCalled = false;

		const props = {
			render: true,
			toggleModals: data => {
				_toggleModalsCalled = true;
			}
			// ...getMockStore(["settings","handlers"])
		};

		const enzymeWrapper = shallow(<AddProductCTA {...props} />);
		const instance = enzymeWrapper.instance();

		// expect(enzymeWrapper.find('.add-product-box').exists()).toBeTruthy();

		expect(enzymeWrapper.is('.add-product-box')).toBeTruthy();

		instance.onAddClick({ stopPropagation: jest.fn() });
		expect(_toggleModalsCalled).toBeTruthy();
	});
});
