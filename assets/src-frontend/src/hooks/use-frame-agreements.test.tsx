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

	const queryFrameAgreements = mockFunction(remoteActions.queryFrameAgreements);

	const remoteActionsWithSpy = {
		...remoteActions,
		queryFrameAgreements
	};

	const spyOnQueryFrameAgreements = jest.spyOn(remoteActions, 'queryFrameAgreements');

	test('should call queryFrameAgreements remote action and group data with status', async () => {
		expect(spyOnQueryFrameAgreements).toHaveBeenCalledTimes(0);
		queryFrameAgreements.mockResolvedValueOnce(mockFrameAgreements.splice(0, 3));
		const wrapper = ({ children }: { children: ReactElement }): ReactElement => (
			<RemoteActionsProvider queryCache={queryCache} remoteActions={remoteActionsWithSpy}>
				{children}
			</RemoteActionsProvider>
		);

		const { result, waitFor } = renderHook(() => useFrameAgreements(), {
			wrapper
		});

		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});

		/* eslint-disable @typescript-eslint/naming-convention */
		const expected = {
			Draft: [
				{
					id: 'a1t1t0000009wpQAAQ',
					name: 'AGR-000000',
					account: {
						name: 'Test Account',
						id: '0011t00000DSEtnAAH'
					},
					status: 'Draft',
					validFrom: 1547424000000,
					validTo: 1568419200000,
					disableLevels: false,
					disableCustomTabs: false,
					arbFieldInteger: 48,
					arbFieldText: 'Arb Text',
					agreementName: 'Frame Agreement - Test #1',
					arbFieldDate: 1547510400000,
					arbFieldText2: 'Arb Text 2 - change 2',
					arbFieldText3: 'Arb Text 3 - change 1',
					replacedFrameAgreement: 'a1t1t000000EOuxAAG',
					agreementLevel: 'Master Agreement',
					arbFieldTextarea:
						'Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget'
				},
				{
					id: 'a1t1t000000EyqiAAC',
					name: 'AGR-010263',
					lastModifiedDate: 1572279423000,
					account: {
						name: 'Test Account',
						id: '0011t00000Pq1WRAAZ'
					},
					agreementName: 'Delta Test 1',
					status: 'Draft',
					frameAgreementNumber: '010263',
					agreementLevel: 'Frame Agreement',
					arbFieldText: 'Arb Text',
					arbFormula: 'Arb Text TESTING TESTING',
					arbFieldBool: true
				}
			],
			'Requires Approval': [
				{
					id: 'a1t1t000000EyqnAAC',
					name: 'AGR-010264',
					lastModifiedDate: 1571917299000,
					account: {
						name: 'Test Account',
						id: '0011t00000Pq1WRAAZ'
					},
					agreementName: 'Delta Test 2',
					status: 'Requires Approval',
					frameAgreementNumber: '010264',
					agreementLevel: 'Frame Agreement',
					arbFormula: 'TESTING TESTING',
					arbFieldBool: true
				}
			]
		};
		/* eslint-enable @typescript-eslint/naming-convention */

		expect(result.current.agreements).toEqual(expected);
		expect(spyOnQueryFrameAgreements).toHaveBeenCalledTimes(1);
	});
});
