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
import { useGetProductIds } from '../../hooks/use-get-product-ids';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { useFilterCommercialProduct } from '../../hooks/use-filter-commercial-product';
import { useProductsInCategory } from '../../hooks/use-products-in-category';
import { ProductListGrid } from '../fa-details/product-list-grid';
import { ProductCategorisation } from './product-categorisation';
import { PaginationComputation } from '../pagination-computation';
import { useAppSettings } from '../../hooks/use-app-settings';

interface AddProductsModalProp {
	isModalOpen: boolean;
	onModalClose: () => void;
	onAddProducts: (products: CommercialProductStandalone[]) => void;
	addedProductIds: Array<string>;
}
export interface SelectedProducts {
	[id: string]: CommercialProductStandalone;
}
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

	// pagination related states
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(0);
	const [lastRecordId, setLastRecordId] = useState<string | null>(null);
	// ids of all products that are supposed to be displayed.
	const [allProductIds, setAllProductIds] = useState<string[]>([]);
	// search bar filter value
	const [filterString, setFilterString] = useState<string | null>(null);

	const { data: products, status } = useCommercialProducts(
		productIds,
		filterString,
		lastRecordId,
		pageSize,
		addedProductIds
	);
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

	const { itemIdsStatus, itemIds } = useGetProductIds(productIds, filterString);
	const labels = useCustomLabels();
	const [productList, setProductList] = useState<CommercialProductStandalone[]>([]);
	const { settings } = useAppSettings();
	const isPsEnabled = settings?.facSettings?.isPsEnabled;

	useEffect(() => {
		if (status === QueryStatus.Success && !checkFilterCpIsApplied()) {
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
			if (checkFilterCpIsApplied()) {
				const result = populateLegacyFilteredCpsAndIds();
				let filteredList: CommercialProductStandalone[] = [];
				let filteredIds: string[] = [];
				if (filterString) {
					for (const product of result.filteredProducts || []) {
						if (product.name.toLowerCase().includes(filterString.toLowerCase())) {
							filteredList.push(product);
							filteredIds.push(product.id);
						}
					}
				} else {
					filteredList = result.filteredProducts;
					filteredIds = result.ids;
				}

				setProductList(filteredList);
				setAllProductIds(filteredIds);
			}

			setProductIds([]);
			setLastRecordId(null);
		}
	}, [filterCpStatus, filteredCp]);

	useEffect(() => {
		/*
		 * when legacy filter is removed, [filterCpStatus, filteredCp] useEffect will not run.
		 * in that case this useEffect is used to reset product list, count and ids to original values
		 */
		if (!checkFilterCpIsApplied() && !isPsEnabled) {
			setProductList(products || []);
			setAllProductIds(itemIds || []);
			setProductIds([]);
			setLastRecordId(null);
		}
	}, [filterCp]);

	useEffect(() => {
		let ids: string[] = JSON.parse(JSON.stringify(allProductIds));
		if (itemIdsStatus === QueryStatus.Success && !checkFilterCpIsApplied()) {
			ids = itemIds || [];
		}
		ids = ids.filter((id) => !addedProductIds.includes(id));
		setAllProductIds(ids);
	}, [itemIds, itemIdsStatus, addedProductIds]);

	const checkFilterCpIsApplied = (): boolean => {
		for (const filterItem of filterCp) {
			if (filterItem.values.length) {
				return true;
			}
		}
		return false;
	};

	// returns stringified value of all filters applied.
	const getAllFiltersApplied = (): string => {
		let filterApplied = '';
		if (filterString?.length) {
			filterApplied = filterString;
		}
		if (categoryId?.length) {
			filterApplied += categoryId;
		}
		if (checkFilterCpIsApplied()) {
			filterApplied += JSON.stringify(filterCp);
		}
		return filterApplied;
	};

	const updateSelectedProducts = (
		event: React.ChangeEvent<HTMLInputElement>,
		selectedRows: CommercialProductStandalone[]
	): void => {
		// to support multiSelect, assuming "{selectedRows}" this as an array

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

	const reloadCps = (value: string | Record<string, string[]>): void => {
		if (typeof value === 'string') {
			// if isPsEnabledTrue
			if (!value) {
				setProductIds([]);
				if (!isPsEnabled) {
					setFilterCp([]);
				}
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
		setLastRecordId(null);
	};

	const searchHandler = (filterString: string): void => {
		if (!filterString?.length) {
			setFilterString(null);
			setLastRecordId(null);
			if (!isPsEnabled && checkFilterCpIsApplied()) {
				const result = populateLegacyFilteredCpsAndIds();
				setProductList(result.filteredProducts || []);
				setAllProductIds(result.ids);
			}
			return;
		}

		if (!isPsEnabled && checkFilterCpIsApplied()) {
			legacyFilterWithSearchHandler(filterString);
			return;
		}
		setLastRecordId(null);
		setFilterString(filterString);
	};

	const legacyFilterWithSearchHandler = (filterString: string): void => {
		const filteredList = populateLegacyFilteredCpsAndIds().filteredProducts.filter((product) =>
			product.name.toLowerCase().includes(filterString.toLowerCase())
		);
		setProductList(filteredList);
		const ids = filteredList?.length ? filteredList.map((cp) => cp.id) : [];

		setAllProductIds(ids);
		setLastRecordId(null);
		setFilterString(filterString);
	};

	const populateLegacyFilteredCpsAndIds = (): {
		filteredProducts: CommercialProductStandalone[];
		ids: string[];
	} => {
		const filteredCpResult = {
			filteredProducts: [] as CommercialProductStandalone[],
			ids: [] as string[]
		};
		return (
			filteredCp?.reduce((resultObject, currentCp) => {
				if (!addedProductIds.includes(currentCp.id)) {
					resultObject.filteredProducts.push(currentCp);
					resultObject.ids.push(currentCp.id);
				}
				return resultObject;
			}, filteredCpResult) || filteredCpResult
		);
	};

	const onClose = (): void => {
		setFilterCp([]);
		onModalClose();
		setProductIds([]);
		setShowCategorizationPanel(false);
	};

	const extractItems = (): CommercialProductStandalone[] => {
		let itemsToRender: CommercialProductStandalone[] | null | undefined;

		if (checkFilterCpIsApplied()) {
			const firstIndex = (currentPage - 1) * pageSize;
			const endLimit = firstIndex + pageSize;

			itemsToRender =
				endLimit <= allProductIds.length
					? productList.slice(firstIndex, endLimit)
					: productList.slice(firstIndex, productList.length);
		} else {
			itemsToRender = productList;
		}
		return itemsToRender;
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
				<ProductListGrid
					data={extractItems()}
					filterHandler={searchHandler}
					onSelectRow={updateSelectedProducts}
					selectedProducts={Object.values(selectedProducts)}
				/>
				<PaginationComputation
					updatePageSize={setPageSize}
					updatePage={setCurrentPage}
					setLastRecordId={setLastRecordId}
					filterApplied={getAllFiltersApplied()}
					allIds={allProductIds ? allProductIds : []}
				/>
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
