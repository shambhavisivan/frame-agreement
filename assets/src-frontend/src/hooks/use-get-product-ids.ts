import { QueryStatus, useQuery } from 'react-query';
import { remoteActions } from '../datasources';
import {
	CommercialProductRole,
	CommercialProductType,
	ProductFilter
} from '../datasources/graphql-endpoints/interface';
import { useProductIdsInDefaultCatalogue } from './use-productIds-in-default-catalogue';

export function useGetProductIds(
	filterIds: Array<string> = [],
	filterString: string | null = null
): {
	itemIdsStatus: QueryStatus;
	itemIds?: string[];
} {
	const filter: ProductFilter = {
		role: CommercialProductRole.basic,
		type: CommercialProductType.commercialProduct
	};

	const { productIds } = useProductIdsInDefaultCatalogue(filter);
	// to avoid filter and default catalogue filter mixing up
	const productIdsFilter = filterIds.length ? filterIds : productIds.length ? productIds : [];
	// converting filter string to the form : {"Name":"LX12"} and strigifying it as needed by queryProducts Apex api
	const filterContent: string | null = filterString
		? JSON.stringify({
				name: filterString
		  })
		: filterString;

	const { status, data } = useQuery([productIdsFilter, filterContent], () =>
		remoteActions.getProductIds(productIdsFilter, filterContent)
	);

	return {
		itemIdsStatus: status,
		itemIds: data
	};
}
