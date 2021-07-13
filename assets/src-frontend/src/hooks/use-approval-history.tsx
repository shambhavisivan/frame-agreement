import { QueryStatus, useQuery } from 'react-query';
import { ApprovalHistory, remoteActions } from '../datasources';

export function useApprovalHistory(
	faId: string
): {
	status: QueryStatus;
	approvals: ApprovalHistory | undefined;
} {
	const { status, data } = useQuery(['approvalHistory', faId], () =>
		remoteActions.getApprovalHistory(faId)
	);

	return {
		status,
		approvals: data
	};
}
