import { QueryStatus, useMutation, useQueryCache } from 'react-query';
import { ApprovalActionType, remoteActions } from '../datasources';

interface ApprovalActionProps {
	faId: string;
	actionType: ApprovalActionType;
	comment: string;
}

export function useApprovalAction(
	approveRejectRecallRecord: (
		faId: string,
		actionType: ApprovalActionType,
		comment: string
	) => Promise<boolean> = remoteActions.approveRejectRecallRecord
): {
	approvalStatus: QueryStatus;
	approvalAction: (opts: ApprovalActionProps) => Promise<boolean | undefined>;
} {
	const queryCache = useQueryCache();
	const [mutateAsync, { status }] = useMutation<boolean, Error, ApprovalActionProps>(
		({ faId, actionType, comment }: ApprovalActionProps) =>
			approveRejectRecallRecord(faId, actionType, comment),
		{
			onSuccess: () => queryCache.invalidateQueries('approvalHistory')
		}
	);

	return {
		approvalStatus: status,
		approvalAction: mutateAsync
	};
}
