import React, { ReactElement, useEffect, useState } from 'react';
import './ScrapPaginationStyles.scss';
import { PaginationComponent } from './PaginationComponent';

interface ServerSidePaginationProps {
	// supply react-query's refetch this should catch the data
	/* eslint-disable  @typescript-eslint/no-explicit-any */
	queryFunction: (queryLimit: number, lastRecordId: string | null) => any;
	updateData: (
		cpList: any,
		newPage: number,
		pgSize: number,
		totalCount: number,
		isFirstUpdate?: boolean
	) => void;
	/* eslint-disable  @typescript-eslint/no-explicit-any */
	updateParentPageSize: (newPageSize: number) => any;
	updatePage: (newPage: number) => any;
	getCountAndIds:
		| ((
				sobjectName: string,
				cpType: string,
				cpRole: string
		  ) => Promise<Map<string, number | string[] | null>>)
		| ((id: string | null) => Promise<Map<string, number | string[] | null>>);
	cps: any;
}

export function ServerSidePagination(props: ServerSidePaginationProps): ReactElement {
	const [isPrefetchOn, setIsPrefetchOn] = useState(true);
	const [pageSize, setPageSize] = useState(0);
	const [hasMoreRecords, setHasMoreRecords] = useState(false);
	const [isInitialFetch, setIsInitialFetch] = useState(false);
	const [totalCount, setTotalCount] = useState(0);
	const [allIds, setAllIds] = useState<string[]>([]);

	useEffect(() => {
		setIsInitialFetch(true);
	}, []);

	useEffect(() => {
		const initialLoad = async (): Promise<void> => {
			await initialFetch();
			setIsInitialFetch(false);
		};

		props.updateParentPageSize(pageSize);
		if (isInitialFetch) {
			initialLoad();
		}
	}, [pageSize]);

	const getCountAndIds = async (): Promise<Map<string, number | string[] | null>> => {
		let responseData: Map<string, number | string[] | null> = new Map<
			string,
			number | string[] | null
		>();
		responseData = await props.getCountAndIds(
			'cspmb__price_item__c',
			'Commercial Product',
			'Basic'
		);

		return responseData;
	};

	const initialFetch = async (): Promise<void> => {
		const idsAndTotalCount = await getCountAndIds();
		const totCount = Object.values(idsAndTotalCount)[0];
		const ids = Object.values(idsAndTotalCount)[1];
		const sortedIds = ids !== null && ids.length > 0 ? ids.sort() : [null];

		setTotalCount(totCount);
		setAllIds(sortedIds);

		const cpResponse = await props.queryFunction(2 * pageSize, null);

		setIsPrefetchOn(false);
		if (cpResponse && cpResponse.length !== 0) {
			props.updateData(cpResponse, 1, 1, totCount);

			if (cpResponse.length > pageSize && cpResponse[pageSize]) {
				setHasMoreRecords(true);
			} else {
				setHasMoreRecords(false);
			}
		}
	};

	const onPreviousPageClickHandler = (previousPage: number): void => {
		props.updatePage(previousPage);

		const newFirstpageIndex = (previousPage - 1) * pageSize;

		if (Object.keys(props.cps[newFirstpageIndex]).length === 0) {
			setIsPrefetchOn(true);
			const previousPageFirstIndex = (previousPage - 2) * pageSize;
			const previousPageLastIndex = previousPageFirstIndex + pageSize - 1;
			const lastRecId = allIds[previousPageLastIndex];
			props.queryFunction(pageSize, lastRecId).then((cpResponse: any) => {
				setIsPrefetchOn(false);
				if (cpResponse && cpResponse.length !== 0) {
					props.updateData(cpResponse, previousPage, pageSize, totalCount);
				}
			});
		}

		if (!hasMoreRecords) {
			setHasMoreRecords(true);
		}
	};

	const onNextPageClickHandler = (newPage: number): void => {
		props.updatePage(newPage);

		const newFirstpageIndex = (newPage - 1) * pageSize;
		const newLastPageIndex = newFirstpageIndex + pageSize - 1;

		//check if hasMoreRecords should be true or false to enable/ disable right arrow
		newLastPageIndex + 1 <= allIds.length - 1
			? setHasMoreRecords(true)
			: setHasMoreRecords(false);

		let shouldFetchMore = false;
		for (let i = newFirstpageIndex; i <= newLastPageIndex && i <= totalCount - 1; i++) {
			shouldFetchMore = Object.keys(props.cps[i]).length === 0 ? true : false;
			if (shouldFetchMore) {
				break;
			}
		}
		if (shouldFetchMore) {
			setIsPrefetchOn(true);
			const previousPageFirstIndex = (newPage - 2) * pageSize;
			const previousPageLastIndex = previousPageFirstIndex + pageSize - 1;
			const lastRecId = allIds[previousPageLastIndex];
			props.queryFunction(pageSize, lastRecId).then((cpResponse: any) => {
				setIsPrefetchOn(false);
				if (cpResponse && cpResponse.length !== 0) {
					props.updateData(cpResponse, newPage, pageSize, totalCount);
				}
			});
		}
	};

	const onPageSizeChangeHandler = (newPageSize: number): void => {
		props.updatePage(1);
		setPageSize(newPageSize);

		if (newPageSize < pageSize) {
			setHasMoreRecords(true);
		} else {
			newPageSize < allIds.length ? setHasMoreRecords(true) : setHasMoreRecords(false);

			setIsPrefetchOn(true);

			props.queryFunction(newPageSize, null).then((cpResponse: any) => {
				setIsPrefetchOn(false);

				if (cpResponse && cpResponse.length !== 0) {
					props.updateData(cpResponse, 1, newPageSize, totalCount);
				}
			});
		}
	};

	return (
		<PaginationComponent
			onNextPageClickHandler={onNextPageClickHandler}
			onPreviousPageClickHandler={onPreviousPageClickHandler}
			onPageSizeChangeHandler={onPageSizeChangeHandler}
			updatePage={props.updatePage}
			updatePageSize={setPageSize}
			hasMoreRecords={hasMoreRecords}
			totalCount={totalCount}
			isPrefetchOn={isPrefetchOn}
		/>
	);
}
