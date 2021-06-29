import {
	mockCategoriesInCatalogue,
	mockCategoriesInCatalogueResponse,
	mockOffersInCategory,
	mockOffersInCategoryResponse,
	mockProductIds,
	mockProductsByIds,
	mockProductsByIdsResponse,
	mockProductsInCatalogueResponse,
	mockProductsInCategory,
	mockProductsInCategoryResponse
} from '../mock-data';
import { DispatcherService } from './dispatcher-service';
import { CommercialProductRole, CommercialProductType, PricingServiceApi } from './interface';
import { PricingServiceGraphQL } from './pricing-service-graphql';
import {
	CATEGORIES_IN_CATALOGUE,
	PRODUCTS_IN_CATALOGUE,
	PRODUCTS_IN_CATEGORY,
	PRODUCT_DATA_BY_IDS
} from './pricing-service-queries';

describe('PricingServiceGraphQL', () => {
	jest.mock('./dispatcher-service');
	let pricingServiceAPI: PricingServiceApi;
	const testCatalogueId = 'testCatalogue0000';

	beforeEach(() => {
		/*
		 * We will mock the dispatcher service in the tests. Hence passing empty
		 * string to dispatcher service as url will not harm.
		 */
		pricingServiceAPI = new PricingServiceGraphQL(new DispatcherService(''));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('queryProductIdsInCatalogue', () => {
		test('should return commercial product basic ids in the given catalogue', async () => {
			const productFilter = {
				type: CommercialProductType.commercialProduct,
				role: CommercialProductRole.basic
			};

			DispatcherService.prototype.queryData = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(mockProductsInCatalogueResponse);
			});
			const queryDataSpy = jest.spyOn(DispatcherService.prototype, 'queryData');

			const response = await pricingServiceAPI.queryProductIdsInCatalogue(
				testCatalogueId,
				productFilter
			);

			expect(queryDataSpy).toHaveBeenCalledTimes(1);
			expect(queryDataSpy).toHaveBeenCalledWith(PRODUCTS_IN_CATALOGUE, {
				catalogueId: testCatalogueId
			});
			expect(response).toEqual([mockProductIds[1]]);
		});

		test('should return commercial product offer ids in the given catalogue', async () => {
			const productFilter = {
				type: CommercialProductType.commercialProduct,
				role: CommercialProductRole.offer
			};

			DispatcherService.prototype.queryData = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(mockProductsInCatalogueResponse);
			});
			const queryDataSpy = jest.spyOn(DispatcherService.prototype, 'queryData');

			const response = await pricingServiceAPI.queryProductIdsInCatalogue(
				testCatalogueId,
				productFilter
			);

			expect(queryDataSpy).toHaveBeenCalledTimes(1);
			expect(queryDataSpy).toHaveBeenCalledWith(PRODUCTS_IN_CATALOGUE, {
				catalogueId: testCatalogueId
			});
			expect(response).toEqual([mockProductIds[0]]);
		});

		test('should throw error when there is error fetching products', async () => {
			const productFilter = {
				type: CommercialProductType.commercialProduct,
				role: CommercialProductRole.offer
			};
			const mockErrorMessage = 'Mock Error Message';

			DispatcherService.prototype.queryData = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve({ isSuccess: false, errorMessage: [mockErrorMessage] });
			});
			const queryDataSpy = jest.spyOn(DispatcherService.prototype, 'queryData');

			await expect(
				pricingServiceAPI.queryProductIdsInCatalogue(testCatalogueId, productFilter)
			).rejects.toThrow(new Error(mockErrorMessage));

			expect(queryDataSpy).toHaveBeenCalledTimes(1);
			expect(queryDataSpy).toHaveBeenCalledWith(PRODUCTS_IN_CATALOGUE, {
				catalogueId: testCatalogueId
			});
		});
	});

	describe('queryCatagoriesInCatalogue', () => {
		test('should return categories in the given catalogue', async () => {
			DispatcherService.prototype.queryData = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(mockCategoriesInCatalogueResponse);
			});
			const queryDataSpy = jest.spyOn(DispatcherService.prototype, 'queryData');

			const response = await pricingServiceAPI.queryCategoriesInCatalogue(testCatalogueId);

			expect(queryDataSpy).toHaveBeenCalledTimes(1);
			expect(queryDataSpy).toHaveBeenCalledWith(CATEGORIES_IN_CATALOGUE, {
				catalogueId: testCatalogueId
			});
			expect(response).toEqual(mockCategoriesInCatalogue);
		});

		test('should throw error when there is error fetching categories', async () => {
			const mockErrorMessage = 'Mock Error Message';

			DispatcherService.prototype.queryData = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve({ isSuccess: false, errorMessage: [mockErrorMessage] });
			});
			const queryDataSpy = jest.spyOn(DispatcherService.prototype, 'queryData');

			await expect(
				pricingServiceAPI.queryCategoriesInCatalogue(testCatalogueId)
			).rejects.toThrow(new Error(mockErrorMessage));

			expect(queryDataSpy).toHaveBeenCalledTimes(1);
			expect(queryDataSpy).toHaveBeenCalledWith(CATEGORIES_IN_CATALOGUE, {
				catalogueId: testCatalogueId
			});
		});
	});

	describe('queryProductsInCategory', () => {
		test('should return commercial product basic ids in the given category', async () => {
			const testCategoryId = 'categoryid1';
			const productFilter = {
				type: CommercialProductType.commercialProduct,
				role: CommercialProductRole.basic
			};

			DispatcherService.prototype.queryData = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(mockProductsInCategoryResponse);
			});
			const queryDataSpy = jest.spyOn(DispatcherService.prototype, 'queryData');

			const response = await pricingServiceAPI.queryProductsInCategory(
				testCategoryId,
				productFilter
			);

			expect(queryDataSpy).toHaveBeenCalledTimes(1);
			expect(queryDataSpy).toHaveBeenCalledWith(PRODUCTS_IN_CATEGORY, {
				categoryId: testCategoryId
			});
			expect(response).toEqual(mockProductsInCategory[testCategoryId]);
		});

		test('should return commercial product offer ids in the given category', async () => {
			const testCategoryId = 'categoryid2';
			const productFilter = {
				type: CommercialProductType.commercialProduct,
				role: CommercialProductRole.offer
			};

			DispatcherService.prototype.queryData = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(mockOffersInCategoryResponse);
			});
			const queryDataSpy = jest.spyOn(DispatcherService.prototype, 'queryData');

			const response = await pricingServiceAPI.queryProductsInCategory(
				testCategoryId,
				productFilter
			);

			expect(queryDataSpy).toHaveBeenCalledTimes(1);
			expect(queryDataSpy).toHaveBeenCalledWith(PRODUCTS_IN_CATEGORY, {
				categoryId: testCategoryId
			});
			expect(response).toEqual(mockOffersInCategory[testCategoryId]);
		});

		test('should throw error when there is error fetching products in category', async () => {
			const testCategoryId = 'categoryid1';
			const productFilter = {
				type: CommercialProductType.commercialProduct,
				role: CommercialProductRole.basic
			};
			const mockErrorMessage = 'Mock Error Message';

			DispatcherService.prototype.queryData = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve({ isSuccess: false, errorMessage: [mockErrorMessage] });
			});
			const queryDataSpy = jest.spyOn(DispatcherService.prototype, 'queryData');

			await expect(
				pricingServiceAPI.queryProductsInCategory(testCategoryId, productFilter)
			).rejects.toThrow(new Error(mockErrorMessage));

			expect(queryDataSpy).toHaveBeenCalledTimes(1);
			expect(queryDataSpy).toHaveBeenCalledWith(PRODUCTS_IN_CATEGORY, {
				categoryId: testCategoryId
			});
		});
	});

	describe('queryProductsByIds', () => {
		const testProductIds: string[] = ['a1F1t0000001J ̰BjEAM'];
		test('should return commercial products with given ids', async () => {
			DispatcherService.prototype.queryData = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve(mockProductsByIdsResponse);
			});
			const queryDataSpy = jest.spyOn(DispatcherService.prototype, 'queryData');

			const response = await pricingServiceAPI.queryProductsByIds(testProductIds);

			expect(queryDataSpy).toHaveBeenCalledTimes(1);
			expect(queryDataSpy).toHaveBeenCalledWith(PRODUCT_DATA_BY_IDS, {
				productIds: testProductIds
			});
			expect(response).toEqual(mockProductsByIds);
		});

		test('should throw error when there is error fetching products by ids', async () => {
			const mockErrorMessage = 'Mock Error Message';

			DispatcherService.prototype.queryData = jest.fn().mockImplementationOnce(() => {
				return Promise.resolve({ isSuccess: false, errorMessage: [mockErrorMessage] });
			});
			const queryDataSpy = jest.spyOn(DispatcherService.prototype, 'queryData');

			await expect(pricingServiceAPI.queryProductsByIds(testProductIds)).rejects.toThrow(
				new Error(mockErrorMessage)
			);

			expect(queryDataSpy).toHaveBeenCalledTimes(1);
			expect(queryDataSpy).toHaveBeenCalledWith(PRODUCT_DATA_BY_IDS, {
				productIds: testProductIds
			});
		});
	});
});
