import { ApprovalHistory } from '../../../datasources';
import { ApprovalAction } from './approval-reducer';

interface ApprovalActionExecutor {
	updateComment(comment: string): void;
	reassignTo(newApproverId: string): void;
	refreshHistory(approvalHistory: ApprovalHistory): void;
}

export const createApprovalComponentActions = (dispatch: React.Dispatch<ApprovalAction>) => (
	faId: string
): ApprovalActionExecutor => {
	return {
		updateComment(comment: string): void {
			return dispatch({
				type: 'updateComment',
				payload: {
					faId,
					comment
				}
			});
		},
		reassignTo(newApproverId: string): void {
			return dispatch({
				type: 'reassignTo',
				payload: {
					faId,
					newApproverId
				}
			});
		},
		refreshHistory(approvalHistory: ApprovalHistory): void {
			return dispatch({
				type: 'refreshHistory',
				payload: {
					faId,
					approvalHistory
				}
			});
		}
	};
};
