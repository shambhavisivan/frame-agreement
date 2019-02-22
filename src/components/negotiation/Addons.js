import React, { Component } from 'react';

import './Addons.scss';
// import Checkbox from '../utillity/inputs/Checkbox';
import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';

import { validateAddons } from './Validation';

const LABELS = {
	oneOff: 'cspmb__One_Off_Charge__c',
	recurring: 'cspmb__Recurring_Charge__c'
};

class Addons extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			validation: validateAddons(this.props.addons, this.props.attachment)
		};
	}

	negotiateInline(addon, chargeType, value) {
		let negotiation = this.props.attachment;
		negotiation[addon.Id] = negotiation[addon.Id] || {};
		negotiation[addon.Id][chargeType] = value;

		let negotiationFormat = {
			addon: addon,
			negotiatedOneOff: negotiation[addon.Id].oneOff,
			negotiatedRecurring: negotiation[addon.Id].recurring
		};

		let _validation = validateAddons(negotiationFormat);
		this.setState(
			{ validation: { ...this.state.validation, ..._validation } },
			() => {
				console.log('Validation:', this.state.validation);
			}
		);

		this.props.onNegotiate(negotiation);
	}

	// Id, Name, cspmb__Is_Active__c, cspmb__Effective_Start_Date__c, cspmb__Effective_End_Date__c, cspmb__Billing_Frequency__c, cspmb__Authorization_Level__c, cspmb__Recurring_Charge__c

	render() {
		return (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">Name</div>
					<div className="list-cell">One Off Charge</div>
					<div className="list-cell">Negotiated One Off</div>
					<div className="list-cell">Recurring Charge</div>
					<div className="list-cell">Negotiated Recurring</div>
				</div>

				<ul className="table-list">
					{this.props.addons.map((add, i) => {
						let recurringRow = 'N/A';
						let oneOffRow = 'N/A';
						var value;

						if (add.cspmb__One_Off_Charge__c != null) {
							value =
								(this.props.attachment[add.Id] &&
									this.props.attachment[add.Id].oneOff) ||
								add.cspmb__One_Off_Charge__c;
							oneOffRow = (
								<InputNegotiate
									invalid={this.state.validation[add.Id].oneOff || false}
									onChange={val => {
										this.negotiateInline(add, 'oneOff', val);
									}}
									negotiatedValue={value}
									originalValue={add.cspmb__One_Off_Charge__c}
								/>
							);
						}

						if (add.cspmb__Recurring_Charge__c != null) {
							value =
								(this.props.attachment[add.Id] &&
									this.props.attachment[add.Id].recurring) ||
								add.cspmb__Recurring_Charge__c;
							recurringRow = (
								<InputNegotiate
									invalid={this.state.validation[add.Id].recurring || false}
									onChange={val => {
										this.negotiateInline(add, 'recurring', val);
									}}
									negotiatedValue={value}
									originalValue={add.cspmb__Recurring_Charge__c}
								/>
							);
						}

						return (
							<li key={add.Id} className="list-row">
								<div className="list-cell">
									<Icon name="priority" width="14" color="#4bca81" /> {add.Name}
								</div>

								<div className="list-cell">
									{' '}
									{add.cspmb__One_Off_Charge__c || 'N/A'}
								</div>

								<div className="list-cell negotiable">{oneOffRow}</div>

								<div className="list-cell">
									{' '}
									{add.cspmb__Recurring_Charge__c || 'N/A'}
								</div>

								<div className="list-cell negotiable">{recurringRow}</div>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

export default Addons;
