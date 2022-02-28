import React, { ReactElement, useState } from 'react';
import { CSTabGroup, CSTab } from '@cloudsense/cs-ui-components';
import { CommercialProductStandalone, FrameAgreement } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { ProductListGrid } from './product-list-grid';
import { StandaloneAddons } from './standalone-addons/standalone-addons';
import { TabNames } from '../../datasources';

type DetailTabProps = {
	products: CommercialProductStandalone[];
	agreement: FrameAgreement;
	onSelectProduct: (
		event: React.ChangeEvent<HTMLInputElement>,
		productList: CommercialProductStandalone[]
	) => void;
	setActiveTabName: (tabName: TabNames) => void;

	selectedProducts?: CommercialProductStandalone[];
};

export function DetailsTab({
	products,
	agreement,
	onSelectProduct,
	setActiveTabName,
	selectedProducts
}: DetailTabProps): ReactElement {
	const [activeTab, setActiveTab] = useState(TabNames.products);
	const labels = useCustomLabels();

	const tabClickHandler = (tabName: TabNames): void => {
		setActiveTab(tabName);
		setActiveTabName(tabName);
	};

	return (
		<div>
			<div>
				<CSTabGroup>
					<CSTab
						name={labels.productsTitle}
						active={activeTab === TabNames.products}
						onClick={(): void => {
							tabClickHandler(TabNames.products);
						}}
					/>
					<CSTab
						name={labels.addonsTabTitle}
						active={activeTab === TabNames.addonSA}
						onClick={(): void => {
							tabClickHandler(TabNames.addonSA);
						}}
					/>
					<CSTab
						name={labels.offersTabTitle}
						active={activeTab === TabNames.offers}
						onClick={(): void => {
							tabClickHandler(TabNames.offers);
						}}
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
			<div>
				{activeTab === TabNames.addonSA && (
					<StandaloneAddons activeTab={activeTab} agreement={agreement} />
				)}
			</div>
		</div>
	);
}
