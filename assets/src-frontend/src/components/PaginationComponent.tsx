import React, { ReactElement, useEffect, useState } from 'react';
import classnames from 'classnames';
import './ScrapPaginationStyles.scss';

interface PaginationComponentProps {
	/* eslint-disable  @typescript-eslint/no-explicit-any */
	onPreviousPageClickHandler: (previousPage: number) => any;
	onNextPageClickHandler: (nextPage: number) => any;
	onPageSizeChangeHandler: (newPageSize: number, currentPage: number) => any;
	updatePage: (currentPage: number) => any;
	updatePageSize: (pageSize: number) => any;
	hasMoreRecords: boolean;
	totalCount: number;
	// isPrefetchOn is optional and can be ignored while using this component for client side pagination.
	isPrefetchOn?: boolean;
	/* eslint-disable  @typescript-eslint/no-explicit-any */
}

export function PaginationComponent(props: PaginationComponentProps): ReactElement {
	const pageSizes: number[] = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 100];

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(1);

	useEffect(() => {
		props.updatePage(currentPage);
		props.updatePageSize(pageSize);
	}, []);

	const callPageSizeChangeHandler = (event: React.FormEvent<HTMLSelectElement>): void => {
		setPageSize(+event.currentTarget.value);
		setCurrentPage(1);
		props.onPageSizeChangeHandler(+event.currentTarget.value, currentPage);
	};

	const getPageNumbers = (): number[] => {
		const pageNumbers: number[] = [];
		const totalNoOfPages = Math.ceil(props.totalCount / pageSize);
		let lowerPageLimit = 0;
		let upperPageLimit = 0;

		if (currentPage % 5 === 0) {
			lowerPageLimit = currentPage - 5 + 1;
			upperPageLimit = currentPage;
		} else {
			lowerPageLimit = Math.floor(currentPage / 5) * 5 + 1;
			upperPageLimit = Math.ceil(currentPage / 5) * 5;
		}

		for (let i = lowerPageLimit; i <= upperPageLimit; i++) {
			if (i <= totalNoOfPages) {
				pageNumbers.push(i);
			} else {
				break;
			}
		}
		return pageNumbers;
	};

	const callNextPageRangeClickHandler = (): void => {
		// 5 in the page numbers range.
		const newPage = Math.ceil(currentPage / 5) * 5 + 1;
		setCurrentPage(newPage);
		props.onNextPageClickHandler(newPage);
	};

	const callPreviousPageRangeClickHandler = (): void => {
		const newPage = Math.floor(currentPage / 5) * 5 - 4;
		setCurrentPage(newPage);
		props.onPreviousPageClickHandler(newPage);
	};

	const isRightPageRangeArrowDisabled = (): boolean => {
		const totalNoOfPages = Math.ceil(props.totalCount / pageSize);

		const upperPageLimit = currentPage % 5 === 0 ? currentPage : Math.ceil(currentPage / 5) * 5;
		if (upperPageLimit + 1 > totalNoOfPages) {
			return true;
		} else {
			return false;
		}
	};

	const isLeftPageRangeArrowDisabled = (): boolean => {
		const previousPageUpperLimit =
			currentPage % 5 === 0 ? currentPage - 5 : Math.floor(currentPage / 5) * 5;
		if (previousPageUpperLimit < 1) {
			return true;
		} else {
			return false;
		}
	};

	return (
		<ul className={classnames('pagination-container')}>
			{/* Left page range navigation arrow */}
			<li
				className={classnames('pagination-item', {
					disabled: isLeftPageRangeArrowDisabled()
				})}
				onClick={callPreviousPageRangeClickHandler}
			>
				<div className="arrow left" />
				<div className="arrow left" />
			</li>
			{/* Left page navigation arrow */}
			<li
				className={classnames('pagination-item', {
					disabled: currentPage === 1
				})}
				onClick={() => {
					setCurrentPage((prevState) => prevState - 1);
					props.onPreviousPageClickHandler(currentPage - 1);
				}}
			>
				<div className="arrow left" />
			</li>
			{/* Current page number*/}
			{getPageNumbers().map((pgNo) => {
				return (
					<li
						className={classnames('pagination-item', {
							selected: currentPage === pgNo
						})}
						onClick={() => {
							setCurrentPage(pgNo);
							props.onNextPageClickHandler(pgNo);
						}}
					>
						{pgNo}
					</li>
				);
			})}
			{/*  Right Navigation arrow */}
			<li
				className={classnames('pagination-item', {
					disabled: !props.hasMoreRecords || props.isPrefetchOn
				})}
				onClick={() => {
					setCurrentPage((prevState) => prevState + 1);
					props.onNextPageClickHandler(currentPage + 1);
				}}
			>
				<div className="arrow right" />
			</li>
			{/* Right page range navigation arrow */}
			<li
				className={classnames('pagination-item', {
					// disable if next page is greater than toatl number of pages.
					disabled: isRightPageRangeArrowDisabled()
				})}
				onClick={callNextPageRangeClickHandler}
			>
				<div className="arrow right" />
				<div className="arrow right" />
			</li>
			{/* Page size select drop-down */}
			<li>
				<select value={pageSize} onChange={callPageSizeChangeHandler}>
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
