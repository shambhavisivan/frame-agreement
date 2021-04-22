const productIds = ["id-1", "id-2"];

export const queryCpIdsInCatalogue = async () => {
	return new Promise((resolve) => {
		resolve(productIds);
	});
};

const categoriesInCatalogue = [
	{ id: "categoryid1", name: "Mobile" },
	{ id: "categoryid1", name: "Laptop" },
];

export const queryCategoriesInCatalogue = async (catalogueId = null) => {
	return new Promise((resolve) => {
		resolve(categoriesInCatalogue);
	});
};

const productsInCategory = {
	categoryid1: [
		{ id: "cpid-1", name: "Samsung A7" },
		{ id: "cpid-2", name: "Samsung A12" },
	],
	categoryid2: [
		{ id: "cpid-1", name: "Apple Macbook Pro" },
		{ id: "cpid-2", name: "Apple Airbook" },
	],
};

export const queryProductsInCategory = async (categoryId) => {
	return new Promise((resolve) => {
		resolve(productsInCategory[categoryId]);
	});
};

const offersInCategory = {
	categoryid1: [
		{ id: "ofid-1", name: "Samsung A7" },
		{ id: "ofid-2", name: "Samsung A12" },
	],
	categoryid2: [
		{ id: "ofid-1", name: "Apple Macbook Pro" },
		{ id: "ofid-2", name: "Apple Airbook" },
	],
};

export const queryOffersInCategory = async categoryId => {
	return Promise.resolve(offersInCategory[categoryId]);
}

export const queryOfferIdsInCatalogue = () => Promise.resolve(productIds);

const cpMetadata = [
	{
		id: "a1F1t0000001J ̰BjEAM",
		name: "Mobile L_6",
		availableChildProducts: [
			{
				product: {
					id: "a1N4K000000YWSFUA4",
					name: "AddOn #2",
					effectiveStartDate: null,
					effectiveEndDate: null,
					pricing: {
						listOneOffPrice: 10,
						listRecurringPrice: 12,
					},
					customFields: [
						{
							key: "OwnerId",
							value: "0054K000002lGpgQAE",
						},
						{
							key: "IsDeleted",
							value: "false",
						},
						{
							key: "attributes",
							value:
								'{"url":"/services/data/v43.0/sobjects/cspmb__Add_On_Price_Item__c/a1N4K000000YWSFUA4","type":"cspmb__Add_On_Price_Item__c"}',
						},
						{
							key: "CreatedById",
							value: "0054K000002lGpgQAE",
						},
						{
							key: "CreatedDate",
							value: "2021-01-28T09:26:30.000+0000",
						},
						{
							key: "Test_Field__c",
							value: "Test value",
						},
						{
							key: "LastViewedDate",
							value: "2021-04-14T00:57:53.000+0000",
						},
						{
							key: "SystemModstamp",
							value: "2021-04-08T05:38:29.000+0000",
						},
						{
							key: "LastActivityDate",
							value: "null",
						},
						{
							key: "LastModifiedById",
							value: "0054K000002lGpgQAE",
						},
						{
							key: "LastModifiedDate",
							value: "2021-04-08T05:38:29.000+0000",
						},
						{
							key: "cspmb__Account__c",
							value: "null",
						},
						{
							key: "LastReferencedDate",
							value: "2021-04-14T00:57:53.000+0000",
						},
						{
							key: "cspmb__Is_Active__c",
							value: "true",
						},
						{
							key: "cspmb__One_Off_Cost__c",
							value: "null",
						},
						{
							key: "cspmb__Currency_Code__c",
							value: "null",
						},
						{
							key: "cspmb__Discount_Type__c",
							value: "null",
						},
						{
							key: "cspmb__Recurring_Cost__c",
							value: "null",
						},
						{
							key: "cspmb__Version_Number__c",
							value: "null",
						},
						{
							key: "cspmb__Current_Version__c",
							value: "null",
						},
						{
							key: "cspmb__Authorization_Level__c",
							value: "null",
						},
						{
							key: "cspmb__One_Off_Charge_Code__c",
							value: "null",
						},
						{
							key: "cspmb__Recurring_Charge_Code__c",
							value: "null",
						},
						{
							key: "cspmb__Product_Definition_Name__c",
							value: "null",
						},
						{
							key: "cspmb__Is_Authorization_Required__c",
							value: "false",
						},
						{
							key: "cspmb__One_Off_Charge_External_Id__c",
							value: "null",
						},
						{
							key: "cspmb__Is_One_Off_Discount_Allowed__c",
							value: "true",
						},
						{
							key: "cspmb__Rec ̰ring_Charge_External_Id__c",
							value: "null",
						},
						{
							key: "cspmb__Is_Recurring_Discount_Allowed__c",
							value: "true",
						},
						{
							key:
								"cspmb__Apply_One_Off_Charge_Account_Discount__c",
							value: "false",
						},
						{
							key:
								"cspmb__Apply_Recurring_Charge_Account_Discount__c",
							value: "false",
						},
					],
				},
				externalIds: [
					{
						key: "associationSfId",
						value: "a1k4K000001Rn8rQAC",
					},
				],
				group: null,
			},
		],
		commercialProductMetadata: {
			attributeMetadata: {
				version: "2-0-0",
				attributes: [
					{
						name: "Colour",
						values: [
							{
								value: "Midnight Green",
							},
							{
								value: "SpaceGrey",
							},
							{
								value: "Silver",
							},
							{
								value: "Gold",
							},
						],
					},
					{
						name: "Memory",
						values: [
							{
								value: "64",
							},
							{
								value: "128",
							},
						],
					},
				],
			},
		},
	},
];

export const queryCpMetadataByIds = () => Promise.resolve(cpMetadata);