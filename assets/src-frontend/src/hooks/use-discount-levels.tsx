import { useCallback, useContext } from 'react';
import {
	applyDiscount,
	Discount,
	filterDiscountLevelValues
} from '../components/fa-details/negotiation/discount-validator';
import {
	ChargeType,
	NegotiationItemType,
	ProductNegotiation
} from '../components/fa-details/negotiation/negotiation-reducer';
import { DiscountLevel } from '../datasources';
import { discountContext } from '../providers/discount-conformance-provider';

export function useDiscountLevels(): {
	fetchValidProductDiscounts: (
		productId: string,
		itemType: NegotiationItemType,
		chargeType: ChargeType
	) => Discount[];
	applyProductDiscount: (
		productId: string,
		itemType: NegotiationItemType,
		chargeType: ChargeType,
		discount: Discount
	) => number;
} {
	const { discountLevels, negotiation: state } = useContext(discountContext);
	const discountsByProductId: {
		[productId: string]: DiscountLevel[];
	} = discountLevels.reduce(
		(discsByProd, discLvl) => {
			const itemId: string = discLvl.priceItemId
				? discLvl.priceItemId
				: (discLvl.addonId as string);
			if (discsByProd[itemId]) {
				discsByProd[itemId].push(discLvl.discountLevel);
			} else {
				discsByProd[itemId] = [discLvl.discountLevel];
			}
			return discsByProd;
		},
		{} as {
			[productId: string]: DiscountLevel[];
		}
	);

	const fetchValidProductDiscounts = useCallback(
		(productId: string, itemType: NegotiationItemType, chargeType: ChargeType): Discount[] => {
			let productDiscountLevels: DiscountLevel[] = [];
			if (discountLevels) {
				productDiscountLevels = discountsByProductId[productId]?.filter(
					(discountLvl: DiscountLevel) => discountLvl.chargeType === chargeType
				);
			}
			if (!productDiscountLevels?.length) {
				return [];
			}

			const productNegotiable = (state[itemType][productId] as ProductNegotiation).product[
				chargeType
			];

			const discounts: Discount[] = [];
			for (const discountLvl of productDiscountLevels) {
				const validDiscountValues = filterDiscountLevelValues(
					discountLvl,
					productNegotiable.original as number
				);
				for (const value of validDiscountValues) {
					const discount: Discount = {
						discountType: discountLvl.discountType,
						discountValue: value
					};
					discounts.push(discount);
				}
			}

			return discounts;
		},
		[state, discountLevels, discountsByProductId]
	);

	const applyProductDiscount = useCallback(
		(
			productId: string,
			itemType: NegotiationItemType,
			chargeType: ChargeType,
			discount: Discount
		): number => {
			const productNegotiable = (state[itemType][productId] as ProductNegotiation).product[
				chargeType
			];

			if (!discount || !discount.discountType || !discount.discountValue) {
				return productNegotiable.original as number;
			}

			return applyDiscount(productNegotiable.original as number, discount);
		},
		[state]
	);

	return {
		fetchValidProductDiscounts,
		applyProductDiscount
	};
}
