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
import { NegotiationItemType } from './negotiation/negotiation-reducer';

interface ProductDetailsProps {
	product: CommercialProductStandalone;
	productType?: NegotiationItemType;
}
const enum ChildButtons {
	'addon' = 'addon',
	'ratecard' = 'ratecard'
}

export function ProductDetails({
	product: { id },
	productType = 'products'
}: ProductDetailsProps): ReactElement {
	const labels = useCustomLabels();
	const [activeDetails, setActiveDetails] = useState<ChildButtons>(ChildButtons.addon);
	const { addonList } = useQueryAddons(id);
	const { dispatch, ...state } = useContext(store);
	const negotiateActions = createActionsForNegotiateProduct(dispatch);
	const { negotiateRateCardLine } = negotiateActions(id, productType);

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
			{activeDetails === ChildButtons.addon && (
				<AddonGrid
					addonList={addonList || []}
					fieldMetadata={ADDON_PRODUCT_DETAILS_GRID_METADATA}
				/>
			)}
			{activeDetails === ChildButtons.ratecard && (
				<tr>
					<td>
						<RateCards
							rateCards={state.products[id].rateCards || {}}
							negotiateRateCardLine={negotiateRateCardLine}
						/>
					</td>
				</tr>
			)}
		</div>
	);
}
