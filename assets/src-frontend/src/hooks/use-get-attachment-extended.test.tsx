import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { AttachmentOriginalItems } from '../datasources';
import { deforcify } from '../datasources/deforcify';
import { useGetAttachmentExtended } from './use-get-attachment-extended';
import * as cpHook from './use-commercial-products';
import * as cpDataHook from './use-commercial-product-data';
import * as saAoHook from './use-get-standalone-addons';
import * as helperFunctions from '../utils/helper-functions';
import {
	mockCommercialProducts,
	mockProductDataWithRateCardsOnly,
	attachment,
	mockStandaloneAddons
} from '../datasources/mock-data';

describe('test useGetAttachmentExtended', () => {
	const mockProductIds = Object.keys(attachment.products || {});

	const useCommercialProductsSpy = jest.spyOn(cpHook, 'useCommercialProducts').mockImplementation(
		jest.fn(() => {
			return { status: QueryStatus.Success, data: [mockCommercialProducts[0]] };
		})
	);

	const useCommercialProductDataSpy = jest
		.spyOn(cpDataHook, 'useCommercialProductData')
		.mockImplementation(
			jest.fn(() => {
				return { status: QueryStatus.Success, data: mockProductDataWithRateCardsOnly };
			})
		);

	const useGetStandaloneAddonsSpy = jest
		.spyOn(saAoHook, 'useGetStandaloneAddons')
		.mockImplementation(
			jest.fn(() => {
				return {
					standaloneAddons: mockStandaloneAddons.slice(0, 2).map(deforcify),
					status: QueryStatus.Success
				};
			})
		);

	const mockAttachmentExtended: AttachmentOriginalItems = {
		commercialProducts: {
			[mockCommercialProducts[0].id]: mockCommercialProducts[0]
		},
		commercialProductData: mockProductDataWithRateCardsOnly,
		standaloneAddons: {
			[mockStandaloneAddons[0].id]: mockStandaloneAddons[0],
			[mockStandaloneAddons[1].id]: mockStandaloneAddons[1]
		}
	};

	const createAttExtendedSpy = jest
		.spyOn(helperFunctions, 'createAttExtended')
		.mockReturnValue(mockAttachmentExtended);

	test('should call the useGetAttachmentExtended hook and return extended attachment data.', async () => {
		const { result } = renderHook(() =>
			useGetAttachmentExtended(attachment, QueryStatus.Success)
		);

		expect(useCommercialProductsSpy).toHaveBeenCalledWith(mockProductIds);
		expect(useCommercialProductDataSpy).toHaveBeenCalledWith(mockProductIds);
		expect(useGetStandaloneAddonsSpy).toHaveBeenCalled();
		expect(createAttExtendedSpy).toHaveBeenCalledWith(
			[mockCommercialProducts[0]],
			mockProductDataWithRateCardsOnly,
			mockStandaloneAddons.slice(0, 2)
		);
		expect(result.current).toEqual(mockAttachmentExtended);
	});
});
