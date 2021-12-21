import React, { ReactElement, useContext, useState } from 'react';
import { CommercialProductStandalone } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { CSButton } from '@cloudsense/cs-ui-components';
import { AddonGrid } from './addon-grid';
import { useQueryAddons } from '../../hooks/use-query-addons';
import { ADDON_PRODUCT_DETAILS_GRID_METADATA } from '../../app-constants';
import { RateCards } from './rate-cards';
import { store } from './details-page-provider';
import { createActionsForNegotiateProduct } from './negotiation/negotiation-action-creator';
import { NegotiationItemType } from './negotiation/details-reducer';
import { QueryStatus, useCommercialProductData } from '../../hooks/use-commercial-product-data';
import { ChargeList } from './charge-list';
import { LegacyProductCharge } from './legacy-product-charge';

interface ProductDetailsProps {
	product: CommercialProductStandalone;
	productType?: NegotiationItemType;
}
const enum ChildButtons {
	'addon' = 'addon',
	'ratecard' = 'ratecard',
	'charges' = 'charges'
}

export function ProductDetails({
	product,
	productType = 'products'
}: ProductDetailsProps): ReactElement {
	const labels = useCustomLabels();
	const [activeDetails, setActiveDetails] = useState<ChildButtons>(ChildButtons.addon);
	const { addonList } = useQueryAddons(product.id);
	const { dispatch } = useContext(store);
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

	const renderCharges = (): ReactElement => {
		if (activeDetails === ChildButtons.charges && status === QueryStatus.Success) {
			if (productData?.cpData[product.id]?.charges?.length) {
				return (
					<ChargeList
						chargeList={productData?.cpData[product.id].charges || []}
						productId={product.id}
						negotiateOneOffCharge={negotiateAdvancedOneOffCharge}
						negotiateRecurringCharge={negotiateAdvancedRecurringCharge}
					/>
				);
			} else {
				return (
					<LegacyProductCharge
						product={product}
						oneOffChargeNegotiation={negotiateProductOneOff}
						recurringChargeNegotiation={negotiateProductRecurring}
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
				label={labels.productsRates}
				onClick={(): void => onClickButton(ChildButtons.ratecard)}
			/>
			<CSButton
				label={labels.chargesHeaderName}
				onClick={(): void => onClickButton(ChildButtons.charges)}
			/>
			{activeDetails === ChildButtons.addon && (
				<AddonGrid
					addonList={addonList || []}
					fieldMetadata={ADDON_PRODUCT_DETAILS_GRID_METADATA}
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
			{renderCharges()}
		</div>
	);
}
