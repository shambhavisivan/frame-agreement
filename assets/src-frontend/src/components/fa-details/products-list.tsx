import React, { ReactElement } from 'react';
import { CommercialProductStandalone } from '../../datasources';
import { ProductNegotiation } from './negotiation-reducer';
import { ProductDetails } from './product-details';

export interface ProductActions {
	negotiateRecurring(value: number): void;
	negotiateOneOff(value: number): void;
	negotiateRateCardLine(rateCardId: string, rateCardLineId: string, value: number): void;
}

interface ProductsListProps {
	selectedProducts: (CommercialProductStandalone & ProductNegotiation)[];
	createProductActions: (productId: string) => ProductActions;
}

export function ProductsList({
	selectedProducts,
	createProductActions
}: ProductsListProps): ReactElement {
	return (
		<table>
			<tbody>
				<tr>
					<td> </td>
					<th>Name</th>
					<th>Recurring</th>
					<th>OneOff</th>
					<th>RateCards</th>
				</tr>
				{selectedProducts.map((p) => (
					<ProductDetails key={p.id} product={p} actions={createProductActions(p.id)} />
				))}
			</tbody>
		</table>
	);
}
