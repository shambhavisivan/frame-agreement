import React, { ReactElement, useState } from 'react';
import { CommercialProductStandalone } from '../../datasources';
import { SelectedProducts } from '../dialogs/add-products-modal';
import { ProductListGrid } from './product-list-grid';

interface ProductsListProps {
	productList: CommercialProductStandalone[];
}

export function ProductsList({ productList }: ProductsListProps): ReactElement {
	const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>({});

	const onSelectProduct = (
		event: React.ChangeEvent<HTMLInputElement>,
		selectedRows: CommercialProductStandalone[]
	): void => {
		const selected = selectedRows.reduce(
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
		<div>
			<ProductListGrid
				data={productList}
				selectedProducts={Object.values(selectedProducts) || []}
				onSelectRow={onSelectProduct}
			/>
		</div>
	);
}
