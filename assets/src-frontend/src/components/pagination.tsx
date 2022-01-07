import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { PAGE_SIZES } from '../app-constants';
import { CSButtonGroup, CSButton, CSSelect } from '@cloudsense/cs-ui-components';

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
		if (props.shouldResetPage !== prevResetState.current) {
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
		<div className="pagination-container">
			<CSButtonGroup marginPosition="right">
				{/* Left page range navigation arrow */}
				<CSButton
					label="Left page range"
					labelHidden
					className="range-btn-left"
					iconName="jump_to_left"
					disabled={props.isLeftPageRangeArrowDisabled(currentPage)}
					onClick={callPreviousPageRangeClickHandler}
				/>
				{/* Left page navigation arrow */}
				<CSButton
					label="Left page navigation"
					labelHidden
					className="navigation-btn-left"
					iconName="chevronleft"
					disabled={currentPage === 1}
					onClick={(): void => {
						setCurrentPage((prevState) => prevState - 1);
						props.onNextPageClickHandler(currentPage - 1, pageSize);
					}}
				/>
				{/* Page numbers */}
				{props.getPageNumbers(currentPage, pageSize).map((pgNo, index) => {
					return (
						<CSButton
							label={pgNo.toString()}
							className={currentPage === pgNo ? 'page-btn-active' : 'page-btn'}
							btnStyle={currentPage === pgNo ? 'brand' : 'initial'}
							onClick={(): void => {
								setCurrentPage(pgNo);
								props.onNextPageClickHandler(pgNo, pageSize);
							}}
							key={index}
						/>
					);
				})}
				{/*  Right Navigation arrow */}
				<CSButton
					label="Right navigation"
					labelHidden
					className="navigation-btn-right"
					iconName="chevronright"
					disabled={!hasMorePages}
					onClick={(): void => {
						setCurrentPage((prevState) => prevState + 1);
						props.onNextPageClickHandler(currentPage + 1, pageSize);
					}}
				/>
				{/* Right page range navigation arrow */}
				<CSButton
					label="Right page range"
					labelHidden
					className="range-btn-right"
					iconName="jump_to_right"
					disabled={props.isRightPageRangeArrowDisabled(currentPage, pageSize)}
					onClick={callNextPageRangeClickHandler}
				/>
			</CSButtonGroup>
			{/* Page size select drop-down */}
			<>
				<CSSelect label="Page size select" labelHidden onChange={callPageSizeChangeHandler}>
					{PAGE_SIZES.map((val) => {
						return (
							<option key={val} value={val}>
								{val}
							</option>
						);
					})}
				</CSSelect>
			</>
		</div>
	);
}
