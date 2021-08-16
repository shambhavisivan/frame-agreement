import { renderHook } from '@testing-library/react-hooks';
import React, { ReactElement } from 'react';
import { queryCache, QueryStatus } from 'react-query';
import { remoteActions } from '../datasources';
import { DELTA_CALC_RESULT_MOCK } from '../datasources/mock-data';
import { RemoteActionsProvider } from '../providers/app-settings-provider';
import { useGetDelta } from './use-get-delta';

jest.mock('../datasources/remote-actions-salesforce', () => ({
	remoteActions: {
		getAppSettings: jest.fn(),
		getDelta: jest.fn()
	}
}));
describe('test useGetDelta', () => {
	const wrapper = ({ children }: { children: ReactElement }): ReactElement => (
		<RemoteActionsProvider queryCache={queryCache} remoteActions={remoteActions}>
			{children}
		</RemoteActionsProvider>
	);
	const getDeltaSpy = jest
		.spyOn(remoteActions, 'getDelta')
		.mockResolvedValue(DELTA_CALC_RESULT_MOCK);

	test('should call getDelta remote actions', async () => {
		const { result, waitFor } = renderHook(() => useGetDelta('source-faid', 'target-faId'), {
			wrapper
		});

		await waitFor(() => result.current.deltaStatus === QueryStatus.Success);

		expect(getDeltaSpy).toHaveBeenCalledWith('target-faId', 'source-faid');
		expect(result.current.comparedAgreement).toEqual(DELTA_CALC_RESULT_MOCK);
	});
});
