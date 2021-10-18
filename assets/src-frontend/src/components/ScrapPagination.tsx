import React, { ReactElement, useEffect, useState } from 'react';
import classnames from 'classnames';
import './ScrapPaginationStyles.scss';

interface LastRecord {
	lastRecordIndex: number;
	lastRecordId: string | null;
}

interface CurrentPageInfo {
	currentPage: number;
	pageSize: number;
}

interface PaginationProps {
	// supply react-query's refetch this should catch the data
	/* eslint-disable  @typescript-eslint/no-explicit-any */
	queryFunction: (queryLimit: number, lastRecordId?: string | null) => any;
	updateData: (cpList: any) => void;
	/* eslint-disable  @typescript-eslint/no-explicit-any */
	updatePage: (pageDetails: CurrentPageInfo) => any;
	// TODO: cps will be removed from props in the actual implementation and got from store/ react query.
	cps: any;
}

export function Pagination(props: PaginationProps): ReactElement {
	const defaultQueryLimit = 4;
	const pageSizes: number[] = [2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];

	const [currentPage, setCurrentPage] = useState(1);
	const [isPrefetchOn, setIsPrefetchOn] = useState(true);
	const [pageSize, setPageSize] = useState(2);
	const [hasMoreRecords, setHasMoreRecords] = useState(false);

	const [lastRecord, setLastRecord] = useState<LastRecord>({
		lastRecordIndex: -1,
		lastRecordId: null
	}); // 'a1P4K000007OauGUAS'
	useEffect(() => {
		props
			.queryFunction(
				defaultQueryLimit > 2 * pageSize ? defaultQueryLimit : 2 * pageSize,
				lastRecord.lastRecordId
			)
			.then((cpResponse: any[]) => {
				setIsPrefetchOn(false);
				if (cpResponse && cpResponse.length !== 0) {
					props.updateData(cpResponse);
					const index = cpResponse.length - 1;
					const id = cpResponse[index].id;
					setLastRecord({
						lastRecordIndex: index,
						lastRecordId: id
					});
					if (cpResponse.length > pageSize && cpResponse[pageSize]) {
						setHasMoreRecords(true);
					} else {
						setHasMoreRecords(false);
					}
					props.updatePage({
						currentPage: currentPage,
						pageSize: pageSize
					});
				}
			});
	}, []);

	const onPreviousPageClickHandler = (): void => {
		const prevPage = currentPage - 1;
		setCurrentPage((prevState) => prevState - 1);
		props.updatePage({
			currentPage: prevPage,
			pageSize: pageSize
		});

		if (!hasMoreRecords) {
			setHasMoreRecords(true);
		}
	};

	const onNextPageClickHandler = (): void => {
		const newPage = currentPage + 1;
		setCurrentPage((prevState) => prevState + 1);
		props.updatePage({
			currentPage: newPage,
			pageSize: pageSize
		});

		const newFirstpageIndex = (newPage - 1) * pageSize;
		const newLastPageIndex = newFirstpageIndex + pageSize - 1;

		//check if hasMoreRecords should be true or false to enable/ disable right arrow
		if (newLastPageIndex + 1 <= props.cps.length - 1) {
			setHasMoreRecords(true);
		} else {
			setIsPrefetchOn(true);
			props
				.queryFunction(
					defaultQueryLimit > pageSize ? defaultQueryLimit : pageSize,
					lastRecord.lastRecordId
				)
				.then((cpResponse: any) => {
					setIsPrefetchOn(false);
					if (cpResponse && cpResponse.length !== 0) {
						props.updateData(cpResponse);
						const index = cpResponse.length - 1;
						const id = cpResponse[index].id;
						setLastRecord({
							lastRecordIndex: index,
							lastRecordId: id
						});
						setHasMoreRecords(true);
					} else {
						setHasMoreRecords(false);
					}
				});
		}
	};

	const onPageSizeChangeHandler = (event: React.FormEvent<HTMLSelectElement>): void => {
		const newPageSize = +event.currentTarget.value;
		setPageSize(newPageSize);
		setCurrentPage(1);
		props.updatePage({ currentPage: 1, pageSize: newPageSize });

		if (newPageSize < pageSize) {
			if (!hasMoreRecords) {
				setHasMoreRecords(true);
			}
		} else {
			// check if records required for new page size is already available else fetch more.
			if (props.cps.length >= 2 * newPageSize) {
				if (!hasMoreRecords) {
					setHasMoreRecords(true);
				}
			} else {
				const queryLimit: number =
					props.cps.length >= newPageSize
						? defaultQueryLimit > newPageSize
							? defaultQueryLimit
							: pageSize
						: defaultQueryLimit > 2 * newPageSize
						? defaultQueryLimit
						: 2 * newPageSize;

				setIsPrefetchOn(true);
				props.queryFunction(queryLimit, lastRecord.lastRecordId).then((cpResponse: any) => {
					setIsPrefetchOn(false);

					if (cpResponse && cpResponse.length !== 0) {
						props.updateData(cpResponse);
						const index = cpResponse.length - 1;
						const id = cpResponse[index].id;
						setLastRecord({
							lastRecordIndex: index,
							lastRecordId: id
						});

						// check if next page first index would be within limits of the whole data list i.e. <= last index of the whole list.
						newPageSize <= props.cps.length + cpResponse.length - 1
							? setHasMoreRecords(true)
							: setHasMoreRecords(false);
					} else {
						setHasMoreRecords(false);
					}
				});
			}
		}
	};

	return (
		<ul className={classnames('pagination-container')}>
			{/* Left navigation arrow */}
			<li
				className={classnames('pagination-item', {
					disabled: currentPage === 1
				})}
				onClick={onPreviousPageClickHandler}
			>
				<div className="arrow left" />
			</li>
			{/* Current page number*/}
			<li
				className={classnames('pagination-item', {
					selected: true
				})}
			>
				{currentPage}
			</li>
			{/*  Right Navigation arrow */}
			<li
				className={classnames('pagination-item', {
					disabled: !hasMoreRecords || isPrefetchOn
				})}
				onClick={onNextPageClickHandler}
			>
				<div className="arrow right" />
			</li>
			{/* Page size select drop-down */}
			<li>
				<select value={pageSize} onChange={onPageSizeChangeHandler}>
					{pageSizes.map((val) => {
						return (
							<option key={val} value={val}>
								{val}
							</option>
						);
					})}
				</select>
			</li>
		</ul>
	);
}
