import React, { ReactElement, useState } from 'react';
import { CSButton, CSCheckbox } from '@cloudsense/cs-ui-components';
import { QueryStatus, useAppSettings } from '../../hooks/use-app-settings';
import { useGetCategoriesInCatalogue } from '../../hooks/use-get-categories-in-catalogue';
import { useCustomLabels } from '../../hooks/use-custom-labels';

type Props = {
	onApplyFilter: (filterText: string | Record<string, string[]>) => void;
};

export function ProductCategorisation({ onApplyFilter }: Props): ReactElement {
	const { settings } = useAppSettings();
	const { categoryList, status } = useGetCategoriesInCatalogue(
		settings?.defaultCatalogueId || ''
	);
	const [filterData, setFilterData] = useState<Record<string, string[]>>({});
	const labels = useCustomLabels();

	const createFilter = (field: string, value: string): void => {
		let filterDataCopy = { ...filterData };
		if (filterDataCopy[field]) {
			filterDataCopy[field].includes(value)
				? (filterDataCopy = {
						...filterDataCopy,
						[field]: filterDataCopy[field].filter((val) => val !== value)
				  })
				: filterDataCopy[field].push(value);
		} else {
			filterDataCopy[field] = [value];
		}

		setFilterData(filterDataCopy);
	};

	return (
		<div>
			{status === QueryStatus.Success && settings?.facSettings.isPsEnabled ? (
				categoryList?.map((category) => (
					<li key={category.id} onClick={(): void => onApplyFilter(category.id)}>
						{category.name}
					</li>
				))
			) : (
				<div>
					<span>
						{settings?.categorizationData?.map((data) => (
							<ul>
								<h2>
									<strong>{data.name}</strong>
								</h2>
								{data.values.map((value) => (
									<li>
										<CSCheckbox
											label="select filter"
											labelHidden={true}
											onClick={(): void => createFilter(data.field, value)}
											checked={filterData[data.field]?.includes(value)}
										/>
										{value}
									</li>
								))}
							</ul>
						))}
					</span>
					<CSButton
						label={labels.modalCategorizationBtnApply}
						onClick={(): void => onApplyFilter(filterData)}
					/>
				</div>
			)}
		</div>
	);
}
