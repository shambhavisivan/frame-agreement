import { CommercialProductStandalone } from '../../datasources';
import { ProductNegotiation } from './negotiation/negotiation-reducer';
import React, { ReactElement } from 'react';
import { Negotiation } from './negotiation';
import { RateCards } from './rate-cards';
import { NegotiateProductActions } from './negotiation/negotiation-action-creator';

interface ProductDetailsProps {
	product: CommercialProductStandalone & ProductNegotiation;
	actions: NegotiateProductActions;
}

export function ProductDetails({
	product: { id, name, product, rateCards },
	actions: { negotiateProductOneOff, negotiateProductRecurring, negotiateRateCardLine }
}: ProductDetailsProps): ReactElement {
	return (
		<tr>
			<th>
				{name} ({id})
			</th>
			<td>
				<Negotiation
					negotiable={product?.recurring}
					onNegotiatedChanged={(value): void => negotiateProductRecurring(value)}
				/>
			</td>
			<td>
				<Negotiation
					negotiable={product?.oneOff}
					onNegotiatedChanged={(value): void => negotiateProductOneOff(value)}
				/>
			</td>
			<td>
				<RateCards
					rateCards={rateCards || {}}
					negotiateRateCardLine={negotiateRateCardLine}
				/>
			</td>
		</tr>
	);
}
