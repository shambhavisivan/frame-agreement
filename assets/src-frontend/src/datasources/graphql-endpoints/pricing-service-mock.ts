import {
	mockCategoriesInCatalogue,
	mockOffersInCategory,
	mockProductIds,
	mockProductsByIds,
	mockProductsInCategory
} from '../mock-data';
import { DispatcherService } from './dispatcher-service';
import {
	CategoriesInCatalogueData,
	CommercialProductRole,
	PricingServiceApi,
	ProductFilter,
	ProductsByIdsData,
	ProductsInCategoryData
} from './interface';

/**
 * This is the mock implementation for the graphql queries to support running the app locally.
 *
 * Note: This class is named same as the original class so that webpack can replace the original
 * file and use this class without any issues.
 */
export class PricingServiceGraphQL implements PricingServiceApi {
	constructor(private _dispatcherService: DispatcherService) {}

	queryProductIdsInCatalogue(catalogueId: string, filter: ProductFilter): Promise<string[]> {
		return Promise.resolve(mockProductIds);
	}

	queryCategoriesInCatalogue(catalogueId: string): Promise<CategoriesInCatalogueData[]> {
		return Promise.resolve(mockCategoriesInCatalogue);
	}

	queryProductsInCategory(
		categoryId: string,
		filter: ProductFilter
	): Promise<ProductsInCategoryData[]> {
		const mockResponse = filter.role?.has(CommercialProductRole.basic)
			? mockProductsInCategory[categoryId]
			: mockOffersInCategory[categoryId];
		return Promise.resolve(mockResponse);
	}

	queryProductsByIds(productIds: string[]): Promise<ProductsByIdsData[]> {
		return Promise.resolve(mockProductsByIds);
	}
}
