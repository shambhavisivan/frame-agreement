import React, { ReactElement, useContext, useEffect, useState } from 'react';
import {
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement
} from '../../datasources';
import { useCommercialProducts } from '../../hooks/use-commercial-products';
import { LoadingFallback } from '../loading-fallback';
import { CSButton } from '@cloudsense/cs-ui-components';

import { selectAttachment } from './negotiation/negotiation-reducer';
import { AddProductsModal, SelectedProducts } from '../dialogs/add-products-modal';
import { useGetFaAttachment } from '../../hooks/use-get-fa-attachment';
import { QueryStatus } from 'react-query';
import { useCommercialProductData } from '../../hooks/use-commercial-product-data';
import { useSaveAttachment } from '../../hooks/use-save-attachment';
import { ProductStatus } from './product-list-grid';
import { DetailsTab } from './details-tab';
import { store } from './details-page-provider';

interface FaEditorProps {
	agreement?: FrameAgreement;
}

export function FaEditor({ agreement }: FaEditorProps): ReactElement {
	const { attachment, attachmentStatus } = useGetFaAttachment(agreement?.id || '');
	const [productIds, setProductIds] = useState<string[] | undefined>(undefined);
	// fetch only added products and required data intially
	const { data: products = [], status: productsStatus } = useCommercialProducts(productIds);
	const [isAddProductModalOpen, setAddProductsModalOpen] = useState<boolean>(false);
	const { data: productsData, status: productDataStatus } = useCommercialProductData(
		productIds || []
	);
	const { mutate: saveAttachment } = useSaveAttachment();
	const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>({});
	const { dispatch, ...state } = useContext(store);

	useEffect(() => {
		if (attachmentStatus === QueryStatus.Success) {
			const alreadyAddedProductIds = Object.keys(attachment?.products || {});
			setProductIds(alreadyAddedProductIds.length ? alreadyAddedProductIds : undefined);
		}
	}, [attachmentStatus, attachment]);

	useEffect(() => {
		if (Object.keys(state.products).length) {
			saveAttachment({
				faId: agreement?.id || '',
				attachment: selectAttachment(state)
			});
		}
	}, [agreement?.id, saveAttachment, Object.keys(state.products).length]);

	useEffect(() => {
		if (productDataStatus === QueryStatus.Success && productsStatus === QueryStatus.Success) {
			addProductsToFa(products);
		}
	}, [productDataStatus, products, productsStatus]);

	function addProductsToFa(products: CommercialProductStandalone[]): void {
		dispatch({
			type: 'addProducts',
			payload: {
				products: products,
				productsData: productsData || ({} as CommercialProductData)
			}
		});
	}

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

	const selectProducts = (
		productList: CommercialProductStandalone[],
		productStatus: ProductStatus
	): void => {
		const selected = productList.reduce(
			(selectedProd, currentSelected): SelectedProducts => {
				if (!selectedProd[currentSelected.id] && productStatus === 'add') {
					selectedProd[currentSelected.id] = currentSelected;
				} else {
					delete selectedProd[currentSelected.id];
				}
				return selectedProd;
			},
			{ ...selectedProducts }
		);
		setSelectedProducts(
			(prevState): SelectedProducts => {
				return { ...prevState, ...selected };
			}
		);
	};

	return (
		<LoadingFallback status={productsStatus}>
			<LoadingFallback status={attachmentStatus}>
				{isAddProductModalOpen && productSelection}
				<DetailsTab
					products={productIds?.length ? products : []}
					selectedProducts={selectProducts}
					attachment={attachment || {}}
				/>
				{/* TODO: Move this to parent file. It needs to be sibling to header and pages. Add conditional so it is only rendered on details page */}
				<footer className="action-footer">
					<CSButton
						label="Add products"
						size="large"
						onClick={(): void => setAddProductsModalOpen(true)}
					/>
				</footer>
			</LoadingFallback>
		</LoadingFallback>
	);
}
