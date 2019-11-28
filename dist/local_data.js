var SF;

window.localMode = true;

function createPromise(result, timeout = 500) {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(result);
		}, 0);
	});
}

function makeId(n) {
	var text = '';
	var possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < n; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function getRandomFromArr(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function filterProducts(dataArr) {
	dataArr = JSON.parse(dataArr);
	var dataMap = {};
	dataArr.forEach(data => {
		dataMap[data.field] = data.values;
	});

	return commercialProducts.filter(cp => {
		for (var key in dataMap) {
			if (cp.hasOwnProperty(key)) {
				if (!dataMap[key].includes(cp[key])) {
					return false;
				}
			} else {
				return false;
			}
		}
		return true;
	});
}

const nullValues = false;

const settings = {
	status: 'Draft'
	// status: "Active"
};

const approval = {
	isApprover: true,
	isAdmin: true,
	currentUser: '0051t0000025wM9AAI',
	listProcess: [
		{
			Id: '04g1t0000009p45AAA',
			StepsAndWorkitems: [
				{
					ProcessInstanceId: '04g1t0000009p45AAA',
					Id: '04i1t000000956mAAA',
					ProcessNodeId: '04b1t0000008jGQAAY',
					StepStatus: 'Pending',
					TargetObjectId: 'a1t1t000000ZP3bAAG',
					ActorId: '00G1t000001acVVEAY',
					CreatedById: '0051t0000025wM9AAI',
					IsDeleted: false,
					IsPending: true,
					OriginalActorId: '00G1t000001acVVEAY',
					RemindersSent: 0,
					CreatedDate: 1551784837000,
					Actor: {
						Name: 'International - Platinum/Gold',
						Id: '00G1t000001acVVEAY'
					},
					OriginalActor: {
						Name: 'International - Platinum/Gold',
						Id: '00G1t000001acVVEAY'
					},
					ProcessNode: {
						Name: 'Step1',
						Id: '04b1t0000008jGQAAY'
					}
				},
				{
					ProcessInstanceId: '04g1t0000009p45AAA',
					Id: '04h1t0000009lhUAAQ',
					StepStatus: 'Started',
					Comments: 'Submitted frame agreement for approval. Please approve.',
					TargetObjectId: 'a1t1t000000ZP3bAAG',
					ActorId: '0051t0000025wM9AAI',
					CreatedById: '0051t0000025wM9AAI',
					IsDeleted: false,
					IsPending: false,
					OriginalActorId: '0051t0000025wM9AAI',
					RemindersSent: 0,
					CreatedDate: 1551784837000,
					Actor: {
						Name: 'Marko Ivanetic',
						Id: '0051t0000025wM9AAI'
					},
					OriginalActor: {
						Name: 'Marko Ivanetic',
						Id: '0051t0000025wM9AAI'
					}
				}
			]
		},
		{
			Id: '04g1t0000009p40AAA',
			StepsAndWorkitems: [
				{
					ProcessInstanceId: '04g1t0000009p40AAA',
					Id: '04h1t0000009lhPAAQ',
					ProcessNodeId: '04b1t0000008jGQAAY',
					StepStatus: 'Removed',
					Comments: 'Recalled by User: Marko Ivanetic',
					TargetObjectId: 'a1t1t000000ZP3bAAG',
					ActorId: '0051t0000025wM9AAI',
					CreatedById: '0051t0000025wM9AAI',
					IsDeleted: false,
					IsPending: false,
					OriginalActorId: '00G1t000001acVVEAY',
					RemindersSent: 0,
					CreatedDate: 1551784830000,
					Actor: {
						Name: 'Marko Ivanetic',
						Id: '0051t0000025wM9AAI'
					},
					OriginalActor: {
						Name: 'International - Platinum/Gold',
						Id: '00G1t000001acVVEAY'
					},
					ProcessNode: {
						Name: 'Step1',
						Id: '04b1t0000008jGQAAY'
					}
				},
				{
					ProcessInstanceId: '04g1t0000009p40AAA',
					Id: '04h1t0000009lhFAAQ',
					StepStatus: 'Started',
					Comments: 'Submitted frame agreement for approval. Please approve.',
					TargetObjectId: 'a1t1t000000ZP3bAAG',
					ActorId: '0051t0000025wM9AAI',
					CreatedById: '0051t0000025wM9AAI',
					IsDeleted: false,
					IsPending: false,
					OriginalActorId: '0051t0000025wM9AAI',
					RemindersSent: 0,
					CreatedDate: 1551784814000,
					Actor: {
						Name: 'Marko Ivanetic',
						Id: '0051t0000025wM9AAI'
					},
					OriginalActor: {
						Name: 'Marko Ivanetic',
						Id: '0051t0000025wM9AAI'
					}
				}
			]
		},
		{
			Id: '04g1t0000009ouKAAQ',
			StepsAndWorkitems: [
				{
					ProcessInstanceId: '04g1t0000009ouKAAQ',
					Id: '04h1t0000009lf3AAA',
					ProcessNodeId: '04b1t0000008jGQAAY',
					StepStatus: 'Approved',
					Comments: 'Approved by User: Marko Ivanetic',
					TargetObjectId: 'a1t1t000000ZP3bAAG',
					ActorId: '0051t0000025wM9AAI',
					CreatedById: '0051t0000025wM9AAI',
					IsDeleted: false,
					IsPending: false,
					OriginalActorId: '00G1t000001acVVEAY',
					RemindersSent: 0,
					CreatedDate: 1551783337000,
					Actor: {
						Name: 'Marko Ivanetic',
						Id: '0051t0000025wM9AAI'
					},
					OriginalActor: {
						Name: 'International - Platinum/Gold',
						Id: '00G1t000001acVVEAY'
					},
					ProcessNode: {
						Name: 'Step1',
						Id: '04b1t0000008jGQAAY'
					}
				},
				{
					ProcessInstanceId: '04g1t0000009ouKAAQ',
					Id: '04h1t0000009leKAAQ',
					StepStatus: 'Started',
					Comments: 'Submitted frame agreement for approval. Please approve.',
					TargetObjectId: 'a1t1t000000ZP3bAAG',
					ActorId: '0051t0000025wM9AAI',
					CreatedById: '0051t0000025wM9AAI',
					IsDeleted: false,
					IsPending: false,
					OriginalActorId: '0051t0000025wM9AAI',
					RemindersSent: 0,
					CreatedDate: 1551783277000,
					Actor: {
						Name: 'Marko Ivanetic',
						Id: '0051t0000025wM9AAI'
					},
					OriginalActor: {
						Name: 'Marko Ivanetic',
						Id: '0051t0000025wM9AAI'
					}
				}
			]
		},
		{
			Id: '04g1t0000009ou5AAA',
			StepsAndWorkitems: [
				{
					ProcessInstanceId: '04g1t0000009ou5AAA',
					Id: '04h1t0000009ldgAAA',
					ProcessNodeId: '04b1t0000008jGQAAY',
					StepStatus: 'Removed',
					Comments: 'Testing',
					TargetObjectId: 'a1t1t000000ZP3bAAG',
					ActorId: '0051t0000025wM9AAI',
					CreatedById: '0051t0000025wM9AAI',
					IsDeleted: false,
					IsPending: false,
					OriginalActorId: '00G1t000001acVVEAY',
					RemindersSent: 0,
					CreatedDate: 1551783066000,
					Actor: {
						Name: 'Marko Ivanetic',
						Id: '0051t0000025wM9AAI'
					},
					OriginalActor: {
						Name: 'International - Platinum/Gold',
						Id: '00G1t000001acVVEAY'
					},
					ProcessNode: {
						Name: 'Step1',
						Id: '04b1t0000008jGQAAY'
					}
				},
				{
					ProcessInstanceId: '04g1t0000009ou5AAA',
					Id: '04h1t0000009ldbAAA',
					StepStatus: 'Started',
					TargetObjectId: 'a1t1t000000ZP3bAAG',
					ActorId: '0051t0000025wM9AAI',
					CreatedById: '0051t0000025wM9AAI',
					IsDeleted: false,
					IsPending: false,
					OriginalActorId: '0051t0000025wM9AAI',
					RemindersSent: 0,
					CreatedDate: 1551783045000,
					Actor: {
						Name: 'Marko Ivanetic',
						Id: '0051t0000025wM9AAI'
					},
					OriginalActor: {
						Name: 'Marko Ivanetic',
						Id: '0051t0000025wM9AAI'
					}
				}
			]
		}
	]
};
const approval2 = {
	isApprover: false,
	isAdmin: false,
	currentUser: '0051t0000025wM9AAI',
	listProcess: []
};

const FACSettings = {
	fa_editable_statuses: 'Draft, Requires Approval',
	// price_item_fields: "Name, cspmb__Contract_Term__c, cspmb__Price_Item_Description__c, cspmb__Is_Authorization_Required__c, CurrencyIsoCode",
	price_item_fields: 'Id, cspmb__Is_Recurring_Discount_Allowed__c',
	show_volume_fields: true,
	frame_agreement_fields: 'Id, csconta__Account__c',
	account_fields: 'Name, Type',
	decomposition_chunk_size: 2,
	discount_as_price: false,
	approvers_revise: true,
	new_frame_agreement: true,
	active_status_management__c: true,
	product_chunk_size: 100,
	rcl_fields: 'cspmb__Currency_Code__c, Category__c',
	volume_fields_visibility: 'mv',
	usage_type_fields__c: 'cspmb__unit_of_measure__c',
	statuses: {
		active_status: 'Active',
		approved_status: 'Approved',
		closed_status: 'Closed',
		draft_status: 'Draft',
		requires_approval_status: 'Requires Approval'
	},
	truncate_product_fields: true
};

const frameAgreements = [
	{
		Id: 'a1t1t0000009wpQAAQ',
		Name: 'AGR-000000',
		csconta__Account__c: '0011t00000DSEtnAAH',
		csconta__Agreement_Name__c: 'Frame Agreement - Test #1',
		csconta__Status__c: 'Draft',
		csconta__Valid_From__c: 1547424000000,
		csconta__Valid_To__c: 1568419200000,
		csfam__Disable_Levels__c: false,
		csfam__Disable_Custom_Tabs__c: false,
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
		}
	},
	{
		Id: 'a1t1t000000EyqiAAC',
		Name: 'AGR-010263',
		LastModifiedDate: 1572279423000,
		csconta__Account__c: '0011t00000Pq1WRAAZ',
		csconta__Agreement_Name__c: 'Delta Test 1',
		csconta__Status__c: 'Draft',
		csconta__frame_agreement_number__c: '010263',
		csconta__agreement_level__c: 'Frame Agreement',
		csfam__Arb_Field_Text__c: 'Arb Text',
		csfam__Arb_Formula__c: 'Arb Text TESTING TESTING',
		csfam__Arb_Field_Bool__c: true,
		csconta__Account__r: {
			Name: 'Test Account',
			Id: '0011t00000Pq1WRAAZ'
		}
	},
	{
		Id: 'a1t1t000000EyqnAAC',
		Name: 'AGR-010264',
		LastModifiedDate: 1571917299000,
		csconta__Account__c: '0011t00000Pq1WRAAZ',
		csconta__Agreement_Name__c: 'Delta Test 2',
		csconta__Status__c: 'Requires Approval',
		csconta__frame_agreement_number__c: '010264',
		csconta__agreement_level__c: 'Frame Agreement',
		csfam__Arb_Formula__c: 'TESTING TESTING',
		csfam__Arb_Field_Bool__c: true,
		csconta__Account__r: {
			Name: 'Test Account',
			Id: '0011t00000Pq1WRAAZ'
		}
	},
	{
		Id: 'a1t1t000000A0gJAAS',
		Name: 'AGR-000001',
		csconta__Account__c: '0011t00000DSEtnAAH',
		csconta__Agreement_Name__c: 'Frame Agreement - Test #2',
		csconta__Status__c: 'Active',
		csconta__Valid_From__c: 1547424000000,
		csconta__Valid_To__c: 1568419200000,
		csfam__Disable_Levels__c: false,
		csfam__Disable_Custom_Tabs__c: false,
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
		}
	},
	{
		Id: 'a1t1t000000A0gOAAS',
		Name: 'AGR-000002',
		csconta__Account__c: '0011t00000DSEtnAAH',
		csconta__Agreement_Name__c: 'Frame Agreement - Test #3',
		csconta__Status__c: 'Draft',
		csconta__Valid_From__c: 1547424000000,
		csconta__Valid_To__c: 1568419200000,
		csfam__Disable_Levels__c: true,
		csfam__Disable_Custom_Tabs__c: false,
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
		}
	}
];

const childUsageTypes = {
	a201t0000009yECAAY: [
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url:
					'/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: 'a201t0000009yEHAAY',
			Name: 'National Calls to Fixed',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url:
					'/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: 'a201t0000009yETAAY',
			Name: 'National Calls to Mobile',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url:
					'/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: 'a201t0000009yEAAAY',
			Name: 'Appliance Usage Types; an unlikely big Name',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url:
					'/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url:
					'/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url:
					'/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url:
					'/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url:
					'/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url:
					'/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url:
					'/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url:
					'/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url:
					'/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		}
	]
};

const productData = {
	a1F1t0000001JBoEAM: {
		addons: [],
		allowances: [],
		charges: [],
		rateCards: []
	},
	a1F1t0000001JBZEA2: {
		addons: [],
		allowances: [
			{
				Id: 'a1x1t0000001iWkAAI',
				Name: 'ALL1',
				cspmb__amount__c: 14,
				cspmb__priority__c: 3,
				cspmb__usage_type__c: 'a201t0000009yECAAY',
				mainUsageType: {
					cspmb__unit_of_measure__c: 'Minute',
					Name: 'UT2',
					cspmb__type__c: 'Single',
					Id: 'a201t0000009yECAAY',
					childUsageTypes: [
						{
							Id: 'a201t0000009yEHAAY',
							Name: 'National Calls to Fixed',
							cspmb__unit_of_measure__c: 'Minute'
						},
						{
							Id: 'a201t0000009yElAAI',
							Name: 'National Calls to Mobile',
							cspmb__unit_of_measure__c: 'Minute'
						}
					]
				}
			}
		],
		charges: [],
		rateCards: []
	},
	a1F1t0000001JBUEA2: {
		addons: [
			{
				Id: 'a1A1t0000003SXxEAM',
				cspmb__Price_Item__c: 'a1F1t0000001JBUEA2',
				cspmb__Overrides_Add_On_Charges__c: true,
				cspmb__Add_On_Price_Item__c: 'a0w1t0000002hSaAAI',
				cspmb__Recurring_Charge__c: 21.79,
				cspmb__Add_On_Price_Item__r: {
					cspmb__Effective_Start_Date__c: 1545868800000,
					Name: 'Extra 200MB',
					cspmb__Authorization_Level__c: 'a0x1t000001RjCJAA0',
					cspmb__One_Off_Charge__c: 10,
					cspmb__Recurring_Charge__c: 12,
					Id: 'a0w1t0000002hSaAAI'
				}
			},
			{
				Id: 'a1A1t0000003SgeEAE',
				cspmb__Price_Item__c: 'a1F1t0000001JBUEA2',
				cspmb__Overrides_Add_On_Charges__c: true,
				cspmb__Add_On_Price_Item__c: 'a0w1t000000zDnNAAU',
				cspmb__One_Off_Charge__c: 10.99,
				cspmb__Recurring_Charge__c: 31.99,
				cspmb__Add_On_Price_Item__r: {
					cspmb__Effective_Start_Date__c: 1545868800000,
					Name: '1000 SMS',
					cspmb__Authorization_Level__c: 'a0x1t000001RjCEAA0',
					cspmb__Recurring_Charge__c: 82.44,
					Id: 'a0w1t000000zDnNAAU'
				}
			}
		],
		allowances: [
			{
				Id: 'a1x1t0000001iWkAAI',
				Name: 'ALL1',
				cspmb__amount__c: 14,
				cspmb__priority__c: 3,
				cspmb__usage_type__c: 'a201t0000009yECAAY',
				mainUsageType: {
					cspmb__unit_of_measure__c: 'Minute',
					Name: 'UT2',
					cspmb__type__c: 'Single',
					Id: 'a201t0000009yECAAY',
					childUsageTypes: [
						{
							Id: 'a201t0000009yEHAAY',
							Name: 'National Calls to Fixed',
							cspmb__unit_of_measure__c: 'Minute'
						},
						{
							Id: 'a201t0000009yElAAI',
							Name: 'National Calls to Mobile',
							cspmb__unit_of_measure__c: 'Minute'
						}
					]
				}
			},
			{
				Id: 'a1x1t00000049NCAAY',
				Name: 'ALL2',
				cspmb__amount__c: 14,
				cspmb__priority__c: 3,
				cspmb__usage_type__c: 'a201t0000009ryNAAQ',
				mainUsageType: {
					cspmb__unit_of_measure__c: 'Message',
					Name: 'UT1',
					cspmb__type__c: 'Group',
					Id: 'a201t0000009ryNAAQ',
					childUsageTypes: []
				}
			}
		],
		charges: [],
		rateCards: [
			{
				authId: 'a0x1t000001RjC9AAK',
				Id: 'a1N1t0000001QxrEAE',
				Name: 'Domestic',
				rateCardLines: [
					{
						Id: 'a1M1t000000BFrVEAW',
						Name: 'Voice',
						cspmb__Cap_Unit__c: 'Sample Cap Unit',
						cspmb__rate_value__c: 124.99,
						cspmb__usage_type__c: 'a201t0000009ryNAAQ',
						cspmb__Rate_Card__c: 'a1N1t0000001QxrEAE',
						cspmb__Currency_Code__c: 'Sample Code',
						cspmb__Weekend__c: 12,
						cspmb__usage_type__r: {
							Name: 'UT1',
							Id: 'a201t0000009ryNAAQ'
						},
						usageTypeName: 'UT1'
					},
					{
						Id: 'a1M1t000000peaJEAQ',
						Name: 'Data',
						cspmb__usage_type__c: 'a201t0000009ryNAAQ',
						cspmb__Rate_Card__c: 'a1N1t0000001QxrEAE',
						cspmb__Currency_Code__c: 'Sample Code',
						cspmb__Weekend__c: 12,
						cspmb__usage_type__r: {
							Name: 'UT1',
							Id: 'a201t0000009ryNAAQ'
						},
						usageTypeName: 'UT1'
					}
				]
			},
			{
				authId: 'a0x1t000000yZF3AAM',
				Id: 'a1N1t0000001X2dEAE',
				Name: 'International',
				rateCardLines: [
					{
						Id: 'a1M1t000000peXUEAY',
						Name: 'Voice',
						cspmb__rate_value__c: 55.98,
						cspmb__usage_type__c: 'a201t0000009ryNAAQ',
						cspmb__Rate_Card__c: 'a1N1t0000001X2dEAE',
						cspmb__Currency_Code__c: 'Sample Code',
						cspmb__Weekend__c: 14,
						cspmb__usage_type__r: {
							Name: 'UT1',
							Id: 'a201t0000009ryNAAQ'
						},
						usageTypeName: 'UT1'
					},
					{
						Id: 'a1M1t000000peXZEAY',
						Name: 'Data',
						cspmb__rate_value__c: 65.43,
						cspmb__usage_type__c: 'a201t0000009ryNAAQ',
						cspmb__Rate_Card__c: 'a1N1t0000001X2dEAE',
						cspmb__Currency_Code__c: 'Sample Code',
						cspmb__Weekend__c: 14,
						cspmb__usage_type__r: {
							Name: 'UT1',
							Id: 'a201t0000009ryNAAQ'
						},
						usageTypeName: 'UT1'
					},
					{
						Id: 'a1M1t000000peXeEAI',
						Name: 'SMS',
						cspmb__rate_value__c: 12.99,
						cspmb__usage_type__c: 'a201t0000009ryNAAQ',
						cspmb__Rate_Card__c: 'a1N1t0000001X2dEAE',
						cspmb__Currency_Code__c: 'Sample Code',
						cspmb__Weekend__c: 12,
						cspmb__usage_type__r: {
							Name: 'UT1',
							Id: 'a201t0000009ryNAAQ'
						},
						usageTypeName: 'UT1'
					}
				]
			},
			{
				Id: 'a1N1t000000GUYgEAO',
				Name: 'Dimensional',
				rateCardLines: [
					{
						Id: 'a1M1t000000WwSIEA0',
						Name: 'RCL4.3',
						cspmb__rate_value__c: 10.88,
						cspmb__usage_type__c: 'a201t0000009ryNAAQ',
						cspmb__Rate_Card__c: 'a1N1t000000GUYgEAO',
						cspmb__Currency_Code__c: 'Sample Code',
						cspmb__usage_type__r: {
							Name: 'UT1',
							Id: 'a201t0000009ryNAAQ'
						},
						usageTypeName: 'UT1'
					},
					{
						Id: 'a1M1t000000WwS8EAK',
						Name: 'RCL4.1',
						cspmb__rate_value__c: 41.11,
						cspmb__usage_type__c: 'a201t0000009ryNAAQ',
						cspmb__Rate_Card__c: 'a1N1t000000GUYgEAO',
						cspmb__Currency_Code__c: 'Sample Code',
						cspmb__usage_type__r: {
							Name: 'UT1',
							Id: 'a201t0000009ryNAAQ'
						},
						usageTypeName: 'UT1'
					},
					{
						Id: 'a1M1t000000WwSDEA0',
						Name: 'RCL4.2',
						cspmb__rate_value__c: 14.55,
						cspmb__usage_type__c: 'a201t0000009ryNAAQ',
						cspmb__Rate_Card__c: 'a1N1t000000GUYgEAO',
						cspmb__Currency_Code__c: 'Sample Code',
						cspmb__usage_type__r: {
							Name: 'UT1',
							Id: 'a201t0000009ryNAAQ'
						},
						usageTypeName: 'UT1'
					},
					{
						Id: 'a1M1t000000WwSNEA0',
						Name: 'RCL4.4',
						cspmb__rate_value__c: 76.55,
						cspmb__usage_type__c: 'a201t0000009ryNAAQ',
						cspmb__Rate_Card__c: 'a1N1t000000GUYgEAO',
						cspmb__Currency_Code__c: 'Sample Code',
						cspmb__usage_type__r: {
							Name: 'UT1',
							Id: 'a201t0000009ryNAAQ'
						},
						usageTypeName: 'UT1'
					}
				]
			}
		]
	},
	a1F1t0000001JBjEAM: {
		addons: [
			{
				Id: 'a1A1t0000003SbnEAE',
				cspmb__Price_Item__c: 'a1F1t0000001JBjEAM',
				cspmb__Overrides_Add_On_Charges__c: true,
				cspmb__Add_On_Price_Item__c: 'a0w1t0000002hSaAAI',
				cspmb__Add_On_Price_Item__r: {
					cspmb__Effective_Start_Date__c: 1545868800000,
					Name: 'Extra 200MB',
					cspmb__Authorization_Level__c: 'a0x1t000001RjCJAA0',
					cspmb__One_Off_Charge__c: 10,
					cspmb__Recurring_Charge__c: 12,
					Id: 'a0w1t0000002hSaAAI'
				}
			}
		],
		allowances: [],
		charges: [],
		rateCards: []
	},
	a1F1t0000001JCDEA2: {
		addons: [],
		allowances: [],
		charges: [],
		rateCards: []
	},
	a1F1t0000001JByEAM: {
		addons: [],
		charges: [],
		rateCards: []
	},
	a1F1t0000001JC8EAM: {
		addons: [],
		charges: [],
		rateCards: []
	},
	a1F1t0000001JBeEAM: {
		addons: [
			{
				Id: 'a1A1t0000003SiNEAU',
				cspmb__Price_Item__c: 'a1F1t0000001JBeEAM',
				cspmb__Overrides_Add_On_Charges__c: true,
				cspmb__Add_On_Price_Item__c: 'a0w1t000000zDnhAAE',
				cspmb__One_Off_Charge__c: 12,
				cspmb__Recurring_Charge__c: 43,
				cspmb__Add_On_Price_Item__r: {
					cspmb__Effective_Start_Date__c: 1545868800000,
					Name: '1000 Min',
					cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
					cspmb__One_Off_Charge__c: 14,
					Id: 'a0w1t000000zDnhAAE'
				}
			},
			{
				Id: 'a1A1t0000003SaWEAU',
				cspmb__Price_Item__c: 'a1F1t0000001JBeEAM',
				cspmb__Overrides_Add_On_Charges__c: true,
				cspmb__Add_On_Price_Item__c: 'a0w1t0000002hSaAAI',
				cspmb__Add_On_Price_Item__r: {
					cspmb__Effective_Start_Date__c: 1545868800000,
					Name: 'Extra 200MB',
					cspmb__Authorization_Level__c: 'a0x1t000001RjCJAA0',
					cspmb__One_Off_Charge__c: 10,
					cspmb__Recurring_Charge__c: 12,
					Id: 'a0w1t0000002hSaAAI'
				}
			}
		],
		charges: [],
		rateCards: []
	},
	a1F1t0000001JBtEAM: {
		addons: [],
		charges: [],
		rateCards: []
	},
	a1F1t0000001JC3EAM: {
		addons: [],
		charges: [],
		rateCards: []
	},
	a1F1t00000017Y0EAI: {
		addons: [
			{
				Id: 'a1A1t0000002cIMEAY',
				cspmb__Price_Item__c: 'a1F1t00000017Y0EAI',
				cspmb__Overrides_Add_On_Charges__c: true,
				cspmb__Add_On_Price_Item__c: 'a0w1t0000002hSaAAI',
				cspmb__One_Off_Charge__c: 8.49,
				cspmb__Recurring_Charge__c: 12.75,
				cspmb__Add_On_Price_Item__r: {
					cspmb__Effective_Start_Date__c: 1545868800000,
					Name: 'Extra 200MB',
					cspmb__Authorization_Level__c: 'a0x1t000001RjCJAA0',
					cspmb__One_Off_Charge__c: 10,
					cspmb__Recurring_Charge__c: 12,
					Id: 'a0w1t0000002hSaAAI'
				}
			},
			{
				Id: 'a1A1t0000003ScfEAE',
				cspmb__Price_Item__c: 'a1F1t00000017Y0EAI',
				cspmb__Overrides_Add_On_Charges__c: true,
				cspmb__Add_On_Price_Item__c: 'a0w1t000000zDnNAAU',
				cspmb__One_Off_Charge__c: 8.49,
				cspmb__Add_On_Price_Item__r: {
					cspmb__Effective_Start_Date__c: 1545868800000,
					Name: '1000 SMS',
					cspmb__Authorization_Level__c: 'a0x1t000001RjCEAA0',
					cspmb__Recurring_Charge__c: 82.44,
					Id: 'a0w1t000000zDnNAAU'
				}
			}
		],
		allowances: [
			{
				Id: 'a1x1t0000001iWkAAI',
				Name: 'ALL1',
				cspmb__amount__c: 14,
				cspmb__priority__c: 3,
				cspmb__usage_type__c: 'a201t0000009yECAAY',
				mainUsageType: {
					cspmb__unit_of_measure__c: 'Minute',
					Name: 'UT2',
					cspmb__type__c: 'Single',
					Id: 'a201t0000009yECAAY',
					childUsageTypes: [
						{
							Id: 'a201t0000009yEHAAY',
							Name: 'National Calls to Fixed',
							cspmb__unit_of_measure__c: 'Minute'
						},
						{
							Id: 'a201t0000009yElAAI',
							Name: 'National Calls to Mobile',
							cspmb__unit_of_measure__c: 'Minute'
						}
					]
				}
			}
		],
		charges: [
			{
				chargeType: 'Recurring Charge',
				Id: 'a1I1t000001WkzjEAC',
				Name: 'Recurring Charge',
				recurring: 12
			},
			{
				chargeType: 'One-off Charge',
				Id: 'a1I1t000001WkzoEAC',
				Name: 'One-off charge',
				oneOff: 7
			}
		],
		rateCards: [
			{
				Id: 'a1N1t000000GUYbEAO',
				Name: 'Planetary',
				rateCardLines: [
					{
						Id: 'a1M1t000000WwRtEAK',
						Name: 'RCL3.1',
						cspmb__rate_value__c: 55.43,
						cspmb__usage_type__c: 'a201t0000009ryNAAQ',
						cspmb__Rate_Card__c: 'a1N1t000000GUYbEAO',
						cspmb__Currency_Code__c: 'Sample Code',
						cspmb__usage_type__r: {
							Name: 'UT1',
							Id: 'a201t0000009ryNAAQ'
						},
						usageTypeName: 'UT1'
					},
					{
						Id: 'a1M1t000000WwS3EAK',
						Name: 'RCL3.3',
						cspmb__rate_value__c: 12.9,
						cspmb__usage_type__c: 'a201t0000009ryNAAQ',
						cspmb__Rate_Card__c: 'a1N1t000000GUYbEAO',
						cspmb__Currency_Code__c: 'Sample Code',
						cspmb__usage_type__r: {
							Name: 'UT1',
							Id: 'a201t0000009ryNAAQ'
						},
						usageTypeName: 'UT1'
					},
					{
						Id: 'a1M1t000000WwRyEAK',
						Name: 'RCL3.2',
						cspmb__rate_value__c: 44.21,
						cspmb__usage_type__c: 'a201t0000009ryNAAQ',
						cspmb__Rate_Card__c: 'a1N1t000000GUYbEAO',
						cspmb__Currency_Code__c: 'Sample Code',
						cspmb__usage_type__r: {
							Name: 'UT1',
							Id: 'a201t0000009ryNAAQ'
						},
						usageTypeName: 'UT1'
					}
				]
			}
		]
	}
};

const attachment =
	'eyJjdXN0b20iOiIiLCJwcm9kdWN0cyI6eyJhMUYxdDAwMDAwMDFKQmpFQU0iOnsiX3ZvbHVtZSI6eyJtdiI6bnVsbCwibXZwIjpudWxsLCJtdWMiOm51bGwsIm11Y3AiOm51bGx9LCJfYWRkb25zIjp7ImExQTF0MDAwMDAwM1NibkVBRSI6e319LCJfcHJvZHVjdCI6eyJyZWN1cnJpbmciOjI2Nn19LCJhMUYxdDAwMDAwMDFKQ0RFQTIiOnsiX3ZvbHVtZSI6eyJtdiI6bnVsbCwibXZwIjpudWxsLCJtdWMiOm51bGwsIm11Y3AiOm51bGx9LCJfcHJvZHVjdCI6eyJyZWN1cnJpbmciOjI2M319LCJhMUYxdDAwMDAwMDFKQzhFQU0iOnsiX3ZvbHVtZSI6eyJtdiI6bnVsbCwibXZwIjpudWxsLCJtdWMiOm51bGwsIm11Y3AiOm51bGx9LCJfcHJvZHVjdCI6eyJyZWN1cnJpbmciOjIzOS40MX19LCJhMUYxdDAwMDAwMDE3WTBFQUkiOnsiX3ZvbHVtZSI6eyJtdiI6bnVsbCwibXZwIjpudWxsLCJtdWMiOm51bGwsIm11Y3AiOm51bGx9LCJfYWRkb25zIjp7ImExQTF0MDAwMDAwMmNJTUVBWSI6eyJvbmVPZmYiOjcuNjQsInJlY3VycmluZyI6Ny43NX0sImExQTF0MDAwMDAwM1NjZkVBRSI6eyJvbmVPZmYiOjcuNDksInJlY3VycmluZyI6NzkuNDR9fSwiX2NoYXJnZXMiOnsiYTFJMXQwMDAwMDFXa3pvRUFDIjp7Im9uZU9mZiI6N30sImExSTF0MDAwMDAxV2t6akVBQyI6eyJyZWN1cnJpbmciOjEyfX0sIl9yYXRlQ2FyZHMiOnsiYTFOMXQwMDAwMDAxUXhyRUFFIjp7ImExTTF0MDAwMDAwQkZyVkVBVyI6MTI0Ljk5fX19fX0=';

const attachmentMaster =
	'eyJjdXN0b20iOiIiLCJwcm9kdWN0cyI6eyJhMXQxdDAwMDAwMEEwZ09BQVMiOiJhMXQxdDAwMDAwMEEwZ09BQVMifX0';

const AuthLevels = [
	{
		Id: 'a151t000000rmV7AAI',
		Name: 'RCL1.1',
		cspmb__Discount_Threshold__c: 10,
		cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
		cspmb__Discount_Type__c: 'Percentage'
	},
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
	},
	{
		Id: 'a151t000000y2M3AAI',
		Name: 'Percentage',
		cspmb__Discount_Threshold__c: 20,
		cspmb__Authorization_Level__c: 'a0x1t000001RjC4AAK',
		cspmb__Discount_Type__c: 'Percentage'
	},
	{
		Id: 'a151t000000y2LyAAI',
		Name: 'One-off charge',
		cspmb__Discount_Threshold__c: 30,
		cspmb__Authorization_Level__c: 'a0x1t000001RjBzAAK',
		cspmb__Discount_Type__c: 'Percentage'
	},
	{
		Id: 'a151t000000y2MNAAY',
		Name: 'ADD1',
		cspmb__Discount_Threshold__c: 12,
		cspmb__Authorization_Level__c: 'a0x1t000001RjCJAA0',
		cspmb__Discount_Type__c: 'Percentage'
	},
	{
		Id: 'a151t000000y2LtAAI',
		Name: 'Recurring Charge',
		cspmb__Discount_Threshold__c: 5,
		cspmb__Authorization_Level__c: 'a0x1t000001RjBzAAK',
		cspmb__Discount_Type__c: 'Amount'
	},
	{
		Id: 'a151t000000y2MIAAY',
		Name: 'Amount',
		cspmb__Discount_Threshold__c: 3,
		cspmb__Authorization_Level__c: 'a0x1t000001RjCEAA0',
		cspmb__Discount_Type__c: 'Amount'
	},
	{
		Id: 'a151t000000y2MXAAY',
		Name: 'ADD1',
		cspmb__Discount_Threshold__c: 5,
		cspmb__Authorization_Level__c: 'a0x1t000001RjCJAA0',
		cspmb__Discount_Type__c: 'Amount'
	}
];

const DiscLevels_general = [
	{
		discountLevel: {
			Id: 'a141t00000137a8AAA',
			Name: 'Test',
			cspmb__Charge_Type__c: 'RC',
			cspmb__Discount_Type__c: 'Percentage',
			cspmb__Discount_Values__c: '10,20,30'
		},
		priceItemId: 'a1F1t00000017Y0EAI'
	},
	{
		discountLevel: {
			Id: 'a141t00000137cWAAQ',
			Name: 'Invalid',
			cspmb__Charge_Type__c: 'RC',
			cspmb__Discount_Type__c: 'Percentage',
			cspmb__Discount_Values__c: '12, 34, gg'
		},
		priceItemId: 'a1F1t0000001JBPEA2'
	},
	{
		addonId: 'a0w1t0000002hSaAAI',
		discountLevel: {
			Id: 'a141t00000137e7AAA',
			Name: 'TestAddons',
			cspmb__Charge_Type__c: 'RC',
			cspmb__Discount_Type__c: 'Amount',
			cspmb__Discount_Values__c: '10,20,30'
		}
	},
	{
		discountLevel: {
			Id: 'a141t00000137cgAAA',
			Name: 'Test2',
			cspmb__Charge_Type__c: 'RC',
			cspmb__Discount_Increment__c: '1',
			cspmb__Discount_Type__c: 'Amount',
			cspmb__Maximum_Discount_Value__c: 10,
			cspmb__Minimum_Discount_Value__c: 5
		},
		priceItemId: 'a1F1t00000017Y0EAI'
	},
	{
		discountLevel: {
			Id: 'a141t00000137hrAAA',
			Name: 'Test2_2',
			cspmb__Charge_Type__c: 'RC',
			cspmb__Discount_Increment__c: '1',
			cspmb__Discount_Type__c: 'Percentage',
			cspmb__Maximum_Discount_Value__c: 10,
			cspmb__Minimum_Discount_Value__c: 1
		},
		priceItemId: 'a1F1t00000017Y0EAI'
	},
	{
		addonId: 'a0w1t0000002hSaAAI',
		discountLevel: {
			Id: 'a141t00000137hrAAA',
			Name: 'Test2_2',
			cspmb__Charge_Type__c: 'RC',
			cspmb__Discount_Increment__c: '1',
			cspmb__Discount_Type__c: 'Percentage',
			cspmb__Maximum_Discount_Value__c: 10,
			cspmb__Minimum_Discount_Value__c: 1
		}
	},
	{
		discountLevel: {
			Id: 'a141t00000137lLAAQ',
			Name: 'One-off charge',
			cspmb__Charge_Type__c: 'NRC',
			cspmb__Discount_Type__c: 'Percentage',
			cspmb__Discount_Values__c: '10,20,30'
		},
		priceItemId: 'a1F1t00000017Y0EAI'
	},
	{
		discountLevel: {
			Id: 'a141t00000137ycAAA',
			Name: 'ProductCharge-11',
			cspmb__Charge_Type__c: 'RC',
			cspmb__Discount_Type__c: 'Percentage',
			cspmb__Discount_Values__c: '10,20,30'
		},
		priceItemId: 'a1F1t0000001JC8EAM'
	}
];

const DiscLevels = [
	{
		discountLevel: {
			Id: 'a141t000003DckQAAS',
			Name: 'Enterprise DL P-RC',
			cspmb__Charge_Type__c: 'Recurring',
			cspmb__Discount_Increment__c: '5',
			cspmb__Discount_Type__c: 'Percentage',
			cspmb__Maximum_Discount_Value__c: 15,
			cspmb__Minimum_Discount_Value__c: 5
		},
		priceItemId: 'a1F1t0000001JC8EAM'
	},
	{
		discountLevel: {
			Id: 'a141t000001381YAAQ',
			Name: 'Enterprise DL A-RC',
			cspmb__Charge_Type__c: 'Recurring',
			cspmb__Discount_Increment__c: '1',
			cspmb__Discount_Type__c: 'Amount',
			cspmb__Maximum_Discount_Value__c: 5,
			cspmb__Minimum_Discount_Value__c: 1
		},
		priceItemId: 'a1F1t0000001JC8EAM'
	},
	{
		discountLevel: {
			Id: 'a141t000001381YAAS',
			Name: 'Enterprise DL A-NRC',
			cspmb__Charge_Type__c: 'One Off',
			cspmb__Discount_Increment__c: '1',
			cspmb__Discount_Type__c: 'Amount',
			cspmb__Maximum_Discount_Value__c: 5,
			cspmb__Minimum_Discount_Value__c: 1
		},
		priceItemId: 'a1F1t0000001JC8EAM'
	},
	{
		discountLevel: {
			Id: 'a141t000001381YAAR',
			Name: 'Enterprise DL P-NRC',
			cspmb__Charge_Type__c: 'One Off',
			cspmb__Discount_Increment__c: '5',
			cspmb__Discount_Type__c: 'Percentage',
			cspmb__Maximum_Discount_Value__c: 15,
			cspmb__Minimum_Discount_Value__c: 0
		},
		priceItemId: 'a1F1t0000001JC8EAM'
	},
	{
		addonId: 'a0w1t0000002hSaAAI',
		discountLevel: {
			Id: 'a141t000001380zAAA',
			Name: 'One-off charge',
			cspmb__Charge_Type__c: 'RC',
			cspmb__Discount_Increment__c: '1',
			cspmb__Discount_Type__c: 'Amount',
			cspmb__Maximum_Discount_Value__c: 5,
			cspmb__Minimum_Discount_Value__c: 1
		},
		priceItemId: 'a1F1t00000017Y0EAI'
	},
	{
		discountLevel: {
			Id: 'a141t000001381TAAQ',
			Name: 'Recurring Charge',
			cspmb__Charge_Type__c: 'RC',
			cspmb__Discount_Type__c: 'Percentage',
			cspmb__Discount_Values__c: '10,20,30'
		},
		priceItemId: 'a1F1t00000017Y0EAI'
	},
	{
		addonId: 'a0w1t0000002hSaAAI',
		discountLevel: {
			Id: 'a141t000001381iAAA',
			Name: 'Addon_ADD1',
			cspmb__Charge_Type__c: 'One Off',
			cspmb__Discount_Type__c: 'Amount',
			cspmb__Discount_Values__c: '5,10,15'
		}
	},
	{
		discountLevel: {
			Id: 'a141t000001381JAAQ',
			Name: 'One-off charge',
			cspmb__Charge_Type__c: 'RC',
			cspmb__Discount_Increment__c: '1',
			cspmb__Discount_Type__c: 'Percentage',
			cspmb__Maximum_Discount_Value__c: 30,
			cspmb__Minimum_Discount_Value__c: 20
		},
		priceItemId: 'a1F1t00000017Y0EAI'
	}
];

const Delta = {
	csconta__Account__c: {
		new_value: '0011t00000Pq1WRAAZ',
		old_value: '0011t00000Pq1WRAAZ',
		status: 'unchanged'
	},
	csconta__Agreement_Name__c: {
		new_value: 'Delta Test 1',
		old_value: 'Delta Test 2',
		status: 'changed'
	},
	csconta__Status__c: {
		new_value: 'Draft',
		old_value: 'Requires Approval',
		status: 'changed'
	},
	csconta__agreement_level__c: {
		new_value: 'Frame Agreement',
		old_value: 'Frame Agreement',
		status: 'unchanged'
	},
	csfam__Arb_Formula__c: {
		new_value: 'Arb Text TESTING TESTING',
		old_value: 'TESTING TESTING',
		status: 'changed'
	},
	csfam__Arb_Field_Bool__c: {
		new_value: true,
		old_value: true,
		status: 'unchanged'
	},
	_products: {
		a1F1t0000001JCDEA2: 'removed',
		a1F1t0000001JBjEAM: 'added',
		a1F1t0000001JBoEAM: {
			addons: {},
			charges: {
				a1I1t000001WkzjEAC: {
					recurring: {
						old_value: 12,
						status: 'removed'
					}
				},
				a1I1t000001WkzoEAC: {
					oneOff: {
						new_value: 7,
						old_value: 7,
						status: 'unchanged'
					}
				}
			},
			product: {
				oneOff: {
					status: 'unchanged'
				},
				recurring: {
					new_value: 269,
					old_value: 269,
					status: 'unchanged'
				}
			},
			rateCard: {},
			volume: {
				muc: {
					new_value: 100,
					old_value: 44,
					status: 'changed'
				},
				mucp: {
					new_value: 855,
					status: 'changed'
				},
				mv: {
					new_value: 200,
					status: 'changed'
				},
				mvp: {
					new_value: 422,
					old_value: 52,
					status: 'changed'
				}
			}
		},
		a1F1t0000001JBZEA2: {
			addons: {},
			charges: {},
			product: {
				oneOff: {
					status: 'unchanged'
				},
				recurring: {
					new_value: 269,
					old_value: 169,
					status: 'changed'
				}
			},
			rateCard: {
				a1N1t0000001QxrEAE: {
					rcl: {
						a1M1t000000BFrVEAW: {
							old_value: 124.99,
							status: 'removed'
						}
					},
					status: 'removed'
				}
			},
			volume: {
				muc: {
					new_value: 44,
					status: 'changed'
				},
				mucp: {
					new_value: 0,
					status: 'changed'
				},
				mv: {
					new_value: 45,
					old_value: 52,
					status: 'changed'
				},
				mvp: {
					new_value: 25,
					status: 'changed'
				}
			}
		},
		a1F1t0000001JBUEA2: {
			addons: {
				a1A1t0000003SXxEAM: {
					oneOff: {
						new_value: 10,
						old_value: 5,
						status: 'changed'
					},
					recurring: {
						new_value: 21.79,
						old_value: 19.79,
						status: 'changed'
					},
					status: 'changed'
				},
				a1A1t0000003SgeEAE: {
					oneOff: {
						new_value: 10.99,
						old_value: 10.99,
						status: 'unchanged'
					},
					recurring: {
						new_value: 31.99,
						old_value: 31.99,
						status: 'unchanged'
					},
					status: 'unchanged'
				}
			},
			charges: {},
			product: {
				oneOff: {
					new_value: 69,
					old_value: 67,
					status: 'changed'
				},
				recurring: {
					new_value: 269,
					old_value: 267,
					status: 'changed'
				}
			},
			rateCard: {
				a1N1t0000001QxrEAE: {
					rcl: {
						a1M1t000000BFrVEAW: {
							new_value: 124.99,
							old_value: 120.99,
							status: 'changed'
						}
					},
					status: 'changed'
				},
				a1N1t0000001X2dEAE: {
					rcl: {
						a1M1t000000peXUEAY: {
							new_value: 55.98,
							old_value: 50.98,
							status: 'changed'
						},
						a1M1t000000peXZEAY: {
							new_value: 65.43,
							old_value: 65.43,
							status: 'unchanged'
						},
						a1M1t000000peXeEAI: {
							new_value: 12.99,
							old_value: 12.99,
							status: 'unchanged'
						}
					},
					status: 'changed'
				},
				a1N1t000000GUYbEAO: {
					rcl: {
						a1M1t000000WwRtEAK: {
							new_value: 55.43,
							old_value: 50.43,
							status: 'changed'
						},
						a1M1t000000WwS3EAK: {
							new_value: 12.9,
							old_value: 12.9,
							status: 'unchanged'
						},
						a1M1t000000WwRyEAK: {
							new_value: 44.21,
							old_value: 44.21,
							status: 'unchanged'
						}
					},
					status: 'changed'
				},
				a1N1t000000GUYgEAO: {
					rcl: {
						a1M1t000000WwSIEA0: {
							new_value: 10.88,
							old_value: 10.88,
							status: 'unchanged'
						},
						a1M1t000000WwS8EAK: {
							new_value: 41.11,
							old_value: 41.11,
							status: 'unchanged'
						},
						a1M1t000000WwSDEA0: {
							new_value: 14.55,
							old_value: 14.55,
							status: 'unchanged'
						},
						a1M1t000000WwSNEA0: {
							new_value: 76.55,
							old_value: 76.55,
							status: 'unchanged'
						}
					},
					status: 'unchanged'
				}
			},
			volume: {}
		},
		a1F1t00000017Y0EAI: {
			addons: {
				a1A1t0000002cIMEAY: {
					oneOff: {
						new_value: 8.49,
						old_value: 8.49,
						status: 'unchanged'
					},
					recurring: {
						new_value: 12.75,
						old_value: 12.75,
						status: 'unchanged'
					},
					status: 'unchanged'
				},
				a1A1t0000003ScfEAE: {
					oneOff: {
						new_value: 8.49,
						old_value: 8.49,
						status: 'unchanged'
					},
					recurring: {
						new_value: 82.44,
						old_value: 82.44,
						status: 'unchanged'
					},
					status: 'unchanged'
				}
			},
			charges: {
				a1I1t000001WkzjEAC: {
					recurring: {
						new_value: 12,
						old_value: 12,
						status: 'unchanged'
					}
				},
				a1I1t000001WkzoEAC: {
					oneOff: {
						new_value: 7,
						old_value: 7,
						status: 'unchanged'
					}
				}
			},
			product: {},
			rateCard: {
				a1N1t0000001QxrEAE: {
					rcl: {
						a1M1t000000BFrVEAW: {
							new_value: 124.99,
							old_value: 124.99,
							status: 'unchanged'
						}
					},
					status: 'unchanged'
				},
				a1N1t000000GUYbEAO: {
					rcl: {
						a1M1t000000WwRtEAK: {
							new_value: 55.43,
							old_value: 55.43,
							status: 'unchanged'
						},
						a1M1t000000WwS3EAK: {
							new_value: 12.9,
							old_value: 12.9,
							status: 'unchanged'
						},
						a1M1t000000WwRyEAK: {
							new_value: 44.21,
							old_value: 44.21,
							status: 'unchanged'
						}
					},
					status: 'unchanged'
				},
				a1N1t000000GUYgEAO: {
					rcl: {
						a1M1t000000WwSIEA0: {
							new_value: 10.88,
							old_value: 10.88,
							status: 'unchanged'
						},
						a1M1t000000WwS8EAK: {
							new_value: 41.11,
							old_value: 41.11,
							status: 'unchanged'
						},
						a1M1t000000WwSDEA0: {
							new_value: 14.55,
							old_value: 14.55,
							status: 'unchanged'
						},
						a1M1t000000WwSNEA0: {
							new_value: 76.55,
							old_value: 76.55,
							status: 'unchanged'
						}
					},
					status: 'unchanged'
				}
			},
			volume: {}
		}
	}
};

const CustomTabsData = [
	{
		label: 'Custom tab',
		container_id: 'customTab1',
		onEnter: 'customTabEnter'
	}
];
const HeaderData = [
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
		visible: 'csfam__Disable_Levels__c==true',
		grid: 1
	},
	{
		field: 'csfam__Disable_Levels__c',
		readOnly: false,
		label: 'Disable Levels',
		type: 'boolean',
		grid: 2
	},
	{
		field: 'csfam__Disable_Custom_Tabs__c',
		readOnly: false,
		label: 'Disable Tabs',
		type: 'boolean',
		visible: '',
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
		grid: 3
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
];

const CategorizationData = [
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
];

const ButtonCustomData = [
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
		options: {
			title: 'Saleforce VF Page Title',
			width: '100%',
			height: '100%'
		},
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
];

const ButtonStandardData = {
	Save: ['Draft', 'Requires Approval'],
	SubmitForApproval: ['Requires Approval'],
	Submit: ['Approved'],
	Delta: '*',
	DeleteProducts: ['Draft', 'Requires Approval'],
	BulkNegotiate: ['Draft', 'Requires Approval'],
	AddProducts: ['Draft', 'Requires Approval']
};

const commercialProducts = [
	{
		Id: 'a1F1t0000001JBoEAM',
		Name: 'Mobile L_7',
		cspmb__Effective_Start_Date__c: 1545264000000,
		cspmb__One_Off_Charge__c: 60,
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
		Name: 'Enterprise',
		cspmb__Effective_Start_Date__c: 1545264000000,
		cspmb__Recurring_Charge__c: 269,
		cspmb__One_Off_Charge__c: 60,
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
];

const commercialProducts_large = [
	{
		Id: 'a273E000000BHcTQAW',
		Name: 'Elisa Netti Lite SLA P1K24',
		cspmb__Recurring_Charge__c: 0,
		cspmb__One_Off_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Contract_Term__c: 'None',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000BHacQAG',
		Name: 'ElisaNettitemp Lite Elisa Elisa 30M 5M VDSL',
		cspmb__Recurring_Charge__c: 37.5,
		cspmb__One_Off_Charge__c: 80,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Contract_Term__c: 'None',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000BHbfQAG',
		Name: 'Elisa Netti Lite Elisa Elisa 24M 3M ADSL',
		cspmb__Recurring_Charge__c: 36.25,
		cspmb__One_Off_Charge__c: 80,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Contract_Term__c: 'None',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000BHPAQA4',
		Name: 'Acer Aspire E5-574G valkoinen',
		cspmb__Recurring_Charge__c: 0,
		cspmb__One_Off_Charge__c: 648,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Acer Aspire E5-574G valkoinen',
		cspmb__Contract_Term__c: '1',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Vo7uQAC',
		Name: 'Elisa Mobiililaajakaistaliittymä 4G Plus',
		cspmb__Recurring_Charge__c: 0,
		cspmb__One_Off_Charge__c: 3.15,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '4G Plus',
		Sub_Type__c: 'Mobile Broadband',
		cspmb__Contract_Term__c: 'None',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000ug2AQAQ',
		Name: 'Change of SIM card',
		cspmb__One_Off_Charge__c: 3.9,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'SIM-kortin vaihto',
		Sub_Type__c: 'Mobile Voice',
		cspmb__Contract_Term__c: 'None',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azx0QAC',
		Name: 'Varmistuskapasiteetti, lähtö data, Default plan 3 kk',
		cspmb__Recurring_Charge__c: 115,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Default plan 3 kk',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azx1QAC',
		Name: 'Varmistuskapasiteetti, lähtö data, Default plan 6 kk',
		cspmb__Recurring_Charge__c: 160,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Default plan 6 kk',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azx2QAC',
		Name: 'Palvelunhallinta Ketterä +, Kausimaksu',
		cspmb__Recurring_Charge__c: 1250,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azx4QAC',
		Name: 'Asiantuntija, Kertamaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azx5QAC',
		Name: 'Asentaja, Kertamaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azx6QAC',
		Name: 'Asennus- ja logistiikka, Kausimaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azx7QAC',
		Name: 'Varmistuskapasiteetti, lähtö data, Default plan 12 kk',
		cspmb__Recurring_Charge__c: 260,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Default plan 12 kk',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azx8QAC',
		Name: 'Omaisuudenhallinta, Kausimaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azx9QAC',
		Name: 'Päätelaitehallinta, Kausimaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxAQAS',
		Name: 'Vakiointi, Kausimaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxBQAS',
		Name: 'Käyttäjätuki, Kausimaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxCQAS',
		Name: 'Lähituki, Kausimaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxDQAS',
		Name: 'Virtuaalinen työpöytä, Kausimaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxEQAS',
		Name: 'Muisti, Kausimaksu',
		cspmb__Recurring_Charge__c: 10.03,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxFQAS',
		Name: 'Prosessoriteho, Kausimaksu',
		cspmb__Recurring_Charge__c: 6.06,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxGQAS',
		Name: 'Levyjärjestelmätaso, Taso 3',
		cspmb__Recurring_Charge__c: 0.13,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Taso 3',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxHQAS',
		Name: 'Levyjärjestelmätaso, Taso 2',
		cspmb__Recurring_Charge__c: 0.29,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Taso 2',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxIQAS',
		Name: 'Levyjärjestelmätaso, Taso 1',
		cspmb__Recurring_Charge__c: 0.59,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Taso 1',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxJQAS',
		Name:
			'Elisa Kassa Kauppiaan paketti tabletti, Peruspalvelu, yksi toimipaikka',
		cspmb__Recurring_Charge__c: 84,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Peruspalvelu, yksi toimipaikka',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxKQAS',
		Name: 'Elisa Kassa Kauppiaan paketti tabletti, Samsung tabletti',
		cspmb__Recurring_Charge__c: 9,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Samsung tabletti',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxLQAS',
		Name:
			'Elisa Kassa Kauppiaan paketti tabletti, Kuittiprintteri: kiinteä, Star mPOP',
		cspmb__Recurring_Charge__c: 16,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kuittiprintteri: kiinteä, Star mPOP',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxMQAS',
		Name: 'Elisa Kassa Kauppiaan paketti tabletti, Mobiilidata',
		cspmb__Recurring_Charge__c: 10,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Mobiilidata',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxNQAS',
		Name:
			'Elisa Kassa Kauppiaan paketti työasema, Peruspalvelu, yski toimipiste',
		cspmb__Recurring_Charge__c: 84,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Peruspalvelu, yski toimipiste',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxOQAS',
		Name: 'Elisa Kassa Kauppiaan paketti työasema, Elisa Tietoturva',
		cspmb__Recurring_Charge__c: 5.1,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Elisa Tietoturva',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxPQAS',
		Name: 'Elisa Kassa Kauppiaan paketti työasema, Dell OptiPlex 3030',
		cspmb__Recurring_Charge__c: 33,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Dell OptiPlex 3030',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxQQAS',
		Name: 'Elisa Kassa Kauppiaan paketti työasema, Kassalaatikko Star CB2002FN',
		cspmb__Recurring_Charge__c: 3,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kassalaatikko Star CB2002FN',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxRQAS',
		Name:
			'Elisa Kassa Kauppiaan paketti työasema, Termokuittitulostin Star TSP654 USB',
		cspmb__Recurring_Charge__c: 9,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Termokuittitulostin Star TSP654 USB',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxSQAS',
		Name:
			'Elisa Kassa Kauppiaan paketti työasema, Viivakoodinlukija Newland NLS-HR22 Dorad',
		cspmb__Recurring_Charge__c: 4.9,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c:
			'Viivakoodinlukija Newland NLS-HR22 Dorada',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxTQAS',
		Name:
			'Elisa Kassa viivakoodin lukija, viivakoodinlukija Newland NLS-HR22 Dorada',
		cspmb__Recurring_Charge__c: 144,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c:
			'viivakoodinlukija Newland NLS-HR22 Dorada',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxUQAS',
		Name: 'Elisa Kassa kassalaatikko, Star CB2002FN',
		cspmb__Recurring_Charge__c: 3,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Star CB2002FN',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxVQAS',
		Name: 'Elisa Kassa Toimitusprojekti, Kertamaksu',
		cspmb__One_Off_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxWQAS',
		Name:
			'Elisa Kassa kuittiprintteri, termokuittitulostin Star TSP654 Bluetooth',
		cspmb__One_Off_Charge__c: 360,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c:
			'termokuittitulostin Star TSP654 Bluetooth',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxXQAS',
		Name: 'Elisa Kassa kuittiprintteri, termokuittitulostin Star TSP654 USB',
		cspmb__One_Off_Charge__c: 272,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'termokuittitulostin Star TSP654 USB',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxYQAS',
		Name: 'Puheensiirtoyhteydet, 2-johdinliittymä',
		cspmb__Recurring_Charge__c: 8,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '2-johdinliittymä',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxZQAS',
		Name: 'Puheensiirtoyhteydet, 4-johdinliittymä',
		cspmb__Recurring_Charge__c: 25.23,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '4-johdinliittymä',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxcQAC',
		Name: 'Elisa Yritystietoturva, Paketti  45 laitteelle',
		cspmb__Recurring_Charge__c: 33.62,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Paketti  45 laitteelle',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxdQAC',
		Name: 'Puheensiirtoyhteydet, 2-johdinliittymä, avaus',
		cspmb__One_Off_Charge__c: 201.83,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '2-johdinliittymä, avaus',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxeQAC',
		Name: 'Puheensiirtoyhteydet, 4-johdinliittymä, avaus',
		cspmb__One_Off_Charge__c: 201.83,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '4-johdinliittymä, avaus',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxfQAC',
		Name: 'Elisa Netti Plus lisäantenni, Sisäantennipaketti',
		cspmb__Recurring_Charge__c: 10,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Sisäantennipaketti',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxgQAC',
		Name: 'Elisa Tiedonvälitys 1-way SMS Elisa, Kausimaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxhQAC',
		Name: 'Elisa Tiedonvälitys 1-way SMS Open, Kausimaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxiQAC',
		Name: 'Zeendo kotisivut, Kausimaksu',
		cspmb__Recurring_Charge__c: 8.99,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxjQAC',
		Name: 'Elisa Netti Plus lisäantenni, Ulkoantennipaketti',
		cspmb__One_Off_Charge__c: 790,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Ulkoantennipaketti',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxkQAC',
		Name: 'Verkkokaupan asennuspalvelu, Kertamaksu',
		cspmb__One_Off_Charge__c: 3000,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxlQAC',
		Name: 'Elisa Toimisto 365, Project Online Essentials',
		cspmb__Recurring_Charge__c: 5.9,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Project Online Essentials',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxmQAC',
		Name: 'Elisa Toimisto 365, Project Online Professional',
		cspmb__Recurring_Charge__c: 25.3,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Project Online Professional',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxnQAC',
		Name: 'Elisa Toimisto 365, Project Online Premium',
		cspmb__Recurring_Charge__c: 46.4,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Project Online Premium',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxoQAC',
		Name: 'Elisa Toimisto 365, Enterprise Mobility + Security E3',
		cspmb__Recurring_Charge__c: 7.4,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Enterprise Mobility + Security E3',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxpQAC',
		Name: 'Elisa Toimisto 365, Enterprise Mobility + Security E5',
		cspmb__Recurring_Charge__c: 14.5,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Enterprise Mobility + Security E5',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxqQAC',
		Name: 'Elisa Toimisto 365, Windows 10 Enterprise E3',
		cspmb__Recurring_Charge__c: 5.9,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Windows 10 Enterprise E3',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxrQAC',
		Name: 'Elisa Toimisto 365, Windows 10 Enterprise E5',
		cspmb__Recurring_Charge__c: 13.8,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Windows 10 Enterprise E5',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzCQAS',
		Name: 'Mitta-läpikävely, Kertamaksu',
		cspmb__One_Off_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzDQAS',
		Name: 'Toimisto 365 Sähköpostin luontipalvelu, Kertamaksu',
		cspmb__One_Off_Charge__c: 19,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzEQAS',
		Name: 'Toimisto 365 Sähköpostin luonti- ja siirtopalvelu, Kertamaksu',
		cspmb__One_Off_Charge__c: 49,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzFQAS',
		Name: 'Toimisto 365 Essential käyttöönottopalvelu, Kertamaksu',
		cspmb__One_Off_Charge__c: 59,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzGQAS',
		Name: 'Toimisto 365 Premium käyttöönottopalvelu, Kertamaksu',
		cspmb__One_Off_Charge__c: 79,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzHQAS',
		Name: 'Puheratkaisu Vakio käyttöönotto, Kertamaksu',
		cspmb__One_Off_Charge__c: 52.5,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzIQAS',
		Name: 'Elisa Kassa, Yhden toimipaikan ratkaisu',
		cspmb__Recurring_Charge__c: 69,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Yhden toimipaikan ratkaisu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzJQAS',
		Name:
			'Elisa Kassa Kauppiaan paketti tabletti, Peruspalvelu, yksi toimipaikka',
		cspmb__Recurring_Charge__c: 84,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Peruspalvelu, yksi toimipaikka',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzKQAS',
		Name: 'Elisa Kassa Kauppiaan paketti tabletti, Samsung tabletti',
		cspmb__Recurring_Charge__c: 9,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Samsung tabletti',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzLQAS',
		Name:
			'Elisa Kassa Kauppiaan paketti tabletti, Kuittiprintteri: kiinteä, Star mPOP',
		cspmb__Recurring_Charge__c: 16,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kuittiprintteri: kiinteä, Star mPOP',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzMQAS',
		Name: 'Elisa Kassa Kauppiaan paketti tabletti, Mobiilidata',
		cspmb__Recurring_Charge__c: 10,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Mobiilidata',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzNQAS',
		Name:
			'Elisa Kassa Kauppiaan paketti työasema, Peruspalvelu, yski toimipiste',
		cspmb__Recurring_Charge__c: 84,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Peruspalvelu, yski toimipiste',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzOQAS',
		Name: 'Elisa Kassa Kauppiaan paketti työasema, Elisa Tietoturva',
		cspmb__Recurring_Charge__c: 5.1,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Elisa Tietoturva',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzPQAS',
		Name: 'Elisa Kassa Kauppiaan paketti työasema, Dell OptiPlex 3030',
		cspmb__Recurring_Charge__c: 33,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Dell OptiPlex 3030',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzQQAS',
		Name: 'Elisa Kassa Kauppiaan paketti työasema, Kassalaatikko Star CB2002FN',
		cspmb__Recurring_Charge__c: 3,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kassalaatikko Star CB2002FN',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzRQAS',
		Name:
			'Elisa Kassa Kauppiaan paketti työasema, Termokuittitulostin Star TSP654 USB',
		cspmb__Recurring_Charge__c: 9,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Termokuittitulostin Star TSP654 USB',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzSQAS',
		Name:
			'Elisa Kassa Kauppiaan paketti työasema, Viivakoodinlukija Newland NLS-HR22 Dorad',
		cspmb__Recurring_Charge__c: 4.9,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c:
			'Viivakoodinlukija Newland NLS-HR22 Dorada',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzTQAS',
		Name:
			'Elisa Kassa viivakoodin lukija, viivakoodinlukija Newland NLS-HR22 Dorada',
		cspmb__Recurring_Charge__c: 144,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c:
			'viivakoodinlukija Newland NLS-HR22 Dorada',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzUQAS',
		Name: 'Elisa Kassa kassalaatikko, Star CB2002FN',
		cspmb__Recurring_Charge__c: 3,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Star CB2002FN',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzVQAS',
		Name: 'Elisa Kassa Toimitusprojekti, Kertamaksu',
		cspmb__One_Off_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzWQAS',
		Name:
			'Elisa Kassa kuittiprintteri, termokuittitulostin Star TSP654 Bluetooth',
		cspmb__One_Off_Charge__c: 360,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c:
			'termokuittitulostin Star TSP654 Bluetooth',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzXQAS',
		Name: 'Elisa Kassa kuittiprintteri, termokuittitulostin Star TSP654 USB',
		cspmb__One_Off_Charge__c: 272,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'termokuittitulostin Star TSP654 USB',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzYQAS',
		Name: 'Elisa Yritystietoturva, Paketti 25 laitteelle',
		cspmb__Recurring_Charge__c: 18.7,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Paketti 25 laitteelle',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzZQAS',
		Name: 'Elisa Yritystietoturva, Paketti 35 laitteelle',
		cspmb__Recurring_Charge__c: 26.2,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Paketti 35 laitteelle',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzaQAC',
		Name: 'Elisa Yritystietoturva, Paketti 45 laitteelle',
		cspmb__Recurring_Charge__c: 33.6,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Paketti 45 laitteelle',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzbQAC',
		Name: 'Elisa Kassa, Yhden toimipaikan ratkaisu',
		cspmb__Recurring_Charge__c: 69,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Yhden toimipaikan ratkaisu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxsQAC',
		Name: 'Elisa Toimisto 365, Skype for Business PSTN Conferencing, AddOn',
		cspmb__Recurring_Charge__c: 4,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c:
			'Skype for Business PSTN Conferencing, AddOn',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxtQAC',
		Name: 'Elisa Toimisto 365, Skype for Business Cloud PBX, AddOn',
		cspmb__Recurring_Charge__c: 6.8,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Skype for Business Cloud PBX, AddOn',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxuQAC',
		Name: 'Elisa Toimisto 365, Azure Active Directory Premium P1',
		cspmb__Recurring_Charge__c: 5.1,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Azure Active Directory Premium P1',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azy0QAC',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Pa2V2R8',
		cspmb__Recurring_Charge__c: 60,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa2V2R8',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azy1QAC',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Pa3V2R8',
		cspmb__Recurring_Charge__c: 55,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa3V2R8',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azy2QAC',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Pa4V2R8',
		cspmb__Recurring_Charge__c: 47,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa4V2R8',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azy3QAC',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Pa1V4R16',
		cspmb__Recurring_Charge__c: 66,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa1V4R16',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azy4QAC',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Pa2V4R16',
		cspmb__Recurring_Charge__c: 55,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa2V4R16',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azy5QAC',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Pa3V4R16',
		cspmb__Recurring_Charge__c: 49,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa3V4R16',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azy6QAC',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Pa4V4R16',
		cspmb__Recurring_Charge__c: 43,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa4V4R16',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azy7QAC',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Pa1V8R32',
		cspmb__Recurring_Charge__c: 59,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa1V8R32',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azy8QAC',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Pa2V8R32',
		cspmb__Recurring_Charge__c: 49,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa2V8R32',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azy9QAC',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Pa3V8R32',
		cspmb__Recurring_Charge__c: 40,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa3V8R32',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyAQAS',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Pa4V8R32',
		cspmb__Recurring_Charge__c: 34,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa4V8R32',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyBQAS',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Erittäin kriittinen',
		cspmb__Recurring_Charge__c: 70,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Erittäin kriittinen',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyCQAS',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Kriittinen',
		cspmb__Recurring_Charge__c: 65,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kriittinen',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyDQAS',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Laajennettu',
		cspmb__Recurring_Charge__c: 58,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Laajennettu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyEQAS',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Normaali',
		cspmb__Recurring_Charge__c: 47,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Normaali',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyFQAS',
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Lähtötaso',
		cspmb__Recurring_Charge__c: 37,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Lähtötaso',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyGQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa1V1R4',
		cspmb__Recurring_Charge__c: 50,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa1V1R4',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyHQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa2V1R4',
		cspmb__Recurring_Charge__c: 45,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa2V1R4',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyIQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa3V1R4',
		cspmb__Recurring_Charge__c: 42,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa3V1R4',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyJQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa4V1R4',
		cspmb__Recurring_Charge__c: 37,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa4V1R4',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyKQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa1V2R8',
		cspmb__Recurring_Charge__c: 50,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa1V2R8',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyLQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa2V2R8',
		cspmb__Recurring_Charge__c: 43,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa2V2R8',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyMQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa3V2R8',
		cspmb__Recurring_Charge__c: 39,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa3V2R8',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyNQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa4V2R8',
		cspmb__Recurring_Charge__c: 34,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa4V2R8',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyOQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa1V4R16',
		cspmb__Recurring_Charge__c: 47,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa1V4R16',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyPQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa2V4R16',
		cspmb__Recurring_Charge__c: 40,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa2V4R16',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyQQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa3V4R16',
		cspmb__Recurring_Charge__c: 36,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa3V4R16',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyRQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa4V4R16',
		cspmb__Recurring_Charge__c: 30,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa4V4R16',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzySQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa1V8R32',
		cspmb__Recurring_Charge__c: 44,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa1V8R32',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyTQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa2V8R32',
		cspmb__Recurring_Charge__c: 38,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa2V8R32',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyUQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa3V8R32',
		cspmb__Recurring_Charge__c: 33,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa3V8R32',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyVQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Pa4V8R32',
		cspmb__Recurring_Charge__c: 28,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Pa4V8R32',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyWQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Erittäin kriittinen',
		cspmb__Recurring_Charge__c: 49,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Erittäin kriittinen',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyXQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Kriittinen',
		cspmb__Recurring_Charge__c: 46,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kriittinen',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyYQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Laajennettu',
		cspmb__Recurring_Charge__c: 40,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Laajennettu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyZQAS',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Normaali',
		cspmb__Recurring_Charge__c: 34,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Normaali',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyaQAC',
		Name: 'SQL - tietokantojen hallinta ja valvonta, Lähtötaso',
		cspmb__Recurring_Charge__c: 27,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Lähtötaso',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzybQAC',
		Name: '42U räkki asiakkaan laitteille, Kausimaksu',
		cspmb__Recurring_Charge__c: 900,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzycQAC',
		Name: 'RU-paikka asiakkaan laitteille, Kausimaksu',
		cspmb__Recurring_Charge__c: 35,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzydQAC',
		Name: 'Sähköenergia ja jäähdytys, Kausimaksu',
		cspmb__Recurring_Charge__c: 0.24,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyeQAC',
		Name: 'Räkkipaikka asiakkaan laitteille, Laite',
		cspmb__Recurring_Charge__c: 65,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Laite',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyfQAC',
		Name: 'Räkkipaikka asiakkaan laitteille, Tietoliikennelaite',
		cspmb__Recurring_Charge__c: 45,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Tietoliikennelaite',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzygQAC',
		Name: 'Räkkipaikka asiakkaan laitteille, Blade Server',
		cspmb__Recurring_Charge__c: 65,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Blade Server',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyhQAC',
		Name: 'Konesaliverkko kytkentä, 1 Gbps',
		cspmb__Recurring_Charge__c: 15,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '1 Gbps',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyiQAC',
		Name: 'Konesaliverkko kytkentä, 10 Gbps',
		cspmb__Recurring_Charge__c: 30,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '10 Gbps',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyjQAC',
		Name: 'Konesaliverkko kytkentä, Blade Server',
		cspmb__Recurring_Charge__c: 12,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Blade Server',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzykQAC',
		Name: 'Virtuaalipalomuuri, Kausimaksu',
		cspmb__Recurring_Charge__c: 320,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzylQAC',
		Name: 'Virtuaalipalomuurin lisä-zone, Kausimaksu',
		cspmb__Recurring_Charge__c: 50,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzymQAC',
		Name: 'Virtuaalipalomuurin IPS suojaus, Kausimaksu',
		cspmb__Recurring_Charge__c: 40,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzynQAC',
		Name: 'Kahden konesalin välinen CWDM yhteys, 10 Gbps',
		cspmb__Recurring_Charge__c: 380,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '10 Gbps',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyoQAC',
		Name: 'Kahden konesalin välinen CWDM yhteys, SAN',
		cspmb__Recurring_Charge__c: 380,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'SAN',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzypQAC',
		Name: 'Kuormanjakopalvelu, F5',
		cspmb__Recurring_Charge__c: 250,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'F5',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyqQAC',
		Name: 'Kuormanjakopalvelu, 50 Mbps',
		cspmb__Recurring_Charge__c: 250,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '50 Mbps',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyrQAC',
		Name: 'Kuormanjakopalvelu, 200 Mbps',
		cspmb__Recurring_Charge__c: 330,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '200 Mbps',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzysQAC',
		Name: 'Citrix Netscaler SDX, 50 Mbps',
		cspmb__Recurring_Charge__c: 600,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '50 Mbps',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzytQAC',
		Name: 'Citrix Netscaler SDX, 200 Mbps',
		cspmb__Recurring_Charge__c: 720,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '200 Mbps',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyuQAC',
		Name: 'Citrix Netscaler SDX, 1000 Mbps',
		cspmb__Recurring_Charge__c: 900,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '1000 Mbps',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyvQAC',
		Name: 'Oma Datalasku, Kertamaksu',
		cspmb__One_Off_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzywQAC',
		Name: 'Oma Laitelasku, Kertamaksu',
		cspmb__One_Off_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyxQAC',
		Name: 'Palomuuriraportointi, Kausimaksu',
		cspmb__Recurring_Charge__c: 50,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyyQAC',
		Name: 'Elisa Kansainvälinen liikenne palvelu, Käyttöönotto',
		cspmb__One_Off_Charge__c: 2000,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Käyttöönotto',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyzQAC',
		Name: 'Elisa Kansainvälinen liikenne, Dial-In, Avaus, maakori 1',
		cspmb__One_Off_Charge__c: 5,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Avaus, maakori 1',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azz0QAC',
		Name: 'Elisa Kansainvälinen liikenne, Dial-In, Avaus, maakori 2',
		cspmb__One_Off_Charge__c: 5,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Avaus, maakori 2',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azz1QAC',
		Name: 'Elisa Kansainvälinen liikenne, Dial-In, Avaus, maakori 3',
		cspmb__One_Off_Charge__c: 15,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Avaus, maakori 3',
		CurrencyIsoCode: 'EUR'
	}
];

const newFA = {
	Id: 'newFaId',
	Name: 'AGR-000000',
	csconta__Account__c: '0011t00000DSEtnAAH',
	csconta__Agreement_Name__c: 'Frame Agreement - Test #NEW',
	csconta__Status__c: 'Draft',
	csconta__Valid_From__c: 1547424000000,
	csconta__Valid_To__c: 1568419200000,
	Arb_Field_Text__c: 'Arb Text',
	Arb_Field_Date__c: 1547510400000,
	Arb_Field_Text_2__c: 'Arb Text 2 - change 1dsfsdf',
	Arb_Field_Text_3__c: 'Arb Text 3 - change 1',
	Arb_Field_Textarea__c:
		'Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget',
	csconta__Account__r: {
		Name: 'Test Account',
		Id: '0011t00000DSEtnAAH'
	}
};

const lookupAccountData = [];
for (var i = 0; i < 2000; i++) {
	lookupAccountData.push({
		Name:
			getRandomFromArr([
				'Pyramid Construction #',
				'Express Logistics #',
				'University no.',
				'United Oil &amp; Gas Corp. '
			]) + i,
		Type:
			'Customer-' +
			getRandomFromArr([
				'Prospect',
				'Direct',
				'Channel',
				'Consumer',
				'Random',
				'Schmustomer'
			]),
		Id: makeId(15)
	});
}

lookupAccountData.sort((a, b) => (a.Id > b.Id ? 1 : b.Id > a.Id ? -1 : 0));

// const priceItemData = {"a1F1t00000017Y0EAI":{"addons":[{"Id":"a0w1t0000002hSaAAI","Name":"ADD1","cspmb__Is_Active__c":true,"cspmb__Recurring_Charge__c":22,"cspmb__Effective_Start_Date__c":1545868800000,"cspmb__Billing_Frequency__c":"Monthly","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM"},{"Id":"a0w1t000000zDnNAAU","Name":"ADD2","cspmb__Is_Active__c":true,"cspmb__Recurring_Charge__c":43,"cspmb__Effective_Start_Date__c":1545868800000,"cspmb__Billing_Frequency__c":"Monthly","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM"}],"Id":"a1F1t00000017Y0EAI","rateCards":[{"authId":"a0x1t000000yZF3AAM","Id":"a1N1t0000001QxrEAE","Name":"RC1","rateCardLines":[{"Id":"a1M1t000000BFrVEAW","Name":"RCL1.1","cspmb__Cap_Unit__c":"Sample Cap Unit","cspmb__rate_value__c":124.99,"cspmb__Rate_Card__c":"a1N1t0000001QxrEAE"},{"Id":"a1M1t000000peaJEAQ","Name":"RCL_1_1","cspmb__Rate_Card__c":"a1N1t0000001QxrEAE"}]}]},"a1F1t0000001JBUEA2":{"addons":[{"Id":"a0w1t0000002hSaAAI","Name":"ADD1","cspmb__Is_Active__c":true,"cspmb__Recurring_Charge__c":22,"cspmb__Effective_Start_Date__c":1545868800000,"cspmb__Billing_Frequency__c":"Monthly","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM"},{"Id":"a0w1t000000zDnNAAU","Name":"ADD2","cspmb__Is_Active__c":true,"cspmb__Recurring_Charge__c":43,"cspmb__Effective_Start_Date__c":1545868800000,"cspmb__Billing_Frequency__c":"Monthly","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM"}],"Id":"a1F1t0000001JBUEA2","rateCards":[{"authId":"a0x1t000000yZF3AAM","Id":"a1N1t0000001X2dEAE","Name":"RC2","rateCardLines":[{"Id":"a1M1t000000peXUEAY","Name":"RCL_1","cspmb__rate_value__c":55.98,"cspmb__Rate_Card__c":"a1N1t0000001X2dEAE"},{"Id":"a1M1t000000peXZEAY","Name":"RCL_2","cspmb__rate_value__c":65.43,"cspmb__Rate_Card__c":"a1N1t0000001X2dEAE"},{"Id":"a1M1t000000peXeEAI","Name":"RCL_3","cspmb__rate_value__c":12.99,"cspmb__Rate_Card__c":"a1N1t0000001X2dEAE"}]}]},"a1F1t0000001JBeEAM":{"addons":[{"Id":"a0w1t0000002hSaAAI","Name":"ADD1","cspmb__Is_Active__c":true,"cspmb__Recurring_Charge__c":22,"cspmb__Effective_Start_Date__c":1545868800000,"cspmb__Billing_Frequency__c":"Monthly","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM"},{"Id":"a0w1t000000zDnhAAE","Name":"ADD3","cspmb__Is_Active__c":true,"cspmb__Recurring_Charge__c":43,"cspmb__Effective_Start_Date__c":1545868800000,"cspmb__Billing_Frequency__c":"Monthly","cspmb__Authorization_Level__c":"a0x1t000000yZF3AAM"}],"Id":"a1F1t0000001JBeEAM","rateCards":[{"authId":"a0x1t000000yZF3AAM","Id":"a1N1t0000001X2dEAE","Name":"RC2","rateCardLines":[{"Id":"a1M1t000000peXUEAY","Name":"RCL_1","cspmb__rate_value__c":55.98,"cspmb__Rate_Card__c":"a1N1t0000001X2dEAE"},{"Id":"a1M1t000000peXZEAY","Name":"RCL_2","cspmb__rate_value__c":65.43,"cspmb__Rate_Card__c":"a1N1t0000001X2dEAE"},{"Id":"a1M1t000000peXeEAI","Name":"RCL_3","cspmb__rate_value__c":12.99,"cspmb__Rate_Card__c":"a1N1t0000001X2dEAE"}]}]}};

window.react_logs = [];

window.SF = SF = {
	param: {
		account: '0011t00000DSEtn'
	},
	labels: {
		frameAgreementTitle: 'Frame Agreement Negotiation Console',
		frameAgreementListTitle: 'Agreement List',
		input_quickSearchPlaceholder: 'Quick search',
		faMenuActionDelete: 'Delete',
		faMenuActionClone: 'Clone',
		faMenuActionEdit: 'Edit',
		faMenuActionAccounts: 'Accounts',
		accounts_modal_no_main: '--no account',
		accounts_modal_no_assoc: '--no associated accounts',
		btn_AddNewAgreement: 'Add new Agreement',
		header_frameAgreementEditorTitle: 'Frame Agreement Details',
		header_frameAgreementMasterTitle: 'Master Frame Agreement',
		header_customDropdownPlaceholder: 'Custom',
		btn_Save: 'Save',
		btn_SubmitForApproval: 'Submit For Approval',
		btn_Submit: 'Activate',
		btn_BulkNegotiate: 'Negotiate Products',
		btn_DeleteProducts: 'Delete Products',
		btn_DeleteAgreements: 'Delete Agreements',
		btn_AddProducts: 'Add Products',
		btn_AddFa: 'Add Frame Agreements',
		btn_Delta: 'Compare Agreements',
		frame_agreements_title: 'Frame Agreements',
		btn_NewVersion: 'Create New Version',
		approval_title: 'Approval history',
		approval_action_approve: 'Approve',
		approval_action_reject: 'Reject',
		approval_action_reassign: 'Reassign',
		approval_action_recall: 'Recall',
		approval_message_title: 'Comment',
		approval_message_placeholder: 'Enter comment...',
		approval_table_header_action: 'Action',
		approval_table_header_date: 'Date',
		approval_table_header_status: 'Status',
		approval_table_header_assignedTo: 'Assigned to',
		approval_table_header_actualApprover: 'Actual Approver',
		approval_table_header_comments: 'Comments',
		products_title: 'Products',
		products_display_columns: 'Display Columns',
		products_volume_minVol: 'Minimum vol',
		products_volume_minVolPeriod: 'Minimum vol. period',
		products_volume_minUsageComm: 'Min. usage commitment',
		products_volume_minUsageCommPeriod: 'Min. usage commitment period',
		products_productNameHeaderCell: 'Product Name',
		faNameHeaderCell: 'FA name',
		products_tab_title: 'Products',
		products_addons: 'Add Ons',
		products_charges: 'Charges',
		products_product_charges: 'Charges (product)',
		products_rates: 'Rate Cards',
		products_allowances: 'Allowances',
		modal_addProduct_title: 'Add Product to Frame Agreement',
		modal_addFa_title: 'Add Frame Agreements',
		modal_addProduct_input_search_placeholder: 'Filter products',
		modal_lookup_input_search_placeholder: 'Filter records...',
		modal_categorization_switch: 'Product categorisation panel',
		modal_categorization_title: 'Product Categorization',
		modal_categorization_btn_clear: 'Clear Filter',
		modal_categorization_btn_apply: 'Apply Filter',
		modal_categorization_btn_add: 'Add Selected',
		modal_bulk_title: 'Bulk Negotiation',
		modal_bulk_selected_title: 'Selected Products',
		modal_bulk_discount_title: 'Discount options',
		modal_bulk_discount_input_title: 'Discount to selection',
		modal_bulk_btn_percentage: 'Percentage',
		modal_bulk_btn_fixed: 'Fixed Amount',
		modal_bulk_btn_apply: 'Apply discount',
		modal_bulk_btn_save: 'Save to Frame Agreement',
		modal_bulk_input_placeholder: 'Enter discount value',
		modal_bulk_input_placeholder: 'Enter discount value',
		modal_charge_table_header_presentIn: 'Present In',
		modal_charge_table_header_oneOff: 'One Off',
		modal_charge_table_header_recurring: 'Recurring',
		modal_charge_table_header_chargeType: 'Charge Type',
		modal_charge_table_header_value: 'Value',
		modal_charge_table_header_unit: 'Unit',
		modal_charge_table_header_rateValue: 'Rate Value',
		modal_bluk_rateFilter_title: 'Filter Rate Card Lines',
		modal_bluk_rateFilter_propertyTitle: 'Select rate card line property:',
		modal_bluk_rateFilter_propertyValueTitle: 'Select value:',
		modal_bluk_rateFilter_dropdownPlaceholder: '-- select a property ---',
		modal_unsavedChanges_alert:
			'You have unsaved changes, are you sure you want to leave?',
		alert_deleteProducts_title: 'Delete products',
		alert_deleteAgreements_title: 'Delete agreements',
		alert_deleteProducts_message:
			'Are you sure you want to delete selected products?',
		alert_deleteAgreements_message:
			'Are you sure you want to delete selected agreements?',
		alert_deleteProducts_btn_action: 'Delete',
		alert_cloneFa_title: 'Clone Frame Agreement',
		alert_cloneFa_message:
			'Are you sure you want to clone this frame agreement?',
		alert_cloneFa_btn_action: 'Clone',
		alert_btn_cancel: 'Cancel',
		modal_charge_table_header_name: 'Name',
		products_title_empty: 'Product Negotiation',
		addProductCTAMessage: 'There are no Products in here',
		addAgreementsCTAMessage: 'There are no Agreements in here',
		save_fa_message: 'Save frame agreement before adding products!',
		save_fa_products_message:
			'They will be visible as soon as you create them.',
		no_fa_message: 'There are no Frame Agreements in here.',
		no_fa_message_2: 'Create at least one frame agreements.',
		addons_header_name: 'Name',
		addons_header_oneOff: 'One Off Charge',
		addons_header_oneOff_neg: 'Negotiated One Off',
		addons_header_recc: 'Recurring Charge',
		addons_header_recc_neg: 'Negotiated Recurring',
		charges_header_name: 'Charge Name',
		charges_header_type: 'Charge Type',
		charges_header_oneOff: 'One Off Adjustment',
		charges_header_neg: 'Negotiated One Off',
		charges_header_recc: 'Recurring Adjustment',
		charges_header_recc_neg: 'Negotiated Recurring',
		product_charge_header_name: 'Charge Name',
		product_charge_header_oneOff: 'One Off Adjustment',
		product_charge_header_oneOff_neg: 'Negotiated One Off',
		product_charge_header_recc: 'Recurring Adjustment',
		product_charge_header_recc_neg: 'Negotiated Recurring',
		usage_type_name_field: 'Name',
		usage_type_undefined: 'No usage type',
		rate_cards_header_name: 'Name',
		rate_cards_header_usage: 'Usage Type',
		rate_cards_header_value: 'Rate Value',
		rate_cards_header_value_neg: 'Negotiated Value',
		util_datepicker_today: 'Today',
		util_negotiation_input_diff_label: 'negotiated',
		util_input_text_enter: 'Enter',
		util_input_formula_placehoder: '--not calculated',
		util_input_lookup_placehoder: 'No record selected',
		toast_approvalAction_success: 'action successful!',
		toast_approvalAction_failed: 'action failed!',
		toast_success_title: 'Submitted!',
		toast_failed_title: 'Failed!',
		toast_submitForApproval_success: 'Successfuly submitted for approval!',
		toast_submitForApproval_failed: 'Unable to start approval process.',
		toast_decomposition_title_failed: 'Activation failed!',
		toast_decomposition_failed: 'Deleting associations made from this attempt.',
		toast_decomposition_title_revered: 'Activation reverted!',
		toast_decomposition_revered: 'Deleted all created associations.',
		toast_decomposition_title_success: 'Activation succeded!',
		toast_decomposition_success: 'Created associations',
		toast_invalid_handler_title: 'Invalid handler!',
		toast_invalid_handler: 'Handler not defined',
		toast_saved_fa: 'Successfuly saved frame agreement.!',
		toast_created_fa: 'Successfuly created new frame agreement.!',
		toast_discount_calculated_title: 'Discount calculated!',
		toast_discount_calculated: 'Changes have to be saved to Frame Agreement.!'
	},
	apiSession: '{!$Api.Session_ID}',
	invokeAction: function(remoteActionName, parametersArr = []) {
		let data = null;
		switch (remoteActionName) {
			case 'getFrameAgreements':
				return createPromise(frameAgreements, 500);

			case 'getCommercialProducts':
				return createPromise(commercialProducts, 500);
			// return createPromise(commercialProducts_large);

			case 'cloneFrameAgreement':
				var faArr = frameAgreements.filter(fa => {
					return fa.Id === parametersArr[0];
				});
				var fa = JSON.parse(JSON.stringify(faArr[0]));
				fa.Id = fa.Id.slice(0, -3) + makeId(3);
				frameAgreements.push(fa);
				return createPromise(fa);

			case 'getAppSettings':
				data = {
					commercialProductCount: 10,
					frameAgreementsCount: 3,
					itemsPerPage: 20,
					ButtonCustomData: ButtonCustomData,
					ButtonStandardData: ButtonStandardData,
					CategorizationData: CategorizationData,
					HeaderData: HeaderData,
					CustomTabsData: CustomTabsData,
					account: {
						Id: 'aaaa',
						Name: 'aaaa'
					},
					// DiscLevels: DiscLevels,
					// AuthLevels: AuthLevels,
					FACSettings: FACSettings
				};
				return createPromise(data, 500);

			case 'getAddons': // Obsolete
				return createPromise(Addons);

			case 'upsertFrameAgreements':
				if (parametersArr[0] !== null) {
					return createPromise(JSON.parse(parametersArr[1]));
				} else {
					return createPromise({
						...newFA,
						csconta__agreement_level__c: parametersArr[1]
					});
				}

			case 'getAttachmentBody':
				var fa = frameAgreements.find(fa => fa.Id === parametersArr[0]);
				var master = fa.csconta__agreement_level__c === 'Master Frame';

				if (master) {
					return createPromise(attachmentMaster, 500);
				} else {
					return createPromise(attachment, 500);
				}

			case 'getAttachmentBody':
				return createPromise(attachment, 1000);

			case 'getApprovalHistory':
				return createPromise(getRandomFromArr([approval, approval]));

			case 'getRateCards': // Obsolete
				return createPromise(rateCards);

			case 'approveRejectRecallRecord': // Obsolete
				return createPromise(true);

			case 'reassignApproval': // Obsolete
				return createPromise(true);

			case 'getDelta': // Obsolete
				return createPromise(Delta);

			case 'submitForApproval': // Obsolete
				return createPromise(getRandomFromArr([true, true, true]));

			case 'saveAttachment':
				return createPromise(parametersArr[1]);

			case 'createPricingRuleGroup':
				return createPromise('pricingRuleId');

			case 'decomposeAttachment':
				return createPromise('Success', 1000);

			case 'undoDecomposition':
				return createPromise('Success', 2000);

			case 'filterCommercialProducts':
				return createPromise(filterProducts(parametersArr[0]));

			case 'setFrameAgreementState':
				return createPromise(getRandomFromArr(['Success']));

			case 'createNewVersionOfFrameAgrement':
				let newFa = JSON.parse(
					JSON.stringify(
						frameAgreements.filter(fa => fa.Id === parametersArr[0])[0]
					)
				);

				newFa.Id = makeId(15);
				newFa.csconta__Status__c = 'Draft';
				newFa.csconta__Agreement_Name__c =
					newFa.csconta__Agreement_Name__c + '_v2';

				return createPromise(newFa);

			case 'getFrameAgreement':
				var fa = frameAgreements.filter(fa => fa.Id === parametersArr[0])[0];
				fa = JSON.parse(JSON.stringify(fa));
				delete fa._ui;
				return createPromise(fa);

			case 'deleteFrameAgreement':
				return createPromise('Success');

			case 'getCommercialProductData':
				var responseData = {
					cpData: [],
					discLevels: DiscLevels,
					childUsageTypes: childUsageTypes,
					discThresh: AuthLevels
				};

				var priceItemIdList = parametersArr[0];

				priceItemIdList.forEach(priceItemId => {
					responseData.cpData[priceItemId] = productData[priceItemId];
				});

				return createPromise(responseData);

			case 'getLookupRecords':
				var getLookupRecordsData;
				var param = JSON.parse(parametersArr[0]);
				var lastIndex;

				if (param.field === 'csconta__replaced_frame_agreement__c') {
					getLookupRecordsData = [
						{
							csconta__Agreement_Name__c: 'My Agreement',
							Id: 'a1t1t000000ZRdPAAW'
						},
						{
							csconta__Agreement_Name__c: 'Test A',
							Id: 'a1t1t000000ZRafAAG'
						},
						{
							csconta__Agreement_Name__c: 'Test A',
							Id: 'a1t1t000000ZRaaAAG'
						},
						{
							csconta__Agreement_Name__c: 'Test A',
							Id: 'a1t1t000000ZRaVAAW'
						},
						{
							csconta__Agreement_Name__c: 'IBM Frame Agreement',
							Id: 'a1t1t000000EOtBAAW'
						},
						{
							Id: 'a1t1t000000EPvDAAW'
						},
						{
							csconta__Agreement_Name__c: 'Test #3',
							Id: 'a1t1t000000EP9nAAG'
						},
						{
							csconta__Agreement_Name__c: 'Test #3',
							Id: 'a1t1t000000EOuxAAG'
						},
						{
							csconta__Agreement_Name__c: ';lk;l',
							Id: 'a1t1t000000ZSNjAAO'
						},
						{
							csconta__Agreement_Name__c: ';lk;l',
							Id: 'a1t1t000000ZSNyAAO'
						},
						{
							csconta__Agreement_Name__c: '.....',
							Id: 'a1t1t000000ZSMHAA4'
						},
						{
							csconta__Agreement_Name__c: 'dsgsdg',
							Id: 'a1t1t000000ZSOcAAO'
						},
						{
							Id: 'a1t1t000000ZSP6AAO'
						},
						{
							csconta__Agreement_Name__c: ';lk;l',
							Id: 'a1t1t000000ZSMgAAO'
						},
						{
							csconta__Agreement_Name__c: ';lk;l',
							Id: 'a1t1t000000ZSMlAAO'
						},
						{
							csconta__Agreement_Name__c: ';lk;l',
							Id: 'a1t1t000000ZSMMAA4'
						},
						{
							csconta__Agreement_Name__c: '.....',
							Id: 'a1t1t000000ZSMbAAO'
						},
						{
							csconta__Agreement_Name__c: ';lk;l',
							Id: 'a1t1t000000ZSNtAAO'
						},
						{
							csconta__Agreement_Name__c: ';lk;l',
							Id: 'a1t1t000000ZSNoAAO'
						},
						{
							csconta__Agreement_Name__c: '.....',
							Id: 'a1t1t000000ZSO8AAO'
						},
						{
							Id: 'a1t1t000000ZSQEAA4'
						},
						{
							csconta__Agreement_Name__c: 'Test #1',
							Id: 'a1t1t000000ZSQ4AAO'
						},
						{
							csconta__Agreement_Name__c: '123213',
							Id: 'a1t1t000000ZSR2AAO'
						},
						{
							csconta__Agreement_Name__c: 'FA 1',
							Id: 'a1t1t000000ZSQnAAO'
						},
						{
							csconta__Agreement_Name__c: 'Test 1',
							Id: 'a1t1t000000ZSPkAAO'
						},
						{
							csconta__Agreement_Name__c: 'Frame Agreement #1',
							Id: 'a1t1t000000ZR7LAAW'
						},
						{
							Id: 'a1t1t000000ZSM2AAO'
						},
						{
							Id: 'a1t1t000000ZSPXAA4'
						},
						{
							csconta__Agreement_Name__c: '.....',
							Id: 'a1t1t000000ZSO3AAO'
						},
						{
							csconta__Agreement_Name__c: 'SIMON',
							Id: 'a1t1t000000ZSPuAAO'
						},
						{
							csconta__Agreement_Name__c: 'Test #2',
							Id: 'a1t1t000000ZSUQAA4'
						},
						{
							csconta__Agreement_Name__c: 'Test #1',
							Id: 'a1t1t000000ZSTmAAO'
						},
						{
							csconta__Agreement_Name__c: 'Test #2',
							Id: 'a1t1t000000ZSUaAAO'
						}
					];
				} else if (
					param.field === 'csconta__Account__c' ||
					param.pointedObject === 'Account'
				) {
					let data;
					if (param.search) {
						param.search = param.search.substring(
							param.search.indexOf('%') + 1,
							param.search.lastIndexOf('%')
						);
						data = lookupAccountData.filter(r =>
							r.Name.toLowerCase().includes(param.search)
						);
					} else {
						data = lookupAccountData.map(r => r);
					}

					lastIndex = data.findIndex(r => r.Id === param.lastId);
					lastIndex = lastIndex === -1 ? 0 : lastIndex;
					getLookupRecordsData = data.slice(
						lastIndex + 1,
						lastIndex + param.offset + 1
					);
				}

				return createPromise(getLookupRecordsData, 2000);

			case 'getLookupInformation':
				var lookupInformation;
				if (parametersArr[0] === 'csconta__replaced_frame_agreement__c') {
					lookupInformation = {
						count: 33
					};
				} else if (
					parametersArr[0] === 'csconta__Account__c' ||
					parametersArr[0] === 'Account'
				) {
					lookupInformation = {
						initialLabel: 'Test Account',
						count: 2000
					};
				}

				return createPromise(lookupInformation);

			case 'getPicklistOptions':
				const OPTIONS = [
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
				];
				var result = {};
				parametersArr[0].forEach(f => {
					result[f] = OPTIONS;
				});

				return createPromise(result);

			case 'getAccountsInformation':
				var accountsInformation = {
					main_account: {
						Id: '0011t00000DQdZEAA1',
						Name: 'Pyramid Construction Inc.'
					},
					associated_accounts: [
						{
							Id: 'a1o1t000000jDS5AAM',
							csconta__Account__c: '0011t00000Pq1WRAAZ',
							csconta__Account__r: {
								Id: '0011t00000Pq1WRAAZ',
								Name: 'Test Account'
							}
						}
					],
					count: 2014
				};
				return createPromise(accountsInformation);

			case 'addAccountAssociation':
				var newAssociation = {
					Id: makeId(8),
					csconta__Account__c: parametersArr[1],
					csconta__Account__r: {
						Id: parametersArr[1],
						Name: 'Universal name'
					}
				};
				return createPromise(newAssociation);

			default:
				return createPromise('Success');
		}
	}
};
