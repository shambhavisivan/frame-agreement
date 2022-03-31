import { renderHook } from '@testing-library/react-hooks';
import {
	mockDiscountThresholds,
	mockNegotiationState,
	mockFrameAgreements,
	mockDiscountData
} from '../datasources/mock-data';
import * as discountValidator from '../components/fa-details/negotiation/discount-validator';
import { useDiscountValidation } from './use-discount-validation';
import {
	ChargeType,
	NegotiationItemType,
	Negotiation
} from '../components/fa-details/negotiation/details-reducer';
import React, { FunctionComponent, ReactElement, ReactNode } from 'react';
import { DiscountThresholdViolation } from '../components/fa-details/negotiation/discount-validator';
import { FrameAgreement, ChargeT } from '../datasources';
import { store, ProviderProps } from '../components/fa-details/details-page-provider';

describe('test useDiscountValidation hook', () => {
	// Cleanup mock
	afterEach(() => {
		jest.clearAllMocks();
	});

	const initialState: Negotiation = {
		negotiation: mockNegotiationState,
		activeFa: {} as FrameAgreement,
		discountData: mockDiscountData,
		disableAgreementOperations: false
	};
	const dispatch = jest.fn();

	const makeWrapper = (value: ProviderProps): FunctionComponent => ({
		children
	}: {
		children?: ReactNode;
	}): ReactElement => (
		<store.Provider value={{ ...initialState, dispatch }}>{children}</store.Provider>
	);

	const testWrapper = makeWrapper({
		agreement: mockFrameAgreements[0]
	});

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
			wrapper: testWrapper
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

	describe('validateProductThresholdForAdvancedCharges', () => {
		const {
			result: {
				current: { validateProductThresholdForAdvancedCharges }
			}
		} = renderHook(() => useDiscountValidation(), {
			wrapper: testWrapper
		});

		test('should validate the product advanced charge against given threshold', async () => {
			const testProductId = 'a1i4I000003Kqe8QAC';
			const testChargeId = 'a1l4I00000AFilFQAT';

			const mockCharge: ChargeT = {
				id: testChargeId,
				name: 'Voice Threshold',
				chargeType: 'oneOff',
				oneOff: { original: 15.5, negotiated: 7.5 },
				recurring: {
					original: 15,
					negotiated: undefined
				}
			};
			const validations = validateProductThresholdForAdvancedCharges(
				testProductId,
				mockCharge
			);

			expect(validations).toEqual([fakeThresholdViolation]);
			expect(validateDiscountsSpy.mock.calls.length).toBe(1);
			expect(validateDiscountsSpy).toHaveBeenCalledWith(
				mockNegotiationState.products[testProductId].charges?.[testChargeId].oneOff,
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
			wrapper: testWrapper
		});

		test('should validate the product associated addon charge against given threshold', async () => {
			const testAddonProductId = 'a1i4I000003KqdtQAC';
			const testAddonId = 'a1N4I000002wyg0UAA';
			const testProductAddonAssociationId = 'a1d4I000005VvmoPAC';
			const validations = validateAddonThreshold(
				testAddonId,
				testProductAddonAssociationId,
				testChargeType,
				'COMMERCIAL_PRODUCT_ASSOCIATED',
				testAddonProductId
			);
			expect(validations).toEqual([fakeThresholdViolation]);
			expect(validateDiscountsSpy.mock.calls.length).toBe(1);
			expect(validateDiscountsSpy).toHaveBeenCalledWith(
				mockNegotiationState.products[testAddonProductId].addons[
					testProductAddonAssociationId
				][testChargeType],
				[mockDiscountThresholds[0]]
			);
		});

		test('should validate the standalone addon charge against given threshold', async () => {
			const testAddonId = 'a1N4I000002wyh9UAA';
			const validations = validateAddonThreshold(
				testAddonId,
				testAddonId,
				testChargeType,
				'STANDALONE'
			);
			expect(validations).toEqual([fakeThresholdViolation]);
			expect(validateDiscountsSpy.mock.calls.length).toBe(1);
			expect(validateDiscountsSpy).toHaveBeenCalledWith(
				mockNegotiationState.addons[testAddonId][testChargeType],
				[mockDiscountThresholds[1]]
			);
		});
	});

	describe('validateRateCardLineThreshold', () => {
		const {
			result: {
				current: { validateRateCardLineThreshold }
			}
		} = renderHook(() => useDiscountValidation(), {
			wrapper: testWrapper
		});

		test('should validate the rate card line item value against given threshold', async () => {
			const testrateCardProductId = 'a1i4I000003Q4GGQA0';
			const testRateCardId = 'a1q4I000009tfziQAA';
			const testRateCardLineId = 'a1p4I00000Cn44DQAR';
			const validations = validateRateCardLineThreshold(
				testrateCardProductId,
				testRateCardId,
				testRateCardLineId,
				mockDiscountThresholds[0].authorizationLevel
			);
			const rateCardLine =
				mockNegotiationState.products[testrateCardProductId].rateCards[testRateCardId]
					.rateCardLines[testRateCardLineId];
			const rateCardNegotiable = {
				original: rateCardLine.original,
				negotiated: rateCardLine.negotiated
			};
			expect(validations).toEqual([fakeThresholdViolation]);
			expect(validateDiscountsSpy.mock.calls.length).toBe(1);
			expect(validateDiscountsSpy).toHaveBeenCalledWith(rateCardNegotiable, [
				mockDiscountThresholds[0]
			]);
		});
	});
});
