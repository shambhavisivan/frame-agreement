import {
	commercialProducts,
	DiscLevels_general,
	frameAgreements,
	productData
} from '../local-server/local_data';
import { deforcify } from './deforcify';
import {
	AppSettings,
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement,
	UserLocaleInfo,
	FieldMetadata,
	Attachment,
	DeltaResult
} from './interfaces';
import {
	DispatcherToken,
	GraphQLResponse
} from '../datasources/graphql-endpoints/dispatcher-service';
import {
	CategoriesInCatalogueData,
	CommercialProductRole,
	CommercialProductType,
	ProductsByIdsData,
	ProductsInCategoryData
} from './graphql-endpoints/interface';
import { DiscountThreshold, FieldPickList } from '.';
import { Negotiation } from '../components/fa-details/negotiation/details-reducer';
import { PAGE_SIZES } from '../app-constants';

export const mockAppSettings: AppSettings = {
	account: {
		id: 'mockID',
		name: 'Cloudsense'
	},
	headerData: [],
	defaultCatalogueId: 'testCatalogueId000',
	customTabsData: {},
	buttonCustomData: {},
	buttonStandardData: { save: '*' },
	relatedListsData: {},
	addonCategorizationData: {},
	categorizationData: [
		{ name: 'Role', field: 'cspmb_role__c', values: ['Master', 'Package', 'Group'] }
	],
	facSettings: {
		statuses: {
			draftStatus: 'Draft',
			activeStatus: 'Active',
			closedStatus: 'Closed',
			approvedStatus: 'Approved',
			requiresApprovalStatus: 'Requires Approval'
		},
		dispatcherServiceUrl: 'https://cs-messaging-dispatcher-eu-dev.herokuapp.com',
		isPsEnabled: true,
		inputMinmaxRestriction: true,
		discountAsPrice: false,
		activeStatusManagement: true,
		faEditableStatuses: ['Draft', 'Requires Approval', 'Approved'],
		approversRevise: true
	}
};

export const mockFrameAgreements: FrameAgreement[] = frameAgreements.map(deforcify);

export const mockDiscountThresholds: DiscountThreshold[] = [
	{
		id: 'a1f4K0000002NaOQAU',
		name: 'Data Threshold',
		discountThresholdCode: 'data07',
		discountType: 'Percentage',
		authorizationLevel: 'a1P4K000008Ci07UAC',
		discountThreshold: 20
	},
	{
		id: 'a1f4K000000Put8QAC',
		name: 'Voice Threshold',
		discountThresholdCode: 'voice01',
		discountType: 'Amount',
		authorizationLevel: 'a1P4K000004UwUaUAK',
		discountThreshold: 10
	}
];

export const mockAuthLevels = {
	a1i4I000003Q4GGQA0: 'a1P4K000004UwUaUAK',
	a1i4I000003Kqe8QAC: 'a1P4K000004UwUaUAK',
	a1i4I000003KqdtQAC: 'a1P4K000004UwUaUAK',
	a1d4I000005Vx2RQAS: 'a1P4K000008Ci07UAC',
	a1d4I000005VsVYQA0: 'a1P4K000008Ci07UAC',
	a1d4I000005VvmoQAC: 'a1P4K000008Ci07UAC',
	a1d4I000005Vx2bQAC: 'a1P4K000008Ci07UAC',
	a1d4I000005Vx2gQAC: 'a1P4K000008Ci07UAC',
	a1N4I000002wyh9UAA: 'a1P4K000004UwUaUAK',
	a1N4I000002wyg0UAA: 'a1P4K000004UwUaUAK',
	a1q4I000009tfziQAA: 'a1P4K000004UwUaUAK',
	a1p4I00000Cn44DQAR: 'a1P4K000008Ci07UAC',
	a1p4I00000Cn42gQAB: 'a1P4K000008Ci07UAC'
};

export const mockCommercialProductData: CommercialProductData = {
	cpData: deforcify(productData),
	discThresh: mockDiscountThresholds,
	discLevels: DiscLevels_general.map((discWrap: SfGlobal.DiscLevelWrapper) => {
		return {
			...discWrap,
			discountLevel: deforcify(discWrap.discountLevel)
		};
	})
};

export const mockCommercialProducts: CommercialProductStandalone[] = commercialProducts.map(
	deforcify
);

export const mockOfferData: CommercialProductData = {
	cpData: deforcify(productData),
	discThresh: mockDiscountThresholds,
	discLevels: DiscLevels_general.map((discWrap: SfGlobal.DiscLevelWrapper) => {
		return {
			...discWrap,
			discountLevel: deforcify(discWrap.discountLevel)
		};
	})
};

export const mockOffers: CommercialProductStandalone[] = commercialProducts.map(deforcify);

export const mockDispatcherAuthToken: DispatcherToken = {
	orgId: 'some-org-id',
	expires: new Date(new Date().getTime() + 10 * 60000).getTime(),
	userAgent: navigator.userAgent,
	token: 'testToken'
};

export const mockUserLocale: UserLocaleInfo = {
	userLocaleLang: 'en',
	userLocaleCountry: 'GB',
	decimalSeparator: '.',
	currency: 'GBP'
};

export const faFieldMetadataMock: FieldMetadata[] = [
	{
		apiName: 'Id',
		fieldLabel: 'Record ID',
		fieldType: 'ID',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'OwnerId',
		fieldLabel: 'Owner ID',
		fieldType: 'REFERENCE',
		isCustom: false,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'IsDeleted',
		fieldLabel: 'Deleted',
		fieldType: 'BOOLEAN',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'Name',
		fieldLabel: 'Frame Agreement Sequence',
		fieldType: 'STRING',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'CreatedDate',
		fieldLabel: 'Created Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'CreatedById',
		fieldLabel: 'Created By ID',
		fieldType: 'REFERENCE',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastModifiedDate',
		fieldLabel: 'Last Modified Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastModifiedById',
		fieldLabel: 'Last Modified By ID',
		fieldType: 'REFERENCE',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'SystemModstamp',
		fieldLabel: 'System Modstamp',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastActivityDate',
		fieldLabel: 'Last Activity Date',
		fieldType: 'DATE',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastViewedDate',
		fieldLabel: 'Last Viewed Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastReferencedDate',
		fieldLabel: 'Last Referenced Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__Account__c',
		fieldLabel: 'Account',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__Agreement_Name__c',
		fieldLabel: 'Agreement Name',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__Main_Contact__c',
		fieldLabel: 'Main Contact',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__Pricing_Rule_Group__c',
		fieldLabel: 'Pricing Rule Group',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__Status__c',
		fieldLabel: 'Status',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__Valid_From__c',
		fieldLabel: 'Valid From',
		fieldType: 'DATE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__Valid_To__c',
		fieldLabel: 'Valid To',
		fieldType: 'DATE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__agreement_level__c',
		fieldLabel: 'Agreement Level',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__effective_end_date__c',
		fieldLabel: 'Effective End Date',
		fieldType: 'DATETIME',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__effective_start_date__c',
		fieldLabel: 'Effective Start Date',
		fieldType: 'DATETIME',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__frame_agreement_number__c',
		fieldLabel: 'Frame Agreement Number',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__master_frame_agreement__c',
		fieldLabel: 'Master Frame Agreement',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__replaced_by__c',
		fieldLabel: 'Replaced By',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'csconta__replaced_frame_agreement__c',
		fieldLabel: 'Replaced Frame Agreement',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'async_job__c',
		fieldLabel: 'Asynchronous Job',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	}
];

export const mockProductIds: string[] = mockCommercialProducts
	.slice(0, PAGE_SIZES[0])
	.map((mockProduct) => mockProduct.id);

export const mockProductsInCatalogueResponse: GraphQLResponse = {
	data: {
		productsInCatalogue: {
			data: [
				{
					id: mockProductIds[0],
					name: 'Mobile L offer',
					role: CommercialProductRole.offer,
					type: CommercialProductType.commercialProduct
				},
				{
					id: mockProductIds[1],
					name: 'Mobile XXL',
					role: CommercialProductRole.basic,
					type: CommercialProductType.commercialProduct
				}
			],
			hasMore: false,
			nextPage: null
		}
	},
	isSuccess: true
};

export const mockCategoriesInCatalogue: CategoriesInCatalogueData[] = [
	{ id: 'categoryid1', name: 'Mobile' },
	{ id: 'categoryid2', name: 'Laptop' }
];

export const mockCategoriesInCatalogueResponse: GraphQLResponse = {
	data: {
		categories: {
			data: mockCategoriesInCatalogue,
			hasMore: false,
			nextPage: null
		}
	},
	isSuccess: true
};

export const mockProductsInCategory: Record<string, ProductsInCategoryData[]> = {
	categoryid1: [
		{
			id: 'cpid-1',
			name: 'Samsung A7',
			type: CommercialProductType.commercialProduct,
			role: CommercialProductRole.basic,
			sequence: 1,
			primary: true
		},
		{
			id: 'cpid-2',
			name: 'Samsung A12',
			type: CommercialProductType.commercialProduct,
			role: CommercialProductRole.basic,
			sequence: 2,
			primary: false
		}
	],
	categoryid2: [
		{
			id: 'cpid-1',
			name: 'Apple Macbook Pro',
			type: CommercialProductType.commercialProduct,
			role: CommercialProductRole.basic,
			sequence: 3,
			primary: false
		},
		{
			id: 'cpid-2',
			name: 'Apple Airbook',
			type: CommercialProductType.commercialProduct,
			role: CommercialProductRole.basic,
			sequence: 4,
			primary: true
		}
	]
};

export const mockProductsInCategoryResponse: GraphQLResponse = {
	data: {
		productsInCategory: {
			data: mockProductsInCategory['categoryid1'],
			hasMore: false,
			nextPage: null
		}
	},
	isSuccess: true
};

export const mockOffersInCategory: Record<string, ProductsInCategoryData[]> = {
	categoryid1: [
		{
			id: 'ofid-1',
			name: 'Samsung A7',
			type: CommercialProductType.commercialProduct,
			role: CommercialProductRole.offer,
			sequence: 1,
			primary: true
		},
		{
			id: 'ofid-2',
			name: 'Samsung A12',
			type: CommercialProductType.commercialProduct,
			role: CommercialProductRole.offer,
			sequence: 2,
			primary: false
		}
	],
	categoryid2: [
		{
			id: 'ofid-1',
			name: 'Apple Macbook Pro',
			type: CommercialProductType.commercialProduct,
			role: CommercialProductRole.offer,
			sequence: 3,
			primary: false
		},
		{
			id: 'ofid-2',
			name: 'Apple Airbook',
			type: CommercialProductType.commercialProduct,
			role: CommercialProductRole.offer,
			sequence: 4,
			primary: true
		}
	]
};

export const mockOffersInCategoryResponse: GraphQLResponse = {
	data: {
		productsInCategory: {
			data: mockOffersInCategory['categoryid2'],
			hasMore: false,
			nextPage: null
		}
	},
	isSuccess: true
};

export const mockProductsByIds: ProductsByIdsData[] = [
	{
		id: 'a1F1t0000001J ̰BjEAM',
		name: 'Mobile L_6',
		availableChildProducts: [
			{
				product: {
					id: 'a1N4K000000YWSFUA4',
					name: 'AddOn #2',
					effectiveStartDate: null,
					effectiveEndDate: null,
					pricing: {
						listOneOffPrice: 10,
						listRecurringPrice: 12
					},
					customFields: [
						{
							key: 'OwnerId',
							value: '0054K000002lGpgQAE'
						},
						{
							key: 'IsDeleted',
							value: 'false'
						},
						{
							key: 'attributes',
							value:
								'{"url":"/services/data/v43.0/sobjects/cspmb__Add_On_Price_Item__c/a1N4K000000YWSFUA4","type":"cspmb__Add_On_Price_Item__c"}'
						},
						{
							key: 'CreatedById',
							value: '0054K000002lGpgQAE'
						},
						{
							key: 'CreatedDate',
							value: '2021-01-28T09:26:30.000+0000'
						},
						{
							key: 'Test_Field__c',
							value: 'Test value'
						},
						{
							key: 'LastViewedDate',
							value: '2021-04-14T00:57:53.000+0000'
						},
						{
							key: 'SystemModstamp',
							value: '2021-04-08T05:38:29.000+0000'
						},
						{
							key: 'LastActivityDate',
							value: 'null'
						},
						{
							key: 'LastModifiedById',
							value: '0054K000002lGpgQAE'
						},
						{
							key: 'LastModifiedDate',
							value: '2021-04-08T05:38:29.000+0000'
						},
						{
							key: 'cspmb__Account__c',
							value: 'null'
						},
						{
							key: 'LastReferencedDate',
							value: '2021-04-14T00:57:53.000+0000'
						},
						{
							key: 'cspmb__Is_Active__c',
							value: 'true'
						},
						{
							key: 'cspmb__One_Off_Cost__c',
							value: 'null'
						},
						{
							key: 'cspmb__Currency_Code__c',
							value: 'null'
						},
						{
							key: 'cspmb__Discount_Type__c',
							value: 'null'
						},
						{
							key: 'cspmb__Recurring_Cost__c',
							value: 'null'
						},
						{
							key: 'cspmb__Version_Number__c',
							value: 'null'
						},
						{
							key: 'cspmb__Current_Version__c',
							value: 'null'
						},
						{
							key: 'cspmb__Authorization_Level__c',
							value: 'null'
						},
						{
							key: 'cspmb__One_Off_Charge_Code__c',
							value: 'null'
						},
						{
							key: 'cspmb__Recurring_Charge_Code__c',
							value: 'null'
						},
						{
							key: 'cspmb__Product_Definition_Name__c',
							value: 'null'
						},
						{
							key: 'cspmb__Is_Authorization_Required__c',
							value: 'false'
						},
						{
							key: 'cspmb__One_Off_Charge_External_Id__c',
							value: 'null'
						},
						{
							key: 'cspmb__Is_One_Off_Discount_Allowed__c',
							value: 'true'
						},
						{
							key: 'cspmb__Rec ̰ring_Charge_External_Id__c',
							value: 'null'
						},
						{
							key: 'cspmb__Is_Recurring_Discount_Allowed__c',
							value: 'true'
						},
						{
							key: 'cspmb__Apply_One_Off_Charge_Account_Discount__c',
							value: 'false'
						},
						{
							key: 'cspmb__Apply_Recurring_Charge_Account_Discount__c',
							value: 'false'
						}
					]
				},
				externalIds: [
					{
						key: 'associationSfId',
						value: 'a1k4K000001Rn8rQAC'
					}
				],
				group: null
			}
		],
		commercialProductMetadata: {
			attributeMetadata: {
				version: '2-0-0',
				attributes: [
					{
						name: 'Colour',
						values: [
							{
								value: 'Midnight Green'
							},
							{
								value: 'SpaceGrey'
							},
							{
								value: 'Silver'
							},
							{
								value: 'Gold'
							}
						]
					},
					{
						name: 'Memory',
						values: [
							{
								value: '64'
							},
							{
								value: '128'
							}
						]
					}
				]
			}
		}
	}
];

export const mockProductsByIdsResponse: GraphQLResponse = {
	isSuccess: true,
	data: {
		getProductsByIdentifiers: mockProductsByIds
	}
};

/* eslint-disable */
export const CUSTOM_LABELS_MOCK: SfGlobal.CustomLabelsSf = {
	alert_cloneFa_btn_action: 'Clone',
	alert_cloneFa_message: 'Are you sure you want to clone this frame agreement?',
	alert_cloneFa_title: 'Clone Frame Agreement',
	alert_deleteAgreements_message: 'Are you sure you want to delete selected agreement(s)?',
	alert_deleteAgreements_title: 'Delete agreement(s)',
	btn_DeleteAgreements: 'Delete',
	frame_agreements_title: 'Frame Agreements',
	filter_text_warning_message: 'Enter atleast 3 or more characters to begin search.',
	fa_none: 'none',
	approval_action_approve: 'Approve',
	approval_action_reassign: 'Reassign',
	approval_action_recall: 'Recall',
	approval_action_reject: 'Reject',
	approval_message_placeholder: 'Enter comment...',
	approval_message_title: 'Comment',
	approval_table_header_action: 'Action',
	approval_table_header_actualApprover: 'Actual Approver',
	approval_table_header_assignedTo: 'Assigned to',
	approval_table_header_comments: 'Comments',
	approval_table_header_date: 'Date',
	approval_table_header_status: 'Status',
	approval_title: 'Approval history',
	btn_Delta: 'Show Delta',
	delta_title: 'Delta Modal',
	btn_CalcDelta: 'Calculate Delta',
	btn_Close: 'Close',
	source_fa: 'Source Agreement',
	target_fa: 'Target Agreement',
	btn_delta_switch_fa: 'Switch To FA',
	delta_fa_fields: 'Frame Agreement Fields',
	products_title: 'Products',
	delta_status_added: 'added',
	delta_status_changed: 'changed',
	delta_status_removed: 'removed',
	delta_status_unchanged: 'unchanged',
	addons_header_oneOff: 'One Off Charge',
	addons_header_recc: 'Recurring Charge',
	fa_volume: 'Volume',
	products_charges: 'Charges',
	products_rates: 'Rate card',
	addon_label: 'Addons',
	btn_AddProducts: 'Add Products',
	modal_addFa_title: 'Add Product to Frame Agreement',
	modal_categorization_btn_add: 'Add Selected',
	modal_categorization_btn_apply: 'Apply Filter',
	modal_categorization_title: 'Product Categorization',
	modal_categorization_btn_clear: 'Clear Filter',
	no_categories_available: 'No categories associated with the catalogue',
	addons_tab_title: 'Standalone Addons',
	offers_tab_title: 'Offers',
	dropdown_no_selection: '--none',
	addons_header_name: 'Name',
	addons_header_oneOff_neg: 'Negotiated One Off',
	addons_header_recc_neg: 'Negotiated Recurring',
	btn_Save: 'Save',
	modal_unsavedChanges_alert: 'You have unsaved changes, are you sure you want to leave?',
	toast_saved_fa: 'Successfuly saved frame agreement!',
	btn_ok: 'Ok',
	incorrect_fa: 'Input frame agreement is either incorrect or not found',
	no_active_fa: 'No active frame agreement in fa editor.',
	not_the_active_fa: 'This is not the current active fa/ fa id.',
	charges_header_name: 'Charges',
	charges_header_neg: 'Negotiated One Off',
	charges_header_oneOff: 'One Off Adjustment',
	charges_header_recc: 'Recurring Adjustment',
	charges_header_recc_neg: 'Negotiated Recurring',
	charges_header_type: 'Charge Type',
	product_charge_header_name: 'Product Charges',
	product_charge_header_oneOff: 'One-Off Adjustment',
	product_charge_header_oneOff_neg: 'Negotiated One Off',
	product_charge_header_recc: 'Recurring Adjustment',
	product_charge_header_recc_neg: 'Negotiated Recurring',
	one_off_product: 'One-off Charge (Product)',
	recurring_product: 'Recurring charge (Product)',
	btn_AddAddons: 'Add Addons',
	btn_DeleteAddons: 'Delete AddOns',
	btn_DeleteProducts: 'Delete Products',
	btn_DeleteOffers: 'Delete Offers',
	modal_addAddons_title: 'Add stand-alone Add Ons',
	modal_addAddons_input_search_placeholder: 'Filter Addons',
	toast_decomposition_title_success: 'Decomposition succeeded!',
	toast_decomposition_success: 'Created associations',
	toast_decomposition_title_failed: 'Decomposition failed!',
	toast_decomposition_failed: 'Deleting associations made from this attempt',
	deletion_confirmation: 'Are you sure you want to delete the selected'
};
/* eslint-enable */

export const attachment: Attachment = {
	custom: {},
	products: {
		a1F1t0000001JBoEAM: {
			volume: {
				mv: null,
				mvp: null,
				muc: null,
				mucp: null
			},
			product: {
				oneOff: 500,
				recurring: 255
			},
			allowances: {}
		},
		a1F1t0000001JBZEA2: {
			volume: {
				mv: null,
				mvp: null,
				muc: null,
				mucp: null
			},
			addons: {
				a1d4I000005Vx2RQAS: {
					oneOff: null,
					recurring: null
				}
			},
			charges: {
				a1l4I00000AFilFQAT: {
					recurring: 5.5,
					oneOff: 15.5
				}
			},
			allowances: {
				a1O4I000001Hg1yUAC: {
					name: 'Roaming Data in TOP Destinations abd rest of the world',
					value: 1
				}
			}
		},
		a1F1t0000001JBUEA2: {
			volume: {
				mv: null,
				mvp: null,
				muc: null,
				mucp: null
			},
			addons: {
				a1d4I000005VsVYQA0: {
					oneOff: 20,
					recurring: 5
				},
				a1d4I000005VvmoQAC: {
					oneOff: 8,
					recurring: 2
				},
				a1d4I000005Vx2bQAC: {
					oneOff: 15,
					recurring: 5
				},
				a1d4I000005Vx2gQAC: {
					oneOff: null,
					recurring: null
				}
			},
			charges: {
				a1l4I00000Du1O3QAJ: {
					recurring: 4
				},
				a1l4I00000Du1a0QAB: {
					oneOff: 10
				}
			},
			rateCards: {
				a1q4I000009tfziQAA: {
					a1p4I00000Cn44DQAR: 100,
					a1p4I00000Cn42gQAB: 85.5
				}
			},
			allowances: {
				a1O4I000001H6FfUAK: {
					name: 'Mobile Tariff Test Offer',
					value: 7
				},
				a1O4I000001Hg28UAC: {
					name: 'Roaming Voice calls in TOP Destinations abd rest of the world',
					value: 2
				},
				a1O4I000001Hg1yUAC: {
					name: 'Roaming Data in TOP Destinations abd rest of the world',
					value: 1
				}
			}
		}
	},
	addons: {
		a1N4I000002wyh9UAA: {
			oneOff: 7,
			recurring: 1.5
		},
		a1N4I000002wyg0UAA: {
			oneOff: 15,
			recurring: 5
		}
	}
};

export const mockNegotiationState: Negotiation['negotiation'] = {
	products: {
		a1i4I000003Q4GGQA0: {
			volume: {
				mv: null,
				mvp: null,
				muc: null,
				mucp: null
			},
			product: {
				oneOff: { original: 500, negotiated: 500 },
				recurring: { original: 255, negotiated: 255 }
			},
			rateCards: {},
			addons: {}
		},
		a1i4I000003Kqe8QAC: {
			volume: {
				mv: null,
				mvp: null,
				muc: null,
				mucp: null
			},
			addons: {
				a1d4I000005Vx2RQAS: {
					oneOff: { original: 5, negotiated: undefined },
					recurring: { original: 1, negotiated: undefined }
				}
			},
			charges: {
				a1l4I00000AFilFQAT: {
					recurring: { original: 5.5, negotiated: undefined },
					oneOff: { original: 15.5, negotiated: undefined }
				}
			},
			rateCards: {},
			product: {
				oneOff: { original: 50, negotiated: undefined },
				recurring: { original: 8, negotiated: undefined }
			},
			allowances: {
				a1O4K000001upTpUAI: {
					name: 'Special Outgoing Bonus',
					value: 300
				},
				a1O4K000001ukAhUAI: {
					name: '20 min allowance',
					value: 10
				}
			}
		},
		a1i4I000003KqdtQAC: {
			volume: {
				mv: null,
				mvp: null,
				muc: null,
				mucp: null
			},
			addons: {
				a1d4I000005VsVYQA0: {
					oneOff: { original: 20, negotiated: undefined },
					recurring: { original: 5, negotiated: undefined }
				},
				a1d4I000005VvmoQAC: {
					oneOff: { original: 8, negotiated: undefined },
					recurring: { original: 2, negotiated: undefined }
				},
				a1d4I000005Vx2bQAC: {
					oneOff: { original: 15, negotiated: undefined },
					recurring: { original: 5, negotiated: undefined }
				},
				a1d4I000005Vx2gQAC: {
					oneOff: { original: 5, negotiated: undefined },
					recurring: { original: 1, negotiated: undefined }
				}
			},
			charges: {
				a1l4I00000Du1O3QAJ: {
					recurring: { original: 4, negotiated: undefined },
					oneOff: { original: 6, negotiated: undefined }
				},
				a1l4I00000Du1a0QAB: {
					oneOff: { original: 10, negotiated: undefined },
					recurring: { original: 1, negotiated: undefined }
				}
			},
			rateCards: {
				a1q4I000009tfziQAA: {
					rateCardLines: {
						a1p4I00000Cn44DQAR: { original: 100, negotiated: undefined },
						a1p4I00000Cn42gQAB: { original: 85.5, negotiated: undefined }
					},
					authId: 'a1P4K000008Ci07UAC'
				}
			},
			product: {
				oneOff: { original: 7, negotiated: undefined },
				recurring: { original: 1, negotiated: undefined }
			}
		}
	},
	addons: {
		a1N4I000002wyh9UAA: {
			oneOff: { original: 7, negotiated: undefined },
			recurring: { original: 1.5, negotiated: undefined }
		},
		a1N4I000002wyg0UAA: {
			oneOff: { original: 15, negotiated: undefined },
			recurring: { original: 5, negotiated: undefined }
		}
	},
	offers: {},
	custom: { customKey: 'customValue' }
};

export const DELTA_CALC_RESULT_MOCK: DeltaResult = {
	account: {
		newValue: '0014K000006gUwFQAU',
		oldValue: '0014K000006gUwFQAU',
		status: 'unchanged'
	},
	agreementName: {
		newValue: 'FA2',
		oldValue: 'FA1',
		status: 'changed'
	},
	status: {
		newValue: 'Draft',
		oldValue: 'Draft',
		status: 'unchanged'
	},
	agreementLevel: {
		newValue: 'Frame Agreement',
		oldValue: 'Frame Agreement',
		status: 'unchanged'
	},
	addons: {
		a1P4K0000023YXoUAM: {
			oneOff: {
				newValue: 20,
				oldValue: 63,
				status: 'changed'
			},
			recurring: {
				newValue: 76,
				oldValue: 45,
				status: 'changed'
			},
			status: 'changed'
		},
		a1P4K0000023YXjUAM: {
			oneOff: {
				newValue: 250,
				oldValue: 250,
				status: 'unchanged'
			},
			recurring: {
				newValue: 500,
				oldValue: 500,
				status: 'unchanged'
			},
			status: 'unchanged'
		}
	},
	products: {
		a1q4K000000H6wSQAS: 'removed',
		a1q4K000000H6wTQAS: 'removed',
		a1q4K000000H6wLQAS: 'added',
		a1q4K000000H6wMQAS: 'added',
		a1q4K000000H6wNQAS: 'added',
		a1q4K000000H6wNQAZ: {
			product: {
				oneOff: {
					oldValue: 30,
					newValue: 50,
					status: 'changed'
				},
				recurring: {
					oldValue: 60,
					newValue: 60,
					status: 'unchanged'
				},
				status: 'changed'
			},
			addons: {
				'sample-id': {
					oneOff: {
						oldValue: 30,
						newValue: 50,
						status: 'changed'
					},
					recurring: {
						oldValue: 60,
						newValue: 60,
						status: 'unchanged'
					},
					status: 'changed'
				}
			},
			charges: {
				'sample-id': {
					oneOff: {
						oldValue: 30,
						newValue: 50,
						status: 'changed'
					},
					recurring: {
						oldValue: 60,
						newValue: 60,
						status: 'unchanged'
					},
					status: 'changed'
				}
			},
			rateCard: {
				'sample-id': {
					oneOff: {
						oldValue: 350,
						newValue: 50,
						status: 'changed'
					},
					recurring: {
						oldValue: 600,
						newValue: 600,
						status: 'unchanged'
					},
					status: 'changed'
				}
			},
			volume: {
				muc: {
					oldValue: 3,
					newValue: 8,
					status: 'changed'
				},
				mv: {
					oldValue: 30,
					newValue: 18,
					status: 'changed'
				},
				mucp: {
					oldValue: 30,
					newValue: 30,
					status: 'unchanged'
				},
				mvp: {
					oldValue: 50,
					newValue: 80,
					status: 'changed'
				}
			}
		}
	}
};

export const CP_FIELD_METADATA: FieldMetadata[] = [
	{
		apiName: 'Id',
		fieldLabel: 'Record ID',
		fieldType: 'ID',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'OwnerId',
		fieldLabel: 'Owner ID',
		fieldType: 'REFERENCE',
		isCustom: false,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'IsDeleted',
		fieldLabel: 'Deleted',
		fieldType: 'BOOLEAN',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'Name',
		fieldLabel: 'Commercial Product Name',
		fieldType: 'STRING',
		isCustom: false,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'CreatedDate',
		fieldLabel: 'Created Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'CreatedById',
		fieldLabel: 'Created By ID',
		fieldType: 'REFERENCE',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastModifiedDate',
		fieldLabel: 'Last Modified Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastModifiedById',
		fieldLabel: 'Last Modified By ID',
		fieldType: 'REFERENCE',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'SystemModstamp',
		fieldLabel: 'System Modstamp',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastViewedDate',
		fieldLabel: 'Last Viewed Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastReferencedDate',
		fieldLabel: 'Last Referenced Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Account__c',
		fieldLabel: 'Account',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Apply_One_Off_Charge_Account_Discount__c',
		fieldLabel: 'Apply One-Off Charge Account Discount',
		fieldType: 'BOOLEAN',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Apply_Recurring_Charge_Account_Discount__c',
		fieldLabel: 'Apply Recurring Charge Account Discount',
		fieldType: 'BOOLEAN',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Authorization_Level__c',
		fieldLabel: 'Authorization Level',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Billing_Frequency__c',
		fieldLabel: 'Billing Frequency',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Contract_Term__c',
		fieldLabel: 'Contract Term',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Currency_Code__c',
		fieldLabel: 'Currency Code',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Current_Version__c',
		fieldLabel: 'Current Version',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Discount_Type__c',
		fieldLabel: 'Discount Type',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Effective_End_Date__c',
		fieldLabel: 'Effective End Date',
		fieldType: 'DATE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Effective_Start_Date__c',
		fieldLabel: 'Effective Start Date',
		fieldType: 'DATE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Is_Active__c',
		fieldLabel: 'Is Active',
		fieldType: 'BOOLEAN',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Is_Authorization_Required__c',
		fieldLabel: 'Is Authorization Required',
		fieldType: 'BOOLEAN',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Is_One_Off_Discount_Allowed__c',
		fieldLabel: 'Is One-Off Discount Allowed',
		fieldType: 'BOOLEAN',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Is_Recurring_Discount_Allowed__c',
		fieldLabel: 'Is Recurring Discount Allowed',
		fieldType: 'BOOLEAN',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Master_Price_item__c',
		fieldLabel: 'Master Commercial Product',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__One_Off_Charge_Code__c',
		fieldLabel: 'One-Off Charge Code',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__One_Off_Charge_External_Id__c',
		fieldLabel: 'One-Off Charge External Id',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__One_Off_Charge__c',
		fieldLabel: 'One-Off Charge',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 18,
		scale: 2,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__One_Off_Cost__c',
		fieldLabel: 'One-Off Cost',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 18,
		scale: 2,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Price_Item_Code__c',
		fieldLabel: 'Commercial Product Code',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Price_Item_Description__c',
		fieldLabel: 'Commercial Product Description',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Product_Definition_Name__c',
		fieldLabel: 'Product Definition Name',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Recurring_Charge_Code__c',
		fieldLabel: 'Recurring Charge Code',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Recurring_Charge_External_Id__c',
		fieldLabel: 'Recurring Charge External Id',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Recurring_Charge__c',
		fieldLabel: 'Recurring Charge',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 18,
		scale: 2,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Recurring_Cost__c',
		fieldLabel: 'Recurring Cost',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 18,
		scale: 2,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Role__c',
		fieldLabel: 'Role',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Version_Number__c',
		fieldLabel: 'Version Number',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 18,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__auto_packaging_priority__c',
		fieldLabel: 'Auto Packaging Priority',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 5,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'rate_card_line__c',
		fieldLabel: 'Rate Card Line',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Type__c',
		fieldLabel: 'Type',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__metadata__c',
		fieldLabel: 'Metadata',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__offer_code__c',
		fieldLabel: 'Offer Code',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	}
];

export const productsInCategoryMock: ProductsInCategoryData[] = [
	{
		id: 'cpid-1',
		name: 'Samsung A7',
		role: CommercialProductRole.basic,
		type: CommercialProductType.commercialProduct,
		sequence: 1,
		primary: true
	},
	{
		id: 'cpid-2',
		name: 'Samsung A12',
		role: CommercialProductRole.basic,
		type: CommercialProductType.commercialProduct,
		sequence: 1,
		primary: false
	}
];

export const categoriesInCatalogue: CategoriesInCatalogueData[] = [
	{
		id: 'cat-1',
		name: 'Mobile Phones'
	},
	{
		id: 'cat-2',
		name: 'Laptop'
	}
];

export const ADDON_METADATA: FieldMetadata[] = [
	{
		apiName: 'Id',
		fieldLabel: 'Record ID',
		fieldType: 'ID',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'OwnerId',
		fieldLabel: 'Owner ID',
		fieldType: 'REFERENCE',
		isCustom: false,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'IsDeleted',
		fieldLabel: 'Deleted',
		fieldType: 'BOOLEAN',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'Name',
		fieldLabel: 'Add On Name',
		fieldType: 'STRING',
		isCustom: false,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'CreatedDate',
		fieldLabel: 'Created Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'CreatedById',
		fieldLabel: 'Created By ID',
		fieldType: 'REFERENCE',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastModifiedDate',
		fieldLabel: 'Last Modified Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastModifiedById',
		fieldLabel: 'Last Modified By ID',
		fieldType: 'REFERENCE',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'SystemModstamp',
		fieldLabel: 'System Modstamp',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastActivityDate',
		fieldLabel: 'Last Activity Date',
		fieldType: 'DATE',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastViewedDate',
		fieldLabel: 'Last Viewed Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'LastReferencedDate',
		fieldLabel: 'Last Referenced Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Account__c',
		fieldLabel: 'Account',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Add_On_Price_Item_Code__c',
		fieldLabel: 'Add On Code',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Add_On_Price_Item_Description__c',
		fieldLabel: 'Add On Description',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Apply_One_Off_Charge_Account_Discount__c',
		fieldLabel: 'Apply One-Off Charge Account Discount',
		fieldType: 'BOOLEAN',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Apply_Recurring_Charge_Account_Discount__c',
		fieldLabel: 'Apply Recurring Charge Account Discount',
		fieldType: 'BOOLEAN',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Authorization_Level__c',
		fieldLabel: 'Authorization Level',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Billing_Frequency__c',
		fieldLabel: 'Billing Frequency',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Contract_Term__c',
		fieldLabel: 'Contract Term',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Currency_Code__c',
		fieldLabel: 'Currency Code',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Current_Version__c',
		fieldLabel: 'Current Version',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Discount_Type__c',
		fieldLabel: 'Discount Type',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Effective_End_Date__c',
		fieldLabel: 'Effective End Date',
		fieldType: 'DATE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Effective_Start_Date__c',
		fieldLabel: 'Effective Start Date',
		fieldType: 'DATE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Is_Active__c',
		fieldLabel: 'Is Active',
		fieldType: 'BOOLEAN',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Is_Authorization_Required__c',
		fieldLabel: 'Is Authorization Required',
		fieldType: 'BOOLEAN',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Is_One_Off_Discount_Allowed__c',
		fieldLabel: 'Is One-Off Discount Allowed',
		fieldType: 'BOOLEAN',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Is_Recurring_Discount_Allowed__c',
		fieldLabel: 'Is Recurring Discount Allowed',
		fieldType: 'BOOLEAN',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__One_Off_Charge_Code__c',
		fieldLabel: 'One-Off Charge Code',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__One_Off_Charge_External_Id__c',
		fieldLabel: 'One-Off Charge External Id',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__One_Off_Charge__c',
		fieldLabel: 'One-Off Charge',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 18,
		scale: 2,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__One_Off_Cost__c',
		fieldLabel: 'One-Off Cost',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 18,
		scale: 2,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Product_Definition_Name__c',
		fieldLabel: 'Product Definition Name',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Recurring_Charge_Code__c',
		fieldLabel: 'Recurring Charge Code',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Recurring_Charge_External_Id__c',
		fieldLabel: 'Recurring Charge External Id',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Recurring_Charge__c',
		fieldLabel: 'Recurring Charge',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 18,
		scale: 2,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Recurring_Cost__c',
		fieldLabel: 'Recurring Cost',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 18,
		scale: 2,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Sequence__c',
		fieldLabel: 'Sequence',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 18,
		scale: 0,
		referenceObjects: null
	},
	{
		apiName: 'cspmb__Version_Number__c',
		fieldLabel: 'Version Number',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 18,
		scale: 0,
		referenceObjects: null
	}
];

export const lookupRecords = [
	{ name: 'Edge Communications', type: 'Customer - Direct', id: '0014K00000Bxld5QAB' },
	{
		name: 'Burlington Textiles Corp of America',
		type: 'Customer - Direct',
		id: '0014K00000Bxld6QAB'
	},
	{ name: 'Pyramid Construction Inc.', type: 'Customer - Channel', id: '0014K00000Bxld7QAB' },
	{ name: 'Dickenson plc', type: 'Customer - Channel', id: '0014K00000Bxld8QAB' },
	{ name: 'Grand Hotels & Resorts Ltd', type: 'Customer - Direct', id: '0014K00000Bxld9QAB' },
	{ name: 'United Oil & Gas Corp.', type: 'Customer - Direct', id: '0014K00000BxldAQAR' },
	{
		name: 'Express Logistics and Transport',
		type: 'Customer - Channel',
		id: '0014K00000BxldBQAR'
	},
	{ name: 'University of Arizona', type: 'Customer - Direct', id: '0014K00000BxldCQAR' },
	{ name: 'United Oil & Gas, UK', type: 'Customer - Direct', id: '0014K00000BxldDQAR' },
	{ name: 'United Oil & Gas, Singapore', type: 'Customer - Direct', id: '0014K00000BxldEQAR' },
	{ name: 'GenePoint', type: 'Customer - Channel', id: '0014K00000BxldFQAR' },
	{ name: 'sForce', id: '0014K00000BxldGQAR' },
	{ name: 'Wayne Enterprices', id: '0014K00000DGtowQAD' },
	{ name: 'Customer Account', id: '0014K00000HTPJRQA5' },
	{ name: 'Partner Account', id: '0014K00000I4Kd9QAF' },
	{ name: 'Test', id: '0014K00000I4c4UQAR' }
];

export const lookupRecordFieldMetadata: Array<FieldMetadata> = [
	{
		apiName: 'id',
		fieldLabel: 'Account ID',
		fieldType: 'ID',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		referenceObjects: [],
		scale: 0
	},
	{
		apiName: 'name',
		fieldLabel: 'Account Name',
		fieldType: 'STRING',
		isCustom: false,
		isUpdatable: true,
		precision: 0,
		referenceObjects: [],
		scale: 0
	},
	{
		apiName: 'type',
		fieldLabel: 'Account Type',
		fieldType: 'PICKLIST',
		isCustom: false,
		isUpdatable: true,
		precision: 0,
		referenceObjects: [],
		scale: 0
	},
	{
		apiName: 'parentId',
		fieldLabel: 'Parent Account ID',
		fieldType: 'REFERENCE',
		isCustom: false,
		isUpdatable: true,
		precision: 0,
		referenceObjects: ['Account'],
		scale: 0
	},
	{
		apiName: 'accountNumber',
		fieldLabel: 'Account Number',
		fieldType: 'STRING',
		isCustom: false,
		isUpdatable: true,
		precision: 0,
		referenceObjects: [],
		scale: 0
	}
];

export const pickListOptions: FieldPickList = {
	agreementLevel: [
		{
			label: 'Master Agreement',
			value: 'Master Agreement'
		},
		{
			label: 'Frame Agreement',
			value: 'Frame Agreement'
		}
	],
	status: [
		{
			label: 'Open',
			value: 'Open'
		},
		{
			label: 'Closed',
			value: 'Closed'
		}
	]
};
