import { DiscountLevel, DiscountThreshold } from '../../../datasources';
import { mockDiscountThresholds } from '../../../datasources/mock-data';
import {
	applyDiscount,
	Discount,
	DiscountThresholdViolation,
	filterDiscountLevelValues,
	validateDiscountThreshold
} from './discount-validator';
import { Negotiable } from './details-reducer';

describe('test discount validator utils', () => {
	describe('validateDiscountThreshold', () => {
		test('should validate discount threshold and return empty array if valid', async () => {
			const testNegotiable: Negotiable = {
				original: 100,
				negotiated: 95
			};
			const testDiscountThresholds: DiscountThreshold[] = [...mockDiscountThresholds];

			const validations = validateDiscountThreshold(testNegotiable, testDiscountThresholds);

			expect(validations).toEqual([]);
		});

		test('should validate discount threshold and return violations if Amount threshold is not valid', async () => {
			const testNegotiable: Negotiable = {
				original: 100,
				negotiated: 89
			};
			const testDiscountThresholds: DiscountThreshold[] = [...mockDiscountThresholds];

			const validations: DiscountThresholdViolation[] = validateDiscountThreshold(
				testNegotiable,
				testDiscountThresholds
			);

			expect(validations).toEqual([
				{
					thresholdName: testDiscountThresholds[1].name,
					violatedAmount: 1
				}
			]);
		});

		test('should validate discount threshold and return violations if Percent threshold is not valid', async () => {
			const testNegotiable: Negotiable = {
				original: 100,
				negotiated: 79
			};
			const testDiscountThresholds: DiscountThreshold[] = [...mockDiscountThresholds];

			const validations: DiscountThresholdViolation[] = validateDiscountThreshold(
				testNegotiable,
				testDiscountThresholds
			);

			expect(validations).toEqual([
				{
					thresholdName: testDiscountThresholds[0].name,
					violatedAmount: 1
				},
				{
					thresholdName: testDiscountThresholds[1].name,
					violatedAmount: 11
				}
			]);
		});
	});

	describe('filterDiscountLevelValues', () => {
		test('should validate discountValues in discount level and return valid values', async () => {
			const testDiscountLevel: DiscountLevel = {
				id: 'a141t00000137a8AAA',
				name: 'Test',
				chargeType: 'RC',
				discountType: 'Percentage',
				discountValues: '10,20,30'
			};
			const testAmount = 40;

			const dicountValues = filterDiscountLevelValues(testDiscountLevel, testAmount);

			expect(dicountValues).toEqual([10, 20, 30]);
		});

		test('should return empty array when unable to parse discountValues in discount level', async () => {
			const testDiscountLevel: DiscountLevel = {
				id: 'a141t00000137a8AAA',
				name: 'Test',
				chargeType: 'RC',
				discountType: 'Percentage',
				discountValues: '10-20,30'
			};
			const testAmount = 40;

			const dicountValues = filterDiscountLevelValues(testDiscountLevel, testAmount);

			expect(dicountValues).toEqual([]);
		});

		test('should return discount values based on min/max/increment if discountValues is incorrect', async () => {
			const testDiscountLevel: DiscountLevel = {
				id: 'a141t00000137cgAAA',
				name: 'Test2',
				chargeType: 'RC',
				discountIncrement: '1',
				discountType: 'Amount',
				maximumDiscountValue: 10,
				minimumDiscountValue: 5
			};
			const testAmount = 40;

			const dicountValues = filterDiscountLevelValues(testDiscountLevel, testAmount);

			expect(dicountValues).toEqual([5, 6, 7, 8, 9, 10]);
		});

		test('should return empty array when a required  discount field is missing', async () => {
			const testDiscountLevel: DiscountLevel = {
				id: 'a141t00000137cgAAA',
				name: 'Test2',
				chargeType: 'RC',
				discountIncrement: '1',
				discountType: 'Amount',
				maximumDiscountValue: 5
			};
			const testAmount = 40;

			const dicountValues = filterDiscountLevelValues(testDiscountLevel, testAmount);

			expect(dicountValues).toEqual([]);
		});

		test('should return empty array when min > max', async () => {
			const testDiscountLevel: DiscountLevel = {
				id: 'a141t00000137cgAAA',
				name: 'Test2',
				chargeType: 'RC',
				discountIncrement: '1',
				discountType: 'Amount',
				maximumDiscountValue: 5,
				minimumDiscountValue: 10
			};
			const testAmount = 40;

			const dicountValues = filterDiscountLevelValues(testDiscountLevel, testAmount);

			expect(dicountValues).toEqual([]);
		});

		test('should return empty array when increment is not correct', async () => {
			const testDiscountLevel: DiscountLevel = {
				id: 'a141t00000137cgAAA',
				name: 'Test2',
				chargeType: 'RC',
				discountIncrement: 'incorrect',
				discountType: 'Amount',
				maximumDiscountValue: 5,
				minimumDiscountValue: 10
			};
			const testAmount = 40;

			const dicountValues = filterDiscountLevelValues(testDiscountLevel, testAmount);

			expect(dicountValues).toEqual([]);
		});

		test('should filter the value if the discount is greater than the amount', async () => {
			const testDiscountLevel: DiscountLevel = {
				id: 'a141t00000137a8AAA',
				name: 'Test',
				chargeType: 'RC',
				discountType: 'Amount',
				discountValues: '10,20,30'
			};
			const testAmount = 25;

			const filteredValues = filterDiscountLevelValues(testDiscountLevel, testAmount);

			expect(filteredValues).toEqual([10, 20]);
		});

		test('should not filter the value if the discount is lesser or equal to the amount', async () => {
			const testDiscountLevel: DiscountLevel = {
				id: 'a141t00000137a8AAA',
				name: 'Test',
				chargeType: 'RC',
				discountType: 'Amount',
				discountValues: '10,20,30'
			};
			const testAmount = 30;

			const filteredValues = filterDiscountLevelValues(testDiscountLevel, testAmount);

			expect(filteredValues).toEqual([10, 20, 30]);
		});

		test('should filter the value if the amount discount is zero', async () => {
			const testDiscountLevel: DiscountLevel = {
				id: 'a141t00000137a8AAA',
				name: 'Test',
				chargeType: 'RC',
				discountType: 'Amount',
				discountValues: '0,10,20,30'
			};
			const testAmount = 30;

			const filteredValues = filterDiscountLevelValues(testDiscountLevel, testAmount);

			expect(filteredValues).toEqual([10, 20, 30]);
		});

		test('should filter the value if the percent discount is zero', async () => {
			const testDiscountLevel: DiscountLevel = {
				id: 'a141t00000137a8AAA',
				name: 'Test',
				chargeType: 'RC',
				discountType: 'Percentage',
				discountValues: '0,10,20,30'
			};
			const testAmount = 30;

			const filteredValues = filterDiscountLevelValues(testDiscountLevel, testAmount);

			expect(filteredValues).toEqual([10, 20, 30]);
		});

		test('should filter the value if the percent discount is greater than 100', async () => {
			const testDiscountLevel: DiscountLevel = {
				id: 'a141t00000137a8AAA',
				name: 'Test',
				chargeType: 'RC',
				discountType: 'Percentage',
				discountValues: '10,20,30,101'
			};
			const testAmount = 30;

			const filteredValues = filterDiscountLevelValues(testDiscountLevel, testAmount);

			expect(filteredValues).toEqual([10, 20, 30]);
		});
	});

	describe('applyDiscount', () => {
		test('should apply the discount and return discounted amount for discountType Amount', async () => {
			const testDiscount: Discount = {
				discountType: 'Amount',
				discountValue: 20
			};
			const fakeOriginalValue = 100;

			const discountedValue = applyDiscount(fakeOriginalValue, testDiscount);

			expect(discountedValue).toEqual(fakeOriginalValue - testDiscount.discountValue);
		});

		test('should apply the discount and return discounted amount for discountType Percentage', async () => {
			const testDiscount: Discount = {
				discountType: 'Percentage',
				discountValue: 10
			};
			const fakeOriginalValue = 100;

			const discountedValue = applyDiscount(fakeOriginalValue, testDiscount);

			expect(discountedValue).toEqual(
				fakeOriginalValue - (fakeOriginalValue * testDiscount.discountValue) / 100
			);
		});
	});
});
