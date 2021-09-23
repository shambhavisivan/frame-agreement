import React, { PropsWithChildren, ReactElement } from 'react';
import negotiationReducer, {
	Negotiation,
	NegotiationAction
} from './negotiation/negotiation-reducer';

export type DetailsState = {
	dispatch: React.Dispatch<NegotiationAction>;
} & Negotiation;
export const store = React.createContext<DetailsState>({} as DetailsState);
store.displayName = 'DetailsStore';
const initialState: DetailsState = {
	products: {}
} as DetailsState;
export function DetailsProvider<T>({ children }: PropsWithChildren<T>): ReactElement {
	const [detailsState, dispatch] = React.useReducer(negotiationReducer, initialState);
	return <store.Provider value={{ ...detailsState, dispatch }}>{children}</store.Provider>;
}
