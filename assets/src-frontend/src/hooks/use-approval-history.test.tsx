import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { deforcify } from '../datasources/deforcify';
import { remoteActions } from '../datasources/remote-actions-salesforce';
import { approval } from '../local-server/local_data';
import { useApprovalHistory } from './use-approval-history';

describe('test useApprovalHistory hook', () => {
	const fakeFaId = 'fakeFaId';
	const getApprovalsHistorySpy = jest
		.spyOn(remoteActions, 'getApprovalHistory')
		.mockImplementation(jest.fn(() => Promise.resolve(deforcify(approval))));

	test('returns approval history by calling getApprovalHistory once', async () => {
		const { result, waitFor } = renderHook(() => useApprovalHistory(fakeFaId));

		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});

		expect(result.current.approvals).toEqual(deforcify(approval));
		expect(getApprovalsHistorySpy.mock.calls.length).toBe(1);
		expect(getApprovalsHistorySpy).toBeCalledWith(fakeFaId);
	});
});
