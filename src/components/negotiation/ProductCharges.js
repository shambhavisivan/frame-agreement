import React, { Component } from 'react';

import './ProductCharges.scss';
// import Checkbox from '../utillity/inputs/Checkbox';
import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';

import { validateProduct } from './Validation';

class ProductCharges extends React.Component {
	constructor(props) {
		super(props);

		let negotiationData = {
			oneOff: this.props.product.cspmb__One_Off_Cost__c,
			negotiatedOneOff: this.props.attachment.oneOff,
			recurring: this.props.product.cspmb__Recurring_Cost__c,
			negotiatedRecurring: this.props.attachment.recurring
		};

		this.state = {
			validation: validateProduct(negotiationData)
		};

		/*
      state.validation:
      {
        oneOff: Bool,
        recurring: Bool
      }
    */
	}

	negotiateInline(chargeType, value) {
		let negotiation = this.props.attachment;
		negotiation[chargeType] = value;

		let negotiationData = {
			oneOff: this.props.product.cspmb__One_Off_Cost__c,
			negotiatedOneOff: negotiation.oneOff,
			recurring: this.props.product.cspmb__Recurring_Cost__c,
			negotiatedRecurring: negotiation.recurring,
			authLevel: this.props.product.cspmb__Authorization_Level__c || null,
			Name: this.props.product.Name
		};

		this.setState({ validation: validateProduct(negotiationData) });

		this.props.onNegotiate(negotiation);
	}

	render() {
		return (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">Charge Name</div>
					<div className="list-cell">One-Off Adjustment</div>
					<div className="list-cell">Negotiated One Off</div>
					<div className="list-cell">Recurring Adjustment</div>
					<div className="list-cell">Negotiated Recurring</div>
				</div>

				<ul className="table-list">
					<li className="list-row">
						<div className="list-cell">
							<Icon name="priority" width="14" color="#4bca81" /> On product
						</div>
						<div className="list-cell">
							{' '}
							{this.props.product.cspmb__One_Off_Cost__c || 'N/A'}
						</div>
						<div className="list-cell negotiable">
							{this.props.product.cspmb__One_Off_Cost__c != null ? (
								<InputNegotiate
									invalid={this.state.validation.oneOff}
									onChange={val => {
										this.negotiateInline('oneOff', val);
									}}
									negotiatedValue={
										this.props.attachment.oneOff ||
										this.props.product.cspmb__One_Off_Cost__c
									}
									originalValue={this.props.product.cspmb__One_Off_Cost__c}
								/>
							) : (
								'N/A'
							)}
						</div>
						<div className="list-cell">
							{' '}
							{this.props.product.cspmb__Recurring_Cost__c || 'N/A'}
						</div>
						<div className="list-cell negotiable">
							{this.props.product.cspmb__Recurring_Cost__c != null ? (
								<InputNegotiate
									invalid={this.state.validation.recurring}
									onChange={val => {
										this.negotiateInline('recurring', val);
									}}
									negotiatedValue={
										this.props.attachment.recurring ||
										this.props.product.cspmb__Recurring_Cost__c
									}
									originalValue={this.props.product.cspmb__Recurring_Cost__c}
								/>
							) : (
								'N/A'
							)}
						</div>
					</li>
				</ul>
			</div>
		);
	}
}

export default ProductCharges;
