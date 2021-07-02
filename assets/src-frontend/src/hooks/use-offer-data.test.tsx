import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { mockOfferData, mockProductIds } from '../datasources/mock-data';
import { remoteActions } from '../datasources/remote-actions-salesforce';
import { useOfferData } from './use-offer-data';

describe('test useOfferData hook', () => {
	const getOfferDataSpy = jest
		.spyOn(remoteActions, 'getOfferData')
		.mockImplementation(jest.fn(() => Promise.resolve(mockOfferData)));

	test('returns offer data and calls getOfferData once', async () => {
		const { result, waitFor } = renderHook(() => useOfferData(mockProductIds, []));
		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});

		expect(result.current.data).toEqual(mockOfferData);
		expect(getOfferDataSpy.mock.calls.length).toBe(1);
		expect(getOfferDataSpy).toHaveBeenCalledWith(mockProductIds, []);
	});
});
