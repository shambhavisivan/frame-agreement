import {
	CSModal,
	CSModalHeader,
	CSModalBody,
	CSModalFooter,
	CSButton
} from '@cloudsense/cs-ui-components';
import React, { ReactElement, useState } from 'react';
import { CommercialProductStandalone } from '../../datasources';
import { useCommercialProducts } from '../../hooks/use-commercial-products';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { ProductListGrid, ProductStatus } from '../fa-details/product-list-grid';

interface AddProductsModalProp {
	isModalOpen: boolean;
	onModalClose: () => void;
	onAddProducts: (products: CommercialProductStandalone[]) => void;
	addedProductIds: Array<string>;
}
type SelectedProducts = { [id: string]: CommercialProductStandalone };

export function AddProductsModal({
	isModalOpen,
	onAddProducts,
	onModalClose,
	addedProductIds
}: AddProductsModalProp): ReactElement {
	const { data: products } = useCommercialProducts();
	const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>({});
	const labels = useCustomLabels();

	const updateSelectedProducts = (
		selectedRows: CommercialProductStandalone[],
		productStatus: ProductStatus
	): void => {
		const selected = selectedRows.reduce(
			(selectedProd, currentSelected): SelectedProducts => {
				if (!selectedProd[currentSelected.id] && productStatus === 'add') {
					selectedProd[currentSelected.id] = currentSelected;
				} else {
					selectedProd[currentSelected.id] && delete selectedProd[currentSelected.id];
				}
				return selectedProd;
			},
			{ ...selectedProducts }
		);
		setSelectedProducts(selected);
	};

	return (
		<CSModal
			visible={isModalOpen}
			outerClickClose
			size="medium"
			className="product-selection-modal"
		>
			<CSModalHeader title={labels.modalAddFaTitle} />
			<CSModalBody padding="0">
				{products ? (
					<ProductListGrid
						data={products.filter((product) => !addedProductIds.includes(product.id))}
						selectedProducts={updateSelectedProducts}
					/>
				) : (
					<p>No products to show here</p>
				)}
			</CSModalBody>
			<CSModalFooter>
				<CSButton
					label={labels.btnAddProducts}
					disabled={!selectedProducts?.length}
					onClick={(): void => {
						onAddProducts(Object.values(selectedProducts));
						onModalClose();
					}}
				/>
				<CSButton label={labels.btnClose} onClick={onModalClose} />
			</CSModalFooter>
		</CSModal>
	);
}
