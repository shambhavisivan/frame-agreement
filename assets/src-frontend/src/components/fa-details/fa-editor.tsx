import React, { ReactElement, useContext, useEffect, useState } from 'react';
import {
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement,
	TabNames
} from '../../datasources';
import { useCommercialProducts } from '../../hooks/use-commercial-products';
import { useGetAttachmentExtended } from '../../hooks/use-get-attachment-extended';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { LoadingFallback } from '../loading-fallback';
import { CSButton } from '@cloudsense/cs-ui-components';

import { AddProductsModal, SelectedProducts } from '../dialogs/add-products-modal';
import { DeleteModal } from '../dialogs/delete-modal';

import { useGetFaAttachment } from '../../hooks/use-get-fa-attachment';
import { QueryStatus } from 'react-query';
import { useCommercialProductData } from '../../hooks/use-commercial-product-data';
import { DetailsTab } from './details-tab';
import { store } from './details-page-provider';
import { usePublisher as publishEventData } from '../../hooks/use-publisher-subscriber';
import { FamWindow } from '../../datasources/register-apis';

interface FaEditorProps {
	agreement?: FrameAgreement;
}

declare const window: FamWindow;

export function FaEditor({ agreement }: FaEditorProps): ReactElement {
	const { attachment, attachmentStatus } = useGetFaAttachment(agreement?.id || '');
	const [productIds, setProductIds] = useState<string[] | undefined>(undefined);
	// fetch only added products and required data intially
	const { data: products = [], status: productsStatus } = useCommercialProducts(productIds);
	const [isAddProductModalOpen, setAddProductsModalOpen] = useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const { data: productsData, status: productDataStatus } = useCommercialProductData(
		productIds || []
	);
	const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>({});
	const {
		dispatch,
		negotiation: { products: stateProduct },
		discountData
	} = useContext(store);
	const [activeTab, setActiveTab] = useState(TabNames.products);
	const labels = useCustomLabels();
	const attachmentExtended = useGetAttachmentExtended(attachment || {}, attachmentStatus);

	useEffect(() => {
		if (Object.keys(attachmentExtended).length) {
			dispatch({
				type: 'loadAttachment',
				payload: { attachment: attachment || {}, attachmentExtended }
			});
		}
	}, [attachmentExtended]);

	useEffect(() => {
		const alreadyAddedProductIds = Object.keys(stateProduct || {});
		setProductIds(alreadyAddedProductIds.length ? alreadyAddedProductIds : undefined);
	}, [stateProduct, discountData]);

	useEffect(() => {
		function addProductsToFa(products: CommercialProductStandalone[]): void {
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
		if (productDataStatus === QueryStatus.Success && productsStatus === QueryStatus.Success) {
			addProductsToFa(products);
		}
	}, [productDataStatus, products, productsData, productsStatus]);

	const onAddProducts = (products: CommercialProductStandalone[]): void =>
		setProductIds((prevState) => [
			...(prevState || []),
			...products.map((product) => product.id)
		]);

	const productSelection = (
		<AddProductsModal
			isModalOpen={isAddProductModalOpen}
			onAddProducts={onAddProducts}
			onModalClose={(): void => setAddProductsModalOpen(false)}
			addedProductIds={productIds || []}
		></AddProductsModal>
	);

	const deleteProdConfirmationHandler = async (): Promise<void> => {
		const idsDeleted = Object.keys(selectedProducts);
		await publishEventData<string[]>('onBeforeDeleteProducts', idsDeleted);
		const idsToDisplay = productIds?.filter((id) => !idsDeleted.includes(id));
		setProductIds(idsToDisplay);

		dispatch({
			type: 'removeProducts',
			payload: { productIds: idsDeleted }
		});
		const validateStatusConsistencyFunc = window?.FAM?.api?.validateStatusConsistency as (
			faId: string
		) => Promise<void>;
		await validateStatusConsistencyFunc(agreement?.id || '');

		await publishEventData<string[]>('onAfterDeleteProducts', idsToDisplay || []);

		setSelectedProducts({});
		setIsDeleteModalOpen(false);
	};

	const deleteProdCancelHandler = (): void => {
		setIsDeleteModalOpen(false);
	};

	const deletionModal = (
		<DeleteModal
			isDeleteModalVisible={isDeleteModalOpen}
			confirmHandler={deleteProdConfirmationHandler}
			cancelHandler={deleteProdCancelHandler}
			activeTab={activeTab}
		/>
	);

	const selectProducts = (
		event: React.ChangeEvent<HTMLInputElement>,
		productList: CommercialProductStandalone[]
	): void => {
		const selected = productList.reduce(
			(selectedProd, currentSelected): SelectedProducts => {
				if (!selectedProd[currentSelected.id]) {
					selectedProd[currentSelected.id] = currentSelected;
				} else {
					delete selectedProd[currentSelected.id];
				}
				return selectedProd;
			},
			{ ...selectedProducts }
		);

		setSelectedProducts(selected);
	};

	const isDisabled = (): boolean => {
		return Object.keys(selectedProducts).length ? false : true;
	};

	return (
		<LoadingFallback status={productsStatus}>
			<LoadingFallback status={attachmentStatus}>
				{isAddProductModalOpen && productSelection}
				{isDeleteModalOpen && deletionModal}
				<DetailsTab
					products={productIds?.length ? products : []}
					agreement={agreement || ({} as FrameAgreement)}
					onSelectProduct={selectProducts}
					selectedProducts={Object.values(selectedProducts)}
					setActiveTabName={setActiveTab}
				/>
				{/* TODO: Move this to parent file. It needs to be sibling to header and pages. Add conditional so it is only rendered on details page */}
				<footer className="action-footer">
					{activeTab === TabNames.products && (
						<CSButton
							label={labels.btnAddProducts}
							size="large"
							onClick={(): void => setAddProductsModalOpen(true)}
						/>
					)}

					{activeTab === TabNames.products && (
						<CSButton
							label={labels.btnDeleteProducts}
							size="large"
							onClick={(): void => setIsDeleteModalOpen(true)}
							disabled={isDisabled()}
						/>
					)}
				</footer>
			</LoadingFallback>
		</LoadingFallback>
	);
}
