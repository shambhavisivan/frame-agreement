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
import { DiscountThreshold, ChargeT, AddonType, FacSetting } from '../datasources';
import { store } from '../components/fa-details/details-page-provider';
import { useAppSettings } from '../hooks/use-app-settings';
import { FamWindow } from '../datasources/register-apis';

const globalAny: FamWindow = (global as unknown) as FamWindow;
globalAny.FAM = {};

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
		addonId: string,
		referenceId: string,
		chargeType: ChargeType,
		addonType: AddonType,
		productId?: string
	) => DiscountThresholdViolation[];
	validateRateCardLineThreshold: (
		productId: string,
		rateCardId: string,
		rateCardLineId: string,
		authId?: string
	) => DiscountThresholdViolation[];
} {
	const { discountData, negotiation: state, activeFa } = useContext(store);

	const { settings } = useAppSettings();
	const { statuses } = settings?.facSettings as FacSetting;

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

			const rclThresholdViolations: DiscountThresholdViolation[] = validateDiscountThreshold(
				{
					original: rateLineNegotiable.original,
					negotiated: rateLineNegotiable.negotiated
				},
				rclThresholds
			);

			if (rclThresholdViolations.length) {
				updateFa();
			}
			return rclThresholdViolations;
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
			const productThresholdViolations: DiscountThresholdViolation[] = validateDiscountThreshold(
				productNegotiable,
				productThresholds
			);
			if (productThresholdViolations.length) {
				updateFa();
			}
			return productThresholdViolations;
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
			addonId: string,
			referenceId: string,
			chargeType: ChargeType,
			addonType: AddonType,
			productId?: string
		): DiscountThresholdViolation[] => {
			if (!discountData?.discountThresholds) {
				return [];
			}

			const addonNegotiable =
				addonType === 'COMMERCIAL_PRODUCT_ASSOCIATED'
					? state['products'][productId as string].addons[referenceId][chargeType]
					: state['addons'][referenceId][chargeType];

			let addonThresholds: DiscountThreshold[] = [];

			const authLevels: { [addonId: string]: string } = discountData?.authLevels || {};

			if (Object.keys(authLevels).length) {
				addonThresholds = discountData?.discountThresholds.filter(
					(threshold) => threshold.authorizationLevel === authLevels[addonId]
				);
			}

			const addonThresholdViolations: DiscountThresholdViolation[] = validateDiscountThreshold(
				addonNegotiable,
				addonThresholds
			);
			if (addonThresholdViolations.length) {
				updateFa();
			}
			return addonThresholdViolations;
		},
		[discountData?.authLevels, state, discountData?.discountThresholds]
	);

	const updateFa = (): void => {
		const updateFrameAgreementFunc = globalAny?.FAM?.api?.updateFrameAgreement as (
			faId: string,
			field: keyof SfGlobal.FrameAgreement,
			value: string | number | undefined
		) => Promise<void>;

		updateFrameAgreementFunc(
			activeFa?.id || '',
			'csconta__Status__c',
			statuses.requiresApprovalStatus
		);
	};

	return {
		validateProductThreshold,
		validateProductThresholdForAdvancedCharges,
		validateAddonThreshold,
		validateRateCardLineThreshold
	};
}
