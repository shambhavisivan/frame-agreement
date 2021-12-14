import { QueryStatus, useQuery } from 'react-query';
import { CommercialProductStandalone, remoteActions } from '../datasources';
import { useProductIdsInDefaultCatalogue } from './use-productIds-in-default-catalogue';
import { cpFilter as filter } from '../app-constants';

export function useCommercialProducts(
	filterIds: Array<string> = [],
	filterFields: string | null = null,
	lastRecordId: string | null = null,
	queryLimit = 0,
	alreadyAddedIds: Array<string> = []
): {
	status: QueryStatus;
	data?: CommercialProductStandalone[];
} {
	const { productIds } = useProductIdsInDefaultCatalogue(filter);
	// to avoid filter and default catalogue filter mixing up
	const productIdsFilter = filterIds?.length ? filterIds : productIds.length ? productIds : [];
	// converting filter string to the form : {"Name":"LX12"} and strigifying it as needed by queryProducts Apex api
	const filterContent: string | null = filterFields
		? JSON.stringify({
				name: filterFields
		  })
		: filterFields;

	const { status, data } = useQuery(
		[
			'commercialProducts',
			productIdsFilter,
			filterContent,
			lastRecordId,
			queryLimit,
			alreadyAddedIds
		],
		() =>
			remoteActions.queryProducts(
				productIdsFilter,
				filterContent,
				lastRecordId,
				queryLimit,
				alreadyAddedIds
			)
	);

	return {
		status,
		data
	};
}
