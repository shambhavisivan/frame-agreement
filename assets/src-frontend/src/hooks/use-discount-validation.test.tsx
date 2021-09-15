import { renderHook } from '@testing-library/react-hooks';
import {
	mockAuthLevels,
	mockDiscountThresholds,
	mockNegotiationState
} from '../datasources/mock-data';
import * as discountValidator from '../components/fa-details/negotiation/discount-validator';
import { useDiscountValidation } from './use-discount-validation';
import { ContextProps, discountContext } from '../providers/discount-conformance-provider';
import {
	ChargeType,
	NegotiationItemType
} from '../components/fa-details/negotiation/negotiation-reducer';
import React, { FunctionComponent, ReactElement, ReactNode } from 'react';
import { DiscountThresholdViolation } from '../components/fa-details/negotiation/discount-validator';

describe('test useDiscountValidation hook', () => {
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

	const testProductId = 'a1i4I000003Q4GGQA0';
	const testItemType: NegotiationItemType = 'products';
	const testChargeType: ChargeType = 'recurring';
	const fakeThresholdViolation: DiscountThresholdViolation = {
		thresholdName: 'Voice Threshold',
		violatedAmount: 2
	};
	const validateDiscountsSpy = jest
		.spyOn(discountValidator, 'validateDiscountThreshold')
		.mockReturnValue([fakeThresholdViolation]);

	describe('validateProductThreshold', () => {
		const {
			result: {
				current: { validateProductThreshold }
			}
		} = renderHook(() => useDiscountValidation(), {
			wrapper: makeWrapper({
				negotiation: mockNegotiationState,
				discountThresholds: mockDiscountThresholds,
				authLevels: mockAuthLevels
			})
		});

		test('should validate the product charge against given threshold', async () => {
			const validations = validateProductThreshold(
				testProductId,
				testItemType,
				testChargeType
			);

			expect(validations).toEqual([fakeThresholdViolation]);
			expect(validateDiscountsSpy.mock.calls.length).toBe(1);
			expect(validateDiscountsSpy).toHaveBeenCalledWith(
				mockNegotiationState.products[testProductId].product.recurring,
				[mockDiscountThresholds[1]]
			);
		});
	});

	describe('validateAddonThreshold', () => {
		const {
			result: {
				current: { validateAddonThreshold }
			}
		} = renderHook(() => useDiscountValidation(), {
			wrapper: makeWrapper({
				negotiation: mockNegotiationState,
				discountThresholds: mockDiscountThresholds,
				authLevels: mockAuthLevels
			})
		});

		test('should validate the addon charge against given threshold', async () => {
			const testAddonProductId = 'a1i4I000003KqdtQAC';
			const testAddonId = 'a1d4I000005VsVYQA0';
			const validations = validateAddonThreshold(
				testAddonProductId,
				testAddonId,
				testChargeType
			);
			expect(validations).toEqual([fakeThresholdViolation]);
			expect(validateDiscountsSpy.mock.calls.length).toBe(1);
			expect(validateDiscountsSpy).toHaveBeenCalledWith(
				mockNegotiationState.products[testAddonProductId].addons[testAddonId][
					testChargeType
				],
				[mockDiscountThresholds[0]]
			);
		});
	});

	describe('validateRateCardLineThreshold', () => {
		const {
			result: {
				current: { validateRateCardLineThreshold }
			}
		} = renderHook(() => useDiscountValidation(), {
			wrapper: makeWrapper({
				negotiation: mockNegotiationState,
				discountThresholds: mockDiscountThresholds,
				authLevels: mockAuthLevels
			})
		});

		test('should validate the rate card line item value against given threshold', async () => {
			const testrateCardProductId = 'a1i4I000003KqdtQAC';
			const testRateCardId = 'a1q4I000009tfziQAA';
			const testRateCardLineId = 'a1p4I00000Cn44DQAR';
			const validations = validateRateCardLineThreshold(
				testrateCardProductId,
				testRateCardId,
				testRateCardLineId
			);

			expect(validations).toEqual([fakeThresholdViolation]);
			expect(validateDiscountsSpy.mock.calls.length).toBe(1);
			expect(validateDiscountsSpy).toHaveBeenCalledWith(
				mockNegotiationState.products[testrateCardProductId].rateCards[testRateCardId]
					.rateCardLines[testRateCardLineId],
				[mockDiscountThresholds[0]]
			);
		});
	});
});
