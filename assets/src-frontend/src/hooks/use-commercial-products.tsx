import { QueryStatus, useQuery } from 'react-query';
import { CommercialProductStandalone, remoteActions } from '../datasources';

export { QueryStatus } from 'react-query';

export function useCommercialProducts(
	getCommercialProducts: () => Promise<
		CommercialProductStandalone[]
	> = remoteActions.getCommercialProducts
): {
	status: QueryStatus;
	data?: CommercialProductStandalone[];
} {
	const { status, data } = useQuery('commercialProducts', getCommercialProducts);

	return {
		status,
		data
	};
}
