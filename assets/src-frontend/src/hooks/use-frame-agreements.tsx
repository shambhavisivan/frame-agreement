import { useQuery, QueryStatus } from 'react-query';
import { remoteActions, FrameAgreement } from '../datasources';

export { QueryStatus } from 'react-query';

export function useFrameAgreements(
	getFrameAgreements: () => Promise<FrameAgreement[]> = remoteActions.getFrameAgreements
): {
	status: QueryStatus;
	agreements: FrameAgreement[] | undefined;
} {
	const { status, data } = useQuery('frameAgreements', getFrameAgreements);

	return {
		status,
		agreements: data
	};
}
