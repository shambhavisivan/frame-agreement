export const getMockStore = neededProps => {
	let _store = {};
	if (!neededProps) {
		return FULL_STORE;
	}

	neededProps.forEach(prop => {
		_store[prop] = FULL_STORE[prop];
	});

	return _store;
};

export const getInitStore = () => {
	return INITIAL_STORE;
};

export const getFa = () => ({
	Id: 'a1t1t0000009wpQAAQ',
	Name: 'AGR-000000',
	csconta__Account__c: '0011t00000DSEtnAAH',
	csconta__Agreement_Name__c: 'Frame Agreement - Test #1',
	csconta__Status__c: 'Draft',
	csconta__Valid_From__c: 1547424000000,
	csconta__Valid_To__c: 1568419200000,
	csfam__Arb_Field_Bool__c: true,
	csfam__Arb_Field_Integer__c: 48,
	csfam__Arb_Field_Text__c: 'Arb Text',
	csfam__Arb_Field_Date__c: 1547510400000,
	csfam__Arb_Field_Text_2__c: 'Arb Text 2 - change 2',
	csfam__Arb_Field_Text_3__c: 'Arb Text 3 - change 1',
	csconta__replaced_frame_agreement__c: 'a1t1t000000EOuxAAG',
	csconta__agreement_level__c: 'Master Agreement',
	csfam__Arb_Field_Textarea__c:
		'Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget',
	csconta__Account__r: {
		Name: 'Test Account',
		Id: '0011t00000DSEtnAAH'
	},
	_ui: {
		commercialProducts: [],
		approvalNeeded: [],
		headerRows: [
			[
				{
					field: 'csconta__Agreement_Name__c',
					readOnly: false,
					label: 'Agreement Name',
					type: 'text',
					grid: 2
				},
				{
					field: 'csfam__Arb_Field_Integer__c',
					readOnly: false,
					label: 'Arb Field Integer',
					type: 'number',
					visible: 'csfam__Arb_Field_Bool__c==true',
					grid: 1
				},
				{
					field: 'csfam__Arb_Field_Bool__c',
					readOnly: false,
					label: 'Arb Field Bool',
					type: 'boolean',
					grid: 2
				},
				{
					field: 'csfam__Arb_Field_Text__c',
					readOnly: false,
					label: 'Arb Field Text',
					type: 'text',
					grid: 4
				},
				{
					field: 'csfam__Arb_Field_Date__c',
					readOnly: false,
					label: 'Arb Field Date',
					type: 'date',
					grid: 2
				}
			],
			[
				{
					field: 'csfam__Arb_Picklist__c',
					readOnly: false,
					label: 'Arb Field Picklist',
					type: 'picklist',
					grid: 3,
					options: [
						{
							label: 'OptionA',
							value: 'OptionA'
						},
						{
							label: 'OptionB',
							value: 'OptionB'
						},
						{
							label: 'OptionC',
							value: 'OptionC'
						}
					]
				},
				{
					field: 'csfam__Arb_Field_Textarea__c',
					readOnly: false,
					label: 'Arb Field Textarea',
					type: 'textarea',
					grid: 4
				},
				{
					field: 'csfam__Arb_Formula__c',
					readOnly: true,
					label: 'Arb Formula',
					type: 'formula',
					grid: 4
				}
			],
			[
				{
					field: 'csconta__Account__c',
					readOnly: false,
					label: 'Account',
					type: 'lookup',
					grid: 4,
					lookupData: {
						columns: ['Name', 'Type'],
						whereClause: "name != 'invalidTest'"
					}
				},
				{
					field: 'csconta__replaced_frame_agreement__c',
					readOnly: false,
					label: 'Replaced FA',
					type: 'lookup',
					grid: 4,
					lookupData: {
						columns: ['csconta__Agreement_Name__c', 'Id']
					}
				}
			]
		],
		attachment: {
			custom: '',
			products: {
				a1F1t0000001JBjEAM: {
					_volume: {
						mv: null,
						mvp: null,
						muc: null,
						mucp: null
					},
					_addons: {
						a1A1t0000003SbnEAE: {}
					},
					_product: {
						recurring: 266
					}
				},
				a1F1t0000001JCDEA2: {
					_volume: {
						mv: null,
						mvp: null,
						muc: null,
						mucp: null
					},
					_product: {
						recurring: 263
					}
				},
				a1F1t0000001JC8EAM: {
					_volume: {
						mv: null,
						mvp: null,
						muc: null,
						mucp: null
					},
					_product: {
						recurring: 239.41
					}
				},
				a1F1t00000017Y0EAI: {
					_volume: {
						mv: null,
						mvp: null,
						muc: null,
						mucp: null
					},
					_addons: {
						a1A1t0000002cIMEAY: {
							oneOff: 7.64,
							recurring: 7.75
						},
						a1A1t0000003ScfEAE: {
							oneOff: 7.49,
							recurring: 79.44
						}
					},
					_charges: {
						a1I1t000001WkzoEAC: {
							oneOff: 7
						},
						a1I1t000001WkzjEAC: {
							recurring: 12
						}
					},
					_rateCards: {
						a1N1t0000001QxrEAE: {
							a1M1t000000BFrVEAW: 124.99
						}
					}
				}
			}
		}
	}
});

const INITIAL_STORE = {
	initialised: {
		fa_loaded: false,
		cp_loaded: false,
		settings_loaded: false
	},
	settings: {},
	accounts: [],
	frameAgreements: {},
	commercialProducts: null,
	productFields: [],
	faFields: [],
	activeFa: null,
	validation: {},
	validationProduct: {},
	// approvalNeeded: false, // true -> needs validation
	handlers: {},
	modals: {
		actionIframe: false,
		actionIframeUrl: '',
		productModal: false,
		frameModal: false,
		negotiateModal: false
	},
	toasts: []
	// activeId: null
};

const FULL_STORE = {
	initialised: {
		fa_loaded: true,
		cp_loaded: true,
		settings_loaded: true
	},
	settings: {
		commercialProductCount: 10,
		frameAgreementsCount: 3,
		itemsPerPage: 20,
		ButtonCustomData: [
			{
				type: 'action',
				label: 'Action button',
				id: 'bta1',
				location: 'Editor',
				method: 'ActionFunction',
				hidden: ['Active']
			},
			{
				type: 'iframe',
				label: 'iFrame button',
				id: 'bta2',
				location: 'Editor',
				method: 'iFrameFunction',
				hidden: ['Active']
			},
			{
				type: 'redirect',
				label: 'Redirect button',
				id: 'bta3',
				location: 'Editor',
				method: 'RedirectFunction',
				hidden: ['Active']
			},
			{
				type: 'redirect',
				label: 'Redirect 2',
				id: 'bta4',
				method: 'ActionFunction',
				location: 'List',
				hidden: ['Active']
			},
			{
				type: 'redirect',
				label: 'Action button',
				id: 'bta5',
				location: 'Footer',
				method: 'ActionFunction',
				hidden: ['Active']
			}
		],
		ButtonStandardData: {
			Save: ['Draft', 'Requires Approval'],
			SubmitForApproval: ['Requires Approval'],
			Submit: ['Draft', 'Approved'],
			DeleteProducts: ['Draft', 'Requires Approval'],
			BulkNegotiate: ['Draft', 'Requires Approval'],
			AddProducts: ['Draft', 'Requires Approval'],
			AddFrameAgreement: ['Draft', 'Requires Approval'],
			NewVersion: ['Active']
		},
		CategorizationData: [
			{
				name: 'Alpha',
				field: 'Categorization_Alpha__c',
				values: ['Fixed', 'Mobile', 'Static']
			},
			{
				name: 'Beta',
				field: 'Categorization_Beta__c',
				values: ['10GB', '20GB', '50GB', '100GB']
			}
		],
		HeaderData: [
			{
				field: 'csconta__Agreement_Name__c',
				readOnly: false,
				label: 'Agreement Name',
				type: 'text',
				grid: 2
			},
			{
				field: 'csfam__Arb_Field_Integer__c',
				readOnly: false,
				label: 'Arb Field Integer',
				type: 'number',
				visible: 'csfam__Arb_Field_Bool__c==true',
				grid: 1
			},
			{
				field: 'csfam__Arb_Field_Bool__c',
				readOnly: false,
				label: 'Arb Field Bool',
				type: 'boolean',
				grid: 2
			},
			{
				field: 'csfam__Arb_Field_Text__c',
				readOnly: false,
				label: 'Arb Field Text',
				type: 'text',
				grid: 4
			},
			{
				field: 'csfam__Arb_Field_Date__c',
				readOnly: false,
				label: 'Arb Field Date',
				type: 'date',
				grid: 2
			},
			{
				field: 'csfam__Arb_Picklist__c',
				readOnly: false,
				label: 'Arb Field Picklist',
				type: 'picklist',
				grid: 3,
				options: [
					{
						label: 'OptionA',
						value: 'OptionA'
					},
					{
						label: 'OptionB',
						value: 'OptionB'
					},
					{
						label: 'OptionC',
						value: 'OptionC'
					}
				]
			},
			{
				field: 'csfam__Arb_Field_Text_3__c',
				readOnly: false,
				label: 'Arb Field Text 3',
				type: 'text',
				visible: 'csfam__Arb_Field_Text__c==hide',
				grid: 4
			},
			{
				field: 'csfam__Arb_Field_Textarea__c',
				readOnly: false,
				label: 'Arb Field Textarea',
				type: 'textarea',
				grid: 4
			},
			{
				field: 'csfam__Arb_Formula__c',
				readOnly: true,
				label: 'Arb Formula',
				type: 'formula',
				grid: 4
			},
			{
				field: 'csconta__Account__c',
				readOnly: false,
				label: 'Account',
				type: 'lookup',
				grid: 4,
				lookupData: {
					columns: ['Name', 'Type'],
					whereClause: "name != 'invalidTest'"
				}
			},
			{
				field: 'csconta__replaced_frame_agreement__c',
				readOnly: false,
				label: 'Replaced FA',
				type: 'lookup',
				grid: 4,
				lookupData: {
					columns: ['csconta__Agreement_Name__c', 'Id']
				}
			}
		],
		CustomTabsData: [
			{
				label: 'Custom tab',
				container_id: 'customTab1',
				onEnter: 'customTabEnter',
				type: 'text',
				grid: 3,
				readOnly: false,
				onMount: null
			}
		],
		account: {
			Id: 'aaaa',
			Name: 'aaaa'
		},
		DiscLevels: {
			a141t00000137a8AAA: {
				discountLevel: {
					Id: 'a141t00000137a8AAA',
					Name: 'Test',
					cspmb__Charge_Type__c: 'RC',
					cspmb__Discount_Type__c: 'Percentage',
					cspmb__Discount_Values__c: [10, 20, 30]
				},
				levelId: 'a141t00000137a8AAA',
				priceItemId: 'a1F1t00000017Y0EAI'
			},
			a141t00000137e7AAA: {
				addonId: 'a0w1t0000002hSaAAI',
				discountLevel: {
					Id: 'a141t00000137e7AAA',
					Name: 'TestAddons',
					cspmb__Charge_Type__c: 'RC',
					cspmb__Discount_Type__c: 'Amount',
					cspmb__Discount_Values__c: [10, 20, 30]
				},
				levelId: 'a141t00000137e7AAA'
			},
			a141t00000137cgAAA: {
				discountLevel: {
					Id: 'a141t00000137cgAAA',
					Name: 'Test2',
					cspmb__Charge_Type__c: 'RC',
					cspmb__Discount_Type__c: 'Amount',
					cspmb__Discount_Values__c: [5, 6, 7, 8, 9, 10]
				},
				levelId: 'a141t00000137cgAAA',
				priceItemId: 'a1F1t00000017Y0EAI'
			},
			a141t00000137hrAAA: {
				addonId: 'a0w1t0000002hSaAAI',
				discountLevel: {
					Id: 'a141t00000137hrAAA',
					Name: 'Test2_2',
					cspmb__Charge_Type__c: 'RC',
					cspmb__Discount_Type__c: 'Percentage',
					cspmb__Discount_Values__c: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
				},
				levelId: 'a141t00000137hrAAA'
			},
			a141t00000137lLAAQ: {
				discountLevel: {
					Id: 'a141t00000137lLAAQ',
					Name: 'One-off charge',
					cspmb__Charge_Type__c: 'NRC',
					cspmb__Discount_Type__c: 'Percentage',
					cspmb__Discount_Values__c: [10, 20, 30]
				},
				levelId: 'a141t00000137lLAAQ',
				priceItemId: 'a1F1t00000017Y0EAI'
			},
			a141t00000137ycAAA: {
				discountLevel: {
					Id: 'a141t00000137ycAAA',
					Name: 'ProductCharge-11',
					cspmb__Charge_Type__c: 'RC',
					cspmb__Discount_Type__c: 'Percentage',
					cspmb__Discount_Values__c: [10, 20, 30]
				},
				levelId: 'a141t00000137ycAAA',
				priceItemId: 'a1F1t0000001JC8EAM'
			}
		},
		AuthLevels: {
			a0x1t000000yZF3AAM: [
				{
					Id: 'a151t000000rmV7AAI',
					Name: 'RCL1.1',
					cspmb__Discount_Threshold__c: 10,
					cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
					cspmb__Discount_Type__c: 'Percentage'
				}
			],
			a0x1t000001RjC9AAK: [
				{
					Id: 'a151t000000y2MDAAY',
					Name: 'RCL1.1',
					cspmb__Discount_Threshold__c: 21,
					cspmb__Authorization_Level__c: 'a0x1t000001RjC9AAK',
					cspmb__Discount_Type__c: 'Percentage'
				},
				{
					Id: 'a151t000000y2M8AAI',
					Name: 'RCL_1_1',
					cspmb__Discount_Threshold__c: 5,
					cspmb__Authorization_Level__c: 'a0x1t000001RjC9AAK',
					cspmb__Discount_Type__c: 'Amount'
				}
			],
			a0x1t000001RjC4AAK: [
				{
					Id: 'a151t000000y2M3AAI',
					Name: 'Percentage',
					cspmb__Discount_Threshold__c: 20,
					cspmb__Authorization_Level__c: 'a0x1t000001RjC4AAK',
					cspmb__Discount_Type__c: 'Percentage'
				}
			],
			a0x1t000001RjBzAAK: [
				{
					Id: 'a151t000000y2LyAAI',
					Name: 'One-off charge',
					cspmb__Discount_Threshold__c: 30,
					cspmb__Authorization_Level__c: 'a0x1t000001RjBzAAK',
					cspmb__Discount_Type__c: 'Percentage'
				},
				{
					Id: 'a151t000000y2LtAAI',
					Name: 'Recurring Charge',
					cspmb__Discount_Threshold__c: 5,
					cspmb__Authorization_Level__c: 'a0x1t000001RjBzAAK',
					cspmb__Discount_Type__c: 'Amount'
				}
			],
			a0x1t000001RjCJAA0: [
				{
					Id: 'a151t000000y2MNAAY',
					Name: 'ADD1',
					cspmb__Discount_Threshold__c: 12,
					cspmb__Authorization_Level__c: 'a0x1t000001RjCJAA0',
					cspmb__Discount_Type__c: 'Percentage'
				},
				{
					Id: 'a151t000000y2MXAAY',
					Name: 'ADD1',
					cspmb__Discount_Threshold__c: 5,
					cspmb__Authorization_Level__c: 'a0x1t000001RjCJAA0',
					cspmb__Discount_Type__c: 'Amount'
				}
			],
			a0x1t000001RjCEAA0: [
				{
					Id: 'a151t000000y2MIAAY',
					Name: 'Amount',
					cspmb__Discount_Threshold__c: 3,
					cspmb__Authorization_Level__c: 'a0x1t000001RjCEAA0',
					cspmb__Discount_Type__c: 'Amount'
				}
			]
		},
		FACSettings: {
			fa_editable_statuses: new Set(['Draft', 'Requires Approval']),
			price_item_fields: [],
			show_volume_fields: false,
			frame_agreement_fields: [],
			decomposition_chunk_size: 2,
			discount_as_price: true,
			new_frame_agreement: true,
			product_chunk_size: 100,
			rcl_fields: [],
			statuses: {
				active_status: 'Active',
				approved_status: 'Approved',
				closed_status: 'Closed',
				draft_status: 'Draft',
				requires_approval_status: 'Requires Approval'
			},
			truncate_product_fields: true
		}
	},
	accounts: [],
	frameAgreements: {
		a1t1t0000009wpQAAQ: {
			Id: 'a1t1t0000009wpQAAQ',
			Name: 'AGR-000000',
			csconta__Account__c: '0011t00000DSEtnAAH',
			csconta__Agreement_Name__c: 'Frame Agreement - Test #1',
			csconta__Status__c: 'Draft',
			csconta__Valid_From__c: 1547424000000,
			csconta__Valid_To__c: 1568419200000,
			csfam__Arb_Field_Bool__c: true,
			csfam__Arb_Field_Integer__c: 48,
			csfam__Arb_Field_Text__c: 'Arb Text',
			csfam__Arb_Field_Date__c: 1547510400000,
			csfam__Arb_Field_Text_2__c: 'Arb Text 2 - change 2',
			csfam__Arb_Field_Text_3__c: 'Arb Text 3 - change 1',
			csconta__replaced_frame_agreement__c: 'a1t1t000000EOuxAAG',
			csconta__agreement_level__c: 'Master Agreement',
			csfam__Arb_Field_Textarea__c:
				'Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget',
			csconta__Account__r: {
				Name: 'Test Account',
				Id: '0011t00000DSEtnAAH'
			},
			_ui: {
				commercialProducts: [],
				approvalNeeded: [],
				headerRows: [
					[
						{
							field: 'csconta__Agreement_Name__c',
							readOnly: false,
							label: 'Agreement Name',
							type: 'text',
							grid: 2
						},
						{
							field: 'csfam__Arb_Field_Integer__c',
							readOnly: false,
							label: 'Arb Field Integer',
							type: 'number',
							visible: 'csfam__Arb_Field_Bool__c==true',
							grid: 1
						},
						{
							field: 'csfam__Arb_Field_Bool__c',
							readOnly: false,
							label: 'Arb Field Bool',
							type: 'boolean',
							grid: 2
						},
						{
							field: 'csfam__Arb_Field_Text__c',
							readOnly: false,
							label: 'Arb Field Text',
							type: 'text',
							grid: 4
						},
						{
							field: 'csfam__Arb_Field_Date__c',
							readOnly: false,
							label: 'Arb Field Date',
							type: 'date',
							grid: 2
						}
					],
					[
						{
							field: 'csfam__Arb_Picklist__c',
							readOnly: false,
							label: 'Arb Field Picklist',
							type: 'picklist',
							grid: 3,
							options: [
								{
									label: 'OptionA',
									value: 'OptionA'
								},
								{
									label: 'OptionB',
									value: 'OptionB'
								},
								{
									label: 'OptionC',
									value: 'OptionC'
								}
							]
						},
						{
							field: 'csfam__Arb_Field_Textarea__c',
							readOnly: false,
							label: 'Arb Field Textarea',
							type: 'textarea',
							grid: 4
						},
						{
							field: 'csfam__Arb_Formula__c',
							readOnly: true,
							label: 'Arb Formula',
							type: 'formula',
							grid: 4
						}
					],
					[
						{
							field: 'csconta__Account__c',
							readOnly: false,
							label: 'Account',
							type: 'lookup',
							grid: 4,
							lookupData: {
								columns: ['Name', 'Type'],
								whereClause: "name != 'invalidTest'"
							}
						},
						{
							field: 'csconta__replaced_frame_agreement__c',
							readOnly: false,
							label: 'Replaced FA',
							type: 'lookup',
							grid: 4,
							lookupData: {
								columns: ['csconta__Agreement_Name__c', 'Id']
							}
						}
					]
				],
				attachment: {
					custom: '',
					products: {
						a1F1t0000001JBjEAM: {
							_volume: {
								mv: null,
								mvp: null,
								muc: null,
								mucp: null
							},
							_addons: {
								a1A1t0000003SbnEAE: {}
							},
							_product: {
								recurring: 266
							}
						},
						a1F1t0000001JCDEA2: {
							_volume: {
								mv: null,
								mvp: null,
								muc: null,
								mucp: null
							},
							_product: {
								recurring: 263
							}
						},
						a1F1t0000001JC8EAM: {
							_volume: {
								mv: null,
								mvp: null,
								muc: null,
								mucp: null
							},
							_product: {
								recurring: 239.41
							}
						},
						a1F1t00000017Y0EAI: {
							_volume: {
								mv: null,
								mvp: null,
								muc: null,
								mucp: null
							},
							_addons: {
								a1A1t0000002cIMEAY: {
									oneOff: 7.64,
									recurring: 7.75
								},
								a1A1t0000003ScfEAE: {
									oneOff: 7.49,
									recurring: 79.44
								}
							},
							_charges: {
								a1I1t000001WkzoEAC: {
									oneOff: 7
								},
								a1I1t000001WkzjEAC: {
									recurring: 12
								}
							},
							_rateCards: {
								a1N1t0000001QxrEAE: {
									a1M1t000000BFrVEAW: 124.99
								}
							}
						}
					}
				}
			}
		},
		a1t1t000000A0gJAAS: {
			Id: 'a1t1t000000A0gJAAS',
			Name: 'AGR-000001',
			csconta__Account__c: '0011t00000DSEtnAAH',
			csconta__Agreement_Name__c: 'Frame Agreement - Test #2',
			csconta__Status__c: 'Active',
			csconta__Valid_From__c: 1547424000000,
			csconta__Valid_To__c: 1568419200000,
			csfam__Arb_Field_Bool__c: true,
			csfam__Arb_Field_Integer__c: 144,
			csfam__Arb_Field_Text__c: 'Arb Text',
			csfam__Arb_Field_Date__c: 1547424000000,
			csfam__Arb_Field_Text_2__c: 'Arb Text 2 - change 1dsfsdf',
			csfam__Arb_Field_Text_3__c: 'Arb Text 3 - change 1',
			csconta__agreement_level__c: 'Frame Agreement',
			csfam__Arb_Field_Textarea__c:
				'Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget',
			csconta__Account__r: {
				Name: 'Test Account',
				Id: '0011t00000DSEtnAAH'
			},
			_ui: {
				commercialProducts: [],
				approvalNeeded: [],
				headerRows: [
					[
						{
							field: 'csconta__Agreement_Name__c',
							readOnly: false,
							label: 'Agreement Name',
							type: 'text',
							grid: 2
						},
						{
							field: 'csfam__Arb_Field_Integer__c',
							readOnly: false,
							label: 'Arb Field Integer',
							type: 'number',
							visible: 'csfam__Arb_Field_Bool__c==true',
							grid: 1
						},
						{
							field: 'csfam__Arb_Field_Bool__c',
							readOnly: false,
							label: 'Arb Field Bool',
							type: 'boolean',
							grid: 2
						},
						{
							field: 'csfam__Arb_Field_Text__c',
							readOnly: false,
							label: 'Arb Field Text',
							type: 'text',
							grid: 4
						},
						{
							field: 'csfam__Arb_Field_Date__c',
							readOnly: false,
							label: 'Arb Field Date',
							type: 'date',
							grid: 2
						}
					],
					[
						{
							field: 'csfam__Arb_Picklist__c',
							readOnly: false,
							label: 'Arb Field Picklist',
							type: 'picklist',
							grid: 3,
							options: [
								{
									label: 'OptionA',
									value: 'OptionA'
								},
								{
									label: 'OptionB',
									value: 'OptionB'
								},
								{
									label: 'OptionC',
									value: 'OptionC'
								}
							]
						},
						{
							field: 'csfam__Arb_Field_Textarea__c',
							readOnly: false,
							label: 'Arb Field Textarea',
							type: 'textarea',
							grid: 4
						},
						{
							field: 'csfam__Arb_Formula__c',
							readOnly: true,
							label: 'Arb Formula',
							type: 'formula',
							grid: 4
						}
					],
					[
						{
							field: 'csconta__Account__c',
							readOnly: false,
							label: 'Account',
							type: 'lookup',
							grid: 4,
							lookupData: {
								columns: ['Name', 'Type'],
								whereClause: "name != 'invalidTest'"
							}
						},
						{
							field: 'csconta__replaced_frame_agreement__c',
							readOnly: false,
							label: 'Replaced FA',
							type: 'lookup',
							grid: 4,
							lookupData: {
								columns: ['csconta__Agreement_Name__c', 'Id']
							}
						}
					]
				],
				attachment: null
			}
		},
		a1t1t000000A0gOAAS: {
			Id: 'a1t1t000000A0gOAAS',
			Name: 'AGR-000002',
			csconta__Account__c: '0011t00000DSEtnAAH',
			csconta__Agreement_Name__c: 'Frame Agreement - Test #3',
			csconta__Status__c: 'Draft',
			csconta__Valid_From__c: 1547424000000,
			csconta__Valid_To__c: 1568419200000,
			csfam__Arb_Field_Bool__c: true,
			csfam__Arb_Field_Integer__c: 22,
			csfam__Arb_Field_Text__c: 'Arb Text',
			csfam__Arb_Field_Date__c: 1547424000000,
			csfam__Arb_Field_Text_2__c: 'Arb Text 2 - change 1dsfsdf',
			csfam__Arb_Field_Text_3__c: 'Arb Text 3 - change 1',
			csfam__Arb_Field_Textarea__c:
				'Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget',
			csconta__Account__r: {
				Name: 'Test Account',
				Id: '0011t00000DSEtnAAH'
			},
			_ui: {
				commercialProducts: [],
				approvalNeeded: [],
				headerRows: [
					[
						{
							field: 'csconta__Agreement_Name__c',
							readOnly: false,
							label: 'Agreement Name',
							type: 'text',
							grid: 2
						},
						{
							field: 'csfam__Arb_Field_Integer__c',
							readOnly: false,
							label: 'Arb Field Integer',
							type: 'number',
							visible: 'csfam__Arb_Field_Bool__c==true',
							grid: 1
						},
						{
							field: 'csfam__Arb_Field_Bool__c',
							readOnly: false,
							label: 'Arb Field Bool',
							type: 'boolean',
							grid: 2
						},
						{
							field: 'csfam__Arb_Field_Text__c',
							readOnly: false,
							label: 'Arb Field Text',
							type: 'text',
							grid: 4
						},
						{
							field: 'csfam__Arb_Field_Date__c',
							readOnly: false,
							label: 'Arb Field Date',
							type: 'date',
							grid: 2
						}
					],
					[
						{
							field: 'csfam__Arb_Picklist__c',
							readOnly: false,
							label: 'Arb Field Picklist',
							type: 'picklist',
							grid: 3,
							options: [
								{
									label: 'OptionA',
									value: 'OptionA'
								},
								{
									label: 'OptionB',
									value: 'OptionB'
								},
								{
									label: 'OptionC',
									value: 'OptionC'
								}
							]
						},
						{
							field: 'csfam__Arb_Field_Textarea__c',
							readOnly: false,
							label: 'Arb Field Textarea',
							type: 'textarea',
							grid: 4
						},
						{
							field: 'csfam__Arb_Formula__c',
							readOnly: true,
							label: 'Arb Formula',
							type: 'formula',
							grid: 4
						}
					],
					[
						{
							field: 'csconta__Account__c',
							readOnly: false,
							label: 'Account',
							type: 'lookup',
							grid: 4,
							lookupData: {
								columns: ['Name', 'Type'],
								whereClause: "name != 'invalidTest'"
							}
						},
						{
							field: 'csconta__replaced_frame_agreement__c',
							readOnly: false,
							label: 'Replaced FA',
							type: 'lookup',
							grid: 4,
							lookupData: {
								columns: ['csconta__Agreement_Name__c', 'Id']
							}
						}
					]
				],
				attachment: null
			}
		}
	},
	commercialProducts: [
		{
			Id: 'a1F1t0000001JBoEAM',
			Name: 'Mobile L_7',
			cspmb__Effective_Start_Date__c: 1545264000000,
			cspmb__Recurring_Charge__c: 269,
			cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
			cspmb__Is_Authorization_Required__c: false,
			cspmb__Is_One_Off_Discount_Allowed__c: true,
			cspmb__Is_Recurring_Discount_Allowed__c: true,
			cspmb__Price_Item_Description__c: '30 Gb Internet + 5000 minutes/SMS',
			cspmb__Contract_Term__c: '24 Months',
			Categorization_Alpha__c: 'Mobile',
			Categorization_Beta__c: '100GB'
		},
		{
			Id: 'a1F1t0000001JBZEA2',
			Name: 'Mobile L_4',
			cspmb__Effective_Start_Date__c: 1547337600000,
			cspmb__Effective_End_Date__c: 1583625600000,
			cspmb__Recurring_Charge__c: 269,
			cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
			cspmb__Is_Authorization_Required__c: false,
			cspmb__Is_One_Off_Discount_Allowed__c: true,
			cspmb__Is_Recurring_Discount_Allowed__c: true,
			cspmb__Price_Item_Description__c: '30 Gb Internet + 5000 minutes/SMS',
			cspmb__Contract_Term__c: '24 Months',
			Categorization_Alpha__c: 'Static',
			Categorization_Beta__c: '100GB'
		},
		{
			Id: 'a1F1t0000001JBUEA2',
			Name: 'Mobile L_3',
			cspmb__Recurring_Charge__c: 269,
			cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
			cspmb__Is_Authorization_Required__c: false,
			cspmb__Is_One_Off_Discount_Allowed__c: true,
			cspmb__Is_Recurring_Discount_Allowed__c: true,
			cspmb__Price_Item_Description__c: '30 Gb Internet + 5000 minutes/SMS',
			cspmb__Contract_Term__c: '24 Months',
			Categorization_Alpha__c: 'Fixed',
			Categorization_Beta__c: '100GB'
		},
		{
			Id: 'a1F1t0000001JBjEAM',
			Name: 'Mobile L_6',
			cspmb__Effective_Start_Date__c: 1545264000000,
			cspmb__Recurring_Charge__c: 269,
			cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
			cspmb__Is_Authorization_Required__c: false,
			cspmb__Is_One_Off_Discount_Allowed__c: true,
			cspmb__Is_Recurring_Discount_Allowed__c: true,
			cspmb__Price_Item_Description__c: '30 Gb Internet + 5000 minutes/SMS',
			cspmb__Contract_Term__c: '24 Months',
			Categorization_Alpha__c: 'Static',
			Categorization_Beta__c: '50GB'
		},
		{
			Id: 'a1F1t0000001JCDEA2',
			Name: 'Mobile L_12',
			cspmb__Effective_Start_Date__c: 1545264000000,
			cspmb__Recurring_Charge__c: 269,
			cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
			cspmb__Is_Authorization_Required__c: false,
			cspmb__Is_One_Off_Discount_Allowed__c: true,
			cspmb__Is_Recurring_Discount_Allowed__c: true,
			cspmb__Price_Item_Description__c: '30 Gb Internet + 5000 minutes/SMS',
			cspmb__Contract_Term__c: '24 Months',
			Categorization_Alpha__c: 'Fixed',
			Categorization_Beta__c: '50GB'
		},
		{
			Id: 'a1F1t0000001JByEAM',
			Name: 'Mobile L_9',
			cspmb__Effective_Start_Date__c: 1545264000000,
			cspmb__Recurring_Charge__c: 269,
			cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
			cspmb__Is_Authorization_Required__c: false,
			cspmb__Is_One_Off_Discount_Allowed__c: true,
			cspmb__Is_Recurring_Discount_Allowed__c: true,
			cspmb__Price_Item_Description__c: '30 Gb Internet + 5000 minutes/SMS',
			cspmb__Contract_Term__c: '24 Months',
			Categorization_Alpha__c: 'Mobile',
			Categorization_Beta__c: '50GB'
		},
		{
			Id: 'a1F1t0000001JC8EAM',
			Name: 'Mobile L_11',
			cspmb__Effective_Start_Date__c: 1545264000000,
			cspmb__Recurring_Charge__c: 269,
			cspmb__Authorization_Level__c: 'a0x1t000001RjC4AAK',
			cspmb__Is_Authorization_Required__c: false,
			cspmb__Is_One_Off_Discount_Allowed__c: true,
			cspmb__Is_Recurring_Discount_Allowed__c: true,
			cspmb__Price_Item_Description__c: '30 Gb Internet + 5000 minutes/SMS',
			cspmb__Contract_Term__c: '24 Months',
			Categorization_Alpha__c: 'Static',
			Categorization_Beta__c: '20GB'
		},
		{
			Id: 'a1F1t0000001JBeEAM',
			Name: 'Mobile L_5',
			cspmb__Recurring_Charge__c: 269,
			cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
			cspmb__Is_Authorization_Required__c: false,
			cspmb__Is_One_Off_Discount_Allowed__c: true,
			cspmb__Is_Recurring_Discount_Allowed__c: true,
			cspmb__Price_Item_Description__c: '30 Gb Internet + 5000 minutes/SMS',
			cspmb__Contract_Term__c: '24 Months',
			Categorization_Alpha__c: 'Fixed',
			Categorization_Beta__c: '10GB'
		},
		{
			Id: 'a1F1t0000001JBtEAM',
			Name: 'Mobile L_8',
			cspmb__Effective_Start_Date__c: 1545264000000,
			cspmb__Recurring_Charge__c: 269,
			cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
			cspmb__Is_Authorization_Required__c: false,
			cspmb__Is_One_Off_Discount_Allowed__c: true,
			cspmb__Is_Recurring_Discount_Allowed__c: true,
			cspmb__Price_Item_Description__c: '30 Gb Internet + 5000 minutes/SMS',
			cspmb__Contract_Term__c: '24 Months',
			Categorization_Alpha__c: 'Mobile',
			Categorization_Beta__c: '20GB'
		},
		{
			Id: 'a1F1t0000001JC3EAM',
			Name: 'Mobile L_10',
			cspmb__Effective_Start_Date__c: 1545264000000,
			cspmb__Recurring_Charge__c: 269,
			cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
			cspmb__Is_Authorization_Required__c: false,
			cspmb__Is_One_Off_Discount_Allowed__c: true,
			cspmb__Is_Recurring_Discount_Allowed__c: true,
			cspmb__Price_Item_Description__c: '30 Gb Internet + 5000 minutes/SMS',
			cspmb__Contract_Term__c: '24 Months',
			Categorization_Alpha__c: 'Static',
			Categorization_Beta__c: '10GB'
		},
		{
			Id: 'a1F1t00000017Y0EAI',
			Name: 'Mobile L',
			cspmb__Effective_Start_Date__c: 1545264000000,
			cspmb__Recurring_Charge__c: 269,
			cspmb__Authorization_Level__c: 'a0x1t000001RjBzAAK',
			cspmb__Is_Authorization_Required__c: false,
			cspmb__Is_One_Off_Discount_Allowed__c: true,
			cspmb__Is_Recurring_Discount_Allowed__c: false,
			cspmb__Price_Item_Description__c: '30 Gb Internet + 5000 minutes/SMS',
			cspmb__Contract_Term__c: '24 Months'
		}
	],
	productFields: [],
	faFields: [],
	modals: {
		actionIframe: false,
		actionIframeUrl: '',
		productModal: false,
		frameModal: false,
		negotiateModal: false
	}
};
