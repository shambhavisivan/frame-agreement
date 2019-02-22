import React, { Component } from 'react';
import Icon from '../utillity/Icon';

import './Charges.scss';
import InputNegotiate from '../utillity/inputs/InputNegotiate';

import { validateCharges } from './Validation';

class Charges extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			validation: validateCharges(
				this.props.charges,
				this.props.authLevel,
				this.props.attachment
			)
		};
	}

	negotiateInline(charge, value) {
		let negotiation = this.props.attachment;
		negotiation[charge.Id] = negotiation[charge.Id] || {};
		negotiation[charge.Id][charge._type] = value;

		let negotiationFormat = {
			charge,
			negotiatedValue: value
		};

		let _validation = validateCharges(negotiationFormat, this.props.authLevel);
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
					<div className="list-cell">Charge Name</div>
					<div className="list-cell">Charge Type</div>
					<div className="list-cell">One-Off Adjustment</div>
					<div className="list-cell">Negotiated One Off</div>
					<div className="list-cell">Recurring Adjustment</div>
					<div className="list-cell">Negotiated Recurring</div>
				</div>

				<ul className="table-list">
					{this.props.charges.map((charge, i) => {
						let recurringRow = 'N/A';
						let oneOffRow = 'N/A';
						var value;

						if (charge.oneOff != null) {
							value =
								(this.props.attachment[charge.Id] &&
									this.props.attachment[charge.Id].oneOff) ||
								charge.oneOff;
							oneOffRow = (
								<InputNegotiate
									invalid={this.state.validation[charge.Id]}
									onChange={val => {
										this.negotiateInline(charge, val);
									}}
									negotiatedValue={value}
									originalValue={charge.oneOff}
								/>
							);
						}

						if (charge.recurring != null) {
							value =
								(this.props.attachment[charge.Id] &&
									this.props.attachment[charge.Id].recurring) ||
								charge.recurring;
							recurringRow = (
								<InputNegotiate
									invalid={this.state.validation[charge.Id]}
									onChange={val => {
										this.negotiateInline(charge, val);
									}}
									negotiatedValue={value}
									originalValue={charge.recurring}
								/>
							);
						}

						return (
							<li key={charge.Id} className="list-row">
								<div className="list-cell">
									<Icon name="priority" width="14" color="#4bca81" />{' '}
									{charge.Name}
								</div>
								<div className="list-cell"> {charge.chargeType}</div>
								<div className="list-cell"> {charge.oneOff || 'N/A'}</div>
								<div className="list-cell negotiable">{oneOffRow}</div>
								<div className="list-cell"> {charge.recurring || 'N/A'}</div>
								<div className="list-cell negotiable">{recurringRow}</div>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}
export default Charges;
