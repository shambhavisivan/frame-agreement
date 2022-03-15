import { CSFormChangedFieldData, CSFormData } from '@cloudsense/cs-form-v2';
import { CSFormFieldData } from '@cloudsense/cs-form-v2/dist/types/cs-form-field-types';
import { FormBuilderFieldMetadata, remoteActions } from '../datasources';
import { lookupRecordFieldMetadata, lookupRecords } from '../datasources/mock-data';
import { generateCsformData, updateCsFormData } from './cs-form-utils';

describe('build CS form data', () => {
	jest.spyOn(remoteActions, 'getFieldMetadata').mockReturnValue(
		Promise.resolve(lookupRecordFieldMetadata)
	);

	const getLookupRecordsSpy = jest
		.spyOn(remoteActions, 'getLookupRecords')
		.mockReturnValue(Promise.resolve(lookupRecords));
	describe('test build CS form data of various data types', () => {
		test('Based on data type respective cs form field type must be built', async () => {
			const fieldMetadataList = sampleFieldMetadata;
			const csFormData = await generateCsformData({
				fieldMetadataList: fieldMetadataList,
				label: 'testLabel'
			});

			let stringCountFieldMetadata = 0;
			let idCountFieldMetadata = 0;
			let referenceCountFieldMetadata = 0;
			let pickListCountFieldMetadata = 0;
			let dateTimeCountFieldMetadata = 0;
			let dateCountFieldMetadata = 0;
			let booleanCountFieldMetadata = 0;
			let numberCountFieldMetadata = 0;
			let doubleCountFieldMetadata = 0;
			fieldMetadataList.forEach((fieldMetadata) => {
				if (fieldMetadata.type === 'STRING') {
					stringCountFieldMetadata += 1;
				} else if (fieldMetadata.type === 'REFERENCE') {
					referenceCountFieldMetadata += 1;
				} else if (fieldMetadata.type === 'DATE') {
					dateCountFieldMetadata += 1;
				} else if (fieldMetadata.type === 'DATETIME') {
					dateTimeCountFieldMetadata += 1;
				} else if (fieldMetadata.type === 'PICKLIST') {
					pickListCountFieldMetadata += 1;
				} else if (fieldMetadata.type === 'BOOLEAN') {
					booleanCountFieldMetadata += 1;
				} else if (fieldMetadata.type === 'NUMBER') {
					numberCountFieldMetadata += 1;
				} else if (fieldMetadata.type === 'DOUBLE') {
					doubleCountFieldMetadata += 1;
				} else if (fieldMetadata.type === 'ID') {
					idCountFieldMetadata += 1;
				}
			});

			let textCountCsFromData = 0;
			let lookupCountCsFormData = 0;
			let selectCountCsFormData = 0;
			let dateTimeCountCsFormData = 0;
			let dateCountCsFormData = 0;
			let checkBoxCountCsFormData = 0;
			let numberCountCsFormData = 0;
			csFormData[0].fields.forEach((fieldMetadata) => {
				if (fieldMetadata.fieldType === 'TEXT') {
					textCountCsFromData += 1;
				} else if (fieldMetadata.fieldType === 'LOOKUP') {
					lookupCountCsFormData += 1;
				} else if (fieldMetadata.fieldType === 'DATE') {
					dateCountCsFormData += 1;
				} else if (fieldMetadata.fieldType === 'DATETIME') {
					dateTimeCountCsFormData += 1;
				} else if (fieldMetadata.fieldType === 'SELECT') {
					selectCountCsFormData += 1;
				} else if (fieldMetadata.fieldType === 'CHECKBOX') {
					checkBoxCountCsFormData += 1;
				} else if (fieldMetadata.fieldType === 'NUMBER') {
					numberCountCsFormData += 1;
				}
			});

			expect(stringCountFieldMetadata + idCountFieldMetadata).toBe(textCountCsFromData);
			expect(referenceCountFieldMetadata).toBe(lookupCountCsFormData);
			expect(pickListCountFieldMetadata).toBe(selectCountCsFormData);
			expect(booleanCountFieldMetadata).toBe(checkBoxCountCsFormData);
			expect(dateCountFieldMetadata).toBe(dateCountCsFormData);
			expect(dateTimeCountFieldMetadata).toBe(dateTimeCountCsFormData);
			expect(numberCountFieldMetadata + doubleCountFieldMetadata).toBe(numberCountCsFormData);

			expect(getLookupRecordsSpy).toBeCalledTimes(lookupCountCsFormData);
		});
	});

	describe('test lookup field', () => {
		test('By default name column must be added to cs form lookup', async () => {
			const fieldMetadataList: Array<FormBuilderFieldMetadata> = [
				{
					field: 'pricingRuleGroup',
					readOnly: false,
					label: 'Pricing Rule Group',
					type: 'REFERENCE',
					grid: 3,
					lookupData: {
						referenceField: 'cspmb__Pricing_Rule_Group__c'
					}
				}
			];

			const csFormData = await generateCsformData({
				fieldMetadataList: fieldMetadataList,
				label: 'testLabel'
			});

			if (csFormData[0].fields[0].fieldType === 'LOOKUP') {
				expect(csFormData[0].fields[0].columns.length).toBe(1);
			}
		});

		test('Name column must be duplicated even if user configures them in JSON settings', async () => {
			const fieldMetadataList: Array<FormBuilderFieldMetadata> = [
				{
					field: 'account',
					readOnly: false,
					label: 'Account',
					type: 'REFERENCE',
					grid: 3,
					lookupData: {
						whereClause: 'name != "Edge Communication"',
						columns: ['Name', 'type'],
						referenceField: 'Account'
					},
					value: '0014K00000DGtowQAD'
				}
			];

			const csFormData = await generateCsformData({
				fieldMetadataList: fieldMetadataList,
				label: 'testLabel'
			});

			if (csFormData[0].fields[0].fieldType === 'LOOKUP') {
				expect(csFormData[0].fields[0].columns.length).toBe(
					fieldMetadataList[0].lookupData?.columns?.length
				);
			}
		});
	});

	describe('test date field value', () => {
		test('For unix timestamp date value must be generated', async () => {
			const fieldMetadataList: Array<FormBuilderFieldMetadata> = [
				{
					field: 'effectiveStartDate',
					readOnly: false,
					label: 'Effective Start Date',
					type: 'DATETIME',
					grid: 2,
					value: 1638469800000
				}
			];

			const csFormData = await generateCsformData({
				fieldMetadataList: fieldMetadataList,
				label: 'testLabel'
			});

			if (csFormData[0].fields[0].fieldType === 'DATETIME') {
				expect(csFormData[0].fields[0].selected instanceof Date).toBe(true);
			}
		});

		test('For valid date pattern in string date value must be generated', async () => {
			const fieldMetadataList: Array<FormBuilderFieldMetadata> = [
				{
					field: 'effectiveStartDate',
					readOnly: false,
					label: 'Effective Start Date',
					type: 'DATETIME',
					grid: 2,
					value: '08/03/2022'
				}
			];

			const csFormData = await generateCsformData({
				fieldMetadataList: fieldMetadataList,
				label: 'testLabel'
			});

			if (csFormData[0].fields[0].fieldType === 'DATETIME') {
				expect(csFormData[0].fields[0].selected instanceof Date).toBe(true);
			}
		});

		test('No default value must be set for undefined date value', async () => {
			const fieldMetadataList: Array<FormBuilderFieldMetadata> = [
				{
					field: 'effectiveStartDate',
					readOnly: false,
					label: 'Effective Start Date',
					type: 'DATETIME',
					grid: 2
				}
			];

			const csFormData = await generateCsformData({
				fieldMetadataList: fieldMetadataList,
				label: 'testLabel'
			});

			if (csFormData[0].fields[0].fieldType === 'DATETIME') {
				expect(csFormData[0].fields[0].selected instanceof Date).toBe(false);
			}
		});

		test('For valid date object date value must be generated', async () => {
			const fieldMetadataList: Array<FormBuilderFieldMetadata> = [
				{
					field: 'effectiveStartDate',
					readOnly: false,
					label: 'Effective Start Date',
					type: 'DATETIME',
					grid: 2,
					value: new Date('08/03/2022')
				}
			];

			const csFormData = await generateCsformData({
				fieldMetadataList: fieldMetadataList,
				label: 'testLabel'
			});

			if (csFormData[0].fields[0].fieldType === 'DATETIME') {
				expect(csFormData[0].fields[0].selected instanceof Date).toBe(true);
			}
		});

		test('For invalid date value datatype error must be thrown', async () => {
			const fieldMetadataList: Array<FormBuilderFieldMetadata> = [
				{
					field: 'effectiveStartDate',
					readOnly: false,
					label: 'Effective Start Date',
					type: 'DATETIME',
					grid: 2,
					value: true
				}
			];

			const invalidDataType = (): Promise<CSFormData> => {
				return generateCsformData({
					fieldMetadataList: fieldMetadataList,
					label: 'testLabel'
				});
			};
			expect(invalidDataType()).rejects.toThrow(Error);
		});
	});

	describe('test update csForm', () => {
		const formLabel = 'testLabel';
		let csFormData = {} as CSFormData;

		beforeEach(async () => {
			csFormData = await generateCsformData({
				fieldMetadataList: sampleFieldMetadata,
				label: formLabel
			});
		});

		test('string value update', () => {
			const fieldName =
				sampleFieldMetadata.find((fieldMetadata) => {
					return fieldMetadata.type === 'STRING';
				})?.field || '';
			const fieldValue = 'updatedValue';
			const data: CSFormChangedFieldData = {
				sectionKey: formLabel,
				fieldName: fieldName,
				value: fieldValue
			};

			const updatedCsForm: CSFormData = updateCsFormData(csFormData, data);
			const updatedCsFormValue: string = updatedCsForm
				.find((csFromFieldData) => {
					return csFromFieldData.sectionKey === data.sectionKey;
				})
				?.fields.find((csFormFieldData) => {
					return csFormFieldData.name === data.fieldName;
				})?.value;

			expect(fieldValue).toBe(updatedCsFormValue);
		});

		test('pickList value update', () => {
			const fieldName =
				sampleFieldMetadata.find((fieldMetadata) => {
					return fieldMetadata.type === 'PICKLIST';
				})?.field || '';
			const fieldValue = 'updatedValue';
			const data: CSFormChangedFieldData = {
				sectionKey: formLabel,
				fieldName: fieldName,
				value: fieldValue
			};

			const updatedCsForm: CSFormData = updateCsFormData(csFormData, data);
			const updatedCsFormValue: string = updatedCsForm
				.find((csFromFieldData) => {
					return csFromFieldData.sectionKey === data.sectionKey;
				})
				?.fields.find((csFormFieldData) => {
					return csFormFieldData.name === data.fieldName;
				})?.value;

			expect(fieldValue).toBe(updatedCsFormValue);
		});

		test('dateTime value update', () => {
			const fieldName =
				sampleFieldMetadata.find((fieldMetadata) => {
					return fieldMetadata.type === 'DATETIME';
				})?.field || '';
			const fieldValue = new Date(1638469800000);
			const data: CSFormChangedFieldData = {
				sectionKey: formLabel,
				fieldName: fieldName,
				value: fieldValue
			};

			const updatedCsForm: CSFormData = updateCsFormData(csFormData, data);
			const updatedCsFormValue: CSFormFieldData = updatedCsForm
				.find((csFromFieldData) => {
					return csFromFieldData.sectionKey === data.sectionKey;
				})
				?.fields.find((csFormFieldData) => {
					return csFormFieldData.name === data.fieldName;
				}) as CSFormFieldData;

			if (updatedCsFormValue?.fieldType === 'DATETIME') {
				expect(updatedCsFormValue.selected?.getTime()).toBe(fieldValue.getTime());
			}
		});

		test('lookup value update', () => {
			const fieldName =
				sampleFieldMetadata.find((fieldMetadata) => {
					return fieldMetadata.type === 'REFERENCE';
				})?.field || '';
			const fieldValue: Record<string, unknown> = {
				...lookupRecords[Math.floor(Math.random() * lookupRecords.length)]
			};
			const data: CSFormChangedFieldData = {
				sectionKey: formLabel,
				fieldName: fieldName,
				value: {
					key: fieldValue.id,
					data: fieldValue
				}
			};

			const updatedCsForm: CSFormData = updateCsFormData(csFormData, data);
			const updatedCsFormValue: CSFormFieldData = updatedCsForm
				.find((csFromFieldData) => {
					return csFromFieldData.sectionKey === data.sectionKey;
				})
				?.fields.find((csFormFieldData) => {
					return csFormFieldData.name === data.fieldName;
				}) as CSFormFieldData;

			expect(updatedCsFormValue?.value).toBe(fieldValue.id);
		});

		test('boolean value update', () => {
			const fieldName =
				sampleFieldMetadata.find((fieldMetadata) => {
					return fieldMetadata.type === 'BOOLEAN';
				})?.field || '';
			const fieldValue = true;
			const data: CSFormChangedFieldData = {
				sectionKey: formLabel,
				fieldName: fieldName,
				value: fieldValue
			};

			const updatedCsForm: CSFormData = updateCsFormData(csFormData, data);
			const updatedCsFormValue: CSFormFieldData = updatedCsForm
				.find((csFromFieldData) => {
					return csFromFieldData.sectionKey === data.sectionKey;
				})
				?.fields.find((csFormFieldData) => {
					return csFormFieldData.name === data.fieldName;
				}) as CSFormFieldData;

			expect(updatedCsFormValue?.value).toBe(fieldValue);
		});
	});
});

const sampleFieldMetadata: Array<FormBuilderFieldMetadata> = [
	{
		field: 'agreementId',
		readOnly: false,
		label: 'Agreement Id',
		type: 'ID',
		grid: 2,
		value: '0014K00000DItowRAD'
	},
	{
		field: 'agreementName',
		readOnly: false,
		label: 'Agreement name',
		type: 'STRING',
		grid: 2,
		value: 'RCL_1'
	},
	{
		field: 'account',
		readOnly: false,
		label: 'Account',
		type: 'REFERENCE',
		grid: 3,
		lookupData: {
			whereClause: 'name != "Edge Communication"',
			columns: ['Name', 'type'],
			referenceField: 'Account'
		},
		value: '0014K00000DGtowQAD'
	},
	{
		field: 'agreementLevel',
		readOnly: false,
		label: 'Agreement Level',
		type: 'PICKLIST',
		grid: 2,
		value: 'Frame Agreement'
	},
	{
		field: 'effectiveEndDate',
		readOnly: false,
		label: 'Effective End Date',
		type: 'DATETIME',
		grid: 2
	},
	{
		field: 'effectiveStartDate',
		readOnly: false,
		label: 'Effective Start Date',
		type: 'DATETIME',
		grid: 2,
		value: 1638469800000
	},
	{
		field: 'frameAgreementNumber',
		readOnly: false,
		label: 'Frame Agreement Number',
		type: 'STRING',
		grid: 2,
		value: 'FFF006229'
	},
	{
		field: 'mainContact',
		readOnly: true,
		label: 'Main Contact',
		type: 'REFERENCE',
		grid: 3,
		lookupData: {
			columns: ['Name'],
			referenceField: 'Contact'
		}
	},
	{
		field: 'masterFrameAgreement',
		readOnly: false,
		label: 'Master Frame Agreement',
		visible: 'csconta__agreement_level__c != Master Agreement && csconta__Status__c != Active',
		type: 'REFERENCE',
		grid: 3,
		lookupData: {
			columns: ['Name'],
			referenceField: 'csconta__Frame_Agreement__c'
		},
		value: 'a274K000000QFZTQA4'
	},
	{
		field: 'pricingRuleGroup',
		readOnly: false,
		label: 'Pricing Rule Group',
		type: 'REFERENCE',
		grid: 3,
		lookupData: {
			referenceField: 'cspmb__Pricing_Rule_Group__c'
		}
	},
	{
		field: 'replacedBy',
		readOnly: false,
		label: 'Replaced By',
		type: 'REFERENCE',
		grid: 3,
		lookupData: {
			columns: ['Name'],
			referenceField: 'csconta__Frame_Agreement__c'
		}
	},
	{
		field: 'status',
		readOnly: false,
		label: 'Status',
		type: 'PICKLIST',
		grid: 2,
		value: 'Draft'
	},
	{
		field: 'validFrom',
		readOnly: false,
		label: 'Valid From',
		type: 'DATE',
		grid: 2
	},
	{
		field: 'validTo',
		readOnly: false,
		label: 'Valid To',
		type: 'DATE',
		grid: 2
	},
	{
		field: 'arbBoolean',
		readOnly: false,
		label: 'ARB Boolean',
		type: 'BOOLEAN',
		grid: 2
	},
	{
		field: 'arbDouble',
		readOnly: false,
		label: 'ARB Boolean',
		type: 'DOUBLE',
		grid: 2
	},
	{
		field: 'arbNumber',
		readOnly: false,
		label: 'ARB Number',
		type: 'NUMBER',
		grid: 2
	}
];
