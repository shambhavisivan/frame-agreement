import {
	Addon,
	Allowances,
	Attachment,
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement,
	Product,
	Volume
} from '../../../datasources';

export interface Negotiable {
	original: number | undefined | null;
	negotiated: number | undefined | null;
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
	allowances?: Allowances;
}

export type NegotiationItemType = 'products' | 'offers' | 'addons';

export interface Negotiation {
	negotiation: {
		products: {
			[productId: string]: ProductNegotiation;
		};
		offers: {
			[offerId: string]: ProductNegotiation;
		};
		addons: {
			[addonId: string]: NegotiableCharges;
		};
		allowances?: Allowances;
		custom?: string | Record<string, unknown> | undefined;
	};
	activeFa?: FrameAgreement;
	disableAgreementOperations?: boolean;
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
	  }
	| {
			type: 'updateActiveFa';
			payload: {
				agreement: FrameAgreement;
			};
	  }
	| {
			type: 'negotiateOneOffCharge';
			payload: {
				value: Negotiable['negotiated'];
				itemType: NegotiationItemType;
				productId: string;
				chargeId: string;
			};
	  }
	| {
			type: 'negotiateRecurringCharge';
			payload: {
				value: Negotiable['negotiated'];
				itemType: NegotiationItemType;
				productId: string;
				chargeId: string;
			};
	  }
	| {
			type: 'addAddonsToFa';
			payload: {
				addons: Addon[];
			};
	  }
	| {
			type: 'setCustomData';
			payload: {
				data: string | Record<string, unknown>;
			};
	  };

export type AgreementAction = {
	type: 'toggleDisableAgreementOperation';
	payload: boolean;
};
// TODO: use normalized state for negotiables - will simplify updates
export function detailsReducer(
	inputState: Negotiation,
	action: NegotiationAction | AgreementAction
): Negotiation {
	const { negotiation: state } = inputState;
	switch (action.type) {
		case 'negotiateProductOneOff':
			if (!state[action.payload.itemType][action.payload.productId]) {
				throw new Error('Cannot negotiate missing product');
			}

			return {
				...inputState,
				negotiation: {
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
				}
			};

		case 'negotiateProductRecurring':
			if (!state[action.payload.itemType][action.payload.productId]) {
				throw new Error('Cannot negotiate missing product');
			}

			return {
				...inputState,
				negotiation: {
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
					if (Object.keys(state.products).includes(currentProduct.id)) {
						return {};
					}
					const productData = action.payload.productsData.cpData[currentProduct.id];
					if (!productData) {
						throw new Error('Product data cannot be found');
					}

					const negotiation: ProductNegotiation = {
						rateCards: productData?.rateCards.reduce((accu, rateCard) => {
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
						addons: {},
						charges: productData?.charges?.reduce(
							(accu, currentCharge) => {
								accu[currentCharge.id] = {
									oneOff: {
										original: currentCharge.oneOff,
										negotiated: undefined
									},
									recurring: {
										original: currentCharge.recurring,
										negotiated: undefined
									}
								};
								return accu;
							},
							{} as {
								[chargeId: string]: NegotiableCharges;
							}
						),
						allowances: productData?.allowances?.reduce((accumulator, allowance) => {
							accumulator[allowance.id] = {
								name: allowance.name,
								value: allowance.amount
							};

							return accumulator;
						}, {} as Allowances)
					};
					accumulator[currentProduct.id] = negotiation;
					return accumulator;
				},
				{} as {
					[productId: string]: ProductNegotiation;
				}
			);
			return {
				...inputState,
				negotiation: {
					...state,
					products: {
						...state.products,
						...negotiatedProducts
					}
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
				...inputState,
				negotiation: {
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
				}
			};

		case 'loadAttachment':
			const attachment = action.payload.attachment;

			const createProductStructure = (
				products: Attachment['products'] | Attachment['offers']
			): Negotiation['negotiation']['products'] | Negotiation['negotiation']['offers'] => {
				const productState = {} as {
					[productId: string]: ProductNegotiation;
				};
				if (products) {
					Object.entries(products).forEach(([productId, productNegotiation]) => {
						productState[productId] = {
							volume: productNegotiation.volume || ({} as Volume),
							addons: Object.keys(productNegotiation.addons || {}).reduce(
								(
									addonData,
									currentAddonId
								): {
									[addonId: string]: NegotiableCharges;
								} => {
									addonData[currentAddonId] = {
										oneOff: {
											negotiated: productNegotiation?.addons
												? productNegotiation?.addons[currentAddonId]?.oneOff
												: undefined,
											original: undefined
										},
										recurring: {
											negotiated: productNegotiation?.addons
												? productNegotiation?.addons[currentAddonId]
														?.recurring
												: undefined,
											original: undefined
										}
									};
									return addonData;
								},
								{} as {
									[addonId: string]: NegotiableCharges;
								}
							),
							charges: Object.keys(productNegotiation.charges || {}).reduce(
								(
									charges,
									chargeId
								): {
									[chargeId: string]: NegotiableCharges;
								} => {
									charges[chargeId] = {
										oneOff: {
											negotiated: productNegotiation?.charges
												? productNegotiation?.charges[chargeId]?.oneOff
												: undefined,
											original: undefined
										},
										recurring: {
											negotiated: productNegotiation?.charges
												? productNegotiation.charges[chargeId]?.recurring
												: undefined,
											original: undefined
										}
									};
									return charges;
								},
								{} as {
									[chargeId: string]: NegotiableCharges;
								}
							),
							product: {
								oneOff: {
									negotiated: productNegotiation.product?.oneOff,
									original: undefined
								},
								recurring: {
									negotiated: productNegotiation.product?.recurring,
									original: undefined
								}
							},
							rateCards: Object.entries(productNegotiation?.rateCards || {}).reduce(
								(accu, [id, value]) => {
									accu[id] = {
										rateCardLines: Object.entries(value).reduce(
											(rateCardLine, [id, negotiated]) => {
												rateCardLine[id] = {
													negotiated,
													original: undefined
												};
												return rateCardLine;
											},
											{} as RateCardLines
										)
									};
									return accu;
								},
								{} as ProductNegotiation['rateCards']
							),
							allowances: productNegotiation?.allowances || {}
						};
					});
				}
				return productState;
			};

			return {
				...inputState,
				negotiation: {
					...state,
					products: createProductStructure(attachment.products),
					offers: createProductStructure(attachment.offers),
					addons: Object.entries(attachment.addons || {}).reduce(
						(accu, [addonId, chargeValue]) => {
							accu[addonId] = {
								oneOff: {
									negotiated: chargeValue.oneOff,
									original: undefined
								},
								recurring: {
									negotiated: chargeValue.recurring,
									original: undefined
								}
							};

							return accu;
						},
						{} as Negotiation['negotiation']['addons']
					)
				}
			};

		case 'negotiateVolume':
			const { productId: itemId, itemType: negotiationItemType, volume } = action.payload;
			return {
				...inputState,
				negotiation: {
					...state,
					[negotiationItemType]: {
						...state[negotiationItemType],
						[itemId]: {
							...state[negotiationItemType][itemId],
							volume
						}
					}
				}
			};
		case 'updateActiveFa':
			return { ...inputState, activeFa: action.payload.agreement };

		case 'negotiateOneOffCharge':
			return {
				...inputState,
				negotiation: {
					...state,
					[action.payload.itemType]: {
						[action.payload.productId]: {
							...state.products[action.payload.productId],
							charges: Object.fromEntries(
								Object.entries(
									state.products[action.payload.productId].charges || {}
								).map(([chargeId, negCharges]) => {
									if (chargeId === action.payload.chargeId) {
										negCharges.oneOff.negotiated = action.payload.value;
									}
									return [chargeId, negCharges];
								})
							)
						}
					}
				}
			};

		case 'negotiateRecurringCharge':
			return {
				...inputState,
				negotiation: {
					...state,
					[action.payload.itemType]: {
						[action.payload.productId]: {
							...state.products[action.payload.productId],
							charges: Object.fromEntries(
								Object.entries(
									state.products[action.payload.productId].charges || {}
								).map(([chargeId, negCharges]) => {
									if (chargeId === action.payload.chargeId) {
										negCharges.recurring.negotiated = action.payload.value;
									}
									return [chargeId, negCharges];
								})
							)
						}
					}
				}
			};

		case 'addAddonsToFa':
			return {
				...inputState,
				negotiation: {
					...state,
					addons: action.payload.addons.reduce((accumulator, currentAddon) => {
						accumulator[currentAddon.id] = {
							oneOff: {
								negotiated: undefined,
								original: currentAddon.oneOffCharge
							},
							recurring: {
								negotiated: undefined,
								original: currentAddon.recurringCharge
							}
						};

						return accumulator;
					}, {} as Negotiation['negotiation']['addons'])
				}
			};

		case 'setCustomData':
			return {
				...inputState,
				negotiation: {
					...state,
					custom: action.payload.data
				}
			};

		case 'toggleDisableAgreementOperation':
			return {
				...inputState,
				disableAgreementOperations: action.payload
			};

		default:
			return { ...inputState };
	}
}

export function selectAttachment(state: Negotiation['negotiation']): Attachment {
	const formatProducts = (
		products: Negotiation['negotiation']['products'] | Negotiation['negotiation']['offers']
	): Attachment['products'] | Attachment['offers'] =>
		Object.fromEntries(
			Object.entries(products || {}).map(([productId, productNegotiation]) => {
				const attachedProductNegotiation = {
					product: {
						...(productNegotiation?.product?.oneOff?.negotiated && {
							oneOff: productNegotiation.product.oneOff.negotiated
						}),
						...(productNegotiation?.product?.recurring?.negotiated && {
							recurring: productNegotiation.product.recurring.negotiated
						})
					},
					rateCards: Object.fromEntries(
						Object.entries(productNegotiation?.rateCards || {}).map(
							([rateCardId, rateCard]) => {
								return [
									rateCardId,
									Object.fromEntries(
										Object.entries(rateCard.rateCardLines).map(
											([rateCardLineId, rateCardLine]) => {
												return [
													rateCardLineId,
													rateCardLine.negotiated || 0
												];
											}
										)
									)
								];
							}
						)
					),
					charges: Object.keys(productNegotiation?.charges || {}).reduce(
						(chargeResult, chargeId) => {
							chargeResult[chargeId] = {
								oneOff: productNegotiation.charges
									? productNegotiation.charges[chargeId].oneOff.negotiated
									: undefined,
								recurring: productNegotiation.charges
									? productNegotiation.charges[chargeId].recurring.negotiated
									: undefined
							};
							return chargeResult;
						},
						{} as {
							[chargeId: string]: Product;
						}
					),
					volume: productNegotiation.volume,
					allowances: productNegotiation?.allowances || {}
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
		products: formatProducts(state.products),
		offers: formatProducts(state.offers),
		addons,
		custom: state.custom
	};
}
