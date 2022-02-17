import React, { ReactElement, useState } from 'react';
import { CSTabGroup, CSTab } from '@cloudsense/cs-ui-components';
import { CommercialProductStandalone } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { ProductListGrid } from './product-list-grid';
import { StandaloneAddons } from './standalone-addons/standalone-addons';

type DetailTabProps = {
	products: CommercialProductStandalone[];
	onSelectProduct: (
		event: React.ChangeEvent<HTMLInputElement>,
		productList: CommercialProductStandalone[]
	) => void;
	selectedProducts?: CommercialProductStandalone[];
};

const enum TabNames {
	'products' = 'PRODUCTS',
	'offers' = 'OFFERS',
	'addonSA' = 'ADDON_STAND_ALONE'
}

export function DetailsTab({
	products,
	onSelectProduct,
	selectedProducts
}: DetailTabProps): ReactElement {
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
			<div>
				{activeTab === TabNames.products && (
					<ProductListGrid
						data={products}
						selectedProducts={Object.values(selectedProducts || [])}
						onSelectRow={onSelectProduct}
						isCollapsible={true}
					/>
				)}
			</div>
			<div>{activeTab === TabNames.addonSA && <StandaloneAddons />}</div>
		</div>
	);
}
