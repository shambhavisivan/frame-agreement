import {
	CSButton,
	CSCheckbox,
	CSTable,
	CSTableBody,
	CSTableCell,
	CSTableHeader
} from '@cloudsense/cs-ui-components';
import React, { useState, ReactElement, ReactNode } from 'react';
import { FrameAgreement } from '../../datasources';

export type ColumnMetadata = { label: string; apiName: keyof FrameAgreement };
type CSTableProps = {
	columnMetadata: ColumnMetadata[];
	data: unknown;
	disableColumnChooser?: boolean;
	rowRenderer(data: CSTableProps['data'], columnMetadata: ColumnMetadata[]): ReactNode;
};

export function CsTableWrapper(props: CSTableProps): ReactElement {
	// show only first 4 fields for visibility purposes
	const [columnMetadata, setColumnMetadata] = useState<ColumnMetadata[]>(
		props.columnMetadata.length > 4 ? props.columnMetadata.slice(0, 4) : props.columnMetadata
	);
	const [showColumnChooser, setShowColumnChooser] = useState(false);

	const renderColumnChooser = (): ReactNode => {
		const apiNames = columnMetadata.map((metadata) => metadata.apiName);
		const modifyColumnMetadata = (metadata: ColumnMetadata, includes: boolean): void => {
			if (!includes) {
				setColumnMetadata((prevMetadata) => [...prevMetadata, metadata]);
				return;
			}

			const filteredMetadata: ColumnMetadata[] = columnMetadata.filter(
				(metainfo) => metainfo.apiName !== metadata.apiName
			);

			setColumnMetadata(filteredMetadata);
		};

		return (
			<ul>
				{props.columnMetadata.map((metadata) => {
					const isColumnVisible = new Set(apiNames).has(metadata.apiName);
					return (
						<li>
							<CSCheckbox
								checked={isColumnVisible}
								label={metadata.label}
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
						return <CSTableCell key={column.label} text={column.label} />;
					})}
					{!props.disableColumnChooser && (
						<CSButton
							label={'column chooser'}
							origin={'cs'}
							onClick={(): void => setShowColumnChooser((prevState) => !prevState)}
						/>
					)}
				</CSTableHeader>
				{showColumnChooser && renderColumnChooser()}
				<CSTableBody>{props.rowRenderer(props.data, columnMetadata)}</CSTableBody>
			</CSTable>
		</div>
	);
}
