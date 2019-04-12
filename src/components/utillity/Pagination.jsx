import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';

import Icon from './Icon';

class Pagination extends Component {
	constructor(props) {
		super(props);
		this.onPageChange = this.onPageChange.bind(this);
		this.onPageSizeChange = this.onPageSizeChange.bind(this);

		this.pageSizes = [10, 20, 50, 100];
	}

	onPageSizeChange(event) {
		this.props.onPageSizeChange(+event.target.value);
	}

	onPageChange(data) {
		this.props.onPageChange(data.selected + 1);
	}

	render() {
		const pageCount = Math.ceil(this.props.totalSize / this.props.pageSize);

		let pagination = '';
		if (this.props.totalSize > this.pageSizes[0]) {
			pagination = (
				<div className="fa-pagination-container">
					<ReactPaginate
						previousLabel={<Icon name="left" width="14" color="#0070d2" />}
						nextLabel={<Icon name="right" width="14" color="#0070d2" />}
						breakLabel={'...'}
						breakClassName={'fa-pagination-ellipsis'}
						pageCount={pageCount}
						marginPagesDisplayed={2}
						pageRangeDisplayed={5}
						onPageChange={this.onPageChange}
						containerClassName={'fa-pagination'}
						subContainerClassName={'pages pagination'}
						pageClassName={'page'}
						activeClassName={'active'}
					/>

					<select value={this.props.pageSize} onChange={this.onPageSizeChange}>
						{this.pageSizes.map(val => {
							return (
								<option key={val} value={val}>
									{val}
								</option>
							);
						})}
					</select>
				</div>
			);
		}

		return pagination;
	}
}

export default Pagination;
