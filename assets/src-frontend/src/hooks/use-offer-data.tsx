import { QueryStatus, useQuery } from 'react-query';
import { CommercialProductData, remoteActions } from '../datasources';

export function useOfferData(
	ids: string[],
	addonIds: string[] | null
): {
	status: QueryStatus;
	data?: CommercialProductData;
} {
	const { status, data } = useQuery(
		['offerData', ids, addonIds],
		() => remoteActions.getOfferData(ids, addonIds),
		{
			enabled: ids.length > 0
		}
	);

	return {
		status,
		data
	};
}
