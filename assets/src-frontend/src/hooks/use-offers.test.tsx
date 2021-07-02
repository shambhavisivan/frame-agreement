import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { mockOffers, mockProductIds } from '../datasources/mock-data';
import * as productsFromPrs from './use-productIds-in-default-catalogue';
import { remoteActions } from '../datasources/remote-actions-salesforce';
import {
	CommercialProductRole,
	CommercialProductType
} from '../datasources/graphql-endpoints/interface';
import { useOffers } from './use-offers';

describe('test useOffers hook', () => {
	const getOffersSpy = jest
		.spyOn(remoteActions, 'getOffers')
		.mockImplementation(jest.fn(() => Promise.resolve(mockOffers)));

	const useProductIdsSpy = jest
		.spyOn(productsFromPrs, 'useProductIdsInDefaultCatalogue')
		.mockImplementation(
			jest.fn(() => {
				return { status: QueryStatus.Success, productIds: mockProductIds };
			})
		);

	test('returns offers and calls getOffers once', async () => {
		const { result, waitFor } = renderHook(() => useOffers());
		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});

		expect(result.current.data).toEqual(mockOffers);
		expect(useProductIdsSpy).toHaveBeenCalledWith({
			role: CommercialProductRole.offer,
			type: CommercialProductType.commercialProduct
		});
		expect(getOffersSpy.mock.calls.length).toBe(1);
		expect(getOffersSpy).toHaveBeenCalledWith(mockProductIds);
	});
});
