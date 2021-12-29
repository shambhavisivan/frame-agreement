import React, { ReactElement, useState } from 'react';
import { CSTabGroup, CSTab } from '@cloudsense/cs-ui-components';
import { ProductStatus } from './product-list-grid';
import { CommercialProductStandalone } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { ProductsList } from './products-list';
import { StandaloneAddons } from './standalone-addons/standalone-addons';

type DetailTabProps = {
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

export function DetailsTab({ products }: DetailTabProps): ReactElement {
	const [activeTab, setActiveTab] = useState(TabNames.products);
	const labels = useCustomLabels();
	const onTabClick = (activeTab: TabNames): void => setActiveTab(activeTab);

	return (
		<div>
			<div>
				<CSTabGroup>
					<CSTab
						name={labels.productsTitle}
						active={activeTab === TabNames.products}
						onClick={(): void => onTabClick(TabNames.products)}
					/>
					<CSTab
						name={labels.addonsTabTitle}
						active={activeTab === TabNames.addonSA}
						onClick={(): void => onTabClick(TabNames.addonSA)}
					/>
					<CSTab
						name={labels.offersTabTitle}
						active={activeTab === TabNames.offers}
						onClick={(): void => onTabClick(TabNames.offers)}
					/>
				</CSTabGroup>
			</div>
			<div>{activeTab === TabNames.products && <ProductsList productList={products} />}</div>
			<div>{activeTab === TabNames.addonSA && <StandaloneAddons />}</div>
		</div>
	);
}
