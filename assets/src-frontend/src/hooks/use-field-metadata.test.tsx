import { renderHook } from '@testing-library/react-hooks';
import React, { ReactElement } from 'react';
import { QueryCache, QueryStatus } from 'react-query';
import { faFieldMetadataMock } from '../datasources/mock-data';
import { remoteActions } from '../datasources/remote-actions-salesforce';
import { RemoteActionsProvider } from '../providers/app-settings-provider';
import { mockFunction } from '../test-helper';
import { useFieldMetadata } from './use-field-metadata';

jest.mock('../datasources/remote-actions-salesforce', () => ({
	remoteActions: {
		getFieldMetadata: jest.fn()
	}
}));

describe('test useFieldMetadata hook', () => {
	const queryCache = new QueryCache();

	const getFieldMetadataMock = mockFunction(remoteActions.getFieldMetadata);

	const remoteActionsWithSpy = {
		...remoteActions,
		getFieldMetadataMock
	};

	const spyOnGetFieldMetadata = jest.spyOn(remoteActions, 'getFieldMetadata');

	test('should call queryFrameAgreements remote action and group data with status', async () => {
		expect(spyOnGetFieldMetadata).toHaveBeenCalledTimes(0);

		getFieldMetadataMock.mockResolvedValueOnce(faFieldMetadataMock);
		const wrapper = ({ children }: { children: ReactElement }): ReactElement => (
			<RemoteActionsProvider queryCache={queryCache} remoteActions={remoteActionsWithSpy}>
				{children}
			</RemoteActionsProvider>
		);

		const { result, waitFor } = renderHook(() => useFieldMetadata(''), {
			wrapper
		});

		await waitFor(() => {
			return result.current.metadataStatus === QueryStatus.Success;
		});

		expect(result.current.metadata).toEqual(faFieldMetadataMock);
		expect(spyOnGetFieldMetadata).toHaveBeenCalledTimes(1);
	});
});
