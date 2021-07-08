import { renderHook } from '@testing-library/react-hooks';
import React, { ReactElement } from 'react';
import { act } from 'react-dom/test-utils';
import { QueryCache, QueryStatus } from 'react-query';
import { mockFrameAgreements } from '../datasources/mock-data';
import { remoteActions } from '../datasources/remote-actions-salesforce';
import { RemoteActionsProvider } from '../providers/app-settings-provider';
import { mockFunction } from '../test-helper';
import { useCloneFrameAgreement } from './use-clone-frame-agreement';

jest.mock('../datasources/remote-actions-salesforce', () => ({
	remoteActions: {
		cloneFrameAgreement: jest.fn(),
		getAppSettings: jest.fn(),
		queryFrameAgreements: jest.fn().mockResolvedValueOnce([])
	}
}));

// TODO: some setup issues on using the useMutation hook
describe.skip('test useCloneFrameAgreement hook', () => {
	const queryCache = new QueryCache();
	const cloneFrameAgreementMock = mockFunction(remoteActions.cloneFrameAgreement);

	const remoteActionsWithMock = {
		...remoteActions,
		cloneFrameAgreementMock
	};

	const spyOnCloneFrameAgreement = jest.spyOn(remoteActions, 'cloneFrameAgreement');

	test('should call cloneFrameAgreement remote action', async () => {
		expect(spyOnCloneFrameAgreement).toHaveBeenCalledTimes(0);

		cloneFrameAgreementMock.mockResolvedValueOnce(mockFrameAgreements[0]);
		const wrapper = ({ children }: { children: ReactElement }): ReactElement => (
			<RemoteActionsProvider queryCache={queryCache} remoteActions={remoteActionsWithMock}>
				{children}
			</RemoteActionsProvider>
		);

		const { result, waitFor } = renderHook(() => useCloneFrameAgreement(), {
			wrapper
		});

		await waitFor(() => {
			return result.current.cloneStatus === QueryStatus.Success;
		});

		expect(result.current.cloneFrameAgreement).toBeInstanceOf('function');

		act(() => {
			result.current.cloneFrameAgreement('some-id');
		});
		expect(spyOnCloneFrameAgreement).toHaveBeenCalledTimes(1);
	});
});
