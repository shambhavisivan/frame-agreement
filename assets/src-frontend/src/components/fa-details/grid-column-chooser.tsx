import React, { ReactElement } from 'react';
import { CSDataTableColumnInterface, CSList, CSListItem } from '@cloudsense/cs-ui-components';
import { FieldMetadata } from '../../datasources';

type Props = {
	metadata: FieldMetadata[];
	onSelectField: (metadata: CSDataTableColumnInterface[]) => void;
	selectedFieldList: CSDataTableColumnInterface[];
};
export function GridColumnChooser({
	metadata,
	onSelectField,
	selectedFieldList
}: Props): ReactElement {
	const renderColumnChooser = (): ReactElement => {
		const apiNames = selectedFieldList.map((metadata) => metadata.key);
		const modifyColumnMetadata = (metadata: FieldMetadata, includes: boolean): void => {
			if (!includes) {
				const metadataInf = [
					...selectedFieldList,
					{
						key: metadata.apiName,
						header: metadata.fieldLabel
					}
				];
				onSelectField(metadataInf);
				return;
			}

			const filteredMetadata: CSDataTableColumnInterface[] = selectedFieldList.filter(
				(metainfo) => metainfo.key !== metadata.apiName
			);

			onSelectField(filteredMetadata);
		};

		return (
			<CSList variant="check-list">
				{metadata?.map((metadata) => {
					const isColumnVisible = new Set(apiNames).has(metadata.apiName);
					return (
						<CSListItem
							key={metadata.apiName}
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

	return renderColumnChooser();
}
