import React, { ReactElement, useContext, useEffect, useState } from 'react';
import {
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement
} from '../../datasources';
import { useCommercialProducts } from '../../hooks/use-commercial-products';
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
		negotiation: { products: stateProduct }
	} = useContext(store);

	useEffect(() => {
		if (attachmentStatus === QueryStatus.Success) {
			dispatch({
				type: 'loadAttachment',
				payload: { attachment: attachment || {} }
			});
		}
	}, [attachmentStatus, attachment]);

	useEffect(() => {
		const alreadyAddedProductIds = Object.keys(stateProduct || {});
		setProductIds(alreadyAddedProductIds.length ? alreadyAddedProductIds : undefined);
	}, [stateProduct]);

	useEffect(() => {
		function addProductsToFa(products: CommercialProductStandalone[]): void {
			dispatch({
				type: 'addProducts',
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

	return (
		<LoadingFallback status={productsStatus}>
			<LoadingFallback status={attachmentStatus}>
				{isAddProductModalOpen && productSelection}
				{isDeleteModalOpen && deletionModal}
				<DetailsTab
					products={productIds?.length ? products : []}
					onSelectProduct={selectProducts}
					selectedProducts={Object.values(selectedProducts)}
				/>
				{/* TODO: Move this to parent file. It needs to be sibling to header and pages. Add conditional so it is only rendered on details page */}
				<footer className="action-footer">
					<CSButton
						label="Add products"
						size="large"
						onClick={(): void => setAddProductsModalOpen(true)}
					/>

					<CSButton
						label="Delete products"
						size="large"
						onClick={(): void => setIsDeleteModalOpen(true)}
						disabled={!productIds?.length}
					/>
				</footer>
			</LoadingFallback>
		</LoadingFallback>
	);
}
