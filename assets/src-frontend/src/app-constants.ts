import { FieldMetadata } from './datasources';

export enum QueryKeys {
	frameagreement = 'frameAgreement',
	faAttachment = 'faAttachment',
	compareAgreement = 'compareAgreement',
	categoriesInCatalogue = 'categoriesInCatalogue',
	productsInCategory = 'productsInCategory'
}
export const FA_API_NAME = 'csconta__Frame_Agreement__c';
export const SEARCH_INPUT_VALIDATION_MESSAGE = 'Enter atleast 3 or more characters to begin search';
export const DEFAULT_GRID_VISIBLE_FIELDS = 5;
export const DEFAULT_SEARCH_TRIGGER_LIMIT = 3;

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
