import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { AppSettings } from '../datasources';
import {
	CommercialProductRole,
	CommercialProductType
} from '../datasources/graphql-endpoints/interface';
import { PricingServiceGraphQL } from '../datasources/graphql-endpoints/pricing-service-graphql';
import { mockAppSettings, productsInCategoryMock } from '../datasources/mock-data';
import * as appSettings from './use-app-settings';
import { useProductsInCategory } from './use-products-in-category';

describe('useProductsInCategory test', () => {
	jest.mock('../datasources/graphql-endpoints/pricing-service-graphql');
	const mockFilter = {
		role: CommercialProductRole.basic,
		type: CommercialProductType.commercialProduct
	};
	const queryProductsSpy = jest
		.spyOn(PricingServiceGraphQL.prototype, 'queryProductsInCategory')
		.mockReturnValueOnce(Promise.resolve(productsInCategoryMock));
	const appSettingsSpy = jest.spyOn(appSettings, 'useAppSettings');

	afterEach(() => {
		queryProductsSpy.mockClear();
		appSettingsSpy.mockClear();
	});

	test('call queryProductsWith required params', async () => {
		appSettingsSpy.mockImplementation(
			jest.fn(() => {
				return { status: appSettings.QueryStatus.Success, settings: mockAppSettings };
			})
		);

		const { waitFor, result } = renderHook(() =>
			useProductsInCategory('mockCategoryId', mockFilter)
		);

		await waitFor(() => result.current.productStatus === QueryStatus.Success);

		expect(queryProductsSpy).toHaveBeenCalledTimes(1);
		expect(result.current.products).toEqual(productsInCategoryMock);
	});

	test('should not call remoteAction of isPsEnabled = false', async () => {
		const setting: AppSettings = mockAppSettings;

		appSettingsSpy.mockImplementation(
			jest.fn(() => {
				return {
					status: QueryStatus.Success,
					settings: {
						...setting,
						facSettings: { ...setting.facSettings, isPsEnabled: false }
					}
				};
			})
		);

		const { waitFor, result } = renderHook(() =>
			useProductsInCategory('mockCategoryIdPsDisabled', mockFilter)
		);

		await waitFor(() => result.current.productStatus === QueryStatus.Idle);

		expect(queryProductsSpy).not.toHaveBeenCalled();
		expect(result.current.products).toBeUndefined();
	});

	test('should not call remoteAction if categoryId is empty', async () => {
		appSettingsSpy.mockImplementation(
			jest.fn(() => {
				return { status: appSettings.QueryStatus.Success, settings: mockAppSettings };
			})
		);

		const { waitFor, result } = renderHook(() => useProductsInCategory('', mockFilter));

		await waitFor(() => result.current.productStatus === QueryStatus.Idle);

		expect(queryProductsSpy).not.toHaveBeenCalled();
		expect(result.current.products).toBeUndefined();
	});
});
