/*
  props.onActionTaken -> function
  props.faId -> string
*/
import React from 'react';
import { shallow } from 'enzyme';
import Toggle from '../src/components/utillity/inputs/Toggle';

it('renders properly', () => {
	const props = {
		disabled: true,
		gkey: 'anykey',
		value: true,
		onChange: function(data) {
			console.log(data);
		}
	};

	const wrapper = shallow(<Toggle {...props} />);
	// expect(wrapper.contains(welcome)).toBe(true);
	expect(wrapper.find('label').hasClass('switch-wrapper')).toBe(true);
});
