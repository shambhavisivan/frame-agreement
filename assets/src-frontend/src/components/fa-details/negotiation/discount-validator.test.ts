import { DiscountThreshold } from '../../../datasources';
import { mockDiscountThresholds } from '../../../datasources/mock-data';
import { DiscountThresholdViolation, validateDiscountThreshold } from './discount-validator';
import { Negotiable } from './negotiation-reducer';

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
				{ thresholdName: testDiscountThresholds[1].name, violatedAmount: 1 }
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
				{ thresholdName: testDiscountThresholds[0].name, violatedAmount: 1 },
				{ thresholdName: testDiscountThresholds[1].name, violatedAmount: 11 }
			]);
		});
	});
});
