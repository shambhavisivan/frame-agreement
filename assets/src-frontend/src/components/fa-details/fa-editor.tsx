import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { CommercialProductData, FrameAgreement, TabNames } from '../../datasources';
import { useCommercialProducts } from '../../hooks/use-commercial-products';
import { useGetAttachmentOriginalItems } from '../../hooks/use-get-attachment-original-items';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { LoadingFallback } from '../loading-fallback';
import { CSTab, CSTabGroup } from '@cloudsense/cs-ui-components';
import { useGetFaAttachment } from '../../hooks/use-get-fa-attachment';
import { QueryStatus } from 'react-query';
import { useCommercialProductData } from '../../hooks/use-commercial-product-data';
import { store } from './details-page-provider';
import { StandaloneAddons } from './standalone-addons/standalone-addons';
import { Products } from './products';
import { useAppSettings } from '../../hooks/use-app-settings';

interface FaEditorProps {
	setFaFooterActionButtons: React.Dispatch<React.SetStateAction<React.ReactElement>>;
	agreement?: FrameAgreement;
}

export function FaEditor({ setFaFooterActionButtons, agreement }: FaEditorProps): ReactElement {
	const { attachment, attachmentStatus } = useGetFaAttachment(agreement?.id || '');
	const [productIds, setProductIds] = useState<string[] | undefined>(undefined);
	// fetch only added products and required data intially
	const { data: products = [], status: productsStatus } = useCommercialProducts(productIds);
	const { data: productsData, status: productDataStatus } = useCommercialProductData(
		productIds || []
	);
	const {
		dispatch,
		negotiation: { products: stateProduct }
	} = useContext(store);
	const [activeTab, setActiveTab] = useState(TabNames.products);
	const labels = useCustomLabels();
	const attachmentOriginalItems = useGetAttachmentOriginalItems(
		attachment || {},
		attachmentStatus
	);
	const { settings } = useAppSettings();

	useEffect(() => {
		if (Object.keys(attachmentOriginalItems).length) {
			dispatch({
				type: 'loadAttachment',
				payload: { attachment: attachment || {}, attachmentOriginalItems }
			});
		}
	}, [attachmentOriginalItems]);

	useEffect(() => {
		const alreadyAddedProductIds = Object.keys(stateProduct || {});
		setProductIds(alreadyAddedProductIds.length ? alreadyAddedProductIds : undefined);
	}, [stateProduct]);

	useEffect(() => {
		if (productDataStatus === QueryStatus.Success && productsStatus === QueryStatus.Success) {
			dispatch({
				type: 'addProducts',
				payload: {
					products: products,
					productsData: productsData || ({} as CommercialProductData)
				}
			});
			dispatch({
				type: 'setDiscountData',
				payload: {
					products: products,
					productsData: productsData || ({} as CommercialProductData)
				}
			});
		}
	}, [productDataStatus, products, productsData, productsStatus]);

	const tabClickHandler = (tabName: TabNames): void => {
		setActiveTab(tabName);
	};

	return (
		<LoadingFallback status={productsStatus && productDataStatus}>
			<LoadingFallback status={attachmentStatus}>
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
						{settings?.facSettings.isPsEnabled && (
							<CSTab
								name={labels.offersTabTitle}
								active={activeTab === TabNames.offers}
								onClick={(): void => {
									tabClickHandler(TabNames.offers);
								}}
							/>
						)}
					</CSTabGroup>
				</div>
				<div>
					{activeTab === TabNames.products && (
						<Products
							agreement={agreement || ({} as FrameAgreement)}
							setFaFooterActionButtons={setFaFooterActionButtons}
						/>
					)}
				</div>
				<div>
					{activeTab === TabNames.addonSA && (
						<StandaloneAddons
							agreement={agreement || ({} as FrameAgreement)}
							setFaFooterActionButtons={setFaFooterActionButtons}
						/>
					)}
				</div>
			</LoadingFallback>
		</LoadingFallback>
	);
}
