import { ApprovalHistory, ProcessInstanceHistory } from '../../../datasources';

export interface Approval {
	approvals: {
		[faId: string]: {
			approvalHistory: ApprovalHistory;
			comment: string;
			newApproverId: string;
			canRecall: boolean;
			canApproveReject: boolean;
			canReassign: boolean;
		};
	};
}

export type ApprovalAction =
	| {
			type: 'updateComment';
			payload: {
				faId: string;
				comment: string;
			};
	  }
	| {
			type: 'reassignTo';
			payload: {
				faId: string;
				newApproverId: string;
			};
	  }
	| {
			type: 'refreshHistory';
			payload: {
				faId: string;
				approvalHistory: ApprovalHistory;
			};
	  };

export default function approvalReducer(state: Approval, action: ApprovalAction): Approval {
	switch (action.type) {
		case 'updateComment':
			if (!state.approvals[action.payload.faId]) {
				throw new Error('Cannot update comment on a missing Frame agreement');
			}

			return {
				...state,
				approvals: {
					...state.approvals,
					[action.payload.faId]: {
						...state.approvals[action.payload.faId],
						comment: action.payload.comment
					}
				}
			};

		case 'reassignTo':
			if (!state.approvals[action.payload.faId]) {
				throw new Error('Cannot reassign approval on a missing Frame agreement');
			}

			return {
				...state,
				approvals: {
					...state.approvals,
					[action.payload.faId]: {
						...state.approvals[action.payload.faId],
						newApproverId:
							action.payload.newApproverId ||
							state.approvals[action.payload.faId]?.approvalHistory?.currentUser
					}
				}
			};

		case 'refreshHistory':
			const approvalHistory = action.payload.approvalHistory;
			const startingIndex = approvalHistory?.listProcess[0]?.stepsAndWorkitems?.findIndex(
				(step: ProcessInstanceHistory) => {
					return step.stepStatus === 'Started';
				}
			);
			const lastApprovalProcessIndex = 0;
			const isInitiator =
				approvalHistory?.listProcess[lastApprovalProcessIndex]?.stepsAndWorkitems[
					startingIndex
				].originalActorId === approvalHistory?.currentUser;
			return {
				...state,
				approvals: {
					...state.approvals,
					[action.payload.faId]: {
						...state.approvals[action.payload.faId],
						approvalHistory: action.payload.approvalHistory,
						canRecall: approvalHistory?.isAdmin || isInitiator,
						canApproveReject: approvalHistory?.isApprover,
						canReassign: approvalHistory?.isAdmin
					}
				}
			};

		default:
			return state;
	}
}
