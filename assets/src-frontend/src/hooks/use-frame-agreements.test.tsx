import { renderHook } from '@testing-library/react-hooks';
import React, { ReactElement } from 'react';
import { QueryCache, QueryStatus } from 'react-query';
import { mockFrameAgreements } from '../datasources/mock-data';
import { remoteActions } from '../datasources/remote-actions-salesforce';
import { RemoteActionsProvider } from '../providers/app-settings-provider';
import { mockFunction } from '../test-helper';
import { useFrameAgreements } from './use-frame-agreements';

jest.mock('../datasources/remote-actions-salesforce', () => ({
	remoteActions: {
		queryFrameAgreements: jest.fn(),
		getAppSettings: jest.fn()
	}
}));

describe('test useFrameAgremments hook', () => {
	const queryCache = new QueryCache();
	const wrapper = ({ children }: { children: ReactElement }): ReactElement => (
		<RemoteActionsProvider queryCache={queryCache} remoteActions={remoteActionsWithSpy}>
			{children}
		</RemoteActionsProvider>
	);

	const queryFrameAgreements = mockFunction(remoteActions.queryFrameAgreements);

	const remoteActionsWithSpy = {
		...remoteActions,
		queryFrameAgreements
	};

	const spyOnQueryFrameAgreements = jest.spyOn(remoteActions, 'queryFrameAgreements');

	beforeEach(() => {
		spyOnQueryFrameAgreements.mockClear();
	});

	test('should call queryFrameAgreements remote action and group data with status', async () => {
		expect(spyOnQueryFrameAgreements).toHaveBeenCalledTimes(0);
		queryFrameAgreements.mockResolvedValueOnce(mockFrameAgreements.splice(0, 3));

		const { result, waitFor } = renderHook(() => useFrameAgreements(), {
			wrapper
		});

		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});
		const expected = [
			{
				id: 'a1t1t0000009wpQAAQ',
				name: 'AGR-000000',
				account: {
					name: 'Test Account',
					id: '0011t00000DSEtnAAH'
				},
				agreementName: 'Frame Agreement - Test #1',
				status: 'Draft',
				validFrom: 1547424000000,
				validTo: 1568419200000,
				disableLevels: false,
				disableCustomTabs: false,
				arbFieldInteger: 48,
				arbFieldText: 'Arb Text',
				arbFieldDate: 1547510400000,
				arbFieldText2: 'Arb Text 2 - change 2',
				arbFieldText3: 'Arb Text 3 - change 1',
				replacedFrameAgreement: 'a1t1t0000009wpQAAP',
				agreementLevel: 'Master Agreement',
				arbFieldTextarea:
					'Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget'
			},
			{
				id: 'a1t1t0000009wpQAAP',
				name: 'AGR-0007',
				account: {
					name: 'Test Account',
					id: '0011t00000DSEtnAAH'
				},
				agreementName: 'Frame Agreement - Test #1 replaced',
				status: 'Active',
				validFrom: 1547424000000,
				validTo: 1568419200000,
				disableLevels: false,
				disableCustomTabs: false,
				arbFieldInteger: 48,
				arbFieldText: 'Arb Text',
				arbFieldDate: 1547510400000,
				arbFieldText2: 'Arb Text 2 - change 2',
				arbFieldText3: 'Arb Text 3 - change 1',
				agreementLevel: 'Master Agreement',
				arbFieldTextarea:
					'Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget'
			},
			{
				id: 'a1t1t0000009wpQAzx',
				name: 'AGR-0007',
				account: {
					name: 'Test Account',
					id: '0011t00000DSEtnAAH'
				},
				agreementName: 'Frame Agreement - Test #1',
				status: 'Active',
				validFrom: 1547424000000,
				validTo: 1568419200000,
				disableLevels: false,
				disableCustomTabs: false,
				arbFieldInteger: 48,
				arbFieldText: 'Arb Text',
				arbFieldDate: 1547510400000,
				arbFieldText2: 'Arb Text 2 - change 2',
				arbFieldText3: 'Arb Text 3 - change 1',
				agreementLevel: 'Master Agreement',
				arbFieldTextarea:
					'Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget'
			}
		];

		expect(result.current.agreementList).toEqual(expected);
		expect(spyOnQueryFrameAgreements).toHaveBeenCalledTimes(1);
	});

	test('should call queryframeagreements with filter params', async () => {
		const { result, waitFor } = renderHook(
			() =>
				useFrameAgreements({
					name: 'sampleFa',
					activeTab: 'Active'
				}),
			{
				wrapper
			}
		);

		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});

		/* eslint-disable @typescript-eslint/naming-convention */
		const transformedfilterString = JSON.stringify({
			csconta__Agreement_Name__c: 'sampleFa',
			csconta__Status__c: 'Active'
		});
		/* eslint-enable @typescript-eslint/naming-convention */

		expect(spyOnQueryFrameAgreements).toHaveBeenCalledTimes(1);
		expect(spyOnQueryFrameAgreements).toHaveBeenCalledWith(transformedfilterString);
	});
});
