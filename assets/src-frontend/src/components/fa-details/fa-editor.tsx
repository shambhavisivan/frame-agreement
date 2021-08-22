import React, { FormEvent, ReactElement, useEffect, useReducer, useState } from 'react';
import { CommercialProductStandalone, FrameAgreement } from '../../datasources';
import { useCommercialProductData } from '../../hooks/use-commercial-product-data';
import { useCommercialProducts } from '../../hooks/use-commercial-products';
import { useSaveAttachment } from '../../hooks/use-save-attachment';
import { useUpsertFrameAgreements } from '../../hooks/use-upsert-frame-agreements';
import { LoadingFallback } from '../loading-fallback';
import { FaJsonInput } from './fa-json-input';
import { createActionsForProduct } from './negotiation/negotiation-action-creator';
import {
	CSButton,
	CSInputSearch,
	CSModal,
	CSModalHeader,
	CSModalBody,
	CSModalFooter,
	CSDataTable
} from '@cloudsense/cs-ui-components';

import negotiationReducer, {
	ProductNegotiation,
	selectAttachment
} from './negotiation/negotiation-reducer';
import { ProductsList } from './products-list';

interface FaEditorProps {
	agreement?: FrameAgreement;
}

function CommercialProductOption({
	product,
	onClick
}: {
	product: CommercialProductStandalone;
	onClick: (product: CommercialProductStandalone) => void;
}): ReactElement {
	return (
		<CSButton key={product.id} label={product.name} onClick={(): void => onClick(product)} />
	);
}

export function FaEditor({ agreement }: FaEditorProps): ReactElement {
	const [faDetails, setFaDetails] = useState<Partial<FrameAgreement>>({});
	const { data: products = [], status: productsStatus } = useCommercialProducts();

	const [productIds, setProductIds] = useState<string[]>([]);

	const [modalOpen, setModalOpen] = useState<boolean>(false);

	useEffect(() => {
		if (products.length !== 0) {
			setProductIds(products.map((p) => p.id));
		}
	}, [products]);

	const { data: productsData, status: productDataStatus } = useCommercialProductData(productIds);

	useEffect(() => {
		if (!!agreement) {
			setFaDetails(agreement);
		}
	}, [agreement]);

	const { status, mutate } = useUpsertFrameAgreements();

	const [state, dispatch] = useReducer(negotiationReducer, { products: {} });

	function addProductToFa(product: CommercialProductStandalone): void {
		const productData = productsData?.cpData[product.id];
		if (typeof productData !== 'undefined') {
			const negotiation: ProductNegotiation = {
				rateCards: Object.fromEntries(
					productData.rateCards.map((rateCard) => [
						rateCard.id,
						Object.fromEntries(
							rateCard.rateCardLines.map((rateCardLine) => [
								rateCardLine.id,
								{
									name: rateCardLine.name,
									original: rateCardLine.rateValue,
									negotiated: undefined
								}
							])
						)
					])
				),
				product: {
					recurring: {
						original: product.recurringCharge,
						negotiated: undefined
					},
					oneOff: {
						original: product.oneOffCharge,
						negotiated: undefined
					}
				},
				volume: {
					mv: null,
					mvp: null,
					muc: null,
					mucp: null
				}
			};

			dispatch({
				type: 'addProducts',
				payload: {
					products: {
						[product.id]: negotiation
					}
				}
			});
		}
	}

	const { status: saveAttachmentStatus, mutate: mutateAttachment } = useSaveAttachment();

	function onSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault();

		if (!!agreement) {
			const faId = agreement.id;
			mutate({
				faId,
				fieldData: faDetails || {}
			});

			const attachment = selectAttachment(state);
			mutateAttachment({ faId, attachment });
		}
	}

	// TODO: use memo
	const selectedProducts = Object.entries(state.products).map(
		([productId, productNegotiation]) => {
			const matchingCommercialProduct = products.find((p) => p.id === productId);

			if (!matchingCommercialProduct) {
				throw new Error('Attached product does not exist in the product list');
			}

			return {
				...productNegotiation,
				...matchingCommercialProduct
			};
		}
	);

	const productSelection = (
		<CSModal
			visible={modalOpen}
			onClose={(): void => setModalOpen(false)}
			outerClickClose
			size="medium"
			className="product-selection-modal"
		>
			<CSModalHeader title="Add Product to Frame Agreement" />
			<CSModalBody padding="0">
				{/* TODO: add filter functionality */}
				<CSInputSearch label="Filter products..." width="20rem" />
				{/* row render csbutton logic will be moved to row onclick prop once support for table onclick is added */}
				<CSDataTable
					columns={[
						{
							key: 'name',
							header: 'Commercial Product Name',
							grow: 2,
							render: (row): ReactElement => (
								<CommercialProductOption
									product={row.data as CommercialProductStandalone}
									onClick={addProductToFa}
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
					rows={products.map((p) => ({
						key: p.id,
						data: p
					}))}
				/>
			</CSModalBody>
			<CSModalFooter>
				<CSButton label="Close" onClick={(): void => setModalOpen(false)} />
			</CSModalFooter>
		</CSModal>
	);

	return (
		<LoadingFallback status={saveAttachmentStatus}>
			<LoadingFallback status={productsStatus}>
				<LoadingFallback status={productDataStatus}>
					{productSelection}
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
					<LoadingFallback status={status}>
						<FaJsonInput agreement={agreement || {}} setFaDetails={setFaDetails} />
						<form onSubmit={onSubmit}>
							<button type="submit">Update Agreement</button>
						</form>
					</LoadingFallback>
					{/* TODO: Move this to parent file. It needs to be sibling to header and pages. Add conditional so it is only rendered on details page */}
					<footer className="action-footer">
						<CSButton
							label="Add products"
							size="large"
							onClick={(): void => setModalOpen(true)}
						/>
					</footer>
				</LoadingFallback>
			</LoadingFallback>
		</LoadingFallback>
	);
}
