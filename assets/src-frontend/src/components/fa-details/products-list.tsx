import React, { ReactElement } from 'react';
import { CommercialProductStandalone } from '../../datasources';
import { NegotiateProductActions } from './negotiation/negotiation-action-creator';
import { NegotiationItemType, ProductNegotiation } from './negotiation/negotiation-reducer';
import { ProductDetails } from './product-details';

interface ProductsListProps {
	selectedProducts: (CommercialProductStandalone & ProductNegotiation)[];
	createProductActions: (
		productId: string,
		itemType: NegotiationItemType
	) => NegotiateProductActions;
}

export function ProductsList({
	selectedProducts,
	createProductActions
}: ProductsListProps): ReactElement {
	return (
		<table>
			<tbody>
				{selectedProducts.map((p) => (
					<ProductDetails
						key={p.id}
						product={p}
						actions={createProductActions(p.id, 'products')}
					/>
				))}
			</tbody>
		</table>
	);
}
