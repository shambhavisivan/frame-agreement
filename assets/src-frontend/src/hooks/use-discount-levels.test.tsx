import { renderHook } from '@testing-library/react-hooks';
import {
	mockAuthLevels,
	mockDiscountThresholds,
	mockNegotiationState
} from '../datasources/mock-data';
import * as discountValidator from '../components/fa-details/negotiation/discount-validator';
import { ContextProps, discountContext } from '../providers/discount-conformance-provider';
import {
	ChargeType,
	NegotiationItemType
} from '../components/fa-details/negotiation/negotiation-reducer';
import React, { FunctionComponent, ReactElement, ReactNode } from 'react';
import { deforcify } from '../datasources/deforcify';
import { DiscLevels_general } from '../local-server/local_data';
import { useDiscountLevels } from './use-discount-levels';
import { Discount } from '../components/fa-details/negotiation/discount-validator';

describe('test useDiscountLevels hook', () => {
	// Cleanup mock
	afterEach(() => {
		jest.clearAllMocks();
	});

	const makeWrapper = (value: ContextProps): FunctionComponent => ({
		children
	}: {
		children?: ReactNode;
	}): ReactElement => (
		<discountContext.Provider value={value}>{children}</discountContext.Provider>
	);

	const testWrapper = makeWrapper({
		negotiation: mockNegotiationState,
		discountThresholds: mockDiscountThresholds,
		authLevels: mockAuthLevels,
		discountLevels: DiscLevels_general.map((discWrap: SfGlobal.DiscLevelWrapper) => {
			return {
				...discWrap,
				discountLevel: deforcify(discWrap.discountLevel)
			};
		})
	});

	const testProductId = 'a1i4I000003Q4GGQA0';
	const testItemType: NegotiationItemType = 'products';
	const testChargeType: ChargeType = 'oneOff';
	const fakeDiscountLevelValues: number[] = [10, 20, 30];
	const fakeDiscountedValue = 450;

	const filterDiscountLevelValuesSpy = jest
		.spyOn(discountValidator, 'filterDiscountLevelValues')
		.mockReturnValue(fakeDiscountLevelValues);
	const applyDiscountSpy = jest
		.spyOn(discountValidator, 'applyDiscount')
		.mockReturnValue(fakeDiscountedValue);

	describe('fetchValidProductDiscounts', () => {
		const {
			result: {
				current: { fetchValidProductDiscounts }
			}
		} = renderHook(() => useDiscountLevels(), {
			wrapper: testWrapper
		});

		test('should validate the discount levels by calling getDiscountLevelValues and provide valid discounts', async () => {
			const validDiscounts = fetchValidProductDiscounts(
				testProductId,
				testItemType,
				testChargeType
			);

			expect(validDiscounts).toEqual(
				fakeDiscountLevelValues.map((value) => {
					return { discountValue: value, discountType: 'Percentage' };
				})
			);
			expect(filterDiscountLevelValuesSpy.mock.calls.length).toBe(1);
			expect(filterDiscountLevelValuesSpy).toHaveBeenCalledWith(
				deforcify(DiscLevels_general[1].discountLevel),
				mockNegotiationState.products[testProductId].product[testChargeType].original
			);
		});
	});

	describe('applyProductDiscount', () => {
		const {
			result: {
				current: { applyProductDiscount }
			}
		} = renderHook(() => useDiscountLevels(), {
			wrapper: testWrapper
		});

		test('should apply the product discount by calling applyDiscount and provide discounted value', async () => {
			const testDiscount: Discount = {
				discountValue: 10,
				discountType: 'Percentage'
			};

			const discountedValue = applyProductDiscount(
				testProductId,
				testItemType,
				testChargeType,
				testDiscount
			);

			expect(discountedValue).toEqual(fakeDiscountedValue);
			expect(applyDiscountSpy.mock.calls.length).toBe(1);
			expect(applyDiscountSpy).toHaveBeenCalledWith(
				mockNegotiationState['products'][testProductId].product.oneOff.original,
				testDiscount
			);
		});
	});
});
