import { NegotiationAction, NegotiationItemType } from './details-reducer';

export interface NegotiateProductActions {
	negotiateProductRecurring(value: number): void;
	negotiateProductOneOff(value: number): void;
	negotiateProductAddonRecurring(addonId: string, value: number): void;
	negotiateProductAddonOneOff(addonId: string, value: number): void;
	negotiateRateCardLine(rateCardId: string, rateCardLineId: string, value: number): void;
	negotiateAddonRecurring(value: number): void;
	negotiateAddonOneOff(value: number): void;
	negotiateAdvancedOneOffCharge(value: number, chargeId: string): void;
	negotiateAdvancedRecurringCharge(value: number, chargeId: string): void;
}

export const createActionsForNegotiateProduct = (dispatch: React.Dispatch<NegotiationAction>) => (
	productId: string,
	itemType: NegotiationItemType
): NegotiateProductActions => {
	return {
		negotiateProductRecurring(value: number): void {
			return dispatch({
				type: 'negotiateProductRecurring',
				payload: {
					productId,
					itemType,
					value
				}
			});
		},
		negotiateProductOneOff(value: number): void {
			return dispatch({
				type: 'negotiateProductOneOff',
				payload: {
					productId,
					itemType,
					value
				}
			});
		},
		negotiateProductAddonRecurring(addonId: string, value: number): void {
			return dispatch({
				type: 'negotiateProductAddonRecurring',
				payload: {
					productId,
					itemType,
					addonId,
					value
				}
			});
		},
		negotiateProductAddonOneOff(addonId: string, value: number): void {
			return dispatch({
				type: 'negotiateProductAddonOneOff',
				payload: {
					productId,
					itemType,
					addonId,
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
					itemType,
					rateCardLineId,
					value
				}
			});
		},
		negotiateAddonRecurring(value: number): void {
			return dispatch({
				type: 'negotiateAddonRecurring',
				payload: {
					addonId: productId,
					value
				}
			});
		},
		negotiateAddonOneOff(value: number): void {
			return dispatch({
				type: 'negotiateAddonOneOff',
				payload: {
					addonId: productId,
					value
				}
			});
		},
		negotiateAdvancedOneOffCharge(value: number, chargeId: string): void {
			return dispatch({
				type: 'negotiateOneOffCharge',
				payload: { value, itemType, productId, chargeId }
			});
		},
		negotiateAdvancedRecurringCharge(value: number, chargeId: string): void {
			return dispatch({
				type: 'negotiateRecurringCharge',
				payload: { value, itemType, productId, chargeId }
			});
		}
	};
};
