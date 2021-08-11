import React, { FormEvent, ReactElement, useEffect, useReducer, useState } from 'react';
import { CommercialProductStandalone, FrameAgreement } from '../../datasources';
import { useCommercialProductData } from '../../hooks/use-commercial-product-data';
import { useCommercialProducts } from '../../hooks/use-commercial-products';
import { useSaveAttachment } from '../../hooks/use-save-attachment';
import { useUpsertFrameAgreements } from '../../hooks/use-upsert-frame-agreements';
import { LoadingFallback } from '../loading-fallback';
import { FaJsonInput } from './fa-json-input';
import { createActionsForProduct } from './negotiation/negotiation-action-creator';
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
		<li key={product.id}>
			<button onClick={(): void => onClick(product)}>{product.name}</button>
		</li>
	);
}

export function FaEditor({ agreement }: FaEditorProps): ReactElement {
	const [faDetails, setFaDetails] = useState<Partial<FrameAgreement>>({});
	const { data: products = [], status: productsStatus } = useCommercialProducts();

	const [productIds, setProductIds] = useState<string[]>([]);

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

	// TODO: display in a modal
	const productSelection = (
		<ul>
			{products.map((p) => (
				<CommercialProductOption product={p} onClick={addProductToFa} key={p.id} />
			))}
		</ul>
	);

	return (
		<LoadingFallback status={saveAttachmentStatus}>
			<LoadingFallback status={productsStatus}>
				<LoadingFallback status={productDataStatus}>
					{productSelection}
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
				</LoadingFallback>
			</LoadingFallback>
		</LoadingFallback>
	);
}
