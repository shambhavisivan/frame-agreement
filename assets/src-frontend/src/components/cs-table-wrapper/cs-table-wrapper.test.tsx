import React from 'react';
import { render, act } from '@testing-library/react';
import { CsTableWrapper } from '.';
import { FieldMetadata, FrameAgreement } from '../../datasources';
import { mockFrameAgreements } from '../../datasources/mock-data';

describe('cs table wrapper test', () => {
	const columnMetadata: FieldMetadata[] = [
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
		}
	];
	const data: FrameAgreement[] = mockFrameAgreements;
	const renderCustomRow = jest.fn();

	test('should call the row renderer function with the expected params', () => {
		act(() => {
			render(
				<CsTableWrapper
					columnMetadata={columnMetadata}
					data={data}
					rowRenderer={renderCustomRow}
				/>
			);
		});

		expect(renderCustomRow.mock.calls.length).toEqual(1);
		expect(renderCustomRow).toHaveBeenCalledWith(data, columnMetadata.slice(0, 5));
	});
});
