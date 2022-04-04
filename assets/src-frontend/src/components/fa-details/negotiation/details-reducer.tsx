import {
	Addon,
	Allowances,
	Attachment,
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement,
	Product,
	Volume,
	AttachmentOriginalItems,
	Charge
} from '../../../datasources';
import { DiscLevelWrapper, DiscountThreshold } from '../../../datasources';
import { RateCards } from '../rate-cards';

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

export type DiscountData = {
	authLevels?: {
		[productId: string]: string;
	};
	discountThresholds?: DiscountThreshold[];

	discountLevels?: DiscLevelWrapper[];
};

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
	discountData?: DiscountData;
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
				productAddonAssociationId: string;
				value: number;
			};
	  }
	| {
			type: 'negotiateProductAddonOneOff';
			payload: {
				productId: string;
				itemType: NegotiationItemType;
				productAddonAssociationId: string;
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
				attachmentExtended: AttachmentOriginalItems;
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
			type: 'removeProducts';
			payload: {
				productIds: string[];
			};
	  }
	| {
			type: 'removeAddons';
			payload: {
				addonIds: string[];
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
	  }
	| {
			type: 'setDiscountData';
			payload: {
				products: CommercialProductStandalone[];
				productsData: CommercialProductData;
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
			const stateProductsIds = new Set(Object.keys(state.products));
			const negotiatedProducts = action.payload.products.reduce(
				(
					accumulator,
					currentProduct
				): {
					[productId: string]: ProductNegotiation;
				} => {
					if (stateProductsIds.has(currentProduct.id)) {
						return accumulator;
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
						addons: productData?.addons?.reduce(
							(accu, currentAddon) => {
								accu[currentAddon.id] = {
									oneOff: {
										original: currentAddon.addOnPriceItem.oneOffCharge,
										negotiated: undefined
									},
									recurring: {
										original: currentAddon.addOnPriceItem.recurringCharge,
										negotiated: undefined
									}
								};
								return accu;
							},
							{} as {
								[addonId: string]: NegotiableCharges;
							}
						),
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

		case 'setDiscountData':
			let authLevels = action.payload.products.reduce((authAccumulator, currentProduct): {
				[id: string]: string;
			} => {
				if (currentProduct.authorizationLevel) {
					authAccumulator[currentProduct.id] = currentProduct.authorizationLevel;
				}
				return authAccumulator;
			}, {} as { [id: string]: string });

			const cpData = action.payload.productsData.cpData;
			Object.keys(cpData).forEach((productId) => {
				const productAddonAuthLevels = cpData[productId].addons.reduce(
					(
						authAccumulator,
						currentProductAddonAssociation
					): {
						[id: string]: string;
					} => {
						const addon = currentProductAddonAssociation.addOnPriceItem;
						if (addon.authorizationLevel) {
							authAccumulator[addon.id] = addon.authorizationLevel;
						}
						return authAccumulator;
					},
					{} as { [id: string]: string }
				);
				authLevels = {
					...authLevels,
					...productAddonAuthLevels
				};
			});

			const discountData: DiscountData = {
				authLevels: authLevels,
				discountThresholds: action.payload.productsData.discThresh || [],
				discountLevels: action.payload.productsData.discLevels || []
			};

			return { ...inputState, discountData };

		case 'removeProducts':
			const idsToBeDeleted = action.payload.productIds;
			const productsAfterDeletion = JSON.parse(JSON.stringify(state.products));
			idsToBeDeleted.forEach((id) => delete productsAfterDeletion[id]);

			return {
				...inputState,
				negotiation: {
					...state,
					products: productsAfterDeletion
				}
			};

		case 'removeAddons':
			const addonIdsToBeDeleted = action.payload.addonIds;
			const addonsAfterDeletion = JSON.parse(JSON.stringify(state.addons));
			addonIdsToBeDeleted.forEach((id) => delete addonsAfterDeletion[id]);

			return {
				...inputState,
				negotiation: {
					...state,
					addons: addonsAfterDeletion
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
			const attachmentExtended = action.payload.attachmentExtended;

			const createProductStructure = (
				products: Attachment['products'] | Attachment['offers']
			): Negotiation['negotiation']['products'] | Negotiation['negotiation']['offers'] => {
				const productState = {} as {
					[productId: string]: ProductNegotiation;
				};
				if (products) {
					Object.entries(products).forEach(([productId, productNegotiation]) => {
						const cpAddons = attachmentExtended?.commercialProductData?.cpData[
							productId
						].addons.reduce((result, currentAddon) => {
							result[currentAddon.id] = currentAddon.addOnPriceItem;
							return result;
						}, {} as { [id: string]: Addon });

						const cpAdvancedCharges = attachmentExtended?.commercialProductData?.cpData[
							productId
						].charges.reduce((result, charge) => {
							result[charge.id] = charge;
							return result;
						}, {} as { [id: string]: Charge });

						const rcs = attachmentExtended?.commercialProductData?.cpData[
							productId
						].rateCards.reduce((rcResult, rateCard) => {
							rcResult[rateCard.id] = {
								rateCardLines: rateCard.rateCardLines?.reduce((rclResult, rcl) => {
									rclResult[rcl.id] = {
										original: rcl.rateValue,
										negotiated:
											productNegotiation?.rateCards?.[rateCard.id]?.[rcl.id]
									};
									return rclResult;
								}, {} as RateCardLines)
							};
							return rcResult;
						}, {} as RateCards);

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
											original: cpAddons?.[currentAddonId]?.oneOffCharge
										},
										recurring: {
											negotiated: productNegotiation?.addons
												? productNegotiation?.addons[currentAddonId]
														?.recurring
												: undefined,
											original: cpAddons?.[currentAddonId]?.recurringCharge
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
											original: cpAdvancedCharges?.[chargeId].oneOff
										},
										recurring: {
											negotiated: productNegotiation?.charges
												? productNegotiation.charges[chargeId]?.recurring
												: undefined,
											original: cpAdvancedCharges?.[chargeId].recurring
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
									original:
										attachmentExtended?.commercialProducts?.[productId]
											.oneOffCharge
								},
								recurring: {
									negotiated: productNegotiation.product?.recurring,
									original:
										attachmentExtended?.commercialProducts?.[productId]
											.recurringCharge
								}
							},
							rateCards: Object.entries(productNegotiation?.rateCards || {}).reduce(
								(accu, [rcId, value]) => {
									accu[rcId] = {
										rateCardLines: Object.entries(value).reduce(
											(rateCardLine, [rclId, negotiated]) => {
												rateCardLine[rclId] = {
													negotiated,
													original:
														rcs?.[rcId].rateCardLines[rclId].original
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
									original:
										attachmentExtended?.standaloneAddons?.[addonId].oneOffCharge
								},
								recurring: {
									negotiated: chargeValue.recurring,
									original:
										attachmentExtended?.standaloneAddons?.[addonId]
											.recurringCharge
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
						...state[action.payload.itemType],
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
						...state[action.payload.itemType],
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
					addons: action.payload.addons.reduce(
						(accumulator, currentAddon) => {
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
						},
						{ ...state.addons }
					)
				}
			};

		case 'negotiateProductAddonOneOff':
			return {
				...inputState,
				negotiation: {
					...state,
					[action.payload.itemType]: {
						...state[action.payload.itemType],
						[action.payload.productId]: {
							...state.products[action.payload.productId],
							addons: {
								...state.products[action.payload.productId].addons,
								[action.payload.productAddonAssociationId]: {
									...state.products[action.payload.productId].addons[
										action.payload.productAddonAssociationId
									],
									oneOff: {
										...state.products[action.payload.productId].addons[
											action.payload.productAddonAssociationId
										].oneOff,
										negotiated: action.payload.value
									}
								}
							}
						}
					}
				}
			};

		case 'negotiateProductAddonRecurring':
			return {
				...inputState,
				negotiation: {
					...state,
					[action.payload.itemType]: {
						...state[action.payload.itemType],
						[action.payload.productId]: {
							...state.products[action.payload.productId],
							addons: {
								...state.products[action.payload.productId].addons,
								[action.payload.productAddonAssociationId]: {
									...state.products[action.payload.productId].addons[
										action.payload.productAddonAssociationId
									],
									recurring: {
										...state.products[action.payload.productId].addons[
											action.payload.productAddonAssociationId
										].recurring,
										negotiated: action.payload.value
									}
								}
							}
						}
					}
				}
			};

		case 'negotiateAddonOneOff':
			return {
				...inputState,
				negotiation: {
					...state,
					addons: {
						...state.addons,
						[action.payload.addonId]: {
							...state.addons[action.payload.addonId],
							oneOff: {
								negotiated: action.payload.value,
								original: undefined
							}
						}
					}
				}
			};

		case 'negotiateAddonRecurring':
			return {
				...inputState,
				negotiation: {
					...state,
					addons: {
						...state.addons,
						[action.payload.addonId]: {
							...state.addons[action.payload.addonId],
							recurring: {
								negotiated: action.payload.value,
								original: undefined
							}
						}
					}
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
					addons: Object.fromEntries(
						Object.entries(productNegotiation?.addons || {}).map(
							([addonId, aoNegotiable]) => {
								return [
									addonId,
									{
										oneOff: aoNegotiable.oneOff.negotiated,
										recurring: aoNegotiable.recurring.negotiated
									}
								];
							}
						)
					),
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
		addons: addons,
		custom: state.custom
	};
}
