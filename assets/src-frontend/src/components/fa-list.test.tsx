import * as React from 'react';
import { FrameAgreementList } from './fa-list';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { mockAppSettings, mockFrameAgreements } from '../datasources/mock-data';
import { act, render, screen } from '@testing-library/react';
import { useFrameAgreements } from '../hooks/use-frame-agreements';
import { useAppSettings } from '../hooks/use-app-settings';
import { useUpsertFrameAgreements } from '../hooks/use-upsert-frame-agreements';
import { mockFunction } from '../test-helper';
import { QueryStatus } from 'react-query';

jest.mock('../hooks/use-frame-agreements', () => ({
	useFrameAgreements: jest.fn()
}));

jest.mock('../hooks/use-app-settings', () => ({
	useAppSettings: jest.fn()
}));

jest.mock('../hooks/use-upsert-frame-agreements', () => ({
	useUpsertFrameAgreements: jest.fn()
}));

const useFAMock = mockFunction(useFrameAgreements);
const useAppSettingsMock = mockFunction(useAppSettings);
const useUpsertFAMock = mockFunction(useUpsertFrameAgreements);

describe('framework agreement list page', () => {
	beforeAll(() => {
		useFAMock.mockReturnValue({ status: QueryStatus.Success, agreements: mockFrameAgreements });
		useAppSettingsMock.mockReturnValue({
			status: QueryStatus.Success,
			settings: mockAppSettings
		});

		useUpsertFAMock.mockReturnValue({
			status: QueryStatus.Success,
			mutate: () => Promise.resolve({} as unknown)
		});
	});

	test('Should render frame-agreement list on load', () => {
		act(() => {
			render(
				<Router history={createMemoryHistory()}>
					<FrameAgreementList />
				</Router>
			);
		});

		const faList = screen.getByTestId('fa-list-test-id');
		expect(faList.getElementsByTagName('li')).toHaveLength(5);
	});

	test('Should render dropdown buttons on click add frameagreements', () => {
		act(() => {
			render(
				<Router history={createMemoryHistory()}>
					<FrameAgreementList />
				</Router>
			);
		});

		const csDropDown = screen.getByTestId('cs-drop-down-test-id');
		const labelAddFa = csDropDown.children[0].getAttribute('aria-label');

		expect(labelAddFa).toEqual('Add Agreements');
	});
});
