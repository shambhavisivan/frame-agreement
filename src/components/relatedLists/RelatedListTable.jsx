import { connect } from 'react-redux';
import React, { Component } from 'react';

import { truncateCPField, getFieldLabel } from '~/src/utils/shared-service.js';
import Pagination from '~/src/components/utillity/Pagination';
import Icon from '../utillity/Icon';

const tryParse = entity => {
	try {
		entity = JSON.parse(entity);
	} catch (err) {}
	return entity;
};

class RelatedLists extends Component {
	constructor(props) {
		super(props);

		this.state = {
			page: 1,
			pageSize: 10
		};
	}

	render() {
		let _falseIcon = (
			<Icon name="clear" height="14" width="14" color="#d9675d" />
		);
		let _trueIcon = (
			<Icon name="success" height="14" width="14" color="#4bca81" />
		);

		return (
			<div className="fa-related-list">
				<h4>{this.props.list.label}</h4>
				<div className="fa-modal-product-list-header">
					{this.props.list.columns.map(f => {
						return (
							<div key={f} className="header-th">
								<span>
									{getFieldLabel(this.props.list.object, f) ||
										truncateCPField(f, true)}
								</span>
							</div>
						);
					})}
				</div>
				<div className="fa-modal-product-list">
					{this.props.list.records
						.paginate(this.state.page, this.state.pageSize)
						.map((rlf, i) => {
							return (
								<div key={this.props.list.label + i} className="product-row">
									{this.props.list.columns.map(f => {
										let _val = rlf.hasOwnProperty(f) ? rlf[f].toString() : null;

										if (_val !== null) {
											_val = tryParse(_val);

											if (typeof _val === 'boolean') {
												_val = _val ? _trueIcon : _falseIcon;
											}
										}

										_val = _val || '-';

										return <span key={f + '-' + i}>{_val}</span>;
									})}
								</div>
							);
						})}
					{this.props.list.records.length ? null : (
						<span className="empty-rl-message">
							{window.SF.labels.rl_emptyList ||
								'No records for this related list'}
						</span>
					)}
				</div>

				{this.props.list.records.length > 10 ? (
					<div className="pagination-container">
						<Pagination
							totalSize={this.props.list.records.length}
							pageSize={this.state.pageSize}
							page={this.state.page}
							onPageSizeChange={newPageSize => {
								this.setState(
									{
										pageSize: newPageSize
									},
									() => console.log(newPageSize)
								);
							}}
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
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		settings: state.settings
	};
};

const mapDispatchToProps = {};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RelatedLists);
