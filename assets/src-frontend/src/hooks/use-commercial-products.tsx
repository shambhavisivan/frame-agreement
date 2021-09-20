import { QueryStatus, useQuery } from 'react-query';
import { CommercialProductStandalone, remoteActions } from '../datasources';
import {
	CommercialProductRole,
	CommercialProductType,
	ProductFilter
} from '../datasources/graphql-endpoints/interface';
import { useProductIdsInDefaultCatalogue } from './use-productIds-in-default-catalogue';

export function useCommercialProducts(
	filterIds: Array<string> | undefined
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

	const { status, data } = useQuery(
		['commercialProducts', productIdsFilter],
		() => remoteActions.getCommercialProducts(productIdsFilter),
		{ enabled: typeof filterIds !== 'undefined' }
	);

	return {
		status,
		data
	};
}
