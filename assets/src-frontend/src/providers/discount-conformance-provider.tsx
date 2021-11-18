import React, { PropsWithChildren, ReactElement } from 'react';
import { Negotiation } from '../components/fa-details/negotiation/details-reducer';
import { DiscLevelWrapper, DiscountThreshold } from '../datasources';

export interface ContextProps {
	negotiation: Negotiation['negotiation'];
	discountThresholds?: DiscountThreshold[];
	authLevels: { [productId: string]: string };
	discountLevels: DiscLevelWrapper[];
}

export const discountContext = React.createContext<ContextProps>({
	negotiation: { products: {}, offers: {}, addons: {}, custom: undefined },
	authLevels: {},
	discountThresholds: [],
	discountLevels: []
});

export function DiscountConformanceProvider({
	children,
	discountThresholds,
	authLevels,
	discountLevels,
	negotiation
}: PropsWithChildren<ContextProps>): ReactElement {
	return (
		<discountContext.Provider
			value={{
				negotiation,
				authLevels,
				discountThresholds,
				discountLevels
			}}
		>
			{children}
		</discountContext.Provider>
	);
}
