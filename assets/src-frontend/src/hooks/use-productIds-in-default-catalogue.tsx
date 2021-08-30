import { QueryStatus, useQuery } from 'react-query';
import { ERROR_DEFAULT_CATALOGUE_NOT_DEFINED } from '../constants/errors';
import { PricingServiceGraphQL } from '../datasources/graphql-endpoints';
import { DispatcherService } from '../datasources/graphql-endpoints/dispatcher-service';
import { PricingServiceApi, ProductFilter } from '../datasources/graphql-endpoints/interface';
import { useAppSettings } from './use-app-settings';

export function useProductIdsInDefaultCatalogue(
	filter: ProductFilter
): {
	status: QueryStatus;
	productIds: string[] | [];
} {
	const { settings } = useAppSettings();
	const dispatcherServiceUrl = settings?.facSettings?.dispatcherServiceUrl;
	const pricingServiceApi: PricingServiceApi = new PricingServiceGraphQL(
		new DispatcherService(dispatcherServiceUrl)
	);

	const isPsEnabled = Boolean(settings?.facSettings.isPsEnabled);
	// if isPsEnabled false does not require the defaultCatalogueId error.
	const defaultCatalogueId = settings?.defaultCatalogueId || !isPsEnabled;

	if (!defaultCatalogueId) {
		throw Error(ERROR_DEFAULT_CATALOGUE_NOT_DEFINED);
	}

	const { status, data } = useQuery(
		['productIds', defaultCatalogueId, filter.role, filter.type],
		() => pricingServiceApi.queryProductIdsInCatalogue(defaultCatalogueId as string, filter),
		{
			enabled: isPsEnabled
		}
	);

	return {
		status,
		productIds: data || []
	};
}
