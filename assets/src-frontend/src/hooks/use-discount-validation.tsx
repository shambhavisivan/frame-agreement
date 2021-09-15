import { useCallback, useContext } from 'react';
import {
	DiscountThresholdViolation,
	validateDiscountThreshold
} from '../components/fa-details/negotiation/discount-validator';
import {
	ChargeType,
	NegotiationItemType,
	ProductNegotiation
} from '../components/fa-details/negotiation/negotiation-reducer';
import { DiscountThreshold } from '../datasources';
import { discountContext } from '../providers/discount-conformance-provider';

export function useDiscountValidation(): {
	validateProductThreshold: (
		productId: string,
		itemType: NegotiationItemType,
		chargeType: ChargeType
	) => DiscountThresholdViolation[];
	validateAddonThreshold: (
		productId: string,
		addonId: string,
		chargeType: ChargeType
	) => DiscountThresholdViolation[];
	validateRateCardLineThreshold: (
		productId: string,
		rateCardId: string,
		rateCardLineId: string
	) => DiscountThresholdViolation[];
} {
	const { discountThresholds, authLevels, negotiation: state } = useContext(discountContext);
	const validateRateCardLineThreshold = useCallback(
		(
			productId: string,
			rateCardId: string,
			rateCardLineId: string
		): DiscountThresholdViolation[] => {
			if (!discountThresholds) {
				return [];
			}

			const rateLineNegotiable =
				state['products'][productId].rateCards[rateCardId].rateCardLines[rateCardLineId];

			let rclThresholds: DiscountThreshold[];
			if (!!state['products'][productId]?.rateCards[rateCardId]?.authId) {
				rclThresholds = discountThresholds.filter(
					(threshold) =>
						threshold.authorizationLevel ===
						state['products'][productId].rateCards[rateCardId].authId
				);
			} else {
				rclThresholds = discountThresholds.filter(
					(threshold) =>
						threshold.name ===
						state['products'][productId].rateCards[rateCardId].rateCardLines[
							rateCardLineId
						].name
				);
			}

			return validateDiscountThreshold(
				{
					original: rateLineNegotiable.original,
					negotiated: rateLineNegotiable.negotiated
				},
				rclThresholds
			);
		},
		[state, discountThresholds]
	);

	const validateProductThreshold = useCallback(
		(
			productId: string,
			itemType: NegotiationItemType,
			chargeType: ChargeType
		): DiscountThresholdViolation[] => {
			if (!discountThresholds) {
				return [];
			}
			const productNegotiable = (state[itemType][productId] as ProductNegotiation).product[
				chargeType
			];

			const productThresholds = discountThresholds.filter(
				(threshold) => threshold.authorizationLevel === authLevels[productId]
			);

			return validateDiscountThreshold(productNegotiable, productThresholds);
		},
		[authLevels, state, discountThresholds]
	);

	const validateAddonThreshold = useCallback(
		(
			productId: string,
			addonId: string,
			chargeType: ChargeType
		): DiscountThresholdViolation[] => {
			if (!discountThresholds) {
				return [];
			}

			const addonNegotiable = state['products'][productId].addons[addonId][chargeType];

			const addonThresholds = discountThresholds.filter(
				(threshold) => threshold.authorizationLevel === authLevels[addonId]
			);

			return validateDiscountThreshold(addonNegotiable, addonThresholds);
		},
		[authLevels, state, discountThresholds]
	);
	return {
		validateProductThreshold,
		validateAddonThreshold,
		validateRateCardLineThreshold
	};
}
