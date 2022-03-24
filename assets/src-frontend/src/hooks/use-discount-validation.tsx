import { useCallback, useContext } from 'react';
import {
	DiscountThresholdViolation,
	validateDiscountThreshold
} from '../components/fa-details/negotiation/discount-validator';
import {
	ChargeType,
	NegotiationItemType,
	ProductNegotiation,
	Negotiable
} from '../components/fa-details/negotiation/details-reducer';
import { DiscountThreshold, ChargeT } from '../datasources';
import { store } from '../components/fa-details/details-page-provider';

export function useDiscountValidation(): {
	validateProductThreshold: (
		productId: string,
		itemType: NegotiationItemType,
		chargeType: ChargeType
	) => DiscountThresholdViolation[];
	validateProductThresholdForAdvancedCharges: (
		productId: string,
		charge: ChargeT
	) => DiscountThresholdViolation[];
	validateAddonThreshold: (
		productId: string,
		addonId: string,
		chargeType: ChargeType
	) => DiscountThresholdViolation[];
	validateRateCardLineThreshold: (
		productId: string,
		rateCardId: string,
		rateCardLineId: string,
		authId?: string
	) => DiscountThresholdViolation[];
} {
	const { discountData, negotiation: state } = useContext(store);
	const validateRateCardLineThreshold = useCallback(
		(
			productId: string,
			rateCardId: string,
			rateCardLineId: string,
			authId?: string
		): DiscountThresholdViolation[] => {
			if (!discountData?.discountThresholds) {
				return [];
			}

			const rateLineNegotiable =
				state['products'][productId].rateCards[rateCardId].rateCardLines[rateCardLineId];

			let rclThresholds: DiscountThreshold[] = [];
			if (!!authId) {
				rclThresholds = discountData?.discountThresholds.filter(
					(threshold) =>
						threshold.authorizationLevel === authId &&
						threshold.name === rateLineNegotiable.name
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
		[state, discountData?.discountThresholds]
	);

	const validateProductThreshold = useCallback(
		(
			productId: string,
			itemType: NegotiationItemType,
			chargeType: ChargeType
		): DiscountThresholdViolation[] => {
			if (!discountData?.discountThresholds) {
				return [];
			}
			const productNegotiable = (state[itemType][productId] as ProductNegotiation).product[
				chargeType
			];

			let productThresholds: DiscountThreshold[] = [];

			const authLevels: { [productId: string]: string } = discountData?.authLevels || {};

			if (Object.keys(authLevels).length) {
				productThresholds = discountData?.discountThresholds.filter(
					(threshold) => threshold.authorizationLevel === authLevels[productId]
				);
			}

			return validateDiscountThreshold(productNegotiable, productThresholds);
		},
		[discountData?.authLevels, state, discountData?.discountThresholds]
	);

	const validateProductThresholdForAdvancedCharges = useCallback(
		(productId: string, charge: ChargeT): DiscountThresholdViolation[] => {
			if (!discountData?.discountThresholds) {
				return [];
			}

			const productChargeNegotiable: Negotiable =
				charge.chargeType === 'oneOff' ? charge.oneOff : charge.recurring;

			let productThresholds: DiscountThreshold[] = [];

			const authLevels: { [productId: string]: string } = discountData?.authLevels || {};

			if (Object.keys(authLevels).length) {
				productThresholds = discountData?.discountThresholds.filter(
					(threshold) =>
						threshold.authorizationLevel === authLevels[productId] &&
						threshold.name === charge.name
				);
			}

			return validateDiscountThreshold(productChargeNegotiable, productThresholds);
		},
		[discountData?.authLevels, state, discountData?.discountThresholds]
	);

	const validateAddonThreshold = useCallback(
		(
			productId: string,
			addonId: string,
			chargeType: ChargeType
		): DiscountThresholdViolation[] => {
			if (!discountData?.discountThresholds) {
				return [];
			}

			const addonNegotiable = state['products'][productId].addons[addonId][chargeType];

			let addonThresholds: DiscountThreshold[] = [];

			const authLevels: { [addonId: string]: string } = discountData?.authLevels || {};

			if (Object.keys(authLevels).length) {
				addonThresholds = discountData?.discountThresholds.filter(
					(threshold) => threshold.authorizationLevel === authLevels[addonId]
				);
			}

			return validateDiscountThreshold(addonNegotiable, addonThresholds);
		},
		[discountData?.authLevels, state, discountData?.discountThresholds]
	);
	return {
		validateProductThreshold,
		validateProductThresholdForAdvancedCharges,
		validateAddonThreshold,
		validateRateCardLineThreshold
	};
}
