import { useQuery, QueryStatus } from 'react-query';
import { remoteActions, FrameAgreement } from '../datasources';

export { QueryStatus } from 'react-query';

export interface GroupedFrameAgreements {
	[key: string]: FrameAgreement[];
}
export function useFrameAgreements(): {
	status: QueryStatus;
	agreements: GroupedFrameAgreements | undefined;
} {
	const { status, data } = useQuery(['frameAgreements'], remoteActions.queryFrameAgreements);
	const groupedResultsByStatus: GroupedFrameAgreements = {};

	data?.forEach((agreement) => {
		const status = agreement.status;
		if (status) {
			if (!groupedResultsByStatus[status]) {
				groupedResultsByStatus[status] = [agreement];
			} else {
				groupedResultsByStatus[status] = [...groupedResultsByStatus[status], agreement];
			}
		}
	});

	return {
		status,
		agreements: groupedResultsByStatus
	};
}
