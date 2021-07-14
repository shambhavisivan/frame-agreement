import { act, renderHook } from '@testing-library/react-hooks';
import { ApprovalActionType } from '../datasources';
import { remoteActions } from '../datasources/remote-actions-mock';
import { useApprovalAction } from './use-approval-action';
import * as reactQuery from 'react-query';

describe('test useApprovalAction hook', () => {
	const approveRejectRecallRecord = jest.fn(remoteActions.approveRejectRecallRecord);

	const remoteActionsWithSpy = {
		...remoteActions,
		approveRejectRecallRecord
	};

	const invalidateQueries = jest.fn();
	const useQueryCache = jest.fn().mockReturnValue({
		invalidateQueries
	});
	jest.spyOn(reactQuery, 'useQueryCache').mockImplementation(useQueryCache);

	test('returns mutate function to execute the approval action', async () => {
		const fakeFaId = 'fakeFaId';
		const fakeApprovalAction = ApprovalActionType.approve;
		const fakeApprovalComment = 'Approved by business';

		const { result } = renderHook(() =>
			useApprovalAction(remoteActionsWithSpy.approveRejectRecallRecord)
		);

		await act(async () => {
			await result.current.approvalAction({
				faId: fakeFaId,
				actionType: fakeApprovalAction,
				comment: fakeApprovalComment
			});
		});

		expect(approveRejectRecallRecord.mock.calls.length).toBe(1);
		expect(approveRejectRecallRecord).toBeCalledWith(
			fakeFaId,
			fakeApprovalAction,
			fakeApprovalComment
		);
		expect(invalidateQueries).toBeCalledWith('approvalHistory');
	});
});
