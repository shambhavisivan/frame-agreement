import { renderHook } from '@testing-library/react-hooks';
import React, { ReactElement } from 'react';
import { QueryCache, QueryStatus } from 'react-query';
import { pickListOptions } from '../datasources/mock-data';
import { remoteActions } from '../datasources/remote-actions-salesforce';
import { RemoteActionsProvider } from '../providers/app-settings-provider';
import { mockFunction } from '../test-helper';
import { usePickListOption } from './use-pick-list-option';

jest.mock('../datasources/remote-actions-salesforce', () => ({
	remoteActions: {
		getPicklistOptions: jest.fn()
	}
}));

describe('test usePickListOption hook', () => {
	const queryCache = new QueryCache();

	const getPicklistOptionsMock = mockFunction(remoteActions.getPicklistOptions);

	const remoteActionsWithSpy = {
		...remoteActions,
		getPicklistOptionsMock
	};

	const spyOnGetPicklistOptionsMock = jest.spyOn(remoteActions, 'getPicklistOptions');

	test('should call getPicklistOptions remote action with status', async () => {
		expect(spyOnGetPicklistOptionsMock).toHaveBeenCalledTimes(0);

		getPicklistOptionsMock.mockResolvedValueOnce(pickListOptions);
		const wrapper = ({ children }: { children: ReactElement }): ReactElement => (
			<RemoteActionsProvider queryCache={queryCache} remoteActions={remoteActionsWithSpy}>
				{children}
			</RemoteActionsProvider>
		);

		const { result, waitFor } = renderHook(
			() => usePickListOption(['csconta__agreement_level__c', 'csconta__status__c']),
			{
				wrapper
			}
		);

		await waitFor(() => {
			return result.current.pickListStatus === QueryStatus.Success;
		});

		expect(result.current.pickList).toEqual(pickListOptions);
		expect(spyOnGetPicklistOptionsMock).toHaveBeenCalledTimes(1);
	});
});
