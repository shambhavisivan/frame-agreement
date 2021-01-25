import { QueryStatus, useQuery } from 'react-query';
import { CommercialProductStandalone, remoteActions } from '../datasources';

export { QueryStatus } from 'react-query';

export function useCommercialProducts(
	cpIds: string[] = []
): {
	status: QueryStatus;
	data?: CommercialProductStandalone[];
} {
	const { status, data } = useQuery(['commercialProducts', cpIds], () =>
		remoteActions.getCommercialProducts(cpIds)
	);

	return {
		status,
		data
	};
}
