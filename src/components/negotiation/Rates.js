import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import './Rates.scss';
import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';

class Rates extends React.Component {
	constructor(props) {
		super(props);
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
					<div className="list-cell">Name</div>
					<div className="list-cell">Rate Value</div>
					<div className="list-cell">Negotiated Value</div>
				</div>
				<ul className="rc-list">
					{this.props.rateCards.map((rc, i) => {
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
										return (
											<li key={rcl.Id} className="list-row">
												<div className="list-cell">
													<Icon name="priority" width="14" color={flagColor} />{' '}
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
			</div>
		);
	}
}

export default Rates;
