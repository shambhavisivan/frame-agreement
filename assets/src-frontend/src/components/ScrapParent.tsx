import React, { ReactElement, useState } from 'react';
import { remoteActions } from '../datasources';
import './ScrapParentStyles.scss';
import { ServerSidePagination } from './ServerSidePagination';

/* eslint-disable  @typescript-eslint/no-explicit-any */

// TODO: this component is to be plugged with add-modal component and refactored accordingly in the next patch/changeset
export function ScrapParent(): ReactElement {
	const [cps, setCps] = useState<any>([]);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState(0);

	const getCps = async (queryLimit: number, lastRecordId?: string | null): Promise<any> => {
		const commercialProducts = await remoteActions.queryProducts(
			[],
			'',
			lastRecordId ? lastRecordId : null,
			queryLimit
		);
		return commercialProducts;
	};

	const updateCps = (
		cpResponse: any,
		newPage: number,
		pgSize: number,
		totalCount: number
	): void => {
		let newCps: any[] = [];
		let pageStartIndex = (newPage - 1) * pgSize;
		const pageEndIndex = pageStartIndex + pgSize - 1;

		if (cps.length === 0) {
			for (let i = 0; i < totalCount; i++) {
				newCps.push({});
			}
		} else {
			newCps = JSON.parse(JSON.stringify(cps));
		}

		cpResponse.map((item: any) => {
			if (pageStartIndex <= pageEndIndex) {
				newCps[pageStartIndex] = item;
				pageStartIndex += 1;
			}
		});

		setCps(newCps);
	};

	const currentPageData = (): any => {
		const firstPageIndex = (currentPage - 1) * pageSize;
		const lastPageIndex = firstPageIndex + pageSize;
		return cps.slice(firstPageIndex, lastPageIndex);
	};

	return (
		<>
			<table>
				<thead>
					<tr>
						<th>
							<b>CP ID</b>
						</th>
						<th>
							<b>CP NAME</b>
						</th>
					</tr>
				</thead>
				<tbody>
					{cps !== null && cps.length !== 0
						? currentPageData().map((item: any) => {
								return (
									<tr>
										<td>{item.id}</td>
										<td>{item.name}</td>
									</tr>
								);
						  })
						: ''}
				</tbody>
			</table>
			<ServerSidePagination
				queryFunction={getCps}
				updateData={updateCps}
				updateParentPageSize={setPageSize}
				updatePage={setCurrentPage}
				getCountAndIds={remoteActions.getItemsCountAndIds}
				cps={cps}
			/>
			{/* below line is just to test react query states later */}
			{/* <ReactQueryDevtools initialIsOpen={false} /> */}
		</>
	);
}
