import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { mockCommercialProducts, mockProductIds } from '../datasources/mock-data';
import * as productsInDefaultCatalogue from './use-productIds-in-default-catalogue';
import { remoteActions } from '../datasources/remote-actions-salesforce';
import { useCommercialProducts } from './use-commercial-products';
import { CommercialProductStandalone } from '../datasources';
import { cpFilter as mockProductFilter } from '../app-constants';

describe('test useCommercialProducts hook', () => {
	const getCommercialProductsSpy = jest
		.spyOn(remoteActions, 'queryProducts')
		.mockImplementation(
			(productIdsFilter, filterFields, lastRecordId, queryLimit, alreadyAddedIds) => {
				// this mock implementation covers only few use cases for test purpose.
				if (productIdsFilter.length && filterFields) {
					const filterStringValue: string = Object.values(
						JSON.parse(filterFields)
					)[0] as string;
					let result: CommercialProductStandalone[] = [];
					result = mockCommercialProducts.filter(
						(cp) =>
							productIdsFilter.includes(cp.id) && cp.name.includes(filterStringValue)
					);
					return result
						? Promise.resolve(result.slice(0, queryLimit))
						: Promise.resolve([] as CommercialProductStandalone[]);
				} else if (productIdsFilter.length && alreadyAddedIds.length) {
					let result: CommercialProductStandalone[] = [];
					result = mockCommercialProducts.filter(
						(cp) => productIdsFilter.includes(cp.id) && !alreadyAddedIds.includes(cp.id)
					);
					return result
						? Promise.resolve(result.slice(0, queryLimit))
						: Promise.resolve([] as CommercialProductStandalone[]);
				} else if (lastRecordId) {
					let result: CommercialProductStandalone[] = [];
					result = mockCommercialProducts.filter((cp) => cp.id > lastRecordId);
					return result
						? Promise.resolve(result.slice(0, queryLimit))
						: Promise.resolve([] as CommercialProductStandalone[]);
				} else {
					return Promise.resolve(
						mockCommercialProducts.slice(0, queryLimit ? queryLimit : 10)
					);
				}
			}
		);

	const useProductIdsSpy = jest
		.spyOn(productsInDefaultCatalogue, 'useProductIdsInDefaultCatalogue')
		.mockImplementation(
			jest.fn(() => {
				return { status: QueryStatus.Success, productIds: mockProductIds };
			})
		);

	test('returns commercial products and calls queryProducts once', async () => {
		const { result, waitFor } = renderHook(() => useCommercialProducts());
		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});

		expect(result.current.data).toEqual(mockCommercialProducts.slice(0, 10));
		expect(useProductIdsSpy).toHaveBeenCalledWith(mockProductFilter);
		expect(getCommercialProductsSpy.mock.calls.length).toBe(1);
		expect(getCommercialProductsSpy).toHaveBeenCalledWith(mockProductIds, null, null, 0, []);
	});

	test('should call useCommercialProducts hook with filter ids and filter string', async () => {
		const { result, waitFor } = renderHook(() =>
			useCommercialProducts(
				['a1F1t0000001JBoEAM', 'a1F1t0000001JBZEA2'],
				'Mobile L_7',
				null,
				10,
				[]
			)
		);
		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});

		expect(result.current.data?.length).toEqual(1);
		expect(result.current.data ? result.current.data[0].id : '').toEqual('a1F1t0000001JBoEAM');
		expect(useProductIdsSpy).toHaveBeenCalledWith(mockProductFilter);
		expect(getCommercialProductsSpy.mock.calls.length).toBe(1);
		expect(getCommercialProductsSpy).toHaveBeenCalledWith(
			['a1F1t0000001JBoEAM', 'a1F1t0000001JBZEA2'],
			JSON.stringify({ name: 'Mobile L_7' }),
			null,
			10,
			[]
		);
	});

	test('should call useCommercialProducts hook with filter ids and alreadyAddedIds', async () => {
		const { result, waitFor } = renderHook(() =>
			useCommercialProducts(['a1F1t0000001JBoEAM', 'a1F1t0000001JBZEA2'], null, null, 10, [
				'a1F1t0000001JBoEAM'
			])
		);
		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});

		expect(result.current.data?.length).toEqual(1);
		expect(result.current.data ? result.current.data[0].id : '').toEqual('a1F1t0000001JBZEA2');
		expect(useProductIdsSpy).toHaveBeenCalledWith(mockProductFilter);
		expect(getCommercialProductsSpy.mock.calls.length).toBe(1);
		expect(getCommercialProductsSpy).toHaveBeenCalledWith(
			['a1F1t0000001JBoEAM', 'a1F1t0000001JBZEA2'],
			null,
			null,
			10,
			['a1F1t0000001JBoEAM']
		);
	});

	test('should call useCommercialProducts hook with lastRecordId', async () => {
		const { result, waitFor } = renderHook(() =>
			useCommercialProducts([], null, 'a1F1t0000001JBoEAM', 10, [])
		);
		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});

		expect(result.current.data?.length).toEqual(5);
		expect(useProductIdsSpy).toHaveBeenCalledWith(mockProductFilter);
		expect(getCommercialProductsSpy.mock.calls.length).toBe(1);
		expect(getCommercialProductsSpy).toHaveBeenCalledWith(
			mockProductIds,
			null,
			'a1F1t0000001JBoEAM',
			10,
			[]
		);
	});

	afterEach(() => {
		getCommercialProductsSpy.mockClear();
	});
});
