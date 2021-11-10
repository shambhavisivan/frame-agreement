import { QueryStatus, useQuery } from 'react-query';
import { CommercialProductStandalone, remoteActions } from '../datasources';
import {
	CommercialProductRole,
	CommercialProductType,
	ProductFilter
} from '../datasources/graphql-endpoints/interface';
import { useProductIdsInDefaultCatalogue } from './use-productIds-in-default-catalogue';

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
	const filter: ProductFilter = {
		role: CommercialProductRole.basic,
		type: CommercialProductType.commercialProduct
	};

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
