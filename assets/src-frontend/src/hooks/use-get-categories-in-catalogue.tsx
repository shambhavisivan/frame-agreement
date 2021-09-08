import { QueryStatus, useQuery } from 'react-query';
import { QueryKeys } from '../app-constants';
import { PricingServiceGraphQL } from '../datasources/graphql-endpoints';
import { DispatcherService } from '../datasources/graphql-endpoints/dispatcher-service';
import { CategoriesInCatalogueData } from '../datasources/graphql-endpoints/interface';
import { useAppSettings } from './use-app-settings';

type Category = CategoriesInCatalogueData;

export function useGetCategoriesInCatalogue(
	catalogueId: string
): { categoryList: Category[] | undefined; status: QueryStatus } {
	const { settings } = useAppSettings();
	const isPsEnabled = settings?.facSettings?.isPsEnabled;
	const pricingServiceApi = new PricingServiceGraphQL(
		new DispatcherService(settings?.facSettings?.dispatcherServiceUrl)
	);

	const { data, status } = useQuery(
		[QueryKeys.categoriesInCatalogue, catalogueId],
		() => pricingServiceApi.queryCategoriesInCatalogue(catalogueId),
		{
			enabled: isPsEnabled && catalogueId
		}
	);

	return {
		categoryList: data,
		status: status
	};
}
