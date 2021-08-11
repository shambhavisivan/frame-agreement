import { CommercialProductStandalone } from '../../datasources';
import { ProductNegotiation } from './negotiation/negotiation-reducer';
import React, { ReactElement } from 'react';
import { Negotiation } from './negotiation';
import { RateCards } from './rate-cards';
import { ProductActions } from './products-list';

interface ProductDetailsProps {
	product: CommercialProductStandalone & ProductNegotiation;
	actions: ProductActions;
}

export function ProductDetails({
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
