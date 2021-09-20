import {
	CSModal,
	CSModalHeader,
	CSModalBody,
	CSModalFooter,
	CSButton
} from '@cloudsense/cs-ui-components';
import React, { ReactElement, useEffect, useState } from 'react';
import { QueryStatus } from 'react-query';
import { AppSettings, CommercialProductStandalone } from '../../datasources';
import {
	CommercialProductRole,
	CommercialProductType,
	ProductFilter
} from '../../datasources/graphql-endpoints/interface';
import { useCommercialProducts } from '../../hooks/use-commercial-products';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { useFilterCommercialProduct } from '../../hooks/use-filter-commercial-product';
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
	const [productIds, setProductIds] = useState<string[] | undefined>(undefined);
	const { data: products, status } = useCommercialProducts(productIds);
	const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>({});
	const [showCategorizationPanel, setShowCategorizationPanel] = useState(false);
	const [categoryId, setCategoryId] = useState('');
	const { products: productsInCategory, productStatus } = useProductsInCategory(
		categoryId,
		commercialProductFilter
	);
	// legacy filter
	const [filterCp, setFilterCp] = useState<AppSettings['categorizationData']>([]);
	const { filteredCp, filterCpStatus } = useFilterCommercialProduct(filterCp);
	const labels = useCustomLabels();
	const [productList, setProductList] = useState<CommercialProductStandalone[]>([]);

	useEffect(() => {
		if (status === QueryStatus.Success) {
			setProductList(products || []);
		}
	}, [products, status]);

	useEffect(() => {
		if (productStatus === QueryStatus.Success) {
			const productsInCategoryIdList = productsInCategory?.map((product) => product.id);
			setProductIds(productsInCategoryIdList || []);
		}
	}, [productStatus, productsInCategory]);

	useEffect(() => {
		if (filterCpStatus === QueryStatus.Success) {
			setProductList(filteredCp || []);
		}
	}, [filterCpStatus, filteredCp]);

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
		setSelectedProducts(
			(prevState): SelectedProducts => {
				return { ...prevState, ...selected };
			}
		);
	};

	const reloadCps = (value: string | Record<string, string[]>): void => {
		if (typeof value === 'string') {
			// if isPsEnabledTrue
			if (!value) {
				setProductIds([]);
			}
			setCategoryId(value);
		} else {
			const transformedFilter: AppSettings['categorizationData'] = [];
			Object.keys(value).forEach((keys) => {
				if (value[keys]) {
					transformedFilter.push(({
						field: keys,
						values: value[keys]
					} as unknown) as SfGlobal.CategorizationData);
				}
			});

			setFilterCp(transformedFilter);
		}
	};

	const searchHandler = (filterString: string): void => {
		if (!filterString) {
			setProductList(products || []);
			return;
		}

		const filteredList = products?.filter((product) =>
			product.name.toLowerCase().includes(filterString.toLowerCase())
		);
		if (filteredList?.length) {
			setProductList(filteredList);
		}
	};

	const onClose = (): void => {
		setFilterCp([]);
		onModalClose();
		setProductIds([]);
		setShowCategorizationPanel(false);
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
					label={labels.modalCategorizationTitle}
					onClick={(): void => setShowCategorizationPanel((prevState) => !prevState)}
				/>
				{showCategorizationPanel && <ProductCategorisation onApplyFilter={reloadCps} />}
				{productList.length ? (
					<ProductListGrid
						data={productList.filter(
							(product: CommercialProductStandalone) =>
								!addedProductIds.includes(product.id)
						)}
						selectedProducts={updateSelectedProducts}
						filterHandler={searchHandler}
					/>
				) : (
					<p>No products to show here</p>
				)}
			</CSModalBody>
			<CSModalFooter>
				<CSButton
					label={labels.btnAddProducts}
					disabled={!Object.values(selectedProducts)?.length}
					onClick={(): void => {
						onAddProducts(Object.values(selectedProducts));
						onModalClose();
					}}
				/>
				<CSButton label={labels.btnClose} onClick={onClose} />
			</CSModalFooter>
		</CSModal>
	);
}
