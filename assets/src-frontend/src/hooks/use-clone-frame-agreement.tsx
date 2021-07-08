import { QueryStatus, useMutation, useQueryCache } from 'react-query';
import { FrameAgreement, remoteActions } from '../datasources';

export function useCloneFrameAgreement(): {
	cloneStatus: QueryStatus;
	cloneFrameAgreement: (faId: string) => Promise<FrameAgreement | undefined>;
} {
	const queryCache = useQueryCache();
	const [mutateAsync, { status }] = useMutation<FrameAgreement, Error, string>(
		(faId) => remoteActions.cloneFrameAgreement(faId),
		{
			onSuccess: () => queryCache.invalidateQueries('frameAgreements')
		}
	);

	return {
		cloneStatus: status,
		cloneFrameAgreement: mutateAsync
	};
}
