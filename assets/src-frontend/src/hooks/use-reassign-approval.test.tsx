import { act, renderHook } from '@testing-library/react-hooks';
import { remoteActions } from '../datasources/remote-actions-mock';
import { useReassignApproval } from './use-reassign-approval';
import * as reactQuery from 'react-query';

describe('test useReassignApproval hook', () => {
	const reassignApproval = jest.fn(remoteActions.reassignApproval);

	const remoteActionsWithSpy = {
		...remoteActions,
		reassignApproval
	};

	const invalidateQueries = jest.fn();
	const useQueryCache = jest.fn().mockReturnValue({
		invalidateQueries
	});
	jest.spyOn(reactQuery, 'useQueryCache').mockImplementation(useQueryCache);

	test('returns mutate function to reassign the approval', async () => {
		const fakeFaId = 'fakeFaId';
		const fakeApprover = 'New Approver';

		const { result } = renderHook(() =>
			useReassignApproval(remoteActionsWithSpy.reassignApproval)
		);

		await act(async () => {
			await result.current.approvalAction({
				faId: fakeFaId,
				newApproverId: fakeApprover
			});
		});

		expect(reassignApproval.mock.calls.length).toBe(1);
		expect(reassignApproval).toBeCalledWith(fakeFaId, fakeApprover);
		expect(invalidateQueries).toBeCalledWith('approvalHistory');
	});
});
