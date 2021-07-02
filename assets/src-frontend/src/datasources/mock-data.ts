import { commercialProducts, frameAgreements, productData } from '../local-server/local_data';
import { deforcify } from './deforcify';
import {
	AppSettings,
	CommercialProductData,
	CommercialProductStandalone,
	FrameAgreement,
	UserLocaleInfo,
	FieldMetadata
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

export const mockAppSettings: AppSettings = {
	account: {
		id: 'mockID',
		name: 'Cloudsense'
	},
	headerData: {},
	defaultCatalogueId: 'testCatalogueId000',
	customTabsData: {},
	buttonCustomData: {},
	buttonStandardData: {},
	relatedListsData: {},
	addonCategorizationData: {},
	categorizationData: {},
	facSettings: {
		statuses: {
			draftStatus: 'Draft',
			activeStatus: 'Active',
			closedStatus: 'Closed',
			approvedStatus: 'Approved',
			requiresApprovalStatus: 'Requires Approval'
		},
		dispatcherServiceUrl: 'https://cs-messaging-dispatcher-eu-dev.herokuapp.com'
	}
};

export const mockFrameAgreements: FrameAgreement[] = frameAgreements.map(deforcify);

export const mockCommercialProductData: CommercialProductData = {
	cpData: deforcify(productData)
};

export const mockCommercialProducts: CommercialProductStandalone[] = commercialProducts.map(
	deforcify
);

export const mockOfferData: CommercialProductData = {
	cpData: deforcify(productData)
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
	decimalSeparator: '.'
};

export const faFieldMetadataMock: FieldMetadata[] = [
	{
		apiName: 'Id',
		fieldLabel: 'Record ID',
		fieldType: 'ID',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'OwnerId',
		fieldLabel: 'Owner ID',
		fieldType: 'REFERENCE',
		isCustom: false,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'IsDeleted',
		fieldLabel: 'Deleted',
		fieldType: 'BOOLEAN',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'Name',
		fieldLabel: 'Frame Agreement Sequence',
		fieldType: 'STRING',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'CreatedDate',
		fieldLabel: 'Created Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'CreatedById',
		fieldLabel: 'Created By ID',
		fieldType: 'REFERENCE',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'LastModifiedDate',
		fieldLabel: 'Last Modified Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'LastModifiedById',
		fieldLabel: 'Last Modified By ID',
		fieldType: 'REFERENCE',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'SystemModstamp',
		fieldLabel: 'System Modstamp',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'LastActivityDate',
		fieldLabel: 'Last Activity Date',
		fieldType: 'DATE',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'LastViewedDate',
		fieldLabel: 'Last Viewed Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'LastReferencedDate',
		fieldLabel: 'Last Referenced Date',
		fieldType: 'DATETIME',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Account__c',
		fieldLabel: 'Account',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Agreement_Name__c',
		fieldLabel: 'Agreement Name',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Main_Contact__c',
		fieldLabel: 'Main Contact',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Pricing_Rule_Group__c',
		fieldLabel: 'Pricing Rule Group',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Status__c',
		fieldLabel: 'Status',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Valid_From__c',
		fieldLabel: 'Valid From',
		fieldType: 'DATE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Valid_To__c',
		fieldLabel: 'Valid To',
		fieldType: 'DATE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__agreement_level__c',
		fieldLabel: 'Agreement Level',
		fieldType: 'PICKLIST',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__effective_end_date__c',
		fieldLabel: 'Effective End Date',
		fieldType: 'DATETIME',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__effective_start_date__c',
		fieldLabel: 'Effective Start Date',
		fieldType: 'DATETIME',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__frame_agreement_number__c',
		fieldLabel: 'Frame Agreement Number',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__master_frame_agreement__c',
		fieldLabel: 'Master Frame Agreement',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__replaced_by__c',
		fieldLabel: 'Replaced By',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__replaced_frame_agreement__c',
		fieldLabel: 'Replaced Frame Agreement',
		fieldType: 'REFERENCE',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'async_job__c',
		fieldLabel: 'Asynchronous Job',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: false,
		precision: 0,
		scale: 0
	}
];

export const mockProductIds: string[] = ['id-1', 'id-2'];

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
		productsByIds: mockProductsByIds
	}
};
