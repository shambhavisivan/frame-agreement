import React, { ReactElement } from 'react';
import { CommercialProductStandalone } from '../../datasources';
import { Negotiation } from './negotiation';
import { ProductNegotiation } from './negotiation-reducer';
import { RateCards } from './rate-cards';

interface ProductActions {
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

interface ProductDetailsProps {
	product: CommercialProductStandalone & ProductNegotiation;
	actions: ProductActions;
}

function ProductDetails({
	product: { id, name, product, rateCards },
	actions: { negotiateOneOff, negotiateRecurring, negotiateRateCardLine }
}: ProductDetailsProps): ReactElement {
	return (
		<tr>
			<th>
				{name} ({id})
			</th>
			<td>
				<Negotiation
					negotiable={product.recurring}
					onNegotiatedChanged={negotiateRecurring}
				/>
			</td>
			<td>
				<Negotiation negotiable={product.oneOff} onNegotiatedChanged={negotiateOneOff} />
			</td>
			<td>
				<RateCards rateCards={rateCards} negotiateRateCardLine={negotiateRateCardLine} />
			</td>
		</tr>
	);
}
