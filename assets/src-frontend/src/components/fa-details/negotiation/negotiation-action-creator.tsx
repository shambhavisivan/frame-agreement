import { NegotiationAction } from './negotiation-reducer';

export interface ProductActions {
	negotiateRecurring(value: number): void;
	negotiateOneOff(value: number): void;
	negotiateRateCardLine(rateCardId: string, rateCardLineId: string, value: number): void;
}

export const createActionsForProduct = (dispatch: React.Dispatch<NegotiationAction>) => (
	productId: string
): ProductActions => {
	return {
		negotiateRecurring(value: number): void {
			return dispatch({
				type: 'negotiateRecurring',
				payload: {
					productId,
					value
				}
			});
		},
		negotiateOneOff(value: number): void {
			return dispatch({
				type: 'negotiateOneOff',
				payload: {
					productId,
					value
				}
			});
		},
		negotiateRateCardLine(rateCardId: string, rateCardLineId: string, value: number): void {
			return dispatch({
				type: 'negotiateRateCardLine',
				payload: {
					productId,
					rateCardId,
					rateCardLineId,
					value
				}
			});
		}
	};
};
