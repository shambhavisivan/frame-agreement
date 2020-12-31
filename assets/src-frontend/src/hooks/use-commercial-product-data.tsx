import { QueryStatus, useQuery } from 'react-query';
import { CommercialProductData, remoteActions } from '../datasources';

export { QueryStatus } from 'react-query';

export function useCommercialProductData(
	ids: string[]
): {
	status: QueryStatus;
	data?: CommercialProductData;
} {
	const { status, data } = useQuery(
		['commercialProductData', ids],
		() => remoteActions.getCommercialProductData(ids),
		{
			enabled: ids.length > 0
		}
	);

	return {
		status,
		data
	};
}
