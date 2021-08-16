import { QueryStatus, useQuery } from 'react-query';
import { QueryKeys } from '../app-constants';
import { DeltaResult, remoteActions } from '../datasources';

export function useGetDelta(
	sourceFaId: string,
	targetFaId: string
): {
	comparedAgreement: DeltaResult | undefined;
	deltaStatus: QueryStatus;
} {
	const isQueryEnabled = !!sourceFaId && !!targetFaId;

	const { data, status } = useQuery(
		[QueryKeys.compareAgreement, sourceFaId, targetFaId],
		// source and target should be flipped existing issue with backend.
		() => remoteActions.getDelta(targetFaId, sourceFaId),
		{ enabled: isQueryEnabled }
	);

	return {
		comparedAgreement: data,
		deltaStatus: status
	};
}
