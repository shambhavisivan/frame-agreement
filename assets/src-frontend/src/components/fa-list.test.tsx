import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import 'uuid';
import { FrameAgreementList } from './fa-list';

jest.mock('../datasources/remote-actions-salesforce', () => ({
	remoteActions: {
		queryFrameAgreements: jest.fn(),
		getAppSettings: jest.fn(),
		getFieldMetadata: jest.fn(),
		getChildFrameAgreements: jest.fn().mockResolvedValue([]),
		cloneFrameAgreement: jest.fn(),
		deleteFrameAgreement: jest.fn()
	}
}));

import { remoteActions } from '../datasources/remote-actions-salesforce';
import {
	faFieldMetadataMock,
	mockAppSettings,
	mockFrameAgreements
} from '../datasources/mock-data';
import { act } from 'react-dom/test-utils';

describe('framework agreement list page', () => {
	let queryFrameAgreementsSpy: jest.SpyInstance<unknown>;
	let getFieldMetadataMock: jest.SpyInstance<unknown>;
	let getAppSettingsMock: jest.SpyInstance<unknown>;

	beforeEach(() => {
		queryFrameAgreementsSpy = jest
			.spyOn(remoteActions, 'queryFrameAgreements')
			.mockResolvedValueOnce(mockFrameAgreements);
		getFieldMetadataMock = jest
			.spyOn(remoteActions, 'getFieldMetadata')
			.mockResolvedValue(faFieldMetadataMock);
		getAppSettingsMock = jest
			.spyOn(remoteActions, 'getAppSettings')
			.mockResolvedValue(mockAppSettings);
	});

	it('When component is mounted required apis are called', () => {
		render(<FrameAgreementList />);

		expect(queryFrameAgreementsSpy).toHaveBeenCalledTimes(1);
		expect(getAppSettingsMock).toHaveBeenCalledTimes(1);
		expect(getFieldMetadataMock).toHaveBeenCalledTimes(1);
	});

	test('should call query frameagreements with expected filters on keydown in search filter', async () => {
		render(<FrameAgreementList />);

		const searchInput = await screen.findByLabelText('search-input');
		act(() => {
			fireEvent.keyDown(searchInput, {
				target: { value: 'search-fa' },
				key: 'Enter',
				code: 'Enter'
			});
		});

		expect(queryFrameAgreementsSpy).toHaveBeenCalledWith(
			'{"csconta__Agreement_Name__c":"search-fa","csconta__Status__c":"Draft"}'
		);
	});

	test('should call query frameagreements with no filter', async () => {
		render(<FrameAgreementList />);

		const searchInput = await screen.findByLabelText('search-input');
		act(() => {
			fireEvent.keyDown(searchInput, {
				target: { value: '' },
				key: 'Enter',
				code: 'Enter'
			});
		});

		expect(queryFrameAgreementsSpy).toHaveBeenCalledWith('');
	});
});
