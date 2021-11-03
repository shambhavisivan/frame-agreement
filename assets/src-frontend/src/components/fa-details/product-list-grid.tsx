import {
	CSDataTable,
	CSDataTableColumnInterface,
	CSDataTableRowInterface,
	CSDataTableRowWithMetaInterface,
	CSDropdown,
	CSInputSearch,
	CSList,
	CSListItem,
	CSToastApi
} from '@cloudsense/cs-ui-components';
import React, { ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryStatus } from 'react-query';
import {
	CP_API_NAME,
	DEFAULT_GRID_VISIBLE_FIELDS,
	DEFAULT_SEARCH_TRIGGER_LIMIT
} from '../../app-constants';
import { CommercialProductStandalone, FieldMetadata } from '../../datasources';
import { useCustomLabels } from '../../hooks/use-custom-labels';
import { useFieldMetadata } from '../../hooks/use-field-metadata';
import { ProductDetails } from './product-details';

export type ProductStatus = 'add' | 'remove';

type GridProps = {
	data: CommercialProductStandalone[];
	filterHandler?: (filterString: string) => void;
	isCollapsible?: boolean;
	onSelectRow?: (
		event: React.ChangeEvent<HTMLInputElement>,
		row: CommercialProductStandalone[]
	) => void;
	selectedProducts?: CommercialProductStandalone[];
};

export function ProductListGrid({
	data,
	filterHandler,
	isCollapsible = false,
	onSelectRow,
	selectedProducts
}: GridProps): ReactElement {
	const { metadata, metadataStatus } = useFieldMetadata(CP_API_NAME);
	const [fieldMetadata, setFieldMetadata] = useState<CSDataTableColumnInterface[]>([]);
	const [filterString, setFilterString] = useState<string>('');
	const labels = useCustomLabels();

	const renderColumnChooser = (): ReactNode => {
		const apiNames = fieldMetadata.map((metadata) => metadata.key);
		const modifyColumnMetadata = (metadata: FieldMetadata, includes: boolean): void => {
			if (!includes) {
				setFieldMetadata((prevMetadata) => [
					...prevMetadata,
					{
						key: metadata.apiName,
						header: metadata.fieldLabel
					}
				]);
				return;
			}

			const filteredMetadata: CSDataTableColumnInterface[] = fieldMetadata.filter(
				(metainfo) => metainfo.key !== metadata.apiName
			);

			setFieldMetadata(filteredMetadata);
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

	useEffect(() => {
		function transformFieldMetadata(metadata: FieldMetadata[]): CSDataTableColumnInterface[] {
			const transformedData = metadata
				.slice(0, DEFAULT_GRID_VISIBLE_FIELDS)
				.reduce(
					(modifiedData: CSDataTableColumnInterface[], currentMeta: FieldMetadata) => {
						const columnMeta: CSDataTableColumnInterface = {
							key: currentMeta.apiName,
							header: currentMeta.fieldLabel,
							grow: 2
						};
						modifiedData.push(columnMeta);
						return modifiedData;
					},
					[] as CSDataTableColumnInterface[]
				);

			return transformedData;
		}
		if (metadataStatus === QueryStatus.Success) {
			setFieldMetadata((prevState) => [
				...prevState,
				...transformFieldMetadata(metadata || [])
			]);
		}
	}, [metadataStatus, metadata]);

	const filterProducts = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		const {
			key,
			currentTarget: { value }
		} = event;
		if (key === 'Enter') {
			if (value.length > DEFAULT_SEARCH_TRIGGER_LIMIT) {
				filterHandler && filterHandler(value);
				resetInputFilter();
			} else {
				CSToastApi.renderCSToast(
					{
						variant: 'error',
						text: labels.filterTextWarningMessage,
						closeButton: true
					},
					'top-center',
					3
				);
			}
		}
		return;
	};

	const resetInputFilter = (): void => {
		setFilterString('');
	};

	const addColumnChooser = useMemo(() => {
		const modifiedColumnData = [
			...fieldMetadata,
			// to always show the drop down as a last field
			{
				key: 'column-chooser',
				header: (
					<CSDropdown mode="list" iconName="table" position="top">
						{renderColumnChooser()}
					</CSDropdown>
				)
			}
		];
		return modifiedColumnData;
	}, [fieldMetadata]);

	const renderDetails = (row: CSDataTableRowWithMetaInterface): ReactElement => {
		return <ProductDetails product={row.data as CommercialProductStandalone} />;
	};

	const getSelectedKeys = useMemo(
		(): string[] => selectedProducts?.map((product) => product.id) || [],
		[selectedProducts]
	);

	return (
		<div>
			<CSInputSearch
				value={filterString}
				label="Filter products"
				labelHidden
				placeholder="Filter products..."
				autoFocus={true}
				width="20rem"
				onClearSearch={resetInputFilter}
				onKeyDown={filterProducts}
				disabled={!filterHandler}
			/>
			<CSDataTable
				columns={addColumnChooser}
				rows={
					data?.map((product) => ({
						key: product.id,
						data: product
					})) || ([] as CSDataTableRowInterface[])
				}
				subsectionRender={renderDetails}
				collapsible={isCollapsible}
				selectable={!!onSelectRow}
				selectedKeys={getSelectedKeys}
				onSelectChange={(event, selectedRow): void =>
					onSelectRow &&
					onSelectRow(event, [selectedRow.data as CommercialProductStandalone] || [])
				}
			/>
		</div>
	);
}
