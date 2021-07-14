import { QueryStatus, useMutation, useQueryCache } from 'react-query';
import { remoteActions } from '../datasources';

interface ReassignApprovalProps {
	faId: string;
	newApproverId: string;
}

export function useReassignApproval(
	reassignApproval: (
		faId: string,
		newApproverId: string
	) => Promise<void> = remoteActions.reassignApproval
): {
	reassignStatus: QueryStatus;
	approvalAction: (opts: ReassignApprovalProps) => Promise<void | undefined>;
} {
	const queryCache = useQueryCache();
	const [mutateAsync, { status }] = useMutation<void, Error, ReassignApprovalProps>(
		({ faId, newApproverId }: ReassignApprovalProps) => reassignApproval(faId, newApproverId),
		{
			onSuccess: () => queryCache.invalidateQueries('approvalHistory')
		}
	);

	return {
		reassignStatus: status,
		approvalAction: mutateAsync
	};
}
