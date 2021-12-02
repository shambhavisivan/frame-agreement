import {
	Attachment,
	CommercialProductData,
	CommercialProductStandalone
} from '../../../datasources';
import {
	detailsReducer,
	NegotiableCharges,
	Negotiation as INegotiation,
	NegotiationAction,
	ProductNegotiation,
	selectAttachment
} from './details-reducer';

type Negotiation = INegotiation['negotiation'];
describe('detailsReducer', () => {
	const negotiateRecurring: NegotiationAction['type'] = 'negotiateProductRecurring';
	const negotiateOneOff: NegotiationAction['type'] = 'negotiateProductOneOff';
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
					},
					addons: {}
				}
			},
			addons: {},
			offers: {}
		};

		test(`returns the state with the product's negotiated recurring charge set`, () => {
			const negotiatedValue = 42;
			const expectedState: INegotiation = {
				negotiation: {
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
							},
							addons: {}
						}
					},
					addons: {},
					offers: {}
				},
				activeFa: undefined
			};
			expect(
				detailsReducer(
					{ negotiation: testState },
					{
						type: negotiateRecurring,
						payload: {
							productId: testProductId,
							itemType: 'products',
							value: negotiatedValue
						}
					}
				)
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
					},
					addons: {}
				}
			},
			addons: {},
			offers: {}
		};

		test(`returns the state with the product's negotiated oneOff charge set`, () => {
			const negotiatedValue = 42;

			const expectedState: INegotiation = {
				negotiation: {
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
							},
							addons: {}
						}
					},
					addons: {},
					offers: {}
				},
				activeFa: undefined
			};

			expect(
				detailsReducer(
					{ negotiation: testState },
					{
						type: negotiateOneOff,
						payload: {
							productId: testProductId,
							itemType: 'products',
							value: negotiatedValue
						}
					}
				)
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
							rateCardLines: {
								[testRateCardLineId1]: {
									original: 10,
									negotiated: undefined
								}
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
					},
					addons: {}
				}
			},
			addons: {},
			offers: {}
		};

		test(`returns the state with the product's negotiated recurring charge set`, () => {
			const negotiatedValue = 42;
			const expectedState: INegotiation = {
				negotiation: {
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
									rateCardLines: {
										[testRateCardLineId1]: {
											original: 10,
											negotiated: negotiatedValue
										}
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
							},
							addons: {}
						}
					},
					addons: {},
					offers: {}
				},
				activeFa: undefined
			};
			expect(
				detailsReducer(
					{ negotiation: testState },
					{
						type: negotiateRateCardLine,
						payload: {
							productId: testProductId,
							itemType: 'products',
							rateCardId: testRateCartId,
							rateCardLineId: testRateCardLineId1,
							value: negotiatedValue
						}
					}
				)
			).toEqual(expectedState);
		});
	});

	describe(addProducts, () => {
		const testState: Negotiation = {
			products: {},
			offers: {},
			addons: {}
		};

		const testProductId2 = 'testProductId2';

		describe(`with new products having new ids`, () => {
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
							original: 1000,
							negotiated: undefined
						},
						recurring: {
							original: 2000,
							negotiated: undefined
						}
					},
					charges: {},
					addons: {}
				}
			};

			const productsData: CommercialProductData = {
				cpData: {
					[testProductId]: {
						addons: [],
						allowances: [],
						rateCards: [],
						charges: []
					}
				},
				discThresh: [],
				discLevels: []
			};

			const products: CommercialProductStandalone[] = [
				{
					id: testProductId,
					name: 'testproductname',
					contractTerm: '12months',
					oneOffCharge: 1000,
					recurringCharge: 2000
				}
			];

			test(`returns the state with the new products added`, () => {
				const expectedState: INegotiation = {
					negotiation: {
						products: { ...testState.products, ...newProducts },
						addons: {},
						offers: {}
					},
					activeFa: undefined
				};

				const updated = detailsReducer(
					{ negotiation: testState },
					{
						type: addProducts,
						payload: {
							products: products,
							productsData: productsData
						}
					}
				);
				expect(updated).toEqual(expectedState);
			});
		});

		describe(`with one of the new products with same id as the one already present`, () => {
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
						},
						charges: {},
						addons: {}
					}
				},
				offers: {},
				addons: {}
			};
			const productsData: CommercialProductData = {
				cpData: {
					[testProductId2]: {
						addons: [],
						allowances: [],
						rateCards: [],
						charges: []
					}
				},
				discLevels: [],
				discThresh: []
			};

			const products: CommercialProductStandalone[] = [
				{
					id: testProductId2,
					name: 'testproductname',
					contractTerm: '12months',
					oneOffCharge: 200,
					recurringCharge: 300
				}
			];

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
								original: 100,
								negotiated: undefined
							},
							recurring: {
								original: 200,
								negotiated: undefined
							}
						},
						charges: {},
						addons: {}
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
								original: 200,
								negotiated: undefined
							},
							recurring: {
								original: 300,
								negotiated: undefined
							}
						},
						charges: {},
						addons: {}
					}
				};

				const expectedState: INegotiation = {
					negotiation: {
						products: newProducts,
						addons: {},
						offers: {}
					},
					activeFa: undefined
				};

				expect(
					detailsReducer(
						{ negotiation: testState },
						{
							type: addProducts,
							payload: {
								products: products,
								productsData: productsData
							}
						}
					)
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
							rateCardLines: {
								[rateCartLineId1]: {
									original: 1,
									negotiated: undefined
								},
								[rateCartLineId2]: {
									original: 2,
									negotiated: undefined
								}
							}
						}
					},
					product: {
						recurring: {
							original: undefined,
							negotiated: undefined
						},
						oneOff: {
							original: undefined,
							negotiated: undefined
						}
					},
					addons: {}
				}
			},
			addons: {},
			offers: {}
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

			const expectedState: INegotiation = {
				negotiation: {
					products: {
						[productId]: {
							rateCards: {
								[rateCardId1]: {
									rateCardLines: {
										[rateCartLineId1]: {
											negotiated: 42,
											original: undefined
										},
										[rateCartLineId2]: {
											negotiated: 43,
											original: undefined
										}
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
									original: undefined,
									negotiated: 1
								},
								oneOff: {
									original: undefined,
									negotiated: 2
								}
							},
							addons: {},
							charges: {}
						}
					},
					addons: {},
					offers: {}
				},
				activeFa: undefined
			};

			expect(
				detailsReducer(
					{ negotiation: testState },
					{
						type: 'loadAttachment',
						payload: {
							attachment
						}
					}
				)
			).toEqual(expectedState);
		});

		test('negotiate advanced oneoffcharge', () => {
			const stateWithAdvancedCharges: Negotiation = {
				products: {
					[productId]: {
						volume: {
							mv: null,
							muc: null,
							mvp: null,
							mucp: null
						},
						product: {} as NegotiableCharges,
						rateCards: {
							[rateCardId1]: {
								rateCardLines: {
									[rateCartLineId1]: {
										original: 1,
										negotiated: undefined
									},
									[rateCartLineId2]: {
										original: 2,
										negotiated: undefined
									}
								}
							}
						},
						charges: {
							'charge-id': {
								oneOff: {
									negotiated: 0,
									original: 0
								},
								recurring: {
									negotiated: 0,
									original: 0
								}
							}
						},
						addons: {}
					}
				},
				addons: {},
				offers: {}
			};

			const expectedState: INegotiation = {
				negotiation: {
					products: {
						[productId]: {
							rateCards: {
								[rateCardId1]: {
									rateCardLines: {
										[rateCartLineId1]: {
											negotiated: undefined,
											original: 1
										},
										[rateCartLineId2]: {
											negotiated: undefined,
											original: 2
										}
									}
								}
							},
							product: {} as NegotiableCharges,
							volume: {
								muc: null,
								mucp: null,
								mv: null,
								mvp: null
							},
							addons: {},
							charges: {
								'charge-id': {
									oneOff: {
										negotiated: 45,
										original: 0
									},
									recurring: {
										negotiated: 0,
										original: 0
									}
								}
							}
						}
					},
					addons: {},
					offers: {}
				},
				activeFa: undefined
			};

			expect(expectedState).toEqual(
				detailsReducer(
					{ negotiation: stateWithAdvancedCharges },
					{
						type: 'negotiateOneOffCharge',
						payload: {
							productId: productId,
							itemType: 'products',
							chargeId: 'charge-id',
							value: 45
						}
					}
				)
			);
		});

		test('negotiate advanced recurring charge', () => {
			const stateWithAdvancedCharges: Negotiation = {
				products: {
					[productId]: {
						volume: {
							mv: null,
							muc: null,
							mvp: null,
							mucp: null
						},
						product: {} as NegotiableCharges,
						rateCards: {
							[rateCardId1]: {
								rateCardLines: {
									[rateCartLineId1]: {
										original: 1,
										negotiated: undefined
									},
									[rateCartLineId2]: {
										original: 2,
										negotiated: undefined
									}
								}
							}
						},
						charges: {
							'charge-id': {
								oneOff: {
									negotiated: 0,
									original: 0
								},
								recurring: {
									negotiated: 0,
									original: 0
								}
							}
						},
						addons: {}
					}
				},
				addons: {},
				offers: {}
			};

			const expectedState: INegotiation = {
				negotiation: {
					products: {
						[productId]: {
							product: {} as NegotiableCharges,
							rateCards: {
								[rateCardId1]: {
									rateCardLines: {
										[rateCartLineId1]: {
											negotiated: undefined,
											original: 1
										},
										[rateCartLineId2]: {
											negotiated: undefined,
											original: 2
										}
									}
								}
							},
							volume: {
								muc: null,
								mucp: null,
								mv: null,
								mvp: null
							},
							addons: {},
							charges: {
								'charge-id': {
									oneOff: {
										negotiated: 0,
										original: 0
									},
									recurring: {
										negotiated: 4500,
										original: 0
									}
								}
							}
						}
					},
					addons: {},
					offers: {}
				},
				activeFa: undefined
			};

			expect(expectedState).toEqual(
				detailsReducer(
					{ negotiation: stateWithAdvancedCharges },
					{
						type: 'negotiateRecurringCharge',
						payload: {
							productId: productId,
							itemType: 'products',
							chargeId: 'charge-id',
							value: 4500
						}
					}
				)
			);
		});
	});
});

describe('selectors', () => {
	describe('selectAttachment', () => {
		const productId = 'productId';
		const productId2 = 'productId2';
		const chargeId = 'chargeId';
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
							rateCardLines: {
								[rateCartLineId1]: {
									original: 1,
									negotiated: 42
								},
								[rateCartLineId2]: {
									original: 2,
									negotiated: 43
								}
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
					},
					addons: {}
				},
				[productId2]: {
					product: {} as NegotiableCharges,
					volume: {
						mv: null,
						muc: null,
						mvp: null,
						mucp: null
					},
					rateCards: {
						[rateCardId1]: {
							rateCardLines: {
								[rateCartLineId1]: {
									original: 1,
									negotiated: 42
								},
								[rateCartLineId2]: {
									original: 2,
									negotiated: 43
								}
							}
						}
					},
					charges: {
						[chargeId]: {
							oneOff: {
								negotiated: 456,
								original: 456
							},
							recurring: {
								negotiated: 678,
								original: 789
							}
						}
					},
					addons: {}
				}
			},
			addons: {},
			offers: {}
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
					},
					charges: {}
				},
				[productId2]: {
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
					product: {},
					charges: {
						[chargeId]: {
							oneOff: 456,
							recurring: 678
						}
					}
				}
			},
			addons: {},
			offers: {},
			custom: {}
		};

		test(`modify state to match attachment object`, () => {
			expect(selectAttachment(testState)).toEqual(attachment);
		});
	});
});

describe('test updateof currentFA', () => {
	const testState: INegotiation = {} as INegotiation;

	expect(
		detailsReducer(testState, {
			type: 'updateActiveFa',
			payload: {
				agreement: { id: 'someId', agreementName: 'some-agreement', name: 'AGR_001' }
			}
		})
	).toEqual({
		activeFa: { id: 'someId', agreementName: 'some-agreement', name: 'AGR_001' },
		negotiation: {}
	} as INegotiation);
});
