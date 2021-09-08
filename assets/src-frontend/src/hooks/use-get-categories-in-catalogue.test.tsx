import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { AppSettings } from '../datasources';
import { PricingServiceGraphQL } from '../datasources/graphql-endpoints/pricing-service-graphql';
import { categoriesInCatalogue, mockAppSettings } from '../datasources/mock-data';
import * as appSettings from './use-app-settings';
import { useGetCategoriesInCatalogue } from './use-get-categories-in-catalogue';

describe('useGetCategoriesInCatalogue test', () => {
	jest.mock('../datasources/graphql-endpoints/pricing-service-graphql');

	const queryCategoriesInCatalogueSpy = jest
		.spyOn(PricingServiceGraphQL.prototype, 'queryCategoriesInCatalogue')
		.mockReturnValueOnce(Promise.resolve(categoriesInCatalogue));
	const appSettingsSpy = jest.spyOn(appSettings, 'useAppSettings');

	afterEach(() => {
		queryCategoriesInCatalogueSpy.mockClear();
		appSettingsSpy.mockClear();
	});

	test('should call queryCategoriesInCatalogueSpy', async () => {
		appSettingsSpy.mockImplementation(
			jest.fn(() => {
				return { status: appSettings.QueryStatus.Success, settings: mockAppSettings };
			})
		);

		const { result, waitFor } = renderHook(() =>
			useGetCategoriesInCatalogue('catalogueIdMock')
		);

		await waitFor(() => result.current.status === QueryStatus.Success);

		expect(queryCategoriesInCatalogueSpy).toHaveBeenCalledTimes(1);
		expect(result.current.categoryList).toEqual(categoriesInCatalogue);
	});

	test('should not call queryCategoriesInCatalogueSpy if isPsEnabled = false', async () => {
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
			useGetCategoriesInCatalogue('mockCatalogueIdPsDisabled')
		);

		await waitFor(() => result.current.status === QueryStatus.Idle);

		expect(queryCategoriesInCatalogueSpy).not.toHaveBeenCalled();
		expect(result.current.categoryList).toBeUndefined();
	});

	test('should not call queryCategoriesInCatalogueSpy if catalogueId is empty', async () => {
		appSettingsSpy.mockImplementation(
			jest.fn(() => {
				return { status: appSettings.QueryStatus.Success, settings: mockAppSettings };
			})
		);

		const { waitFor, result } = renderHook(() => useGetCategoriesInCatalogue(''));

		await waitFor(() => result.current.status === QueryStatus.Idle);

		expect(queryCategoriesInCatalogueSpy).not.toHaveBeenCalled();
		expect(result.current.categoryList).toBeUndefined();
	});
});
