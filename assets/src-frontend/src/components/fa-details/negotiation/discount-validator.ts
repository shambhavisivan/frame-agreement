import { DiscountThreshold } from '../../../datasources';
import { Negotiable } from './negotiation-reducer';

export interface DiscountThresholdViolation {
	thresholdName: string;
	violatedAmount: number;
}

function convertPercentToAmount(originalAmount: number, percentValue: number): number {
	return (originalAmount * percentValue) / 100;
}

export function validateDiscountThreshold(
	negotiable: Negotiable,
	thresholds: DiscountThreshold[]
): DiscountThresholdViolation[] {
	const violations: DiscountThresholdViolation[] = [];
	if (!Boolean(negotiable.negotiated)) {
		return violations;
	}
	const discount = (negotiable.original || 0) - (negotiable.negotiated || 0);
	for (const discountThreshold of thresholds) {
		let thresholdAmount = discountThreshold.discountThreshold;
		if (discountThreshold.discountType === 'Percentage') {
			thresholdAmount = convertPercentToAmount(negotiable.original || 0, thresholdAmount);
		}
		if (discount > thresholdAmount) {
			const violation: DiscountThresholdViolation = {
				thresholdName: discountThreshold.name,
				violatedAmount: discount - thresholdAmount
			};
			violations.push(violation);
		}
	}
	return violations;
}
