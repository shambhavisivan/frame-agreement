import { QueryStatus, useQuery } from 'react-query';
import { QueryKeys } from '../app-constants';
import { AppSettings, CommercialProductStandalone, remoteActions } from '../datasources';

export function useFilterCommercialProduct(
	filterData: AppSettings['categorizationData']
): {
	filteredCp: CommercialProductStandalone[] | undefined;
	filterCpStatus: QueryStatus;
} {
	// to make react-query more efficient this keys are generated
	const keys = filterData.map((data) => data.field);
	const values = filterData.map((data) => data.values);

	const { data, status } = useQuery(
		[QueryKeys.filterCommercialProduct, keys, values],
		() => remoteActions.filterCommercialProducts(JSON.stringify(filterData)),
		{ enabled: keys?.length && values?.length }
	);

	return {
		filteredCp: data,
		filterCpStatus: status
	};
}
