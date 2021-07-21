import approvalReducer, { Approval, ApprovalAction } from './approval-reducer';
import { approval } from '../../../local-server/local_data';
import { deforcify } from '../../../datasources/deforcify';
import { ApprovalHistory } from '../../../datasources';

describe('approvalReducer', () => {
	const comment: ApprovalAction['type'] = 'updateComment';
	const reassign: ApprovalAction['type'] = 'reassignTo';
	const refresh: ApprovalAction['type'] = 'refreshHistory';

	const testFaId = 'testFaId';

	describe('updateComment', () => {
		const testState: Approval = {
			approvals: {
				[testFaId]: {
					approvalHistory: deforcify(approval),
					canApproveReject: true,
					canReassign: true,
					canRecall: true,
					comment: '',
					newApproverId: ''
				}
			}
		};

		test(`returns the state with the updated comment set`, () => {
			const newComment = 'Approved by business';
			const expectedState: Approval = {
				approvals: {
					[testFaId]: {
						approvalHistory: deforcify(approval),
						canApproveReject: true,
						canReassign: true,
						canRecall: true,
						comment: newComment,
						newApproverId: ''
					}
				}
			};
			expect(
				approvalReducer(testState, {
					type: comment,
					payload: {
						faId: testFaId,
						comment: newComment
					}
				})
			).toEqual(expectedState);
		});
	});

	describe('reassignTo', () => {
		const testState: Approval = {
			approvals: {
				[testFaId]: {
					approvalHistory: deforcify(approval),
					canApproveReject: true,
					canReassign: true,
					canRecall: true,
					comment: '',
					newApproverId: ''
				}
			}
		};

		test(`returns the state with the new approver set`, () => {
			const newApproverId = 'new approver';

			const expectedState: Approval = {
				approvals: {
					[testFaId]: {
						approvalHistory: deforcify(approval),
						canApproveReject: true,
						canReassign: true,
						canRecall: true,
						comment: '',
						newApproverId: newApproverId
					}
				}
			};

			expect(
				approvalReducer(testState, {
					type: reassign,
					payload: {
						faId: testFaId,
						newApproverId
					}
				})
			).toEqual(expectedState);
		});
	});

	describe('refreshHistory', () => {
		const testState: Approval = {
			approvals: {
				[testFaId]: {
					approvalHistory: deforcify(approval),
					canApproveReject: true,
					canReassign: true,
					canRecall: true,
					comment: '',
					newApproverId: ''
				}
			}
		};

		test(`returns the state with the approval history and checks set`, () => {
			const deforcifiedApproval = deforcify(approval);
			const updatedListProcess = [...deforcifiedApproval.listProcess];
			updatedListProcess[0].stepsAndWorkitems[1].originalActorId = 'DifferentActor';
			const newAprovalHistory: ApprovalHistory = {
				...deforcifiedApproval,
				isAdmin: false,
				isPending: false,
				isApprover: false,
				listProcess: updatedListProcess
			};

			const expectedState: Approval = {
				approvals: {
					[testFaId]: {
						approvalHistory: newAprovalHistory,
						canApproveReject: false,
						canReassign: false,
						canRecall: false,
						comment: '',
						newApproverId: ''
					}
				}
			};
			expect(
				approvalReducer(testState, {
					type: refresh,
					payload: {
						faId: testFaId,
						approvalHistory: newAprovalHistory
					}
				})
			).toEqual(expectedState);
		});
	});
});
