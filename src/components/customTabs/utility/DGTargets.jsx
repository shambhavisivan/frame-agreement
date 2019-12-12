import React, { Component } from 'react';
import { truncateCPField, getFieldLabel } from '../../../utils/shared-service';
import Pagination from '../../utillity/Pagination';

const DEFAULT_TARGET = 'product';

class DGTargets extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = {
			page: 1,
			target: this.props.target || DEFAULT_TARGET
		};

		console.log(this.props);
	}

	showRecordsForTarget(target = this.props.target) {
		this.setState({
			target: target
		});

		this.props.onTest(target);
	}

	render() {
		let fields = [...new Set(this.props.fields)];
		let _records;

		if (this.props.hasOwnProperty('bothEntities')) {
			try {
				_records = Object.values(this.props.results[this.state.target] || {});
			} catch (err) {
				console.log('Cannot parse results:', this.props);
			}
		} else {
			_records = this.props.results;
		}

		return (
			<div className="dg-results-container">
				<div className="fa-modal-product-list-header">
					<div className="header-th">Name</div>
					{fields.map(f => {
						return (
							<div key={f} className="header-th">
								<span>
									{getFieldLabel('csfamext__Dynamic_Group__c', f) ||
										truncateCPField(f)}
								</span>
							</div>
						);
					})}
				</div>
				<div className="fa-modal-product-list">
					{_records.paginate(this.state.page, 10).map(record => {
						return (
							<div key={record.Id} className="product-row">
								<span>{record.Name}</span>
								{fields.map(f => {
									return (
										<span key={record.Id + '-' + f}>
											{record.hasOwnProperty(f) ? record[f] : '-'}
										</span>
									);
								})}
							</div>
						);
					})}

					{!_records.length ? (
						<div className="product-row">No targets found for this group!</div>
					) : (
						''
					)}
				</div>

				<div className="fa-modal-footer">
					{this.props.bothEntities ? (
						<div className="fa-footer-btn-container">
							<button
								className="fa-button fa-button--brand"
								onClick={() => this.showRecordsForTarget('product')}
							>
								Test Products
							</button>
							<button
								className="fa-button fa-button--brand"
								onClick={() => this.showRecordsForTarget('rcl')}
							>
								Test Rate Card Lines
							</button>
						</div>
					) : (
						<button
							className="fa-button fa-button--brand"
							onClick={() => this.showRecordsForTarget()}
						>
							Test Group
						</button>
					)}

					{_records.length > 10 ? (
						<div className="pagination-container">
							<Pagination
								totalSize={_records.length}
								pageSize={10}
								page={this.state.page}
								onPageChange={newPage => {
									this.setState({
										page: newPage
									});
								}}
							/>
						</div>
					) : (
						''
					)}
				</div>
			</div>
		);
	}
}

export default DGTargets;
