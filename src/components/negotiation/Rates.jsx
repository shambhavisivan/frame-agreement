import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import './Rates.scss';
import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';
import Pagination from '../utillity/Pagination';

class Rates extends React.Component {
	constructor(props) {
		super(props);

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

	render() {
		let flagColor = this.props.readOnly ? '#ccc' : '#4bca81';

		return (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">
						{window.SF.labels.rate_cards_header_name}
					</div>
					<div className="list-cell">
						{window.SF.labels.rate_cards_header_value}
					</div>
					<div className="list-cell">
						{window.SF.labels.rate_cards_header_value_neg}
					</div>
				</div>
				<ul className="rc-list">
					{this.props.rateCards
						.paginate(
							this.state.pagination.page,
							this.state.pagination.pageSize
						)
						.map((rc, i) => {
							return (
								<li key={rc.Id} className="list-item">
									<div className="rc-title">
										<div className="title-upper" />
										<div className="title-content">
											<Icon name="announcement" width="14" color="#706e6b" />{' '}
											{rc.Name}
										</div>
										<div className="title-lower"> </div>
									</div>

									<ul className="table-list">
										{rc.rateCardLines.map((rcl, i) => {
											if (this.props.validation[rcl.Id]) {
												flagColor = '#D9675D';
											}

											return (
												<li key={rcl.Id} className="list-row">
													<div className="list-cell">
														<Icon
															name="priority"
															width="14"
															color={flagColor}
														/>{' '}
														{rcl.Name}
													</div>
													<div className="list-cell">
														{rcl.cspmb__rate_value__c || '-/-'}
													</div>
													<div className="list-cell negotiable">
														<InputNegotiate
															readOnly={this.props.readOnly}
															invalid={this.props.validation[rcl.Id]}
															onChange={val => {
																this.negotiateInline(rc, rcl, val);
															}}
															negotiatedValue={
																(this.props.attachment[rc.Id] &&
																	this.props.attachment[rc.Id][rcl.Id]) ||
																rcl.cspmb__rate_value__c ||
																0
															}
															originalValue={rcl.cspmb__rate_value__c}
														/>
													</div>
												</li>
											);
										})}
									</ul>
								</li>
							);
						})}
				</ul>

				<Pagination
					totalSize={this.props.rateCards.length}
					pageSize={this.state.pagination.pageSize}
					page={this.state.pagination.page}
					onPageSizeChange={newPageSize => {
						this.setState({
							pagination: { ...this.state.pagination, pageSize: newPageSize }
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
