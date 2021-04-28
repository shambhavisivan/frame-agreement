import { QueryStatus, useMutation } from 'react-query';
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
	const [mutate, { status }] = useMutation<FrameAgreement, Error, UpsertProps>(
		({ fieldData, faId }: UpsertProps) => upsertFrameAgreements(faId, fieldData)
	);

	return {
		mutate,
		status
	};
}
