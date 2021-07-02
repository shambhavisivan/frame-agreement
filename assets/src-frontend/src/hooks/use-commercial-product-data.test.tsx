import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { mockCommercialProductData, mockProductIds } from '../datasources/mock-data';
import { remoteActions } from '../datasources/remote-actions-salesforce';
import { useCommercialProductData } from './use-commercial-product-data';

describe('test useCommercialProductData hook', () => {
	const getCommercialProductDataSpy = jest
		.spyOn(remoteActions, 'getCommercialProductData')
		.mockImplementation(jest.fn(() => Promise.resolve(mockCommercialProductData)));

	test('returns commercial product data and calls getCommercialProductData once', async () => {
		const { result, waitFor } = renderHook(() => useCommercialProductData(mockProductIds));
		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});

		expect(result.current.data).toEqual(mockCommercialProductData);
		expect(getCommercialProductDataSpy.mock.calls.length).toBe(1);
		expect(getCommercialProductDataSpy).toHaveBeenCalledWith(mockProductIds);
	});
});
