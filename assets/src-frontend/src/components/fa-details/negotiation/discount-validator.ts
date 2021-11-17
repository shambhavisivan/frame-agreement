import { DiscountLevel, DiscountThreshold, DiscountType } from '../../../datasources';
import { Negotiable } from './details-reducer';

export interface DiscountThresholdViolation {
	thresholdName: string;
	violatedAmount: number;
}

export interface Discount {
	discountValue: number;
	discountType: DiscountType;
}

function convertPercentToAmount(originalAmount: number, percentValue: number): number {
	return (originalAmount * percentValue) / 100;
}

export function convertAmountToPercent(originalAmount: number, amountValue: number): number {
	return (amountValue * 100) / originalAmount;
}

export function applyDiscount(originalAmount: number, discount: Discount): number {
	let discountAmount: number = discount.discountValue;
	if (discount.discountType === 'Percentage') {
		discountAmount = convertPercentToAmount(originalAmount, discountAmount);
	}
	return originalAmount - discountAmount;
}

export function validateDiscountThreshold(
	negotiable: Negotiable,
	thresholds: DiscountThreshold[]
): DiscountThresholdViolation[] {
	const violations: DiscountThresholdViolation[] = [];
	if (negotiable && negotiable.original !== undefined && negotiable.negotiated !== undefined) {
		const discount = negotiable.original
			? negotiable.original - (negotiable.negotiated || negotiable.original)
			: 0;
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
	}
	return violations;
}

export function filterDiscountLevelValues(
	discountLevel: DiscountLevel,
	originalAmount: number
): number[] {
	const discountValues = getDiscountLevelValues(discountLevel);
	if (discountLevel.discountType === 'Percentage') {
		return discountValues.filter((value) => value > 0 && value <= 100);
	} else if (discountLevel.discountType === 'Amount') {
		return discountValues.filter((value) => value > 0 && value <= originalAmount);
	} else {
		return discountValues;
	}
}

function getDiscountValues(discountValues: string): number[] {
	const invalidValues: string[] = [];
	const discountLevelValues: number[] = [];
	discountValues
		.replace(/\s+/g, '')
		.split(',')
		.forEach((value) => {
			const ret = +value;
			if (!isNaN(ret)) {
				discountLevelValues.push(ret);
			} else {
				invalidValues.push(value);
			}
		});
	if (invalidValues.length) {
		throw new Error(`Invalid discount level values: ${invalidValues}`);
	}
	return discountLevelValues;
}

function getDiscountIncrementValues(discountLevel: DiscountLevel): number[] {
	if (
		discountLevel.discountIncrement &&
		discountLevel.maximumDiscountValue &&
		discountLevel.minimumDiscountValue
	) {
		const discountValues: number[] = [];
		const minDiscount: number = discountLevel.minimumDiscountValue as number;
		const maxDiscount: number = discountLevel.maximumDiscountValue as number;
		const increment: number = +(discountLevel.discountIncrement as string) as number;
		if (isNaN(increment)) {
			throw new Error(`Invalid discount increment value ${discountLevel.discountIncrement}`);
		}
		if (maxDiscount < minDiscount) {
			throw new Error(`Invalid min/max values: ${minDiscount}/${maxDiscount}`);
		} else {
			for (let i = minDiscount; i <= maxDiscount; i += increment) {
				discountValues.push(i);
			}
		}
		return discountValues;
	} else {
		throw new Error(`Missing a required field`);
	}
}

function getDiscountLevelValues(discountLevel: DiscountLevel): number[] {
	const discountLevelErrors: string[] = [];
	let discountLevelValues: number[] = [];
	// If values exists, use that
	if (discountLevel.discountValues) {
		try {
			discountLevelValues = getDiscountValues(discountLevel.discountValues);
		} catch (error) {
			discountLevelErrors.push(
				`${(error as Error).message} in discount level: ${discountLevel.name}`
			);
		}
	}
	if (!discountLevelValues.length) {
		try {
			discountLevelValues = getDiscountIncrementValues(discountLevel);
		} catch (error) {
			discountLevelErrors.push(
				`${(error as Error).message} in discount level: ${discountLevel.name}`
			);
		}
	}
	if (discountLevelErrors.length) {
		// TODO: Add log mechanism to log the errors to console
	}
	return discountLevelValues;
}
