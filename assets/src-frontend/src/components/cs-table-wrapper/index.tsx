import {
	CSButton,
	CSCheckbox,
	CSTable,
	CSTableBody,
	CSTableCell,
	CSTableHeader
} from '@cloudsense/cs-ui-components';
import React, { useState, ReactElement, ReactNode } from 'react';
import { FieldMetadata } from '../../datasources';

type CSTableProps = {
	columnMetadata: FieldMetadata[];
	data: unknown;
	disableColumnChooser?: boolean;
	rowRenderer(data: CSTableProps['data'], columnMetadata: FieldMetadata[]): ReactNode;
};

export function CsTableWrapper(props: CSTableProps): ReactElement {
	// show only first 5 fields for visibility purposes
	const [columnMetadata, setColumnMetadata] = useState<FieldMetadata[]>(
		props.columnMetadata.length > 4 ? props.columnMetadata.slice(0, 5) : props.columnMetadata
	);
	const [showColumnChooser, setShowColumnChooser] = useState(false);

	const renderColumnChooser = (): ReactNode => {
		const apiNames = columnMetadata.map((metadata) => metadata.apiName);
		const modifyColumnMetadata = (metadata: FieldMetadata, includes: boolean): void => {
			if (!includes) {
				setColumnMetadata((prevMetadata) => [...prevMetadata, metadata]);
				return;
			}

			const filteredMetadata: FieldMetadata[] = columnMetadata.filter(
				(metainfo) => metainfo.apiName !== metadata.apiName
			);

			setColumnMetadata(filteredMetadata);
		};

		return (
			<ul style={{ position: 'absolute', float: 'right', right: '0px' }}>
				{props.columnMetadata.map((metadata) => {
					const isColumnVisible = new Set(apiNames).has(metadata.apiName);
					return (
						<li>
							<CSCheckbox
								checked={isColumnVisible}
								label={metadata.fieldLabel}
								onChange={(): void =>
									modifyColumnMetadata(metadata, isColumnVisible)
								}
							/>
						</li>
					);
				})}
			</ul>
		);
	};

	return (
		<div>
			<CSTable data-testid={'cs-table'}>
				<CSTableHeader>
					{columnMetadata.map((column) => {
						return <CSTableCell key={column.fieldLabel} text={column.fieldLabel} />;
					})}
					{!props.disableColumnChooser && (
						<CSButton
							label={'column chooser'}
							origin={'cs'}
							onClick={(): void => setShowColumnChooser((prevState) => !prevState)}
							style={{ position: 'absolute', float: 'right', right: '-126px' }}
						/>
					)}
				</CSTableHeader>
				{showColumnChooser && renderColumnChooser()}
				<CSTableBody>{props.rowRenderer(props.data, columnMetadata)}</CSTableBody>
			</CSTable>
		</div>
	);
}
