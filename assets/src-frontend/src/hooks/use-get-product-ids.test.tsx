import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { mockProductIds } from '../datasources/mock-data';
import * as productsInDefaultCatalogue from './use-productIds-in-default-catalogue';
import { remoteActions } from '../datasources/remote-actions-salesforce';
import { useGetProductIds } from './use-get-product-ids';
import {
	CommercialProductRole,
	CommercialProductType
} from '../datasources/graphql-endpoints/interface';

describe('useGetProductIds hook', () => {
	const getProductIdsSpy = jest
		.spyOn(remoteActions, 'getProductIds')
		.mockImplementation((productIdsFilter, filterString) => {
			if (filterString) {
				return Promise.resolve(['id-1']);
			} else if (productIdsFilter.length) {
				return Promise.resolve(productIdsFilter);
			} else {
				return Promise.resolve(mockProductIds);
			}
		});

	const useProductIdsSpy = jest
		.spyOn(productsInDefaultCatalogue, 'useProductIdsInDefaultCatalogue')
		.mockImplementation(
			jest.fn(() => {
				return { status: QueryStatus.Success, productIds: mockProductIds };
			})
		);

	afterEach(() => {
		getProductIdsSpy.mockClear();
	});

	test('should return ids of commercial products', async () => {
		const { result, waitFor } = renderHook(() => useGetProductIds());
		await waitFor(() => {
			return result.current.itemIdsStatus === QueryStatus.Success;
		});

		expect(result.current.itemIds).toEqual(mockProductIds);
		expect(result.current.itemIds?.length).toEqual(10);
		expect(useProductIdsSpy).toHaveBeenCalledWith({
			role: CommercialProductRole.basic,
			type: CommercialProductType.commercialProduct
		});
		expect(getProductIdsSpy.mock.calls.length).toBe(1);
		expect(getProductIdsSpy).toHaveBeenCalledWith(mockProductIds, null);
	});

	test('should return ids of commercial products that match filterIds passed', async () => {
		const { result, waitFor } = renderHook(() => useGetProductIds(['id-2'], ''));
		await waitFor(() => {
			return result.current.itemIdsStatus === QueryStatus.Success;
		});

		expect(result.current.itemIds).toEqual(['id-2']);
		expect(result.current.itemIds?.length).toEqual(1);
		expect(useProductIdsSpy).toHaveBeenCalledWith({
			role: CommercialProductRole.basic,
			type: CommercialProductType.commercialProduct
		});
		expect(getProductIdsSpy.mock.calls.length).toBe(1);
		expect(getProductIdsSpy).toHaveBeenCalledWith(['id-2'], '');
	});

	test('should return ids of commercial products that match filterIds and filterString passed', async () => {
		const { result, waitFor } = renderHook(() => useGetProductIds(mockProductIds, 'id-1'));
		await waitFor(() => {
			return result.current.itemIdsStatus === QueryStatus.Success;
		});

		expect(result.current.itemIds).toEqual(['id-1']);
		expect(result.current.itemIds?.length).toEqual(1);
		expect(useProductIdsSpy).toHaveBeenCalledWith({
			role: CommercialProductRole.basic,
			type: CommercialProductType.commercialProduct
		});
		expect(getProductIdsSpy.mock.calls.length).toBe(1);
		expect(getProductIdsSpy).toHaveBeenCalledWith(
			mockProductIds,
			JSON.stringify({ name: 'id-1' })
		);
	});
});
