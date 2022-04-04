import * as helperFunctions from './helper-functions';
import {
	mockCommercialProducts,
	mockProductDataWithRateCardsOnly,
	mockStandaloneAddons
} from '../datasources/mock-data';
import { AttachmentOriginalItems } from '../datasources';

describe('createAttExtended should', () => {
	test('return extended attachment data', () => {
		const mockattachmentOriginalItems: AttachmentOriginalItems = {
			commercialProducts: {
				[mockCommercialProducts[0].id]: mockCommercialProducts[0]
			},
			commercialProductData: mockProductDataWithRateCardsOnly,
			standaloneAddons: {
				[mockStandaloneAddons[0].id]: mockStandaloneAddons[0],
				[mockStandaloneAddons[1].id]: mockStandaloneAddons[1]
			}
		};

		const attachmentOriginalItems = helperFunctions.createAttExtended(
			[mockCommercialProducts[0]],
			mockProductDataWithRateCardsOnly,
			mockStandaloneAddons.slice(0, 2)
		);

		expect(attachmentOriginalItems).toEqual(mockattachmentOriginalItems);
	});
});
