import React, { PropsWithChildren, ReactElement } from 'react';
import { Negotiation } from '../components/fa-details/negotiation/negotiation-reducer';
import { DiscountThreshold } from '../datasources';

export interface ContextProps {
	negotiation: Negotiation;
	discountThresholds?: DiscountThreshold[];
	authLevels: { [productId: string]: string };
}

export const discountContext = React.createContext<ContextProps>({
	negotiation: { products: {}, offers: {}, addons: {} },
	authLevels: {},
	discountThresholds: []
});

export function DiscountConformanceProvider({
	children,
	discountThresholds,
	authLevels,
	negotiation
}: PropsWithChildren<ContextProps>): ReactElement {
	return (
		<discountContext.Provider
			value={{ negotiation: negotiation, authLevels, discountThresholds }}
		>
			{children}
		</discountContext.Provider>
	);
}
