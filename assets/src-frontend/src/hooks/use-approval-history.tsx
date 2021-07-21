import { QueryStatus, useQuery } from 'react-query';
import { RefetchOptions } from 'react-query/types/core/query';
import { ApprovalHistory, remoteActions } from '../datasources';

export function useApprovalHistory(
	faId: string
): {
	status: QueryStatus;
	approvals: ApprovalHistory | undefined;
	refetchApprovalHistory: (
		options?: RefetchOptions | undefined
	) => Promise<ApprovalHistory | undefined>;
} {
	const { status, data, refetch } = useQuery(['approvalHistory', faId], () =>
		remoteActions.getApprovalHistory(faId)
	);

	return {
		status,
		approvals: data,
		refetchApprovalHistory: refetch
	};
}
