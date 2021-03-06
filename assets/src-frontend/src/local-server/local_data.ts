/* eslint-disable @typescript-eslint/naming-convention */
function makeId(n = 15): string {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < n; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

export const approval = {
	isApprover: true,
	isAdmin: true,
	isPending: true,
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
export const approval2 = {
	isApprover: false,
	isAdmin: false,
	isPending: false,
	currentUser: '0051t0000025wM9AAI',
	listProcess: []
};

export const FACSettings = {
	fa_editable_statuses: 'Draft, Requires Approval',
	// price_item_fields: "Name, cspmb__Contract_Term__c, cspmb__Price_Item_Description__c, cspmb__Is_Authorization_Required__c, CurrencyIsoCode",
	price_item_fields: 'Id, cspmb__Is_Recurring_Discount_Allowed__c',
	show_volume_fields: true,
	frame_agreement_fields: 'Id, csconta__Account__c',
	account_fields: 'Name, Type',
	decomposition_chunk_size: 2,
	discount_as_price: false,
	approvers_revise: true,
	input_minmax_restriction: true,
	new_frame_agreement: true,
	active_status_management__c: true,
	product_chunk_size: 100,
	decimal_places: 2,
	rcl_fields: 'cspmb__Currency_Code__c, Category__c',
	standalone_addon_fields: 'Id, Name',
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

export const relatedLists = [
	{
		label: 'Account',
		columns: 'Id, csconta__Agreement_Name__c',
		records: [
			{
				Id: 'a1t1t000000EqXhAAK',
				csconta__Agreement_Name__c: 'TEst'
			},
			{
				Id: 'a1t1t000000GFYEAA4',
				csconta__Agreement_Name__c: 'Delta Test #1 - Clone'
			}
		]
	},
	{
		label: 'Pricing Rule Group',
		columns: 'Id, cspmb__always_applied__c, cspmb__description__c',
		records: [
			{
				Id: 'NQJhve5krZcVWaS',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Implementation private organization organization implementation scalable scalable buisness multi-purspose clause module'
			},
			{
				Id: 'ZslNFo1RyqoBtgd',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Concensus multi-purspose implementation multi-purspose master concensus organization multi-purspose process clause module'
			},
			{
				Id: '4fzmW3rohX4QAPs',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Concensus process organization process multi-purspose clause buisness buisness implementation process module'
			},
			{
				Id: 'NC12C5YDwVXbqaB',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Multi-purspose private buisness organization process concensus invoice private buisness concensus module'
			},
			{
				Id: '26Dxa9Lbuk4mRs2',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Concensus master scalable organization organization scalable private implementation concensus buisness module'
			},
			{
				Id: 'uMJSRkWKCJ8V9tK',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Concensus implementation clause private buisness organization private clause scalable multi-purspose module'
			},
			{
				Id: 'qIHKZWOZaz8noIe',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Organization process implementation organization private invoice buisness concensus organization invoice module'
			},
			{
				Id: 'BmRhVjcIEs4Vu4r',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Clause invoice private private implementation clause buisness master master clause module'
			},
			{
				Id: 'DEWj7sSACfXHwg7',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Implementation private process implementation private master multi-purspose clause invoice implementation module'
			},
			{
				Id: 'bZoI2GlWNSILoLp',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Concensus organization scalable buisness private clause scalable invoice organization private module'
			},
			{
				Id: 'ewuWbTtHjLMEhyR',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Buisness organization implementation master clause organization organization scalable clause private module'
			},
			{
				Id: 'Ki9fOuTJQAbLGlI',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Organization buisness multi-purspose clause private multi-purspose concensus invoice organization organization module'
			},
			{
				Id: 'Xa7rD7vNMg36pbw',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Buisness buisness process scalable organization master organization organization multi-purspose organization module'
			},
			{
				Id: 's9IAmsIKLWOfGxG',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Master buisness buisness process clause clause organization private clause private module'
			},
			{
				Id: 'IbiDbFn4VET6fKo',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Buisness master clause concensus concensus buisness private multi-purspose buisness organization module'
			},
			{
				Id: 'LXxnABN98pTnbHX',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Process scalable concensus implementation private buisness clause scalable master invoice module'
			},
			{
				Id: 'xehyzWQSNOleqsa',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Implementation multi-purspose concensus master buisness buisness implementation process scalable process module'
			},
			{
				Id: '9WKj2lOI6WgGb5x',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Clause buisness master multi-purspose process invoice process implementation implementation private module'
			},
			{
				Id: 'h75wku3iIBH5aul',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Private scalable private master master clause clause implementation implementation concensus module'
			},
			{
				Id: 'GaXFxXiUc5sKr70',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Multi-purspose clause implementation implementation process concensus process buisness invoice organization module'
			},
			{
				Id: 'L0Bz7gqhdpgeq7O',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Invoice buisness clause buisness multi-purspose buisness master multi-purspose invoice concensus module'
			},
			{
				Id: 'M087ltfjA1jH9FM',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Implementation scalable scalable implementation implementation organization master buisness invoice process module'
			},
			{
				Id: 'xq005d1lEsMQnrl',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Scalable private concensus invoice buisness process process organization invoice clause module'
			},
			{
				Id: 'k6YdQ4fUI8Xc9ZW',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Invoice master implementation scalable private process multi-purspose buisness invoice process module'
			},
			{
				Id: 'oVO9QnSN07Mtjwe',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Buisness multi-purspose multi-purspose process private process process multi-purspose organization invoice module'
			},
			{
				Id: 'vkKGXgSzqLuxlo9',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Implementation clause buisness concensus invoice organization invoice organization invoice multi-purspose module'
			},
			{
				Id: '7ELwnNKDFmwu6cl',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Concensus master buisness clause invoice multi-purspose buisness invoice private clause module'
			},
			{
				Id: 'ral6roIsxT5FZbc',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Multi-purspose multi-purspose organization process implementation process multi-purspose concensus master multi-purspose module'
			},
			{
				Id: 'zLbuW9Ku894vdwt',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Process scalable clause concensus organization master clause private invoice organization module'
			},
			{
				Id: 'ayRfgOISGGO987s',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Process organization multi-purspose invoice clause master organization process process buisness module'
			},
			{
				Id: 'A5VYCuvBjJs8VOr',
				cspmb__always_applied__c: true,
				cspmb__description__c:
					'Multi-purspose invoice organization concensus clause organization multi-purspose implementation multi-purspose organization module'
			},
			{
				Id: 'jKfRGzENOVoKGSY',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Master master invoice scalable master organization master organization process implementation module'
			},
			{
				Id: 'azBdM9oVHMwoTJD',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Organization master private multi-purspose multi-purspose private master invoice clause clause module'
			},
			{
				Id: 'IIQz2KoNlfKsKBc',
				cspmb__always_applied__c: false,
				cspmb__description__c:
					'Clause multi-purspose process process private process process multi-purspose multi-purspose process module'
			}
		]
	}
];

export const frameAgreements = [
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
		csconta__replaced_frame_agreement__c: 'a1t1t0000009wpQAAP',
		csconta__agreement_level__c: 'Master Agreement',
		csfam__Arb_Field_Textarea__c:
			'Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget',
		csconta__Account__r: {
			Name: 'Test Account',
			Id: '0011t00000DSEtnAAH'
		}
	},
	{
		Id: 'a1t1t0000009wpQAAP',
		Name: 'AGR-0007',
		csconta__Account__c: '0011t00000DSEtnAAH',
		csconta__Agreement_Name__c: 'Frame Agreement - Test #1 replaced',
		csconta__Status__c: 'Active',
		csconta__Valid_From__c: 1547424000000,
		csconta__Valid_To__c: 1568419200000,
		csfam__Disable_Levels__c: false,
		csfam__Disable_Custom_Tabs__c: false,
		csfam__Arb_Field_Integer__c: 48,
		csfam__Arb_Field_Text__c: 'Arb Text',
		csfam__Arb_Field_Date__c: 1547510400000,
		csfam__Arb_Field_Text_2__c: 'Arb Text 2 - change 2',
		csfam__Arb_Field_Text_3__c: 'Arb Text 3 - change 1',
		csconta__agreement_level__c: 'Master Agreement',
		csfam__Arb_Field_Textarea__c:
			'Metus in vestibulum faucibus erat tortor et, suscipit orci, scelerisque a do ac eu, maecenas fusce velit, cras dui faucibus donec urna leo justo. Enim nec sagittis rutrum est, vel erat in venenatis vestibulum, sed nostra dui nonummy etiam eros, eget',
		csconta__Account__r: {
			Name: 'Test Account',
			Id: '0011t00000DSEtnAAH'
		}
	},
	{
		Id: 'a1t1t0000009wpQAzx',
		Name: 'AGR-0007',
		csconta__Account__c: '0011t00000DSEtnAAH',
		csconta__Agreement_Name__c: 'Frame Agreement - Test #1',
		csconta__Status__c: 'Active',
		csconta__Valid_From__c: 1547424000000,
		csconta__Valid_To__c: 1568419200000,
		csfam__Disable_Levels__c: false,
		csfam__Disable_Custom_Tabs__c: false,
		csfam__Arb_Field_Integer__c: 48,
		csfam__Arb_Field_Text__c: 'Arb Text',
		csfam__Arb_Field_Date__c: 1547510400000,
		csfam__Arb_Field_Text_2__c: 'Arb Text 2 - change 2',
		csfam__Arb_Field_Text_3__c: 'Arb Text 3 - change 1',
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
	},
	{
		Id: 'a1t1t000000A0gPAAS',
		Name: 'AGR-000002',
		csconta__Account__c: '0011t00000DSEtnAAH',
		csconta__Agreement_Name__c: 'Child 1',
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
		},
		csconta__master_frame_agreement__c: 'a1t1t0000009wpQAAQ'
	}
];

export const STANDALONE_ADDONS = [
	{
		Id: 'a0w1t0000002hSaAAI',
		Name: 'Extra 200MB',
		cspmb__One_Off_Charge__c: 10,
		cspmb__Recurring_Charge__c: 12
	},
	{
		Id: 'a0w1t000000zDnNAAU',
		Name: '1000 SMS',
		cspmb__One_Off_Charge__c: 22,
		cspmb__Recurring_Charge__c: 82.44
	},
	{
		Id: 'a0w1t000000zDnhAAE',
		Name: '1000 Min',
		cspmb__One_Off_Charge__c: 14
	}
];

export const STANDALONE_ADDONS_AL_INFO = {
	discLevels: [
		{
			addonId: 'a0w1t0000002hSaAAI',
			discountLevel: {
				Id: 'a141t000003ENSyAAO',
				Name: 'One-off charge',
				cspmb__Charge_Type__c: 'NRC',
				cspmb__Discount_Type__c: 'Amount',
				cspmb__Discount_Values__c: '7,8'
			}
		},
		{
			addonId: 'a0w1t0000002hSaAAI',
			discountLevel: {
				Id: 'a141t000001380zAAA',
				Name: 'One-off charge',
				cspmb__Charge_Type__c: 'NRC',
				cspmb__Discount_Increment__c: '1',
				cspmb__Discount_Type__c: 'Amount',
				cspmb__Maximum_Discount_Value__c: 6,
				cspmb__Minimum_Discount_Value__c: 0
			},
			priceItemId: 'a1F1t00000017Y0EAI'
		},
		{
			addonId: 'a0w1t0000002hSaAAI',
			discountLevel: {
				Id: 'a141t000001381iAAA',
				Name: 'Addon_ADD1',
				cspmb__Charge_Type__c: 'One Off',
				cspmb__Discount_Values__c: '5,9,15'
			}
		}
	],
	dcList: [
		{
			Id: 'a151t000000rmV7AAI',
			Name: 'DT1',
			cspmb__Discount_Threshold__c: 10,
			cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
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
	]
};

export const childUsageTypes = {
	a201t0000009yECAAY: [
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url: '/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: 'a201t0000009yEHAAY',
			Name: 'National Calls to Fixed',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url: '/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: 'a201t0000009yETAAY',
			Name: 'National Calls to Mobile',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url: '/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: 'a201t0000009yEAAAY',
			Name: 'Appliance Usage Types; an unlikely big Name',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url: '/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url: '/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url: '/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url: '/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url: '/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url: '/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url: '/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url: '/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		},
		{
			attributes: {
				type: 'cspmb__Usage_Type__c',
				url: '/services/data/v46.0/sobjects/cspmb__Usage_Type__c/a201t0000009yEHAAY'
			},
			Id: makeId(15),
			Name: 'Universal UT',
			cspmb__unit_of_measure__c: 'Minute'
		}
	]
};

interface MainUsageType {
	cspmb__unit_of_measure__c: string;
	Name: string;
	cspmb__type__c: string;
	Id: string;
	childUsageTypes: ChildUsageType[];
}

interface ChildUsageType {
	Id: string;
	Name: string;
	cspmb__unit_of_measure__c: string;
}

interface Allowance {
	Id: string;
	Name: string;
	cspmb__amount__c: number;
	cspmb__priority__c: number;
	cspmb__usage_type__c: string;
	mainUsageType: MainUsageType;
}

interface Charge {
	chargeType: string;
	Id: string;
	Name: string;
	recurring?: number;
	oneOff?: number;
}

interface Addon {
	Id: string;
	cspmb__Price_Item__c: string;
	cspmb__Overrides_Add_On_Charges__c: boolean;
	cspmb__Add_On_Price_Item__c: string;
	cspmb__One_Off_Charge__c?: number;
	cspmb__Recurring_Charge__c?: number;
	cspmb__Add_On_Price_Item__r: AddOnPriceItem;
}

interface AddOnPriceItem {
	cspmb__Effective_Start_Date__c: number;
	Name: string;
	cspmb__Authorization_Level__c: string;
	cspmb__One_Off_Charge__c?: number;
	cspmb__Recurring_Charge__c?: number;
	Id: string;
}

interface RateCard {
	Id: string;
	Name: string;
	authId?: string;
	rateCardLines: RateCardLine[];
}

interface RateCardLine {
	Id: string;
	Name: string;
	cspmb__rate_value__c?: number;
	cspmb__usage_type__c: string;
	cspmb__Rate_Card__c: string;
	cspmb__Currency_Code__c: string;
	cspmb__usage_type__r: UsageType;
	cspmb__Cap_Unit__c?: string;
	cspmb__Weekend__c?: number;
	usageTypeName: string;
}

interface UsageType {
	Name: string;
	Id: string;
}

/**
 * The interface needed to be specified explicitly because the productData
 * array elements are not consistent in their shape leading to bad type
 * inferrence so deforcify was unable to cnvert the type correctly.
 */
export interface SfProductData {
	[key: string]: {
		addons: Addon[];
		allowances?: Allowance[];
		charges: Charge[];
		rateCards: RateCard[];
	};
}

export const productData: SfProductData = {
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
						cspmb__rate_value__c: 62.19,
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
						cspmb__rate_value__c: 62.19,
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
						cspmb__rate_value__c: 41.32,
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

export const attachment =
	'eyJjdXN0b20iOiIiLCJwcm9kdWN0cyI6eyJhMUYxdDAwMDAwMDFKQmpFQU0iOnsiX3ZvbHVtZSI6eyJtdiI6bnVsbCwibXZwIjpudWxsLCJtdWMiOm51bGwsIm11Y3AiOm51bGx9LCJfYWRkb25zIjp7ImExQTF0MDAwMDAwM1NibkVBRSI6e319LCJfcHJvZHVjdCI6eyJyZWN1cnJpbmciOjI2Nn19LCJhMUYxdDAwMDAwMDFKQ0RFQTIiOnsiX3ZvbHVtZSI6eyJtdiI6bnVsbCwibXZwIjpudWxsLCJtdWMiOm51bGwsIm11Y3AiOm51bGx9LCJfcHJvZHVjdCI6eyJyZWN1cnJpbmciOjI2M319LCJhMUYxdDAwMDAwMDFKQzhFQU0iOnsiX3ZvbHVtZSI6eyJtdiI6bnVsbCwibXZwIjpudWxsLCJtdWMiOm51bGwsIm11Y3AiOm51bGx9LCJfcHJvZHVjdCI6eyJyZWN1cnJpbmciOjIzOS40MX19LCJhMUYxdDAwMDAwMDE3WTBFQUkiOnsiX3ZvbHVtZSI6eyJtdiI6bnVsbCwibXZwIjpudWxsLCJtdWMiOm51bGwsIm11Y3AiOm51bGx9LCJfYWRkb25zIjp7ImExQTF0MDAwMDAwMmNJTUVBWSI6eyJvbmVPZmYiOjcuNjQsInJlY3VycmluZyI6Ny43NX0sImExQTF0MDAwMDAwM1NjZkVBRSI6eyJvbmVPZmYiOjcuNDksInJlY3VycmluZyI6NzkuNDR9fSwiX2NoYXJnZXMiOnsiYTFJMXQwMDAwMDFXa3pvRUFDIjp7Im9uZU9mZiI6N30sImExSTF0MDAwMDAxV2t6akVBQyI6eyJyZWN1cnJpbmciOjEyfX0sIl9yYXRlQ2FyZHMiOnsiYTFOMXQwMDAwMDAxUXhyRUFFIjp7ImExTTF0MDAwMDAwQkZyVkVBVyI6MTI0Ljk5fX19fX0=';

export const attachmentMaster =
	'eyJjdXN0b20iOiIiLCJwcm9kdWN0cyI6eyJhMXQxdDAwMDAwMEEwZ09BQVMiOiJhMXQxdDAwMDAwMEEwZ09BQVMifX0';

export const AuthLevels = [
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

export const DiscLevels_general: SfGlobal.DiscLevelWrapper[] = [
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
			Id: 'a141t00000137a8AAA',
			Name: 'Test',
			cspmb__Charge_Type__c: 'oneOff',
			cspmb__Discount_Type__c: 'Percentage',
			cspmb__Discount_Values__c: '10,20,30'
		},
		priceItemId: 'a1i4I000003Q4GGQA0'
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

export const DiscLevels = [
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

export const Delta = {
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
							new_value: 62.19,
							old_value: 62.19,
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
							new_value: 62.19,
							old_value: 62.19,
							status: 'unchanged'
						},
						a1M1t000000WwRyEAK: {
							new_value: 41.32,
							old_value: 41.32,
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
							new_value: 62.19,
							old_value: 62.19,
							status: 'unchanged'
						},
						a1M1t000000WwRyEAK: {
							new_value: 41.32,
							old_value: 41.32,
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

export const CustomTabsData = [
	{
		label: 'Custom tab',
		container_id: 'customTab1',
		onEnter: 'customTabEnter'
	}
];
export const HeaderData = [
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
		field: 'csfam__arb_field_bool__c',
		readOnly: false,
		label: 'Bool Arb',
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
		visible: 'csfam__Arb_Field_Text__c==hide all',
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

export const CategorizationData = [
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
export const AddonCategorizationData = [
	{
		name: 'Alpha',
		field: 'cspmb__Billing_Frequency__c',
		values: ['Monthly', 'Quarterly', 'Annually']
	},
	{
		name: 'Beta',
		field: 'cspmb__Discount_Type__c',
		values: ['Percentage', 'Amount']
	}
];
export const RelatedListsData = [
	{
		label: 'Account',
		object: 'csconta__Frame_Agreement__c',
		fa_lookup: 'csconta__master_frame_agreement__c',
		columns: 'Id, csconta__Agreement_Name__c'
	},
	{
		label: 'Pricing Rule Group',
		object: 'cspmb__Pricing_Rule_Group__c',
		fa_lookup: 'csconta__frame_agreement__c',
		columns: 'Id, cspmb__always_applied__c, cspmb__description__c'
	}
];

export const ButtonCustomData = [
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

export const ButtonStandardData = {
	Save: ['Draft', 'Requires Approval'],
	SubmitForApproval: ['Requires Approval'],
	Submit: ['Approved'],
	Delta: '*',
	DeleteProducts: ['Draft', 'Requires Approval'],
	DeleteAddons: ['Draft', 'Requires Approval'],
	BulkNegotiate: 'csfam__arb_field_bool__c == true',
	BulkNegotiateAddons: ['Draft', 'Requires Approval'],
	AddProducts: ['Draft', 'Requires Approval'],
	AddAddons: ['Draft', 'Requires Approval']
};

export const commercialProducts = [
	{
		Id: 'a1F1t0000001JBoEAM',
		Name: 'Mobile L_7',
		cspmb__Effective_Start_Date__c: 1545264000000,
		cspmb__One_Off_Charge__c: 60.2336,
		cspmb__Recurring_Charge__c: 269.665423,
		cspmb__Authorization_Level__c: 'a0x1t000000yZF3AAM',
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Is_One_Off_Discount_Allowed__c: true,
		cspmb__Is_Recurring_Discount_Allowed__c: false,
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
		cspmb__Is_Recurring_Discount_Allowed__c: false,
		cspmb__Price_Item_Description__c: '30 Gb Internet + 5000 minutes/SMS',
		cspmb__Contract_Term__c: '24 Months',
		Categorization_Alpha__c: 'Static',
		Categorization_Beta__c: '100GB'
	},
	{
		Id: 'a1F1t0000001JBUEA2',
		Name: 'Suojakotelo Insmat Exclusive Universal Tablet 10,1" mustang',
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

export const commercialProducts_large = [
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
		Name: 'Elisa Mobiililaajakaistaliittym?? 4G Plus',
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
		Name: 'Varmistuskapasiteetti, l??ht?? data, Default plan 3 kk',
		cspmb__Recurring_Charge__c: 115,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Default plan 3 kk',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azx1QAC',
		Name: 'Varmistuskapasiteetti, l??ht?? data, Default plan 6 kk',
		cspmb__Recurring_Charge__c: 160,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Default plan 6 kk',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azx2QAC',
		Name: 'Palvelunhallinta Ketter?? +, Kausimaksu',
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
		Name: 'Varmistuskapasiteetti, l??ht?? data, Default plan 12 kk',
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
		Name: 'P????telaitehallinta, Kausimaksu',
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
		Name: 'K??ytt??j??tuki, Kausimaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxCQAS',
		Name: 'L??hituki, Kausimaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxDQAS',
		Name: 'Virtuaalinen ty??p??yt??, Kausimaksu',
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
		Name: 'Levyj??rjestelm??taso, Taso 3',
		cspmb__Recurring_Charge__c: 0.13,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Taso 3',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxHQAS',
		Name: 'Levyj??rjestelm??taso, Taso 2',
		cspmb__Recurring_Charge__c: 0.29,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Taso 2',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxIQAS',
		Name: 'Levyj??rjestelm??taso, Taso 1',
		cspmb__Recurring_Charge__c: 0.59,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Taso 1',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxJQAS',
		Name: 'Elisa Kassa Kauppiaan paketti tabletti, Peruspalvelu, yksi toimipaikka',
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
		Name: 'Elisa Kassa Kauppiaan paketti tabletti, Kuittiprintteri: kiinte??, Star mPOP',
		cspmb__Recurring_Charge__c: 16,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kuittiprintteri: kiinte??, Star mPOP',
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
		Name: 'Elisa Kassa Kauppiaan paketti ty??asema, Peruspalvelu, yski toimipiste',
		cspmb__Recurring_Charge__c: 84,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Peruspalvelu, yski toimipiste',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxOQAS',
		Name: 'Elisa Kassa Kauppiaan paketti ty??asema, Elisa Tietoturva',
		cspmb__Recurring_Charge__c: 5.1,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Elisa Tietoturva',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxPQAS',
		Name: 'Elisa Kassa Kauppiaan paketti ty??asema, Dell??OptiPlex 3030',
		cspmb__Recurring_Charge__c: 33,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Dell??OptiPlex 3030',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxQQAS',
		Name: 'Elisa Kassa Kauppiaan paketti ty??asema, Kassalaatikko Star CB2002FN',
		cspmb__Recurring_Charge__c: 3,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kassalaatikko Star CB2002FN',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxRQAS',
		Name: 'Elisa Kassa Kauppiaan paketti ty??asema, Termokuittitulostin Star TSP654 USB',
		cspmb__Recurring_Charge__c: 9,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Termokuittitulostin Star TSP654 USB',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxSQAS',
		Name: 'Elisa Kassa Kauppiaan paketti ty??asema, Viivakoodinlukija Newland NLS-HR22 Dorad',
		cspmb__Recurring_Charge__c: 4.9,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Viivakoodinlukija Newland NLS-HR22 Dorada',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxTQAS',
		Name: 'Elisa Kassa viivakoodin lukija, viivakoodinlukija Newland NLS-HR22 Dorada',
		cspmb__Recurring_Charge__c: 144,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'viivakoodinlukija Newland NLS-HR22 Dorada',
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
		Name: 'Elisa Kassa kuittiprintteri, termokuittitulostin Star TSP654 Bluetooth',
		cspmb__One_Off_Charge__c: 360,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'termokuittitulostin Star TSP654 Bluetooth',
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
		Name: 'Puheensiirtoyhteydet, 2-johdinliittym??',
		cspmb__Recurring_Charge__c: 8,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '2-johdinliittym??',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxZQAS',
		Name: 'Puheensiirtoyhteydet, 4-johdinliittym??',
		cspmb__Recurring_Charge__c: 25.23,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '4-johdinliittym??',
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
		Name: 'Puheensiirtoyhteydet, 2-johdinliittym??, avaus',
		cspmb__One_Off_Charge__c: 201.83,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '2-johdinliittym??, avaus',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxeQAC',
		Name: 'Puheensiirtoyhteydet, 4-johdinliittym??, avaus',
		cspmb__One_Off_Charge__c: 201.83,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '4-johdinliittym??, avaus',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxfQAC',
		Name: 'Elisa Netti Plus lis??antenni, Sis??antennipaketti',
		cspmb__Recurring_Charge__c: 10,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Sis??antennipaketti',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxgQAC',
		Name: 'Elisa Tiedonv??litys 1-way SMS Elisa, Kausimaksu',
		cspmb__Recurring_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzxhQAC',
		Name: 'Elisa Tiedonv??litys 1-way SMS Open, Kausimaksu',
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
		Name: 'Elisa Netti Plus lis??antenni, Ulkoantennipaketti',
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
		Name: 'Mitta-l??pik??vely, Kertamaksu',
		cspmb__One_Off_Charge__c: 0,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzDQAS',
		Name: 'Toimisto 365 S??hk??postin luontipalvelu, Kertamaksu',
		cspmb__One_Off_Charge__c: 19,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzEQAS',
		Name: 'Toimisto 365 S??hk??postin luonti- ja siirtopalvelu, Kertamaksu',
		cspmb__One_Off_Charge__c: 49,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzFQAS',
		Name: 'Toimisto 365 Essential k??ytt????nottopalvelu, Kertamaksu',
		cspmb__One_Off_Charge__c: 59,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzGQAS',
		Name: 'Toimisto 365 Premium k??ytt????nottopalvelu, Kertamaksu',
		cspmb__One_Off_Charge__c: 79,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kertamaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzHQAS',
		Name: 'Puheratkaisu Vakio k??ytt????notto, Kertamaksu',
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
		Name: 'Elisa Kassa Kauppiaan paketti tabletti, Peruspalvelu, yksi toimipaikka',
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
		Name: 'Elisa Kassa Kauppiaan paketti tabletti, Kuittiprintteri: kiinte??, Star mPOP',
		cspmb__Recurring_Charge__c: 16,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kuittiprintteri: kiinte??, Star mPOP',
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
		Name: 'Elisa Kassa Kauppiaan paketti ty??asema, Peruspalvelu, yski toimipiste',
		cspmb__Recurring_Charge__c: 84,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Peruspalvelu, yski toimipiste',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzOQAS',
		Name: 'Elisa Kassa Kauppiaan paketti ty??asema, Elisa Tietoturva',
		cspmb__Recurring_Charge__c: 5.1,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Elisa Tietoturva',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzPQAS',
		Name: 'Elisa Kassa Kauppiaan paketti ty??asema, Dell??OptiPlex 3030',
		cspmb__Recurring_Charge__c: 33,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Dell??OptiPlex 3030',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzQQAS',
		Name: 'Elisa Kassa Kauppiaan paketti ty??asema, Kassalaatikko Star CB2002FN',
		cspmb__Recurring_Charge__c: 3,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kassalaatikko Star CB2002FN',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzRQAS',
		Name: 'Elisa Kassa Kauppiaan paketti ty??asema, Termokuittitulostin Star TSP654 USB',
		cspmb__Recurring_Charge__c: 9,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Termokuittitulostin Star TSP654 USB',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzSQAS',
		Name: 'Elisa Kassa Kauppiaan paketti ty??asema, Viivakoodinlukija Newland NLS-HR22 Dorad',
		cspmb__Recurring_Charge__c: 4.9,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Viivakoodinlukija Newland NLS-HR22 Dorada',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzzTQAS',
		Name: 'Elisa Kassa viivakoodin lukija, viivakoodinlukija Newland NLS-HR22 Dorada',
		cspmb__Recurring_Charge__c: 144,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'viivakoodinlukija Newland NLS-HR22 Dorada',
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
		Name: 'Elisa Kassa kuittiprintteri, termokuittitulostin Star TSP654 Bluetooth',
		cspmb__One_Off_Charge__c: 360,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'termokuittitulostin Star TSP654 Bluetooth',
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
		cspmb__Price_Item_Description__c: 'Skype for Business PSTN Conferencing, AddOn',
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
		Name: 'Oracle - tietokantojen hallinta ja valvonta, Eritt??in kriittinen',
		cspmb__Recurring_Charge__c: 70,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Eritt??in kriittinen',
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
		Name: 'Oracle - tietokantojen hallinta ja valvonta, L??ht??taso',
		cspmb__Recurring_Charge__c: 37,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'L??ht??taso',
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
		Name: 'SQL - tietokantojen hallinta ja valvonta, Eritt??in kriittinen',
		cspmb__Recurring_Charge__c: 49,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Eritt??in kriittinen',
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
		Name: 'SQL - tietokantojen hallinta ja valvonta, L??ht??taso',
		cspmb__Recurring_Charge__c: 27,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'L??ht??taso',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzybQAC',
		Name: '42U r??kki asiakkaan laitteille, Kausimaksu',
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
		Name: 'S??hk??energia ja j????hdytys, Kausimaksu',
		cspmb__Recurring_Charge__c: 0.24,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Kausimaksu',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyeQAC',
		Name: 'R??kkipaikka asiakkaan laitteille, Laite',
		cspmb__Recurring_Charge__c: 65,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Laite',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyfQAC',
		Name: 'R??kkipaikka asiakkaan laitteille, Tietoliikennelaite',
		cspmb__Recurring_Charge__c: 45,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Tietoliikennelaite',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzygQAC',
		Name: 'R??kkipaikka asiakkaan laitteille, Blade Server',
		cspmb__Recurring_Charge__c: 65,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Blade Server',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyhQAC',
		Name: 'Konesaliverkko kytkent??, 1 Gbps',
		cspmb__Recurring_Charge__c: 15,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '1 Gbps',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyiQAC',
		Name: 'Konesaliverkko kytkent??, 10 Gbps',
		cspmb__Recurring_Charge__c: 30,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '10 Gbps',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyjQAC',
		Name: 'Konesaliverkko kytkent??, Blade Server',
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
		Name: 'Virtuaalipalomuurin lis??-zone, Kausimaksu',
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
		Name: 'Kahden konesalin v??linen CWDM yhteys, 10 Gbps',
		cspmb__Recurring_Charge__c: 380,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: '10 Gbps',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyoQAC',
		Name: 'Kahden konesalin v??linen CWDM yhteys, SAN',
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
		Name: 'Elisa Kansainv??linen liikenne palvelu, K??ytt????notto',
		cspmb__One_Off_Charge__c: 2000,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'K??ytt????notto',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000AzyzQAC',
		Name: 'Elisa Kansainv??linen liikenne, Dial-In, Avaus, maakori 1',
		cspmb__One_Off_Charge__c: 5,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Avaus, maakori 1',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azz0QAC',
		Name: 'Elisa Kansainv??linen liikenne, Dial-In, Avaus, maakori 2',
		cspmb__One_Off_Charge__c: 5,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Avaus, maakori 2',
		CurrencyIsoCode: 'EUR'
	},
	{
		Id: 'a273E000000Azz1QAC',
		Name: 'Elisa Kansainv??linen liikenne, Dial-In, Avaus, maakori 3',
		cspmb__One_Off_Charge__c: 15,
		cspmb__Is_Authorization_Required__c: false,
		cspmb__Price_Item_Description__c: 'Avaus, maakori 3',
		CurrencyIsoCode: 'EUR'
	}
];

export const newFA = {
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
