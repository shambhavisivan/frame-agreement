import React from 'react';
import { render, act } from '@testing-library/react';
import { ColumnMetadata, CsTableWrapper } from '.';
import { FrameAgreement } from '../../datasources';
import { mockFrameAgreements } from '../../datasources/mock-data';

describe('cs table wrapper test', () => {
	const columnMetadata: ColumnMetadata[] = [
		{
			label: 'Frame Agreement Name',
			apiName: 'name'
		},
		{
			label: 'Frame Agreement status',
			apiName: 'agreementLevel'
		},
		{
			label: 'Last modified date',
			apiName: 'lastModifiedDate'
		},
		{
			label: 'Agreement Id',
			apiName: 'id'
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
		expect(renderCustomRow).toHaveBeenCalledWith(data, columnMetadata);
	});
});
