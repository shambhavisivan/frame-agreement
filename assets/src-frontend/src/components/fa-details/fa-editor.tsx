import React, { ReactElement, useEffect, useMemo, useReducer, useState } from 'react';
import { FrameAgreement } from '../../datasources';
import { useCommercialProducts } from '../../hooks/use-commercial-products';
import { LoadingFallback } from '../loading-fallback';
import { createActionsForProduct } from './negotiation/negotiation-action-creator';
import { CSButton, CSDataTable } from '@cloudsense/cs-ui-components';

import negotiationReducer from './negotiation/negotiation-reducer';
import { ProductsList } from './products-list';
import { AddProductsModal } from '../dialogs/add-products-modal';
import { useGetFaAttachment } from '../../hooks/use-get-fa-attachment';
import { QueryStatus } from 'react-query';

interface FaEditorProps {
	agreement?: FrameAgreement;
}

export function FaEditor({ agreement }: FaEditorProps): ReactElement {
	const { attachment, attachmentStatus } = useGetFaAttachment(agreement?.id || '');
	const [productIds, setProductIds] = useState<string[]>([]);
	// fetch only added products and required data intially
	const { data: products = [], status: productsStatus } = useCommercialProducts(productIds);
	const [isAddProductModalOpen, setAddProductsModalOpen] = useState<boolean>(false);

	useEffect(() => {
		if (attachmentStatus === QueryStatus.Success) {
			const alreadyAddedProductIds = Object.keys(attachment?.products || {});
			setProductIds(alreadyAddedProductIds);
		}
	}, [attachmentStatus, attachment]);

	const [state, dispatch] = useReducer(negotiationReducer, { products: {} });

	const selectedProducts = useMemo(
		() =>
			Object.entries(state.products).map(([productId, productNegotiation]) => {
				const matchingCommercialProduct = products.find((p) => p.id === productId);

				if (!matchingCommercialProduct) {
					throw new Error('Attached product does not exist in the product list');
				}

				return {
					...productNegotiation,
					...matchingCommercialProduct
				};
			}),
		[products, state.products]
	);

	const productSelection = (
		<AddProductsModal
			isModalOpen={isAddProductModalOpen}
			onAddProducts={(products): void =>
				setProductIds((prevState) => [
					...prevState,
					...products.map((product) => product.id)
				])
			}
			onModalClose={(): void => setAddProductsModalOpen(false)}
			addedProductIds={productIds}
		></AddProductsModal>
	);

	return (
		<LoadingFallback status={productsStatus}>
			<LoadingFallback status={attachmentStatus}>
				{productSelection}
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
				<ProductsList
					selectedProducts={selectedProducts}
					createProductActions={createActionsForProduct(dispatch)}
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
