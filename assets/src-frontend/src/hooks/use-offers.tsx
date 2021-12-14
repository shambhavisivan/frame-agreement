import { QueryStatus, useQuery } from 'react-query';
import { CommercialProductStandalone, remoteActions } from '../datasources';
import {
	CommercialProductRole,
	CommercialProductType,
	ProductFilter
} from '../datasources/graphql-endpoints/interface';
import { useProductIdsInDefaultCatalogue } from './use-productIds-in-default-catalogue';

export function useOffers(): {
	status: QueryStatus;
	data?: CommercialProductStandalone[];
} {
	const filter: ProductFilter = {
		role: new Set<CommercialProductRole>([CommercialProductRole.offer]),
		type: CommercialProductType.commercialProduct
	};

	const { productIds } = useProductIdsInDefaultCatalogue(filter);
	const { status, data } = useQuery(['offers', productIds], () =>
		remoteActions.getOffers(productIds)
	);

	return {
		status,
		data
	};
}
