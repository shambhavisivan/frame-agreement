import React from 'react';
import { render } from '@testing-library/react';
import 'uuid';
import { FrameAgreementList } from './fa-list';

jest.mock('../datasources/remote-actions-salesforce', () => ({
	remoteActions: {
		queryFrameAgreements: jest.fn(),
		getAppSettings: jest.fn(),
		getFieldMetadata: jest.fn()
	}
}));
import { remoteActions } from '../datasources/remote-actions-salesforce';

describe('framework agreement list page', () => {
	const queryFrameAgreementsSpy = jest.spyOn(remoteActions, 'queryFrameAgreements');
	const getFieldMetadataMock = jest.spyOn(remoteActions, 'getFieldMetadata');
	const getAppSettingsMock = jest.spyOn(remoteActions, 'getAppSettings');

	it('When component is mounted required apis are called', () => {
		render(<FrameAgreementList />);

		expect(queryFrameAgreementsSpy).toHaveBeenCalledTimes(1);
		expect(getAppSettingsMock).toHaveBeenCalledTimes(1);
		expect(getFieldMetadataMock).toHaveBeenCalledTimes(1);
	});
});
