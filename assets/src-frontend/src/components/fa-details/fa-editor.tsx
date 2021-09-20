import React, { ReactElement, useEffect, useReducer, useState } from 'react';
import {
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement
} from '../../datasources';
import { useCommercialProducts } from '../../hooks/use-commercial-products';
import { LoadingFallback } from '../loading-fallback';
import { CSButton, CSDataTable } from '@cloudsense/cs-ui-components';

import negotiationReducer, { selectAttachment } from './negotiation/negotiation-reducer';
import { AddProductsModal } from '../dialogs/add-products-modal';
import { useGetFaAttachment } from '../../hooks/use-get-fa-attachment';
import { QueryStatus } from 'react-query';
import { useCommercialProductData } from '../../hooks/use-commercial-product-data';
import { useSaveAttachment } from '../../hooks/use-save-attachment';

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

	useEffect(() => {
		if (attachmentStatus === QueryStatus.Success) {
			const alreadyAddedProductIds = Object.keys(attachment?.products || {});
			setProductIds(alreadyAddedProductIds.length ? alreadyAddedProductIds : undefined);
		}
	}, [attachmentStatus, attachment]);

	useEffect(() => {
		if (productDataStatus === QueryStatus.Success && productsStatus === QueryStatus.Success) {
			addProductsToFa(products);
		}
	}, [productDataStatus, products, productsStatus]);

	const [state, dispatch] = useReducer(negotiationReducer, {
		products: {},
		offers: {},
		addons: {}
	});

	useEffect(() => {
		saveAttachment({ faId: agreement?.id || '', attachment: selectAttachment(state) });
	}, [Object.keys(state.products).length, agreement]);

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
		/>
	);

	return (
		<LoadingFallback status={productsStatus}>
			<LoadingFallback status={attachmentStatus}>
				{isAddProductModalOpen && productSelection}
				{/* TODO: products will be fed to seperate component to render products/details */}
				{products.map((product) => (
					<p>
						{product.id}::: {product.name}
					</p>
				))}
				{/* TODO: add table rows data */}
				<CSDataTable
					columns={[
						{
							key: 'products',
							header: 'products'
						}
					]}
					rows={[
						{
							key: 0,
							data: {
								products: ''
							}
						}
					]}
					density="comfortable"
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
