import { QueryStatus, useMutation } from 'react-query';
import { FrameAgreement, remoteActions } from '../datasources';

export { QueryStatus } from 'react-query';

interface UpsertProps {
	faId: string;
	fieldData: Partial<FrameAgreement>;
}

export function useUpsertFrameAgreements(
	upsertFrameAgreements: (
		faId: string,
		fieldData: Partial<FrameAgreement>
	) => Promise<FrameAgreement> = remoteActions.upsertFrameAgreements
): {
	status: QueryStatus;
	mutate: (opts: UpsertProps) => Promise<FrameAgreement | undefined>;
} {
	const [mutate, { status }] = useMutation<FrameAgreement, Error, UpsertProps>(
		({ fieldData, faId }: UpsertProps) => upsertFrameAgreements(faId, fieldData)
	);

	return {
		mutate,
		status
	};
}
