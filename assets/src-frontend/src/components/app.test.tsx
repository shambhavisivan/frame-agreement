import React from 'react';
import { render } from '@testing-library/react';
import { App } from './app';

describe('tests for <App/>', () => {
	const component = render(<App />);
	test('to match snapshot', () => {
		expect(component).toMatchSnapshot();
	});
});
