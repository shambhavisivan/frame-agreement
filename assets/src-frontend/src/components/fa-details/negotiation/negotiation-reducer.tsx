import {
	Addons,
	Attachment,
	CommercialProductData,
	CommercialProductStandalone,
	Products,
	Volume
} from '../../../datasources';

export interface Negotiable {
	original: number | undefined;
	negotiated: number | undefined;
}

export interface RateCardLines {
	[rateCardLineId: string]: Negotiable & { name?: string; usageTypeName?: string };
}

export interface RateCards {
	[rateCardId: string]: { rateCardLines: RateCardLines; authId?: string };
}

export type ChargeType = 'oneOff' | 'recurring';

export type NegotiableCharges = Record<ChargeType, Negotiable>;

export interface ProductNegotiation {
	volume: Volume;
	product: NegotiableCharges;
	rateCards: RateCards;
	addons: {
		[addonId: string]: NegotiableCharges;
	};
	charges?: {
		[chargeId: string]: NegotiableCharges;
	};
}

export type NegotiationItemType = 'products' | 'offers' | 'addons';

export interface Negotiation {
	products: {
		[productId: string]: ProductNegotiation;
	};
	offers: {
		[offerId: string]: ProductNegotiation;
	};
	addons: {
		[addonId: string]: NegotiableCharges;
	};
}

export type NegotiationAction =
	| {
			type: 'negotiateProductRecurring';
			payload: {
				productId: string;
				itemType: NegotiationItemType;
				value: number;
			};
	  }
	| {
			type: 'negotiateProductOneOff';
			payload: {
				productId: string;
				itemType: NegotiationItemType;
				value: number;
			};
	  }
	| {
			type: 'negotiateProductAddonRecurring';
			payload: {
				productId: string;
				itemType: NegotiationItemType;
				addonId: string;
				value: number;
			};
	  }
	| {
			type: 'negotiateProductAddonOneOff';
			payload: {
				productId: string;
				itemType: NegotiationItemType;
				addonId: string;
				value: number;
			};
	  }
	| {
			type: 'negotiateAddonRecurring';
			payload: {
				addonId: string;
				value: number;
			};
	  }
	| {
			type: 'negotiateAddonOneOff';
			payload: {
				addonId: string;
				value: number;
			};
	  }
	| {
			type: 'negotiateRateCardLine';
			payload: {
				productId: string;
				itemType: NegotiationItemType;
				rateCardId: string;
				rateCardLineId: string;
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
				products: CommercialProductStandalone[];
				productsData: CommercialProductData;
			};
	  }
	| {
			type: 'negotiateVolume';
			payload: {
				productId: string;
				itemType: NegotiationItemType;
				volume: Volume;
			};
	  };

// TODO: use normalized state for negotiables - will simplify updates
export default function negotiationReducer(
	state: Negotiation,
	action: NegotiationAction
): Negotiation {
	switch (action.type) {
		case 'negotiateProductOneOff':
			if (!state[action.payload.itemType][action.payload.productId]) {
				throw new Error('Cannot negotiate missing product');
			}

			return {
				...state,
				[action.payload.itemType]: {
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

		case 'negotiateProductRecurring':
			if (!state[action.payload.itemType][action.payload.productId]) {
				throw new Error('Cannot negotiate missing product');
			}

			return {
				...state,
				[action.payload.itemType]: {
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
			const negotiatedProducts = action.payload.products.reduce(
				(
					accumulator,
					currentProduct
				): {
					[productId: string]: ProductNegotiation;
				} => {
					const productData = action.payload.productsData.cpData[currentProduct.id];
					if (!productData) {
						throw new Error('Product data cannot be found');
					}

					const negotiation: ProductNegotiation = {
						rateCards: productData.rateCards.reduce((accu, rateCard) => {
							const rateCardLines = rateCard.rateCardLines.reduce(
								(acculine, { id, name, rateValue }) => {
									acculine[id] = {
										name: name,
										original: rateValue,
										negotiated: undefined
									};
									return acculine;
								},
								{} as RateCardLines
							);
							accu[rateCard.id] = {
								rateCardLines: rateCardLines
							};
							return accu;
						}, {} as RateCards),
						product: {
							recurring: {
								original: currentProduct?.recurringCharge,
								negotiated: undefined
							},
							oneOff: {
								original: currentProduct?.oneOffCharge,
								negotiated: undefined
							}
						},
						volume: {
							mv: null,
							mvp: null,
							muc: null,
							mucp: null
						},
						addons: {}
					};
					accumulator[currentProduct.id] = negotiation;
					return accumulator;
				},
				{} as {
					[productId: string]: ProductNegotiation;
				}
			);
			return {
				...state,
				products: {
					...state.products,
					...negotiatedProducts
				}
			};

		case 'negotiateRateCardLine':
			const { productId, itemType, rateCardId, rateCardLineId, value } = action.payload;
			if (
				!(state[itemType][productId] as ProductNegotiation)?.rateCards[rateCardId]
					?.rateCardLines[rateCardLineId]
			) {
				throw new Error('Cannot negotiate missing rate card line');
			}

			return {
				...state,
				[itemType]: {
					...state.products,
					[productId]: {
						...state.products[productId],
						rateCards: {
							...state.products[productId].rateCards,
							[rateCardId]: {
								...state.products[productId].rateCards[rateCardId],
								rateCardLines: {
									...state.products[productId].rateCards[rateCardId]
										.rateCardLines,
									[rateCardLineId]: {
										...state.products[productId].rateCards[rateCardId]
											.rateCardLines[rateCardLineId],
										negotiated: value
									}
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
						type: 'negotiateProductRecurring',
						payload: {
							productId,
							itemType: 'products',
							value: attachedProductNegotiation.product.recurring
						}
					});
				}

				if (attachedProductNegotiation.product?.oneOff) {
					actions.push({
						type: 'negotiateProductOneOff',
						payload: {
							productId,
							itemType: 'products',
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
								itemType: 'products',
								rateCardId,
								rateCardLineId,
								value
							}
						});
					}
				}

				for (const [addonId, charges] of Object.entries(
					attachedProductNegotiation.addons || {}
				)) {
					if (charges?.oneOff) {
						actions.push({
							type: 'negotiateProductAddonOneOff',
							payload: {
								productId,
								itemType: 'products',
								addonId,
								value: charges.oneOff
							}
						});
					}

					if (charges?.recurring) {
						actions.push({
							type: 'negotiateProductAddonRecurring',
							payload: {
								productId,
								itemType: 'products',
								addonId,
								value: charges.recurring
							}
						});
					}
				}

				if (attachedProductNegotiation.volume) {
					actions.push({
						type: 'negotiateVolume',
						payload: {
							productId,
							itemType: 'products',
							volume: attachedProductNegotiation.volume
						}
					});
				}
			}

			for (const [productId, attachedProductNegotiation] of Object.entries(
				action.payload.attachment.offers || ({} as Products)
			)) {
				if (attachedProductNegotiation.product?.recurring) {
					actions.push({
						type: 'negotiateProductRecurring',
						payload: {
							productId,
							itemType: 'offers',
							value: attachedProductNegotiation.product.recurring
						}
					});
				}

				if (attachedProductNegotiation.product?.oneOff) {
					actions.push({
						type: 'negotiateProductOneOff',
						payload: {
							productId,
							itemType: 'offers',
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
								itemType: 'offers',
								rateCardId,
								rateCardLineId,
								value
							}
						});
					}
				}

				for (const [addonId, charges] of Object.entries(
					attachedProductNegotiation.addons || {}
				)) {
					if (charges?.oneOff) {
						actions.push({
							type: 'negotiateProductAddonOneOff',
							payload: {
								productId,
								itemType: 'offers',
								addonId,
								value: charges.oneOff
							}
						});
					}

					if (charges?.recurring) {
						actions.push({
							type: 'negotiateProductAddonRecurring',
							payload: {
								productId,
								itemType: 'offers',
								addonId,
								value: charges.recurring
							}
						});
					}
				}

				if (attachedProductNegotiation.volume) {
					actions.push({
						type: 'negotiateVolume',
						payload: {
							productId,
							itemType: 'offers',
							volume: attachedProductNegotiation.volume
						}
					});
				}
			}

			for (const [addonId, attachedAddonNegotiation] of Object.entries(
				action.payload.attachment.addons || ({} as Addons)
			)) {
				if (attachedAddonNegotiation?.recurring) {
					actions.push({
						type: 'negotiateAddonRecurring',
						payload: {
							addonId,
							value: attachedAddonNegotiation.recurring
						}
					});
				}

				if (attachedAddonNegotiation?.oneOff) {
					actions.push({
						type: 'negotiateAddonOneOff',
						payload: {
							addonId,
							value: attachedAddonNegotiation.oneOff
						}
					});
				}
			}

			return actions.reduce(negotiationReducer, state);

		case 'negotiateVolume':
			const { productId: itemId, itemType: negotiationItemType, volume } = action.payload;
			return {
				...state,
				[negotiationItemType]: {
					...state[itemType],
					[itemId]: {
						...state[negotiationItemType][itemId],
						volume
					}
				}
			};

		default:
			return { ...state };
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
								Object.entries(rateCard.rateCardLines)
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

	const offers: Attachment['offers'] = Object.fromEntries(
		Object.entries(state?.offers || {}).map(([productId, productNegotiation]) => {
			const attachedProductNegotiation = {
				product: {
					...(productNegotiation.product.oneOff.negotiated && {
						oneOff: productNegotiation.product.oneOff.negotiated
					}),
					...(productNegotiation.product.recurring.negotiated && {
						recurring: productNegotiation.product.recurring.negotiated
					})
				},
				volume: productNegotiation.volume,
				allowances: {}
			};

			return [productId, attachedProductNegotiation];
		})
	);

	const addons: Attachment['addons'] = Object.fromEntries(
		Object.entries(state?.addons || {}).map(([addonId, negotiable]) => {
			const attachedAddonNegotiation = {
				...(negotiable.oneOff.negotiated && {
					oneOff: negotiable.oneOff.negotiated
				}),
				...(negotiable.recurring.negotiated && {
					recurring: negotiable.recurring.negotiated
				})
			};

			return [addonId, attachedAddonNegotiation];
		})
	);

	return {
		products,
		offers,
		addons,
		custom: {}
	};
}
