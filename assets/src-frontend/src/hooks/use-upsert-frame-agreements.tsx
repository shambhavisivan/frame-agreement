import { QueryStatus, useMutation, useQueryCache } from 'react-query';
import { QueryKeys } from '../app-constants';
import { FrameAgreement, remoteActions } from '../datasources';

export { QueryStatus } from 'react-query';

export interface UpsertProps {
	faId: string | null;
	fieldData: Partial<FrameAgreement | SfGlobal.FrameAgreement>;
}

export function useUpsertFrameAgreements(
	upsertFrameAgreements: (
		faId: string | null,
		fieldData: Partial<FrameAgreement | SfGlobal.FrameAgreement>
	) => Promise<FrameAgreement> = remoteActions.upsertFrameAgreements
): {
	status: QueryStatus;
	mutate: (opts: UpsertProps) => Promise<FrameAgreement | unknown>;
} {
	const queryCache = useQueryCache();
	const [mutate, { status }] = useMutation<FrameAgreement, Error, UpsertProps>(
		({ fieldData, faId }: UpsertProps) => upsertFrameAgreements(faId, fieldData),
		{
			onSuccess: (data, { faId }) => {
				queryCache.setQueryData(
					[QueryKeys.frameagreement],
					(oldData: FrameAgreement[] | undefined) => {
						if (oldData && oldData.length) {
							const agreements = oldData.filter((fa) => fa.id !== faId);
							return [...agreements, data] as FrameAgreement[];
						} else {
							return [data];
						}
					}
				);
			}
		}
	);

	return {
		mutate,
		status
	};
}
