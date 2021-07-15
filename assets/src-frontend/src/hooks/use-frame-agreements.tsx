import { useQuery, QueryStatus } from 'react-query';
import { QueryKeys } from '../app-constants';
import { remoteActions, FrameAgreement } from '../datasources';

export { QueryStatus } from 'react-query';

export interface GroupedFrameAgreements {
	[key: string]: FrameAgreement[];
}

type FilterParam = {
	activeTab: string;
	name: string;
};

export function useFrameAgreements(
	filterParam: FilterParam | null = null
): {
	status: QueryStatus;
	agreements: GroupedFrameAgreements | undefined;
} {
	/* eslint-disable @typescript-eslint/naming-convention */
	const transformFilter: {
		csconta__Agreement_Name__c: string;
		csconta__Status__c: string;
	} | null = filterParam && {
		csconta__Agreement_Name__c: filterParam.name,
		csconta__Status__c: filterParam.activeTab
	};
	/* eslint-enable @typescript-eslint/naming-convention */

	const queryKey = transformFilter
		? [QueryKeys.frameagreement, JSON.stringify(transformFilter)]
		: [QueryKeys.frameagreement];

	const { status, data } = useQuery(queryKey, () =>
		remoteActions.queryFrameAgreements(transformFilter ? JSON.stringify(transformFilter) : '')
	);
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
