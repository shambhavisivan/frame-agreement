import {
	CSModal,
	CSModalHeader,
	CSModalBody,
	CSInputSearch,
	CSDataTable,
	CSModalFooter,
	CSButton,
	CSDataTableRowInterface
} from '@cloudsense/cs-ui-components';
import React, { ReactElement, useState } from 'react';
import { CommercialProductStandalone } from '../../datasources';
import { useCommercialProducts } from '../../hooks/use-commercial-products';
import { useCustomLabels } from '../../hooks/use-custom-labels';

interface AddProductsModalProp {
	isModalOpen: boolean;
	onModalClose: () => void;
	onAddProducts: (products: CommercialProductStandalone[]) => void;
	addedProductIds: Array<string>;
}

export function AddProductsModal({
	isModalOpen,
	onAddProducts,
	onModalClose,
	addedProductIds
}: AddProductsModalProp): ReactElement {
	const { data: products } = useCommercialProducts();
	const [selectedProducts, setSelectedProducts] = useState<CommercialProductStandalone[]>([]);
	const labels = useCustomLabels();

	function CommercialProductOption({
		product,
		onClick
	}: {
		product: CommercialProductStandalone;
		onClick: (product: CommercialProductStandalone) => void;
	}): ReactElement {
		return (
			<CSButton
				key={product.id}
				label={product.name}
				onClick={(): void => onClick(product)}
			/>
		);
	}

	const onSelectProducts = (product: CommercialProductStandalone): void =>
		setSelectedProducts((prevSelected) => [...prevSelected, product]);

	return (
		<CSModal
			visible={isModalOpen}
			outerClickClose
			size="medium"
			className="product-selection-modal"
		>
			<CSModalHeader title={labels.modalAddFaTitle} />
			<CSModalBody padding="0">
				{/* TODO: add filter functionality */}
				<CSInputSearch label="Filter products..." width="20rem" />
				{/* row render csbutton logic will be moved to row onclick prop once support for table onclick is added */}
				{/* {this grid logic should be moved to a separate file} */}
				<CSDataTable
					columns={[
						{
							key: 'name',
							header: 'Commercial Product Name',
							grow: 2,
							render: (row): ReactElement => (
								<CommercialProductOption
									product={row.data as CommercialProductStandalone}
									onClick={onSelectProducts}
									key={row.key}
								/>
							)
						},
						{
							key: 'Record ID',
							header: 'Record ID'
						},
						{
							key: 'Is Recurring Discount Allowed',
							header: 'Is Recurring Discount Allowed'
						}
					]}
					rows={
						products
							?.filter((product) => !addedProductIds.includes(product.id))
							.map((product) => ({
								key: product.id,
								data: product
							})) || ([] as CSDataTableRowInterface[])
					}
				/>
			</CSModalBody>
			<CSModalFooter>
				<CSButton
					label={labels.btnAddProducts}
					disabled={!selectedProducts?.length}
					onClick={(): void => {
						onAddProducts(selectedProducts);
						onModalClose();
					}}
				/>
				<CSButton label={labels.btnClose} onClick={onModalClose} />
			</CSModalFooter>
		</CSModal>
	);
}
