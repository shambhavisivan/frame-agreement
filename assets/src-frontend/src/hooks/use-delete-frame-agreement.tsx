import { QueryStatus, useMutation, useQueryCache } from 'react-query';
import { QueryKeys } from '../app-constants';
import { remoteActions } from '../datasources';

// TODO: skipping tests for now due to issues with useMutation setup.
export function useDeleteFrameAgreement(): {
	status: QueryStatus;
	deleteFrameAgreement: (faId: string) => Promise<string | undefined>;
} {
	const queryCache = useQueryCache();
	const [mutateAsync, { status }] = useMutation<string, Error, string>(
		(faId) => remoteActions.deleteFrameAgreement(faId),
		{
			onSuccess: async () => queryCache.invalidateQueries(QueryKeys.frameagreement)
		}
	);

	return {
		status,
		deleteFrameAgreement: mutateAsync
	};
}
