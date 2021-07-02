import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { mockAppSettings, mockProductIds } from '../datasources/mock-data';
import { PricingServiceGraphQL } from '../datasources/graphql-endpoints';
import { useProductIdsInDefaultCatalogue } from './use-productIds-in-default-catalogue';
import * as appSettings from './use-app-settings';
import {
	CommercialProductRole,
	CommercialProductType
} from '../datasources/graphql-endpoints/interface';
import {
	ERROR_DEFAULT_CATALOGUE_NOT_DEFINED,
	ERROR_DISPATCHER_URL_MISSING
} from '../constants/errors';

describe('test useProductIdsInDefaultCatalogue hook', () => {
	jest.mock('../datasources/graphql-endpoints/pricing-service-graphql');

	test('returns productIds and calls queryProductIdsInCatalogue once', async () => {
		jest.spyOn(appSettings, 'useAppSettings').mockImplementation(
			jest.fn(() => {
				return { status: QueryStatus.Success, settings: mockAppSettings };
			})
		);

		const queryProductsSpy = jest
			.spyOn(PricingServiceGraphQL.prototype, 'queryProductIdsInCatalogue')
			.mockReturnValueOnce(Promise.resolve(mockProductIds));
		const fakeFilter = {
			role: CommercialProductRole.basic,
			type: CommercialProductType.commercialProduct
		};

		const { result, waitFor } = renderHook(() => useProductIdsInDefaultCatalogue(fakeFilter));
		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});

		expect(result.current.productIds).toEqual(mockProductIds);
		expect(queryProductsSpy.mock.calls.length).toBe(1);
	});

	test('throw error when dispatcher url is not configured in FAC Settings', async () => {
		jest.spyOn(appSettings, 'useAppSettings').mockImplementation(
			jest.fn(() => {
				return {
					status: QueryStatus.Success,
					settings: {
						...mockAppSettings,
						facSettings: { ...mockAppSettings.facSettings, dispatcherServiceUrl: '' }
					}
				};
			})
		);

		const fakeFilter = {
			role: CommercialProductRole.basic,
			type: CommercialProductType.commercialProduct
		};

		const { result } = renderHook(() => useProductIdsInDefaultCatalogue(fakeFilter));

		expect(result.error.message).toEqual(ERROR_DISPATCHER_URL_MISSING);
	});

	test('throw error when default catalogue id is not defined in JSON data', async () => {
		jest.spyOn(appSettings, 'useAppSettings').mockImplementation(
			jest.fn(() => {
				return {
					status: QueryStatus.Success,
					settings: {
						...mockAppSettings,
						defaultCatalogueId: ''
					}
				};
			})
		);

		const fakeFilter = {
			role: CommercialProductRole.basic,
			type: CommercialProductType.commercialProduct
		};

		const { result } = renderHook(() => useProductIdsInDefaultCatalogue(fakeFilter));

		expect(result.error.message).toEqual(ERROR_DEFAULT_CATALOGUE_NOT_DEFINED);
	});
});
