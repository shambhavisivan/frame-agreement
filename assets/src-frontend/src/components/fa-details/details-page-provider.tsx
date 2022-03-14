import React, { PropsWithChildren, ReactElement, useEffect, useReducer } from 'react';
import { FrameAgreement } from '../../datasources';
import {
	AgreementAction,
	detailsReducer,
	DiscountData,
	Negotiation,
	NegotiationAction
} from './negotiation/details-reducer';

export type DetailsState = {
	dispatch: React.Dispatch<NegotiationAction | AgreementAction>;
} & Negotiation;

export const store = React.createContext<DetailsState>({} as DetailsState);
store.displayName = 'DetailsStore';

export interface ProviderProps {
	agreement: FrameAgreement;
}

export function DetailsProvider({
	children,
	agreement
}: PropsWithChildren<ProviderProps>): ReactElement {
	const initialState: Negotiation = {
		negotiation: { products: {}, offers: {}, addons: {}, custom: undefined },
		activeFa: {} as FrameAgreement,
		discountData: {} as DiscountData,
		disableAgreementOperations: false
	};

	const [state, dispatch] = useReducer(detailsReducer, initialState);

	useEffect(() => {
		dispatch({
			type: 'updateActiveFa',
			payload: {
				agreement: agreement || ({} as FrameAgreement)
			}
		});
	}, [agreement]);

	return <store.Provider value={{ ...state, dispatch }}>{children}</store.Provider>;
}
