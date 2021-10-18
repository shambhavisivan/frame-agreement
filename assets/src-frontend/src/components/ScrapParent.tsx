import React, { ReactElement, useState } from 'react';
import { remoteActions } from '../datasources';
import './ScrapParentStyles.scss';
import { Pagination } from './ScrapPagination';

interface CurrentPageInfo {
	currentPage: number;
	pageSize: number;
}

export function ScrapParent(): ReactElement {
	// TODO: move cps to react-query store
	const [cps, setCps] = useState([]);
	const [currentPageDetails, setCurrentPageDetails] = useState<CurrentPageInfo>({
		currentPage: 0,
		pageSize: 5
	});

	/* eslint-disable  @typescript-eslint/no-explicit-any */
	const getCps = async (queryLimit: number, lastRecordId?: string | null): Promise<any> => {
		const commercialProducts = await remoteActions.queryProducts(
			[],
			'',
			lastRecordId ? lastRecordId : null,
			queryLimit
		);
		return commercialProducts;
	};

	/* eslint-disable  @typescript-eslint/no-explicit-any */
	const updateCps = (cpResponse: any): void => {
		const newCps = JSON.parse(JSON.stringify(cps));
		cpResponse.map((item: any) => {
			newCps.push(item);
		});
		setCps(newCps);
	};

	/* eslint-disable  @typescript-eslint/no-explicit-any */
	const currentPageData = (): any => {
		const firstPageIndex = (currentPageDetails.currentPage - 1) * currentPageDetails.pageSize;
		const lastPageIndex = firstPageIndex + currentPageDetails.pageSize;
		//TODO: in actual implementation add sorting as per business requirements if needed.
		return cps.slice(firstPageIndex, lastPageIndex);
	};

	const msg = <h1>Loading... !</h1>;
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
						: msg}
				</tbody>
			</table>
			<Pagination
				queryFunction={getCps}
				updateData={updateCps}
				updatePage={setCurrentPageDetails}
				// TODO: cps will be removed from props once it can be fetched from react query store
				cps={cps}
			/>
		</>
	);
}
