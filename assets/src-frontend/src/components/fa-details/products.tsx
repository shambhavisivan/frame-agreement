import { CSAlert, CSButton } from '@cloudsense/cs-ui-components';
import React, { ReactElement, useContext, useState, useEffect } from 'react';
import {
	CommercialProductStandalone,
	FrameAgreement,
	SelectedProducts,
	TabNames
} from '../../datasources';
import { FamWindow } from '../../datasources/register-apis';
import { DeleteModal } from '../dialogs/delete-modal';
import { ProductListGrid } from './product-list-grid';
import { publishEventData } from '../../utils/publisher-subscriber-utils';
import { useCommercialProducts } from '../../hooks/use-commercial-products';
import { store } from './details-page-provider';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { AddProductsModal } from '../dialogs/add-products-modal';

declare const window: FamWindow;

interface ProductsProps {
	agreement: FrameAgreement;
	setFaFooterActionButtons: React.Dispatch<React.SetStateAction<React.ReactElement>>;
}

export function Products({ agreement, setFaFooterActionButtons }: ProductsProps): ReactElement {
	const [productIds, setProductIds] = useState<string[] | undefined>(undefined);
	const { data: products = [] } = useCommercialProducts(productIds);
	const [isAddProductModalOpen, setAddProductsModalOpen] = useState<boolean>(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [selectedProducts, setSelectedProducts] = useState<SelectedProducts>({});
	const {
		dispatch,
		negotiation: { products: stateProduct },
		discountData
	} = useContext(store);
	const labels = useCustomLabels();

	useEffect(() => {
		setFaFooterActionButtons(getFooterActionButtons());
	}, [selectedProducts]);

	useEffect(() => {
		const alreadyAddedProductIds = Object.keys(stateProduct || {});
		setProductIds(alreadyAddedProductIds.length ? alreadyAddedProductIds : undefined);
	}, [stateProduct, discountData]);

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

		setSelectedProducts({});
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
			activeTab={TabNames.products}
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

	const isDisabled = (): boolean => {
		return Object.keys(selectedProducts).length ? false : true;
	};

	const getFooterActionButtons = (): ReactElement => {
		return (
			<>
				<CSButton
					label={labels.btnAddProducts}
					size="large"
					onClick={(): void => setAddProductsModalOpen(true)}
				/>

				<CSButton
					label={labels.btnDeleteProducts}
					size="large"
					onClick={(): void => setIsDeleteModalOpen(true)}
					disabled={isDisabled()}
				/>
			</>
		);
	};

	return (
		<>
			{isAddProductModalOpen && productSelection}
			{isDeleteModalOpen && deletionModal}
			<ProductListGrid
				data={products}
				selectedProducts={Object.values(selectedProducts || [])}
				onSelectRow={selectProducts}
				isCollapsible={true}
				customNoDataAlert={
					<CSAlert
						variant="info"
						text={[labels.addProductCTAMessage, labels.saveFaProductsMessage]}
					/>
				}
			/>
		</>
	);
}
