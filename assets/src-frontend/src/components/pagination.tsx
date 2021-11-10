import React, { ReactElement, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import '../sass/PaginationStyles.scss';
import { PAGE_SIZES } from '../app-constants';

interface PaginationComponentProps {
	onNextPageClickHandler: (nextPage: number, pageSize: number) => void;
	onPageSizeChangeHandler: () => void;
	updatePage: (currentPage: number) => void;
	updatePageSize: (pageSize: number) => void;
	getPageNumbers: (currentPage: number, pageSize: number) => number[];
	isRightPageRangeArrowDisabled: (currentPage: number, pageSize: number) => boolean;
	isLeftPageRangeArrowDisabled: (currentPage: number) => boolean;
	hasMorePages: (currentPage: number, pageSize: number) => boolean;
	totalCount: number;
	shouldResetPage?: string;
}

export function Pagination(props: PaginationComponentProps): ReactElement {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
	const [hasMorePages, setHasMorePages] = useState(false);

	const prevResetState = useRef<string>();

	useEffect(() => {
		if (props.shouldResetPage && props.shouldResetPage !== prevResetState.current) {
			setCurrentPage(1);
			prevResetState.current = props.shouldResetPage;
		}
		setHasMorePages(props.hasMorePages(currentPage, pageSize));
	});

	useEffect(() => {
		props.updatePage(currentPage);
	}, [currentPage]);

	useEffect(() => {
		props.updatePage(currentPage);
		props.updatePageSize(pageSize);
	}, [pageSize]);

	const callPageSizeChangeHandler = (event: React.FormEvent<HTMLSelectElement>): void => {
		setPageSize(+event.currentTarget.value);
		setCurrentPage(1);
		props.onPageSizeChangeHandler();
	};

	const callNextPageRangeClickHandler = (): void => {
		const newPage = Math.ceil(currentPage / 5) * 5 + 1;
		setCurrentPage(newPage);
		props.onNextPageClickHandler(newPage, pageSize);
	};

	const callPreviousPageRangeClickHandler = (): void => {
		const newPage = Math.floor(currentPage / 5) * 5 - 4;
		setCurrentPage(newPage);
		props.onNextPageClickHandler(newPage, pageSize);
	};

	return (
		<ul className={classnames('pagination-container')}>
			{/* Left page range navigation arrow */}
			<li
				className={classnames('pagination-item', {
					disabled: props.isLeftPageRangeArrowDisabled(currentPage)
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
				onClick={(): void => {
					setCurrentPage((prevState) => prevState - 1);
					props.onNextPageClickHandler(currentPage - 1, pageSize);
				}}
			>
				<div className="arrow left" />
			</li>
			{/* Page numbers */}
			{props.getPageNumbers(currentPage, pageSize).map((pgNo) => {
				return (
					<li
						className={classnames('pagination-item', {
							selected: currentPage === pgNo
						})}
						onClick={(): void => {
							setCurrentPage(pgNo);
							props.onNextPageClickHandler(pgNo, pageSize);
						}}
					>
						{pgNo}
					</li>
				);
			})}
			{/*  Right Navigation arrow */}
			<li
				className={classnames('pagination-item', {
					disabled: !hasMorePages
				})}
				onClick={(): void => {
					setCurrentPage((prevState) => prevState + 1);
					props.onNextPageClickHandler(currentPage + 1, pageSize);
				}}
			>
				<div className="arrow right" />
			</li>
			{/* Right page range navigation arrow */}
			<li
				className={classnames('pagination-item', {
					disabled: props.isRightPageRangeArrowDisabled(currentPage, pageSize)
				})}
				onClick={callNextPageRangeClickHandler}
			>
				<div className="arrow right" />
				<div className="arrow right" />
			</li>
			{/* Page size select drop-down */}
			<li>
				<select value={pageSize} onChange={callPageSizeChangeHandler}>
					{PAGE_SIZES.map((val) => {
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
