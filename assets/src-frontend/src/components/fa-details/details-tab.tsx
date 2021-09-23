import React, { ReactElement, useContext, useState } from 'react';
import { CSTabGroup, CSTab } from '@cloudsense/cs-ui-components';
import { ProductStatus } from './product-list-grid';
import { Attachment, CommercialProductStandalone } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { ProductsList } from './products-list';
import { createActionsForNegotiateProduct } from './negotiation/negotiation-action-creator';
import { store } from './details-page-provider';

type DetailTabProps = {
	attachment: Attachment;
	products: CommercialProductStandalone[];
	selectedProducts: (
		productList: CommercialProductStandalone[],
		productStatus: ProductStatus
	) => void;
};

const enum TabNames {
	'products' = 'PRODUCTS',
	'offers' = 'OFFERS',
	'addonSA' = 'ADDON_STAND_ALONE'
}

export function DetailsTab({
	products,
	selectedProducts,
	attachment
}: DetailTabProps): ReactElement {
	const [activeTab, setActiveTab] = useState(TabNames.products);
	const labels = useCustomLabels();
	const { dispatch } = useContext(store);
	const onTabClick = (activeTab: TabNames): void => setActiveTab(activeTab);

	return (
		<div>
			<div>
				<CSTabGroup>
					<CSTab
						name={labels.productsTitle}
						active={activeTab === TabNames.products}
						onClick={(): void => onTabClick(TabNames.products)}
					></CSTab>
					<CSTab
						name={labels.addonsTabTitle}
						active={activeTab === TabNames.addonSA}
						onClick={(): void => onTabClick(TabNames.addonSA)}
					></CSTab>
					<CSTab
						name={labels.offersTabTitle}
						active={activeTab === TabNames.offers}
						onClick={(): void => onTabClick(TabNames.offers)}
					></CSTab>
				</CSTabGroup>
			</div>
			<div>
				{activeTab === TabNames.products && (
					<ProductsList
						productList={products}
						createProductActions={createActionsForNegotiateProduct(dispatch)}
					/>
				)}
			</div>
		</div>
	);
}
