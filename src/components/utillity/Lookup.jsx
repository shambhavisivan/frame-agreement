import React, { Component } from 'react';

import InputSearch from './inputs/InputSearch';
import Icon from './Icon';
import Loading from './Loading';

import Pagination from './Pagination';
import { truncateCPField, decodeEntities } from '../../utils/shared-service';

import './Lookup.scss';

const RecordSkeleton = props => {
	let skeletonStyle = {
		width: '120px',
		height: '16px'
	};

	let cellContainer = {
		flex: '1'
	};

	let skeletonRowStyle = {
		display: 'flex',
		width: '100%',
		borderRadius: '2px',
		background: 'white',
		boxShadow: '0 1px 0 0 rgba(0, 0, 0, 0.22)',
		justifyContent: 'space-between',
		marginBottom: '6px',
		padding: '6px 12px'
	};

	let skeletonContainerStyle = {
		display: 'flex',
		flexDirection: 'column',
		padding: '16px',
		background: '#f2f3f3',
		maxHeight: '20rem',
		overflowY: 'auto'
	};

	const _arr = Array(10).fill(10);

	return (
		<div className="skeleton-table-item" style={skeletonContainerStyle}>
			{_arr.map((c, i) => (
				<div
					key={c + '' + i}
					className="skeleton-table-item"
					style={skeletonRowStyle}
				>
					{props.cells.map(cc => (
						<div key={cc} style={cellContainer}>
							<div className="skeleton-shape" style={skeletonStyle} />
						</div>
					))}
				</div>
			))}
		</div>
	);
};

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

		let _body = <RecordSkeleton cells={this.props.columns || []} />;

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
									return <span key={c}>{record[c]}</span>;
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
							placeholder="Filter records..."
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
