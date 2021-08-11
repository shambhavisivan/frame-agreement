import { Attachment } from '../../../datasources';
import negotiationReducer, {
	Negotiation,
	NegotiationAction,
	ProductNegotiation,
	selectAttachment
} from './negotiation-reducer';

describe('negotiationReducer', () => {
	const negotiateRecurring: NegotiationAction['type'] = 'negotiateRecurring';
	const negotiateOneOff: NegotiationAction['type'] = 'negotiateOneOff';
	const addProducts: NegotiationAction['type'] = 'addProducts';
	const negotiateRateCardLine: NegotiationAction['type'] = 'negotiateRateCardLine';
	const loadAttachment: NegotiationAction['type'] = 'loadAttachment';

	const testProductId = 'testProductId';
	const testRateCartId = 'testRateCardId';
	const testRateCardLineId1 = 'testRateCardId1';

	describe(negotiateRecurring, () => {
		const testState: Negotiation = {
			products: {
				[testProductId]: {
					volume: {
						mv: null,
						muc: null,
						mvp: null,
						mucp: null
					},
					rateCards: {},
					product: {
						oneOff: {
							original: 100,
							negotiated: undefined
						},
						recurring: {
							original: 200,
							negotiated: undefined
						}
					}
				}
			}
		};
		test(`returns the state with the product's negotiated recurring charge set`, () => {
			const negotiatedValue = 42;
			const expectedState: Negotiation = {
				products: {
					[testProductId]: {
						volume: {
							mv: null,
							muc: null,
							mvp: null,
							mucp: null
						},
						rateCards: {},
						product: {
							oneOff: {
								original: 100,
								negotiated: undefined
							},
							recurring: {
								original: 200,
								negotiated: negotiatedValue
							}
						}
					}
				}
			};
			expect(
				negotiationReducer(testState, {
					type: negotiateRecurring,
					payload: {
						productId: testProductId,
						value: negotiatedValue
					}
				})
			).toEqual(expectedState);
		});
	});

	describe(negotiateOneOff, () => {
		const testState: Negotiation = {
			products: {
				[testProductId]: {
					volume: {
						mv: null,
						muc: null,
						mvp: null,
						mucp: null
					},
					rateCards: {},
					product: {
						oneOff: {
							original: 100,
							negotiated: undefined
						},
						recurring: {
							original: 200,
							negotiated: undefined
						}
					}
				}
			}
		};

		test(`returns the state with the product's negotiated oneOff charge set`, () => {
			const negotiatedValue = 42;

			const expectedState: Negotiation = {
				products: {
					[testProductId]: {
						volume: {
							mv: null,
							muc: null,
							mvp: null,
							mucp: null
						},
						rateCards: {},
						product: {
							oneOff: {
								original: 100,
								negotiated: negotiatedValue
							},
							recurring: {
								original: 200,
								negotiated: undefined
							}
						}
					}
				}
			};

			expect(
				negotiationReducer(testState, {
					type: negotiateOneOff,
					payload: {
						productId: testProductId,
						value: negotiatedValue
					}
				})
			).toEqual(expectedState);
		});
	});

	describe(negotiateRateCardLine, () => {
		const testState: Negotiation = {
			products: {
				[testProductId]: {
					volume: {
						mv: null,
						muc: null,
						mvp: null,
						mucp: null
					},
					rateCards: {
						[testRateCartId]: {
							[testRateCardLineId1]: {
								original: 10,
								negotiated: undefined
							}
						}
					},
					product: {
						oneOff: {
							original: 100,
							negotiated: undefined
						},
						recurring: {
							original: 200,
							negotiated: undefined
						}
					}
				}
			}
		};

		test(`returns the state with the product's negotiated recurring charge set`, () => {
			const negotiatedValue = 42;
			const expectedState: Negotiation = {
				products: {
					[testProductId]: {
						volume: {
							mv: null,
							muc: null,
							mvp: null,
							mucp: null
						},
						rateCards: {
							[testRateCartId]: {
								[testRateCardLineId1]: {
									original: 10,
									negotiated: negotiatedValue
								}
							}
						},
						product: {
							oneOff: {
								original: 100,
								negotiated: undefined
							},
							recurring: {
								original: 200,
								negotiated: undefined
							}
						}
					}
				}
			};
			expect(
				negotiationReducer(testState, {
					type: negotiateRateCardLine,
					payload: {
						productId: testProductId,
						rateCardId: testRateCartId,
						rateCardLineId: testRateCardLineId1,
						value: negotiatedValue
					}
				})
			).toEqual(expectedState);
		});
	});

	describe(addProducts, () => {
		const testState: Negotiation = {
			products: {
				[testProductId]: {
					volume: {
						mv: null,
						muc: null,
						mvp: null,
						mucp: null
					},
					rateCards: {},
					product: {
						oneOff: {
							original: 100,
							negotiated: undefined
						},
						recurring: {
							original: 200,
							negotiated: undefined
						}
					}
				}
			}
		};

		const testProductId2 = 'testProductId2';
		const testProductId3 = 'testProductId3';

		describe(`with new products having new ids`, () => {
			const newProducts: { [productId: string]: ProductNegotiation } = {
				[testProductId2]: {
					volume: {
						mv: null,
						muc: null,
						mvp: null,
						mucp: null
					},
					rateCards: {},
					product: {
						oneOff: {
							original: 200,
							negotiated: undefined
						},
						recurring: {
							original: 300,
							negotiated: undefined
						}
					}
				},
				[testProductId3]: {
					volume: {
						mv: null,
						muc: null,
						mvp: null,
						mucp: null
					},
					rateCards: {},
					product: {
						oneOff: {
							original: 1000,
							negotiated: undefined
						},
						recurring: {
							original: 2000,
							negotiated: undefined
						}
					}
				}
			};
			test(`returns the state with the new products added`, () => {
				const expectedState: Negotiation = {
					products: { ...testState.products, ...newProducts }
				};

				const updated = negotiationReducer(testState, {
					type: addProducts,
					payload: {
						products: newProducts
					}
				});
				expect(updated).toEqual(expectedState);
			});
		});

		describe(`with one of the new products with same id as the one already present`, () => {
			test(`returns the state with the old product replaced`, () => {
				const newProducts: { [productId: string]: ProductNegotiation } = {
					[testProductId]: {
						volume: {
							mv: null,
							muc: null,
							mvp: null,
							mucp: null
						},
						rateCards: {},
						product: {
							oneOff: {
								original: 200,
								negotiated: undefined
							},
							recurring: {
								original: 300,
								negotiated: undefined
							}
						}
					},
					[testProductId2]: {
						volume: {
							mv: null,
							muc: null,
							mvp: null,
							mucp: null
						},
						rateCards: {},
						product: {
							oneOff: {
								original: 1000,
								negotiated: undefined
							},
							recurring: {
								original: 2000,
								negotiated: undefined
							}
						}
					}
				};

				const expectedState: Negotiation = {
					products: newProducts
				};

				expect(
					negotiationReducer(testState, {
						type: addProducts,
						payload: {
							products: newProducts
						}
					})
				).toEqual(expectedState);
			});
		});
	});

	describe(loadAttachment, () => {
		const productId = 'productId';
		const rateCardId1 = 'rateCartId1';
		const rateCartLineId1 = 'rateCartLineId1';
		const rateCartLineId2 = 'rateCartLineId2';

		const testState: Negotiation = {
			products: {
				[productId]: {
					volume: {
						mv: null,
						muc: null,
						mvp: null,
						mucp: null
					},
					rateCards: {
						[rateCardId1]: {
							[rateCartLineId1]: {
								original: 1,
								negotiated: undefined
							},
							[rateCartLineId2]: {
								original: 2,
								negotiated: undefined
							}
						}
					},
					product: {
						recurring: {
							original: 100,
							negotiated: undefined
						},
						oneOff: {
							original: 200,
							negotiated: undefined
						}
					}
				}
			}
		};
		test(`updates the current state with the one described in the attachment`, () => {
			const attachment: Attachment = {
				products: {
					[productId]: {
						rateCards: {
							[rateCardId1]: {
								[rateCartLineId1]: 42,
								[rateCartLineId2]: 43
							}
						},
						volume: {
							muc: null,
							mucp: null,
							mv: null,
							mvp: null
						},
						allowances: {},
						product: {
							recurring: 1,
							oneOff: 2
						}
					}
				},
				addons: {},
				custom: {}
			};

			const expectedState: Negotiation = {
				products: {
					[productId]: {
						rateCards: {
							[rateCardId1]: {
								[rateCartLineId1]: {
									negotiated: 42,
									original: 1
								},
								[rateCartLineId2]: {
									negotiated: 43,
									original: 2
								}
							}
						},
						volume: {
							muc: null,
							mucp: null,
							mv: null,
							mvp: null
						},
						product: {
							recurring: {
								original: 100,
								negotiated: 1
							},
							oneOff: {
								original: 200,
								negotiated: 2
							}
						}
					}
				}
			};

			expect(
				negotiationReducer(testState, {
					type: 'loadAttachment',
					payload: {
						attachment
					}
				})
			).toEqual(expectedState);
		});
	});
});

describe('selectors', () => {
	describe('selectAttachment', () => {
		const productId = 'productId';
		const rateCardId1 = 'rateCartId1';
		const rateCartLineId1 = 'rateCartLineId1';
		const rateCartLineId2 = 'rateCartLineId2';

		const testState: Negotiation = {
			products: {
				[productId]: {
					volume: {
						mv: null,
						muc: null,
						mvp: null,
						mucp: null
					},
					rateCards: {
						[rateCardId1]: {
							[rateCartLineId1]: {
								original: 1,
								negotiated: 42
							},
							[rateCartLineId2]: {
								original: 2,
								negotiated: 43
							}
						}
					},
					product: {
						recurring: {
							original: 100,
							negotiated: 1
						},
						oneOff: {
							original: 200,
							negotiated: 2
						}
					}
				}
			}
		};

		const attachment: Attachment = {
			products: {
				[productId]: {
					rateCards: {
						[rateCardId1]: {
							[rateCartLineId1]: 42,
							[rateCartLineId2]: 43
						}
					},
					volume: {
						muc: null,
						mucp: null,
						mv: null,
						mvp: null
					},
					allowances: {},
					product: {
						recurring: 1,
						oneOff: 2
					}
				}
			},
			addons: {},
			custom: {}
		};

		test(`updates the current state with the one described in the attachment`, () => {
			expect(selectAttachment(testState)).toEqual(attachment);
		});
	});
});
