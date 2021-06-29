import { DispatcherService } from './dispatcher-service';
import {
	CategoriesInCatalogueData,
	CategoriesInCatalogueResponse,
	PricingServiceApi,
	ProductFilter,
	ProductsByIdsData,
	ProductsByIdsResponse,
	ProductsInCatalogueResponse,
	ProductsInCategoryData,
	ProductsInCategoryResponse
} from './interface';
import {
	CATEGORIES_IN_CATALOGUE,
	PRODUCTS_IN_CATALOGUE,
	PRODUCTS_IN_CATEGORY,
	PRODUCT_DATA_BY_IDS
} from './pricing-service-queries';

export class PricingServiceGraphQL implements PricingServiceApi {
	constructor(private _dispatcherService: DispatcherService) {}

	async queryProductIdsInCatalogue(
		catalogueId: string,
		filter: ProductFilter
	): Promise<string[]> {
		const variables = {
			catalogueId: catalogueId
		};

		try {
			const response = await this._dispatcherService.queryData(
				PRODUCTS_IN_CATALOGUE,
				variables
			);
			if (!response.isSuccess) {
				throw new Error(response.errorMessage?.join(', '));
			} else {
				const productsInCatalogueResponse: ProductsInCatalogueResponse = response.data as ProductsInCatalogueResponse;
				return productsInCatalogueResponse.productsInCatalogue.data
					.filter((cp) => cp.role && cp.role === filter.role && cp.type === filter.type)
					.map((cp) => cp.id);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async queryCategoriesInCatalogue(catalogueId: string): Promise<CategoriesInCatalogueData[]> {
		const variables = {
			catalogueId
		};

		try {
			const response = await this._dispatcherService.queryData(
				CATEGORIES_IN_CATALOGUE,
				variables
			);

			if (!response.isSuccess) {
				throw new Error(response.errorMessage?.join(', '));
			} else {
				const categoriesInCatalogueResponse: CategoriesInCatalogueResponse = response.data as CategoriesInCatalogueResponse;
				return categoriesInCatalogueResponse.categories.data;
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async queryProductsInCategory(
		categoryId: string,
		filter: ProductFilter
	): Promise<ProductsInCategoryData[]> {
		const variables = {
			categoryId: categoryId
		};

		try {
			const response = await this._dispatcherService.queryData(
				PRODUCTS_IN_CATEGORY,
				variables
			);

			if (!response.isSuccess) {
				throw new Error(response.errorMessage?.join(', '));
			} else {
				const productsInCategoryResponse: ProductsInCategoryResponse = response.data as ProductsInCategoryResponse;
				return productsInCategoryResponse.productsInCategory.data.filter(
					(cp) => cp.role && cp.role === filter.role && cp.type === filter.type
				);
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async queryProductsByIds(productIds: string[]): Promise<ProductsByIdsData[]> {
		const variables = {
			productIds
		};

		try {
			const response = await this._dispatcherService.queryData(
				PRODUCT_DATA_BY_IDS,
				variables
			);

			if (!response.isSuccess) {
				throw new Error(response.errorMessage?.join(', '));
			} else {
				const productsByIdsResponse: ProductsByIdsResponse = response.data as ProductsByIdsResponse;
				return productsByIdsResponse.productsByIds;
			}
		} catch (error) {
			throw new Error(error.message);
		}
	}
}
