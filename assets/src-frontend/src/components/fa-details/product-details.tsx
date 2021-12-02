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
	product: { id },
	productType = 'products'
}: ProductDetailsProps): ReactElement {
	const labels = useCustomLabels();
	const [activeDetails, setActiveDetails] = useState<ChildButtons>(ChildButtons.addon);
	const { addonList } = useQueryAddons(id);
	const { dispatch } = useContext(store);
	const negotiateActions = createActionsForNegotiateProduct(dispatch);
	const {
		negotiateRateCardLine,
		negotiateAdvancedRecurringCharge,
		negotiateAdvancedOneOffCharge
	} = negotiateActions(id, productType);
	const { data: productData, status } = useCommercialProductData([id]);

	const onClickButton = (buttonName: ChildButtons): void => {
		setActiveDetails(buttonName);
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
				productData?.cpData[id].rateCards && (
					<RateCards
						productId={id}
						rateCards={productData?.cpData[id].rateCards}
						negotiateRateCardLine={negotiateRateCardLine}
					/>
				)}

			{activeDetails === ChildButtons.charges && status === QueryStatus.Success && (
				<ChargeList
					chargeList={productData?.cpData[id].charges || []}
					productId={id}
					negotiateOneOffCharge={negotiateAdvancedOneOffCharge}
					negotiateRecurringCharge={negotiateAdvancedRecurringCharge}
				/>
			)}
		</div>
	);
}
