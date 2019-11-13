import React, { Component } from 'react';

import InputSearch from './inputs/InputSearch';
import Loading from './Loading';

import Pagination from './Pagination';
import { truncateCPField, decodeEntities } from '../../utils/shared-service';
import { LookupSkeleton } from '../skeletons/LookupSkeleton';

class Lookup extends React.Component {
	// this.props.onChange X
	// this.props.onSearch
	// this.props.onPageChange
	// this.props.data
	// this.props.count
	// this.props.loading
	// this.props.columns
	// this.props.selected

	constructor(props) {
		super(props);

		this.onSearch = this.onSearch.bind(this);
		this.onPageChange = this.onPageChange.bind(this);

		this.state = {
			searchValue: '',
			page: this.props.hasOwnProperty('forcePage') ? this.props.forcePage : 1
		};
	}

	onSearch(val) {
		this.setState({ searchValue: val, page: 1 }, () => {
			this.props.onSearch(val);
		});
	}

	onPageChange(newPage) {
		this.setState({ page: newPage }, () => {
			this.props.onPageChange(newPage);
		});
	}

	render() {
		let pagination = '';
		if (this.props.count > 20) {
			pagination = (
				<Pagination
					totalSize={this.props.count}
					pageSize={20}
					page={this.state.page}
					restricted={true}
					onPageChange={this.onPageChange}
					disabled={this.props.disabled}
				/>
			);
		}

		let _body = <LookupSkeleton cells={this.props.columns || []} />;

		if (!this.props.loading) {
			_body = (
				<div className="fa-modal-product-list">
					{this.props.data.paginate(this.state.page, 20).map(record => {
						return (
							<div
								key={record.Id}
								className={
									'product-row' +
									(this.props.selected.Id === record.Id ? ' selected' : '')
								}
								onClick={() => this.props.onChange(record)}
							>
								{this.props.columns.map(c => {
									return <span key={c}>{record[c] || '-'}</span>;
								})}
							</div>
						);
					})}
				</div>
			);
		}

		return (
			<div className="accounts-lookup modal-table-container">
				<Loading loading={this.props.loading} />

				<div className="modal-navigation">
					<div className="search-container">
						<InputSearch
							placeholder={
								window.SF.labels.modal_lookup_input_search_placeholder
							}
							value={this.state.searchValue}
							onChange={this.onSearch}
						/>
					</div>
				</div>

				<div>
					<div className="fa-modal-product-list-header">
						{this.props.columns.map(c => {
							return (
								<div key={c} className="header-th">
									<span>{truncateCPField(c)}</span>
								</div>
							);
						})}
					</div>

					{_body}
				</div>

				{pagination}
			</div>
		);
	}
}

export default Lookup;

// onPageChange={newPage => {
//   this.setState({
//     pagination: { ...this.state.pagination, page: newPage }
//   });
// }}
