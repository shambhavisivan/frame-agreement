import React, { ReactElement, useContext, useMemo } from 'react';
import { Allowance } from '../../datasources';
import { store } from './details-page-provider';
import { CSDataTable, CSDataTableColumnInterface } from '@cloudsense/cs-ui-components';

interface AllowanceProps {
	allowances: Allowance[];
	productId: string;
}

type AllowanceRowData = {
	itemId: string;
	itemName: string;
	rateValue: number;
	usageType: string;
	priority?: number;
};

type AllowanceHeader = { [id: string]: AllowanceRowData };

export function Allowances({ allowances, productId }: AllowanceProps): ReactElement {
	const { negotiation } = useContext(store);
	const createRows = useMemo((): AllowanceHeader => {
		const allowanceRows = allowances?.reduce((alRows, allowance) => {
			alRows[allowance.id] = {
				itemId: allowance.id,
				itemName: allowance.name,
				rateValue: allowance.amount,
				priority: allowance.priority,
				usageType: allowance.usageType.name
			};
			return alRows;
		}, {} as AllowanceHeader);

		return allowanceRows;
	}, [negotiation.products[productId].allowances]);

	const createColumns = (): CSDataTableColumnInterface[] => {
		return [
			{
				key: 'Item Name',
				render: (row): ReactElement => <>{row.data?.itemName || 'N/A'}</>,
				header: 'Item Name'
			},
			{
				key: 'Amount',
				render: (row): ReactElement => <>{row.data?.rateValue || 'N/A'}</>,
				header: 'Amount'
			},
			{
				key: 'Priority',
				render: (row): ReactElement => <>{row.data?.priority || 'N/A'}</>,
				header: 'Priority'
			},
			{
				key: 'Usage Type',
				render: (row): ReactElement => <>{row.data?.usageType || 'N/A'}</>,
				header: 'Usage Type'
			}
		];
	};

	return (
		<>
			<CSDataTable
				columns={createColumns()}
				rows={Object.entries(createRows).map(([id, rowData]) => ({
					key: id,
					data: rowData
				}))}
				collapsible={true}
			/>
		</>
	);
}
