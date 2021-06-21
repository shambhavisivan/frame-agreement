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
		name: 'mockName'
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
			draftStatus: 'Draft'
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
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'OwnerId',
		fieldLabel: 'Owner ID',
		isCustom: false,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'IsDeleted',
		fieldLabel: 'Deleted',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'Name',
		fieldLabel: 'Frame Agreement Sequence',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'CreatedDate',
		fieldLabel: 'Created Date',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'CreatedById',
		fieldLabel: 'Created By ID',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'LastModifiedDate',
		fieldLabel: 'Last Modified Date',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'LastModifiedById',
		fieldLabel: 'Last Modified By ID',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'SystemModstamp',
		fieldLabel: 'System Modstamp',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'LastActivityDate',
		fieldLabel: 'Last Activity Date',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'LastViewedDate',
		fieldLabel: 'Last Viewed Date',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'LastReferencedDate',
		fieldLabel: 'Last Referenced Date',
		isCustom: false,
		isUpdatable: false,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Account__c',
		fieldLabel: 'Account',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Agreement_Name__c',
		fieldLabel: 'Agreement Name',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Main_Contact__c',
		fieldLabel: 'Main Contact',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Pricing_Rule_Group__c',
		fieldLabel: 'Pricing Rule Group',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Status__c',
		fieldLabel: 'Status',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Valid_From__c',
		fieldLabel: 'Valid From',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__Valid_To__c',
		fieldLabel: 'Valid To',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__agreement_level__c',
		fieldLabel: 'Agreement Level',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__effective_end_date__c',
		fieldLabel: 'Effective End Date',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__effective_start_date__c',
		fieldLabel: 'Effective Start Date',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__frame_agreement_number__c',
		fieldLabel: 'Frame Agreement Number',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__master_frame_agreement__c',
		fieldLabel: 'Master Frame Agreement',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__replaced_by__c',
		fieldLabel: 'Replaced By',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'csconta__replaced_frame_agreement__c',
		fieldLabel: 'Replaced Frame Agreement',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'async_job__c',
		fieldLabel: 'Asynchronous Job',
		isCustom: true,
		isUpdatable: false,
		precision: 0,
		scale: 0
	}
];
