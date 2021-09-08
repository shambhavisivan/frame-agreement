import { QueryStatus, useQuery } from 'react-query';
import { QueryKeys } from '../app-constants';
import { PricingServiceGraphQL } from '../datasources/graphql-endpoints';
import { DispatcherService } from '../datasources/graphql-endpoints/dispatcher-service';
import {
	PricingServiceApi,
	ProductFilter,
	ProductsInCategoryData
} from '../datasources/graphql-endpoints/interface';
import { useAppSettings } from './use-app-settings';

export function useProductsInCategory(
	categoryId: string,
	filter: ProductFilter
): {
	products: ProductsInCategoryData[] | undefined;
	productStatus: QueryStatus;
} {
	const { settings } = useAppSettings();
	const isPsEnabled = settings?.facSettings.isPsEnabled;

	const pricingServiceApi: PricingServiceApi = new PricingServiceGraphQL(
		new DispatcherService(settings?.facSettings.dispatcherServiceUrl)
	);

	const { data, status } = useQuery(
		[QueryKeys.productsInCategory, categoryId, filter.role, filter.type],
		() => pricingServiceApi.queryProductsInCategory(categoryId, filter),
		{ enabled: isPsEnabled && categoryId }
	);

	return {
		products: data,
		productStatus: status
	};
}
