import React, { ReactElement } from 'react';
import { CommercialProductStandalone } from '../../datasources';
import { NegotiateProductActions } from './negotiation/negotiation-action-creator';
import { NegotiationItemType } from './negotiation/negotiation-reducer';
import { ProductListGrid } from './product-list-grid';

export interface ProductActions {
	negotiateRecurring(value: number): void;
	negotiateOneOff(value: number): void;
	negotiateRateCardLine(rateCardId: string, rateCardLineId: string, value: number): void;
}

interface ProductsListProps {
	productList: CommercialProductStandalone[];
	createProductActions: (
		productId: string,
		actionType: NegotiationItemType
	) => NegotiateProductActions;
}

export function ProductsList({
	productList,
	createProductActions
}: ProductsListProps): ReactElement {
	return (
		<div>
			<ProductListGrid data={productList} />
		</div>
	);
}
