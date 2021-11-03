import {
	CSDataTable,
	CSDataTableColumnInterface,
	CSDataTableRowInterface
} from '@cloudsense/cs-ui-components';
import React, { ReactElement, useEffect, useState } from 'react';
import { ADDON_API_NAME, DEFAULT_GRID_VISIBLE_FIELDS } from '../../app-constants';
import { Addon, FieldMetadata } from '../../datasources';
import { useFieldMetadata } from '../../hooks/use-field-metadata';

interface Props {
	fieldMetadata?: FieldMetadata[];
	addonList: Addon[];
}

export function AddonGrid({ fieldMetadata, addonList }: Props): ReactElement {
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

	return (
		<div>
			{addonList.length ? (
				<CSDataTable
					columns={metadata}
					rows={
						addonList?.map((addon) => ({
							key: addon.id,
							data: addon
						})) || ([] as CSDataTableRowInterface[])
					}
				/>
			) : (
				<p>No addons to show here</p>
			)}
		</div>
	);
}
