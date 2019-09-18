import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';
import Pagination from '../utillity/Pagination';

export class Rates extends React.Component {
	constructor(props) {
		super(props);

		this.paginationFormat = this.paginateRateCards(10);

		this.state = {
			pagination: {
				page: 1,
				pageSize: 10
			}
		};
	}

	negotiateInline(rc, rcl, value) {
		let negotiation = this.props.attachment;
		negotiation[rc.Id] = negotiation[rc.Id] || {};
		negotiation[rc.Id][rcl.Id] = value;

		this.props.onNegotiate(negotiation);
	}

	// Might need to revert
	// UNSAFE_componentWillUpdate(nextProps, nextState) {
	// 	if (nextState.pagination.pageSize !== this.state.pagination.pageSize) {
	// 		this.paginationFormat = this.paginateRateCards(
	// 			nextState.pagination.pageSize
	// 		);
	// 	}
	// }

	componentWillUpdate(prevProps, prevState) {
		if (prevState.pagination.pageSize !== this.state.pagination.pageSize) {
			this.paginationFormat = this.paginateRateCards(
				this.state.pagination.pageSize
			);
		}
	}

	// Behold
	paginateRateCards(pageSize) {
		let _rcMap = {};
		this.props.rateCards.forEach(rc => {
			_rcMap[rc.Id] = { Id: rc.Id, Name: rc.Name };
			if (rc.hasOwnProperty('authId')) {
				_rcMap[rc.Id].authId = rc.authId;
			}
		});

		let _mergedRcl = this.props.rateCards.reduce((acc, iterator, i) => {
			return acc.concat([], iterator.rateCardLines);
		}, []);

		let _chunked = _mergedRcl.chunk(pageSize);

		let paginated = _chunked.map(_set => {
			let _rcPageMap = {};

			_set.forEach(rcl => {
				if (!_rcPageMap.hasOwnProperty(rcl.cspmb__Rate_Card__c)) {
					_rcPageMap[rcl.cspmb__Rate_Card__c] = {
						..._rcMap[rcl.cspmb__Rate_Card__c]
					};
					_rcPageMap[rcl.cspmb__Rate_Card__c].rateCardLines = [];
				}
				_rcPageMap[rcl.cspmb__Rate_Card__c].rateCardLines.push(rcl);
			});

			return Object.values(_rcPageMap);
		});

		console.log(paginated);
		return paginated;
	}

	render() {
		let flagColor = '#4bca81';

		return (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">
						{window.SF.labels.rate_cards_header_name}
					</div>
					<div className="list-cell">
						{window.SF.labels.rate_cards_header_usage}
					</div>
					<div className="list-cell">
						{window.SF.labels.rate_cards_header_value}
					</div>
					<div className="list-cell">
						{window.SF.labels.rate_cards_header_value_neg}
					</div>
				</div>
				<ul className="fa-modal-list">
					{(this.paginationFormat[this.state.pagination.page - 1] || []).map(
						(rc, i) => {
							return (
								<li key={rc.Id} className="list-item">
									<div className="rate-card-title">
										<div className="title-upper" />
										<div className="title-content">
											<Icon name="announcement" width="14" color="#706e6b" />
											{rc.Name}
										</div>
										<div className="title-lower"> </div>
									</div>

									<ul className="table-list">
										{rc.rateCardLines.map((rcl, i) => {
											if (this.props.validation[rcl.Id]) {
												flagColor = '#D9675D';
											}

											if (this.props.readOnly) {
												flagColor = '#ccc';
											}

											let _negValue;
											if (
												this.props.attachment.hasOwnProperty(rc.Id) &&
												this.props.attachment[rc.Id].hasOwnProperty(rcl.Id)
											) {
												_negValue = this.props.attachment[rc.Id][rcl.Id];
											} else {
												_negValue = rcl.cspmb__rate_value__c || 0;
											}

											return (
												<li key={rcl.Id} className="list-row">
													<div className="list-cell">
														<Icon
															name="priority"
															width="14"
															color={flagColor}
														/>
														{rcl.Name}
													</div>
													<div className="list-cell">
														{rcl.usageTypeName ? rcl.usageTypeName : 'N/A'}
													</div>
													<div className="list-cell">
														{rcl.hasOwnProperty('cspmb__rate_value__c')
															? rcl.cspmb__rate_value__c
															: 'N/A'}
													</div>
													<div className="list-cell negotiable">
														<InputNegotiate
															readOnly={this.props.readOnly}
															invalid={this.props.validation[rcl.Id]}
															max={rcl.cspmb__rate_value__c}
															onChange={val => {
																this.negotiateInline(rc, rcl, val);
															}}
															negotiatedValue={_negValue}
															originalValue={rcl.cspmb__rate_value__c}
														/>
													</div>
												</li>
											);
										})}
									</ul>
								</li>
							);
						}
					)}
				</ul>

				<Pagination
					totalSize={
						this.paginationFormat.length * this.state.pagination.pageSize
					}
					pageSize={this.state.pagination.pageSize}
					page={this.state.pagination.page}
					onPageSizeChange={newPageSize => {
						this.setState({
							pagination: {
								...this.state.pagination,
								pageSize: newPageSize,
								page: 1
							}
						});
					}}
					onPageChange={newPage => {
						this.setState({
							pagination: { ...this.state.pagination, page: newPage }
						});
					}}
				/>
			</div>
		);
	}
}

export default Rates;
