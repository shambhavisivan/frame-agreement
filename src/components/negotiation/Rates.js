import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import './Rates.scss';
import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';

import { validateRateCardLines } from './Validation';

class Rates extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			validation: validateRateCardLines(
				this.props.rateCards,
				this.props.attachment
			)
		};
	}

	negotiateInline(rc, rcl, value) {
		let negotiation = this.props.attachment;
		negotiation[rc.Id] = negotiation[rc.Id] || {};
		negotiation[rc.Id][rcl.Id] = value;

		let negotiationFormat = {
			rcl,
			negotiatedValue: value
		};

		let _validation = validateRateCardLines(negotiationFormat, rc.authId);
		this.setState(
			{ validation: { ...this.state.validation, ..._validation } },
			() => {
				console.log('Validation:', this.state.validation);
			}
		);

		this.props.onNegotiate(negotiation);
	}

	render() {
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
													<Icon name="priority" width="14" color="#4bca81" />{' '}
													{rcl.Name}
												</div>
												<div className="list-cell">
													{rcl.cspmb__rate_value__c || '-/-'}
												</div>
												<div className="list-cell negotiable">
													<InputNegotiate
														invalid={this.state.validation[rcl.Id]}
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
