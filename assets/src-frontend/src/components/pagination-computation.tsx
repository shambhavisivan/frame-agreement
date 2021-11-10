import React, { ReactElement } from 'react';
import { Pagination } from './pagination';

interface PaginationComputationProps {
	updatePageSize: (newPageSize: number) => void;
	updatePage: (newPage: number) => void;
	setLastRecordId: (lastRecordId: string | null) => void;
	allIds: string[];
	filterApplied?: string;
}

export function PaginationComputation(props: PaginationComputationProps): ReactElement {
	const onNextPageClickHandler = (newPage: number, pageSize: number): void => {
		const previousPageFirstIndex = (newPage - 2) * pageSize;
		const previousPageLastIndex = previousPageFirstIndex + pageSize - 1;

		props.setLastRecordId(props.allIds[previousPageLastIndex]);
	};

	const onPageSizeChangeHandler = (): void => {
		props.setLastRecordId(null);
	};

	const getPageNumbers = (currentPage: number, pageSize: number): number[] => {
		// 5 is taken by default as the number of page numbers that will be displayed at a time.
		const pageNumbers: number[] = [];
		const totalNoOfPages = Math.ceil(props.allIds.length / pageSize);
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

	const isRightPageRangeArrowDisabled = (currentPage: number, pageSize: number): boolean => {
		const totalNoOfPages = Math.ceil(props.allIds.length / pageSize);

		const upperPageLimit = currentPage % 5 === 0 ? currentPage : Math.ceil(currentPage / 5) * 5;
		if (upperPageLimit + 1 > totalNoOfPages) {
			return true;
		} else {
			return false;
		}
	};

	const isLeftPageRangeArrowDisabled = (currentPage: number): boolean => {
		const previousPageUpperLimit =
			currentPage % 5 === 0 ? currentPage - 5 : Math.floor(currentPage / 5) * 5;
		if (previousPageUpperLimit < 1) {
			return true;
		} else {
			return false;
		}
	};

	const hasMorePages = (currentPage: number, pageSize: number): boolean => {
		const newFirstpageIndex = (currentPage - 1) * pageSize;
		const newLastPageIndex = newFirstpageIndex + pageSize - 1;
		return newLastPageIndex + 1 <= props.allIds.length - 1 ? true : false;
	};

	return (
		<Pagination
			onNextPageClickHandler={onNextPageClickHandler}
			onPageSizeChangeHandler={onPageSizeChangeHandler}
			updatePage={props.updatePage}
			updatePageSize={props.updatePageSize}
			getPageNumbers={getPageNumbers}
			isRightPageRangeArrowDisabled={isRightPageRangeArrowDisabled}
			isLeftPageRangeArrowDisabled={isLeftPageRangeArrowDisabled}
			hasMorePages={hasMorePages}
			totalCount={props.allIds.length}
			shouldResetPage={props.filterApplied}
		/>
	);
}
