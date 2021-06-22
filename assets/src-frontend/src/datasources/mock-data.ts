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
import { DispatcherToken } from '../datasources/graphql-endpoints/dispatcher-service';

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
		}
	}
};

export const mockFrameAgreements: FrameAgreement[] = frameAgreements.map(deforcify);

export const mockCommercialProductData: CommercialProductData = {
	cpData: deforcify(productData)
};

export const mockCommercialProducts: CommercialProductStandalone[] = commercialProducts.map(
	deforcify
);

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
