import {
	CSDataTable,
	CSDataTableColumnInterface,
	CSDataTableRowInterface,
	CSDataTableRowWithMetaInterface,
	CSDropdown
} from '@cloudsense/cs-ui-components';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { QueryStatus } from 'react-query';
import { ADDON_API_NAME, DEFAULT_GRID_VISIBLE_FIELDS } from '../../app-constants';
import { Addon, FieldMetadata } from '../../datasources';
import { useFieldMetadata } from '../../hooks/use-field-metadata';
import { AddonNegotiation } from './addon-negotiation';
import { GridColumnChooser } from './grid-column-chooser';

interface Props {
	fieldMetadata?: FieldMetadata[];
	addonList: Addon[];
	selectedAddonIds?: string[];
	onSelectRow?: (event: React.ChangeEvent<HTMLInputElement>, row: Addon[]) => void;
	isCollapsible?: boolean;
}

export function AddonGrid({
	fieldMetadata,
	addonList,
	selectedAddonIds,
	isCollapsible = false,
	onSelectRow
}: Props): ReactElement {
	const [metadata, setFieldMetadata] = useState<CSDataTableColumnInterface[]>([]);
	const { metadata: addonMetadata, metadataStatus } = useFieldMetadata(ADDON_API_NAME);

	function transformMetadata(inputFieldMetadata: FieldMetadata[]): CSDataTableColumnInterface[] {
		return inputFieldMetadata.reduce((modifiedFieldMetadata, data) => {
			const columnMeta: CSDataTableColumnInterface = {
				key: data.apiName,
				header: data.fieldLabel,
				grow: 2
			};
			modifiedFieldMetadata.push(columnMeta);
			return modifiedFieldMetadata;
		}, [] as CSDataTableColumnInterface[]);
	}

	useEffect(() => {
		!!fieldMetadata?.length
			? setFieldMetadata(transformMetadata(fieldMetadata))
			: setFieldMetadata(
					transformMetadata(addonMetadata?.slice(0, DEFAULT_GRID_VISIBLE_FIELDS) || [])
			  );
	}, [addonMetadata, fieldMetadata, metadataStatus]);

	const addColumnChooser = useMemo(() => {
		const modifiedColumnData = [
			...metadata,
			// to always show the drop down as a last field
			{
				key: 'column-chooser',
				header: (
					<CSDropdown mode="list" iconName="table" position="top">
						{metadataStatus === QueryStatus.Success && (
							<GridColumnChooser
								metadata={addonMetadata || []}
								selectedFieldList={metadata}
								onSelectField={(metadata): void => {
									setFieldMetadata(metadata);
								}}
							/>
						)}
					</CSDropdown>
				)
			}
		];
		return modifiedColumnData;
	}, [addonMetadata, metadata, metadataStatus]);

	const renderDetails = (row: CSDataTableRowWithMetaInterface): ReactElement => {
		return <AddonNegotiation addon={row.data as Addon} />;
	};

	return (
		<div>
			{addonList.length ? (
				<CSDataTable
					collapsible={isCollapsible}
					selectable={!!onSelectRow}
					selectedKeys={selectedAddonIds}
					columns={addColumnChooser}
					onSelectChange={(event, selectedRow): void =>
						onSelectRow && onSelectRow(event, [selectedRow?.data as Addon])
					}
					rows={
						addonList?.map((addon) => ({
							key: addon.id,
							data: addon
						})) || ([] as CSDataTableRowInterface[])
					}
					subsectionRender={renderDetails}
				/>
			) : (
				<p>No addons to show here</p>
			)}
		</div>
	);
}
