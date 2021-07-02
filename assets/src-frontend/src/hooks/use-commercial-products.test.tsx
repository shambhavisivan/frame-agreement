import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { mockCommercialProducts, mockProductIds } from '../datasources/mock-data';
import * as productsInDefaultCatalogue from './use-productIds-in-default-catalogue';
import { remoteActions } from '../datasources/remote-actions-salesforce';
import { useCommercialProducts } from './use-commercial-products';
import {
	CommercialProductRole,
	CommercialProductType
} from '../datasources/graphql-endpoints/interface';

describe('test useCommercialProducts hook', () => {
	const getCommercialProductsSpy = jest
		.spyOn(remoteActions, 'getCommercialProducts')
		.mockImplementation(jest.fn(() => Promise.resolve(mockCommercialProducts)));

	const useProductIdsSpy = jest
		.spyOn(productsInDefaultCatalogue, 'useProductIdsInDefaultCatalogue')
		.mockImplementation(
			jest.fn(() => {
				return { status: QueryStatus.Success, productIds: mockProductIds };
			})
		);

	test('returns commercial products and calls getCommercialProducts once', async () => {
		const { result, waitFor } = renderHook(() => useCommercialProducts());
		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});

		expect(result.current.data).toEqual(mockCommercialProducts);
		expect(useProductIdsSpy).toHaveBeenCalledWith({
			role: CommercialProductRole.basic,
			type: CommercialProductType.commercialProduct
		});
		expect(getCommercialProductsSpy.mock.calls.length).toBe(1);
		expect(getCommercialProductsSpy).toHaveBeenCalledWith(mockProductIds);
	});
});
