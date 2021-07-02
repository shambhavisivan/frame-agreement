import { QueryStatus, useQuery } from 'react-query';
import { CommercialProductStandalone, remoteActions } from '../datasources';
import {
	CommercialProductRole,
	CommercialProductType,
	ProductFilter
} from '../datasources/graphql-endpoints/interface';
import { useProductIdsInDefaultCatalogue } from './use-productIds-in-default-catalogue';

export function useCommercialProducts(): {
	status: QueryStatus;
	data?: CommercialProductStandalone[];
} {
	const filter: ProductFilter = {
		role: CommercialProductRole.basic,
		type: CommercialProductType.commercialProduct
	};

	const { productIds } = useProductIdsInDefaultCatalogue(filter);

	const { status, data } = useQuery(['commercialProducts', productIds], () =>
		remoteActions.getCommercialProducts(productIds)
	);

	return {
		status,
		data
	};
}
