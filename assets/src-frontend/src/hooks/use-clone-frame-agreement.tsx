import { QueryStatus, useMutation, useQueryCache } from 'react-query';
import { QueryKeys } from '../app-constants';
import { FrameAgreement, remoteActions } from '../datasources';

export function useCloneFrameAgreement(): {
	cloneStatus: QueryStatus;
	cloneFrameAgreement: (faId: string) => Promise<FrameAgreement | undefined>;
} {
	const queryCache = useQueryCache();
	const [mutateAsync, { status }] = useMutation<FrameAgreement, Error, string>(
		(faId) => remoteActions.cloneFrameAgreement(faId),
		{
			onSuccess: () => queryCache.invalidateQueries(QueryKeys.frameagreement)
		}
	);

	return {
		cloneStatus: status,
		cloneFrameAgreement: mutateAsync
	};
}
