import {
	CSDropdown,
	CSList,
	CSListItem,
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
			<CSList variant="check-list">
				{props.columnMetadata.map((metadata) => {
					const isColumnVisible = new Set(apiNames).has(metadata.apiName);
					return (
						<CSListItem
							text={metadata.fieldLabel}
							onSelectChange={(): void =>
								modifyColumnMetadata(metadata, isColumnVisible)
							}
							selected={isColumnVisible}
						/>
					);
				})}
			</CSList>
		);
	};

	return (
		<div>
			<CSTable data-testid={'cs-table'}>
				<CSTableHeader>
					<CSTableCell className="row-editor-placeholder" maxWidth="2.75rem" />
					{columnMetadata.map((column) => {
						return <CSTableCell key={column.fieldLabel} text={column.fieldLabel} />;
					})}
					<CSTableCell className="column-chooser" maxWidth="2.625rem">
						<>
							{!props.disableColumnChooser && (
								<CSDropdown
									mode="list"
									iconName="table"
									position="top"
									onClick={(): void =>
										setShowColumnChooser((prevState) => !prevState)
									}
								>
									{renderColumnChooser()}
								</CSDropdown>
							)}
						</>
					</CSTableCell>
				</CSTableHeader>
				{showColumnChooser && renderColumnChooser()}
				<CSTableBody>{props.rowRenderer(props.data, columnMetadata)}</CSTableBody>
			</CSTable>
		</div>
	);
}
