import {
	CSModal,
	CSModalHeader,
	CSModalBody,
	CSModalFooter,
	CSButton
} from '@cloudsense/cs-ui-components';
import React, { ReactElement, useEffect, useState } from 'react';
import { QueryStatus } from 'react-query';
import { CommercialProductStandalone } from '../../datasources';
import {
	CommercialProductRole,
	CommercialProductType,
	ProductFilter
} from '../../datasources/graphql-endpoints/interface';
import { useCommercialProducts } from '../../hooks/use-commercial-products';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { useProductsInCategory } from '../../hooks/use-products-in-category';
import { ProductListGrid, ProductStatus } from '../fa-details/product-list-grid';
import { ProductCategorisation } from './product-categorisation';

interface AddProductsModalProp {
	isModalOpen: boolean;
	onModalClose: () => void;
	onAddProducts: (products: CommercialProductStandalone[]) => void;
	addedProductIds: Array<string>;
}
type SelectedProducts = { [id: string]: CommercialProductStandalone };
const commercialProductFilter: ProductFilter = {
	role: CommercialProductRole.basic,
	type: CommercialProductType.commercialProduct
};
export function AddProductsModal({
	isModalOpen,
	onAddProducts,
	onModalClose,
	addedProductIds
}: AddProductsModalProp): ReactElement {
	const [productIds, setProductIds] = useState<string[]>([]);
	const { data: products } = useCommercialProducts(productIds);
	const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>({});
	const [showCategorizationPanel, setShowCategorizationPanel] = useState(false);
	const [categoryId, setCategoryId] = useState('');
	const { products: productsInCategory, productStatus } = useProductsInCategory(
		categoryId,
		commercialProductFilter
	);
	const labels = useCustomLabels();

	useEffect(() => {
		if (productStatus === QueryStatus.Success) {
			const productsInCategoryIdList = productsInCategory?.map((product) => product.id);
			setProductIds(productsInCategoryIdList || []);
		}
	}, [productStatus, productsInCategory]);

	const updateSelectedProducts = (
		selectedRows: CommercialProductStandalone[],
		productStatus: ProductStatus
	): void => {
		const selected = selectedRows.reduce(
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
		setSelectedProducts(selected);
	};

	const reloadCps = (value: string | Record<string, string[]>): void => {
		if (typeof value === 'string') {
			// if isPsEnabledTrue
			setCategoryId(value);
		}
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
				<CSButton
					label={labels.modalCategorizationBtnAdd}
					onClick={(): void => setShowCategorizationPanel((prevState) => !prevState)}
				/>
				{showCategorizationPanel && <ProductCategorisation onApplyFilter={reloadCps} />}
				{products ? (
					<ProductListGrid
						data={products.filter((product) => !addedProductIds.includes(product.id))}
						selectedProducts={updateSelectedProducts}
						filterHandler={reloadCps}
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
