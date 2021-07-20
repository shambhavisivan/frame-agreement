import { FieldMetadata } from './datasources';

export enum QueryKeys {
	frameagreement = 'frameAgreement'
}

export const SEARCH_INPUT_VALIDATION_MESSAGE = 'Enter atleast 3 or more characters to begin search';

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
