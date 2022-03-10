import { CSFormData } from '@cloudsense/cs-form-v2';
import {
	FieldMetadata,
	FormBuilderFieldMetadata,
	LookupRecordParam,
	remoteActions
} from '../datasources';
import { deforcifyKeyName } from '../datasources/deforcify';
import { forcifyKeyName } from '../datasources/forcify';

type FieldData = CSFormData[number]['fields'][number];

interface LookupFieldMetadata {
	[fieldName: string]: Array<FieldMetadata>;
}

interface LookupRecords {
	[fieldName: string]: Array<Record<string, unknown>>;
}

const lookupFieldMetadataCache: LookupFieldMetadata = {};
const lookupRecordsCache: LookupRecords = {};

const createFieldData = async (fieldMetadata: FormBuilderFieldMetadata): Promise<FieldData> => {
	let fieldData: FieldData = {
		name: fieldMetadata.field,
		label: fieldMetadata.label,
		fieldType: 'TEXT'
	};

	switch (fieldMetadata.type) {
		case 'STRING':
			fieldData = {
				name: fieldMetadata.field,
				label: fieldMetadata.label,
				fieldType: 'TEXT',
				value: fieldMetadata.value
			};
			break;
		case 'DATE':
			fieldData = {
				name: fieldMetadata.field,
				label: fieldMetadata.label,
				fieldType: 'DATE',
				selected: getDateValue(fieldMetadata.value)
			};
			break;
		case 'DATETIME':
			fieldData = {
				name: fieldMetadata.field,
				label: fieldMetadata.label,
				fieldType: 'DATETIME',
				selected: getDateValue(fieldMetadata.value)
			};
			break;
		case 'PICKLIST':
			const pickList = fieldMetadata.pickListData;
			fieldData = {
				name: fieldMetadata.field,
				label: fieldMetadata.label,
				fieldType: 'SELECT',
				value: fieldMetadata.value,
				selectOptions: pickList?.length ? pickList : []
			};
			break;
		case 'DOUBLE':
		case 'NUMBER':
			fieldData = {
				name: fieldMetadata.field,
				label: fieldMetadata.label,
				fieldType: 'NUMBER',
				value: fieldMetadata.value
			};
			break;
		case 'BOOLEAN':
			fieldData = {
				name: fieldMetadata.field,
				label: fieldMetadata.label,
				fieldType: 'CHECKBOX',
				value: fieldMetadata.value
			};
			break;
		case 'REFERENCE':
			// TODO: once newer version of CS form is released, replace with server mode lookup
			const referenceField = fieldMetadata.lookupData?.referenceField as string;
			let lookupFieldMetadata = lookupFieldMetadataCache[referenceField];
			if (!lookupFieldMetadata) {
				lookupFieldMetadata = await remoteActions.getFieldMetadata(referenceField);
				lookupFieldMetadataCache[referenceField] = lookupFieldMetadata;
			}

			const fieldMetadataMap =
				lookupFieldMetadata.reduce(
					(accumulator, fieldMetadata) => {
						accumulator[fieldMetadata.apiName] = fieldMetadata;
						return accumulator;
					},
					{} as {
						[fieldName: string]: FieldMetadata;
					}
				) || {};

			let columns = [
				{
					key: 'name',
					header: 'Name'
				}
			];

			if (fieldMetadata.lookupData?.columns?.length) {
				const userConfiguredColumn = fieldMetadata.lookupData?.columns.reduce(
					(accumulator, column) => {
						const field = deforcifyKeyName(column);

						if (field !== 'name') {
							accumulator.push({
								key: field,
								header: fieldMetadataMap[field].fieldLabel
							});
						}
						return accumulator;
					},
					[] as Array<{
						key: string;
						header: string;
					}>
				);

				columns = [...columns, ...userConfiguredColumn];
			}

			let lookupRecords = lookupRecordsCache[fieldMetadata.field];

			if (!lookupRecords) {
				const lookupRecordParam: LookupRecordParam = {
					field: forcifyKeyName(fieldMetadata.field, 'csconta'),
					columns: fieldMetadata.lookupData?.columns as string[],
					whereClause: fieldMetadata.lookupData?.whereClause || null,
					lastId: null,
					offset: 200
				};
				lookupRecords = await remoteActions.getLookupRecords(lookupRecordParam);
				lookupRecordsCache[fieldMetadata.field] = lookupRecords;
			}
			let value = {};
			const options = lookupRecords.reduce(
				(recordAccumulator, record) => {
					if (record.id === fieldMetadata.value) {
						value = {
							key: record.id as string,
							data: record
						};
					}
					recordAccumulator.push({
						key: record.id as string,
						data: record
					});
					return recordAccumulator;
				},
				[] as Array<{
					key: string;
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					data: any;
				}>
			);

			fieldData = {
				name: fieldMetadata.field,
				label: fieldMetadata.label,
				fieldType: 'LOOKUP',
				mode: 'client',
				fieldToBeDisplayed: 'name',
				columns: columns,
				options: options,
				value: value
			};
			break;
	}
	fieldData.disabled = fieldMetadata.readOnly;
	fieldData.grow = fieldMetadata.grid || 3;

	return fieldData;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDateValue = (dateValue: any): Date | undefined => {
	if (typeof dateValue === 'undefined') {
		//no value is set
		return dateValue;
	} else if (dateValue instanceof Date) {
		return dateValue;
	} else if (typeof dateValue === 'number') {
		return new Date(dateValue);
	} else if (typeof dateValue === 'string') {
		return new Date(Date.parse(dateValue));
	} else {
		throw new Error('Invalid Date format');
	}
};

export const generateCsformData = async (formData: {
	fieldMetadataList: Array<FormBuilderFieldMetadata>;
	label: string;
}): Promise<CSFormData> => {
	const csFormData: CSFormData = [
		{
			sectionKey: formData.label,
			label: formData.label,
			fields: await formData.fieldMetadataList.reduce(
				async (formFieldAccumulator, current) => {
					const fieldData: FieldData = await createFieldData(current);
					const accumulator = await formFieldAccumulator;
					accumulator.push(fieldData);
					return accumulator;
				},
				Promise.resolve([]) as Promise<CSFormData[number]['fields']>
			)
		}
	];

	return csFormData;
};
