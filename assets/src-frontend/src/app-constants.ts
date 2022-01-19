import { FieldMetadata } from './datasources';
import {
	CommercialProductRole,
	CommercialProductType,
	ProductFilter
} from './datasources/graphql-endpoints/interface';

export enum QueryKeys {
	frameagreement = 'frameAgreement',
	faAttachment = 'faAttachment',
	compareAgreement = 'compareAgreement',
	categoriesInCatalogue = 'categoriesInCatalogue',
	productsInCategory = 'productsInCategory',
	filterCommercialProduct = 'filterCommercialProduct',
	standaloneAddons = 'standaloneAddons',
	approvalHistory = 'approvalHistory',
	appSettings = 'appSettings'
}
export const FA_API_NAME = 'csconta__Frame_Agreement__c';
export const FA_STATUS_FIELD_NAME = 'csconta__Status__c';
export const ADDON_API_NAME = 'cspmb__Add_On_Price_Item__c';
export const SEARCH_INPUT_VALIDATION_MESSAGE = 'Enter atleast 3 or more characters to begin search';
export const DEFAULT_GRID_VISIBLE_FIELDS = 5;
export const DEFAULT_SEARCH_TRIGGER_LIMIT = 3;
export const PAGE_SIZES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
export const PRODUCTS_CHUNK_SIZE = 10;

export const FIELD_METADATA_CHILD_FA: FieldMetadata[] = [
	{
		apiName: 'agreementName',
		fieldLabel: 'Member Agreements',
		fieldType: 'STRING',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'effectiveEndDate',
		fieldLabel: 'Effective End Date',
		fieldType: 'DATETIME',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'effectiveStartDate',
		fieldLabel: 'Effective Start Date',
		fieldType: 'DATETIME',
		isCustom: true,
		isUpdatable: true,
		precision: 0,
		scale: 0
	}
];

export const THEME_DELTA_MODAL = {
	base00: '#000',
	base01: '#fff',
	base02: '#fff',
	base03: '#fff',
	base04: '#fff',
	base05: '#fff',
	base06: '#fff',
	base07: '#fff',
	base08: '#fff',
	base09: '#fff',
	base0A: '#fff',
	base0B: '#fff',
	base0C: '#fff',
	base0D: '#fff',
	base0E: '#fff',
	base0F: '#fff'
};

export const CP_API_NAME = 'cspmb__Price_Item__c';

export const ADDON_PRODUCT_DETAILS_GRID_METADATA: FieldMetadata[] = [
	{
		apiName: 'name',
		fieldLabel: 'Add On Name',
		fieldType: 'STRING',
		isCustom: false,
		isUpdatable: true,
		precision: 0,
		scale: 0
	},
	{
		apiName: 'oneOffCharge',
		fieldLabel: 'One-Off Charge',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 18,
		scale: 2
	},
	{
		apiName: 'recurringCharge',
		fieldLabel: 'Recurring Charge',
		fieldType: 'DOUBLE',
		isCustom: true,
		isUpdatable: true,
		precision: 18,
		scale: 2
	}
];

export const cpFilter: ProductFilter = {
	role: new Set<CommercialProductRole>([
		CommercialProductRole.basic,
		CommercialProductRole.master,
		CommercialProductRole.variant
	]),
	type: CommercialProductType.commercialProduct
};
