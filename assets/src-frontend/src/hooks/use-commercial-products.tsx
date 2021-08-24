import { QueryStatus, useQuery } from 'react-query';
import { CommercialProductStandalone, remoteActions } from '../datasources';
import {
	CommercialProductRole,
	CommercialProductType,
	ProductFilter
} from '../datasources/graphql-endpoints/interface';
import { useProductIdsInDefaultCatalogue } from './use-productIds-in-default-catalogue';

export function useCommercialProducts(
	filterIds: Array<string> = []
): {
	status: QueryStatus;
	data?: CommercialProductStandalone[];
} {
	const filter: ProductFilter = {
		role: CommercialProductRole.basic,
		type: CommercialProductType.commercialProduct
	};

	const { productIds } = useProductIdsInDefaultCatalogue(filter);
	// to prevent duplicates if any
	const productIdsFilter = Array.from(new Set([...filterIds, ...productIds]));

	const { status, data } = useQuery(['commercialProducts', productIdsFilter], () =>
		remoteActions.getCommercialProducts(productIdsFilter)
	);

	return {
		status,
		data
	};
}
