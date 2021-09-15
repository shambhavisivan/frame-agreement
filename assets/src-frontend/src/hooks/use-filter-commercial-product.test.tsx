import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { remoteActions } from '../datasources/remote-actions-salesforce';
import { mockCommercialProducts } from '../datasources/mock-data';
import { useFilterCommercialProduct } from './use-filter-commercial-product';
import { AppSettings } from '../datasources';

jest.mock('../datasources/remote-actions-salesforce', () => ({
	remoteActions: {
		getAppSettings: jest.fn(),
		filterCommercialProducts: jest.fn()
	}
}));

describe('useFilterCommercialProduct', () => {
	const filterCommercialProductSpy = jest
		.spyOn(remoteActions, 'filterCommercialProducts')
		.mockResolvedValue(mockCommercialProducts);

	afterEach(() => {
		filterCommercialProductSpy.mockClear();
	});

	test('should call filterCommercialProducts with expected param', async () => {
		const filter: Partial<SfGlobal.CategorizationData>[] = [
			{
				field: 'cspmb__role__c',
				values: ['Basic', 'Commercial Product']
			},
			{
				field: 'cspmb__type__c',
				values: ['Offer', 'Master']
			}
		];

		const { waitFor, result } = renderHook(() =>
			useFilterCommercialProduct(filter as AppSettings['categorizationData'])
		);

		await waitFor(() => result.current.filterCpStatus === QueryStatus.Success);

		expect(filterCommercialProductSpy).toHaveBeenCalledWith(JSON.stringify(filter));
		expect(result.current.filteredCp).toEqual(mockCommercialProducts);
	});

	test('should not call filterCommercialProducts if filter is invalid', async () => {
		const invalidMockFilter = [] as AppSettings['categorizationData'];

		const { waitFor, result } = renderHook(() => useFilterCommercialProduct(invalidMockFilter));

		await waitFor(() => result.current.filterCpStatus === QueryStatus.Idle);

		expect(filterCommercialProductSpy).not.toHaveBeenCalled();
	});
});
