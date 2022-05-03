import React, { ReactElement, useCallback, useContext, useRef, useState } from 'react';
import { CommercialProductStandalone } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { CSButton } from '@cloudsense/cs-ui-components';
import { RateCards } from './rate-cards';
import { Allowances } from './allowances';
import { store } from './details-page-provider';
import { createActionsForNegotiateProduct } from './negotiation/negotiation-action-creator';
import { NegotiationItemType } from './negotiation/details-reducer';
import { QueryStatus, useCommercialProductData } from '../../hooks/use-commercial-product-data';
import { ChargeList } from './charge-list';
import { LegacyProductCharge } from './legacy-product-charge';
import { AddonNegotiation } from './addon-negotiation';

interface ProductDetailsProps {
	product: CommercialProductStandalone;
	productType?: NegotiationItemType;
}
const enum ChildButtons {
	'addon' = 'addon',
	'ratecard' = 'ratecard',
	'charges' = 'charges',
	'allowances' = 'allowances'
}

export function ProductDetails({
	product,
	productType = 'products'
}: ProductDetailsProps): ReactElement {
	const labels = useCustomLabels();
	const [activeDetails, setActiveDetails] = useState<ChildButtons>(ChildButtons.addon);
	const {
		negotiation: { products },
		dispatch
	} = useContext(store);
	const negotiateActions = createActionsForNegotiateProduct(dispatch);
	const {
		negotiateRateCardLine,
		negotiateAdvancedRecurringCharge,
		negotiateAdvancedOneOffCharge,
		negotiateProductOneOff,
		negotiateProductRecurring
	} = negotiateActions(product.id, productType);
	const { data: productData, status } = useCommercialProductData([product.id]);

	const onClickButton = (buttonName: ChildButtons): void => {
		setActiveDetails(buttonName);
	};
	const negotiateOneOffCharge = useCallback(negotiateAdvancedOneOffCharge, [product.id]);
	const negotiateRecurringCharge = useCallback(negotiateAdvancedRecurringCharge, [product.id]);

	const oneOffChargeNegotiation = useCallback(negotiateProductOneOff, [product.id]);
	const recurringChargeNegotiation = useCallback(negotiateProductRecurring, [product.id]);

	const renderCharges = (): ReactElement => {
		if (activeDetails === ChildButtons.charges && status === QueryStatus.Success) {
			if (productData?.cpData[product.id]?.charges?.length) {
				return (
					<ChargeList
						chargeList={productData?.cpData[product.id].charges || []}
						productId={product.id}
						negotiateOneOffCharge={negotiateOneOffCharge}
						negotiateRecurringCharge={negotiateRecurringCharge}
					/>
				);
			} else {
				return (
					<LegacyProductCharge
						product={product}
						oneOffChargeNegotiation={oneOffChargeNegotiation}
						recurringChargeNegotiation={recurringChargeNegotiation}
					/>
				);
			}
		}
		return <></>;
	};

	return (
		<div>
			<CSButton
				label={labels.addonLabel}
				onClick={(): void => onClickButton(ChildButtons.addon)}
			/>
			<CSButton
				label={labels.chargesHeaderName}
				onClick={(): void => onClickButton(ChildButtons.charges)}
			/>
			<CSButton
				label={labels.productsRates}
				onClick={(): void => onClickButton(ChildButtons.ratecard)}
			/>
			<CSButton
				label={labels.allowances}
				onClick={(): void => onClickButton(ChildButtons.allowances)}
			/>

			{activeDetails === ChildButtons.addon && productData?.cpData[product.id].addons && (
				<AddonNegotiation
					addons={
						productData?.cpData[product.id]?.addons.map(
							(commercialProductsAddonAssociation) => {
								return commercialProductsAddonAssociation.addOnPriceItem;
							}
						) || []
					}
					productId={product.id}
					addonNegotiations={products[product.id]?.addons}
					addonType={'COMMERCIAL_PRODUCT_ASSOCIATED'}
				/>
			)}
			{activeDetails === ChildButtons.ratecard &&
				status === QueryStatus.Success &&
				productData?.cpData[product.id].rateCards && (
					<RateCards
						productId={product.id}
						rateCards={productData?.cpData[product.id].rateCards}
						negotiateRateCardLine={negotiateRateCardLine}
					/>
				)}
			{activeDetails === ChildButtons.allowances &&
				status === QueryStatus.Success &&
				productData?.cpData[product.id].allowances && (
					<Allowances
						productId={product.id}
						allowances={productData?.cpData[product.id].allowances || []}
					/>
				)}
			{renderCharges()}
		</div>
	);
}
