import { Attachment, Products } from '../../../datasources';

type RateCardLineId = string;
type RateCardId = string;
type ProductId = string;

interface Negotiable {
	original: number | undefined;
	negotiated: number | undefined;
}

interface Volume {
	muc: number | null;
	mucp: number | null;
	mv: number | null;
	mvp: number | null;
}

export interface RateCardLines {
	[rateCardLineId: string]: Negotiable & { name?: string; authId?: string };
}

export interface RateCards {
	[rateCardId: string]: RateCardLines;
}

export interface AdvancedCharges {
	[rateCardId: string]: RateCardLines;
}

export interface ProductNegotiation {
	rateCards: RateCards;
	volume: Volume;
	product?: {
		recurring: Negotiable;
		oneOff: Negotiable;
	};
	charges?: AdvancedCharges;
}

export interface Negotiation {
	products: {
		[productId: string]: ProductNegotiation;
	};
}

export type NegotiationAction =
	| {
			type: 'negotiateRecurring';
			payload: {
				productId: ProductId;
				value: number;
			};
	  }
	| {
			type: 'negotiateOneOff';
			payload: {
				productId: ProductId;
				value: number;
			};
	  }
	| {
			type: 'negotiateRateCardLine';
			payload: {
				productId: ProductId;
				rateCardId: RateCardId;
				rateCardLineId: RateCardLineId;
				value: number;
			};
	  }
	| {
			type: 'loadAttachment'; // attachment is like a diff
			payload: {
				attachment: Attachment;
			};
	  }
	| {
			type: 'addProducts';
			payload: {
				products: { [productId: string]: ProductNegotiation };
			};
	  };

// TODO: use normalized state for negotiables - will simplify updates
export default function negotiationReducer(
	state: Negotiation,
	action: NegotiationAction
): Negotiation {
	switch (action.type) {
		case 'negotiateOneOff':
			if (!state.products[action.payload.productId]) {
				throw new Error('Cannot negotiate missing product');
			}

			return {
				...state,
				products: {
					...state.products,
					[action.payload.productId]: {
						...state.products[action.payload.productId],
						product: {
							...state.products[action.payload.productId].product,
							oneOff: {
								...state.products[action.payload.productId].product?.oneOff,
								negotiated: action.payload.value
							}
						}
					} as ProductNegotiation
				}
			};
		case 'negotiateRecurring':
			if (!state.products[action.payload.productId]) {
				throw new Error('Cannot negotiate missing product');
			}

			return {
				...state,
				products: {
					...state.products,
					[action.payload.productId]: {
						...state.products[action.payload.productId],
						product: {
							...state.products[action.payload.productId].product,
							recurring: {
								...state.products[action.payload.productId].product?.recurring,
								negotiated: action.payload?.value
							}
						}
					} as ProductNegotiation
				}
			};
		case 'addProducts':
			return {
				...state,
				products: {
					...state.products,
					...action.payload.products
				}
			};
		case 'negotiateRateCardLine':
			const { productId, rateCardId, rateCardLineId, value } = action.payload;
			if (!state.products[productId]?.rateCards[rateCardId]?.[rateCardLineId]) {
				throw new Error('Cannot negotiate missing rate card line');
			}

			return {
				...state,
				products: {
					...state.products,
					[productId]: {
						...state.products[productId],
						rateCards: {
							...state.products[productId].rateCards,
							[rateCardId]: {
								...state.products[productId].rateCards[rateCardId],
								[rateCardLineId]: {
									...state.products[productId].rateCards[rateCardId][
										rateCardLineId
									],
									negotiated: value
								}
							}
						}
					}
				}
			};
		case 'loadAttachment':
			const actions: NegotiationAction[] = [];

			for (const [productId, attachedProductNegotiation] of Object.entries(
				action.payload.attachment.products || ({} as Products)
			)) {
				if (attachedProductNegotiation.product?.recurring) {
					actions.push({
						type: 'negotiateRecurring',
						payload: {
							productId,
							value: attachedProductNegotiation.product.recurring
						}
					});
				}

				if (attachedProductNegotiation.product?.oneOff) {
					actions.push({
						type: 'negotiateOneOff',
						payload: {
							productId,
							value: attachedProductNegotiation.product.oneOff
						}
					});
				}

				for (const [rateCardId, rateCardLines] of Object.entries(
					attachedProductNegotiation.rateCards || {}
				)) {
					for (const [rateCardLineId, value] of Object.entries(rateCardLines)) {
						actions.push({
							type: 'negotiateRateCardLine',
							payload: {
								productId,
								rateCardId,
								rateCardLineId,
								value
							}
						});
					}
				}
			}

			return actions.reduce(negotiationReducer, state);
	}
}

function isNegotiated(
	value: [string, Negotiable]
): value is [string, { original: number; negotiated: number }] {
	return typeof value[1].negotiated === 'number';
}

export function selectAttachment(state: Negotiation): Attachment {
	const products: Attachment['products'] = Object.fromEntries(
		Object.entries(state.products).map(([productId, productNegotiation]) => {
			const attachedProductNegotiation = {
				product: {
					...(productNegotiation?.product?.oneOff.negotiated && {
						oneOff: productNegotiation.product.oneOff.negotiated
					}),
					...(productNegotiation?.product?.recurring.negotiated && {
						recurring: productNegotiation.product.recurring.negotiated
					})
				},
				rateCards: Object.fromEntries(
					Object.entries(productNegotiation.rateCards).map(([rateCardId, rateCard]) => {
						return [
							rateCardId,
							Object.fromEntries(
								Object.entries(rateCard)
									.filter(isNegotiated)
									.map(([rateCardLineId, rateCardLine]) => {
										return [rateCardLineId, rateCardLine.negotiated];
									})
							)
						];
					})
				),
				volume: productNegotiation.volume,
				allowances: {}
			};

			return [productId, attachedProductNegotiation];
		})
	);

	return {
		products,
		addons: {},
		custom: {}
	};
}
