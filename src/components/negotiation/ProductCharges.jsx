import React, { Component } from 'react';

// import Checkbox from '../utillity/inputs/Checkbox';
import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';
import DropdownNegotiate from '../utillity/inputs/DropdownNegotiate';

import { validateProduct } from '../../utils/validation-service';

import { setValidation } from '../../actions';
import { connect } from 'react-redux';

class ProductCharges extends React.Component {
	constructor(props) {
		super(props);

		this.discounts = [];

		// this.props.oneOffAllowed
		// this.props.recurringAllowed

		if (this.props.level) {
			this.props.level.forEach(lv => {
				this.discounts.push(this.props.settings.DiscLevels[lv].discountLevel);
			});
		}
	}

	negotiateInline(chargeType, value) {
		let negotiation = this.props.attachment;
		negotiation[chargeType] = value;

		this.props.onNegotiate(negotiation);
	}

	isChargeAllowed(chargeType) {
		if (chargeType === 'One-off Charge') {
			return this.props.oneOffAllowed;
		}

		if (chargeType === 'Recurring Charge') {
			return this.props.recurringAllowed;
		}

		console.error(
			chargeType + ' is neither "One-Off Charge" nor "Recurring Charge"'
		);
	}

	render() {
		let flagColor = '#4bca81';
		if (this.props.validation.oneOff) {
			flagColor = '#D9675D';
		}
		if (this.props.readOnly) {
			flagColor = '#ccc';
		}

		return (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">
						{window.SF.labels.product_charge_header_name}
					</div>
					<div className="list-cell">
						{window.SF.labels.product_charge_header_oneOff}
					</div>
					<div className="list-cell">
						{window.SF.labels.product_charge_header_oneOff_neg}
					</div>
					<div className="list-cell">
						{window.SF.labels.product_charge_header_recc}
					</div>
					<div className="list-cell">
						{window.SF.labels.product_charge_header_recc_neg}
					</div>
				</div>

				<ul className="table-list">
					<li className="list-row">
						<div className="list-cell">
							<Icon name="priority" width="14" color={flagColor} /> On product
						</div>
						<div className="list-cell">
							{this.props.product.hasOwnProperty('cspmb__One_Off_Charge__c')
								? this.props.product.cspmb__One_Off_Charge__c
								: 'N/A'}
						</div>
						<div className="list-cell negotiable">
							{(() => {
								// This info applies for both types of charges
								let oneOffRow = 'N/A';
								let negValue = this.props.attachment.hasOwnProperty('oneOff')
									? this.props.attachment.oneOff
									: this.props.product.cspmb__One_Off_Charge__c;

								// If there are any discounts and there one off is defined
								if (
									this.discounts.length &&
									this.props.product.cspmb__One_Off_Charge__c != null
								) {
									// Filter only ones that have adequate type
									let oneOffDiscount = this.discounts.filter(
										dc => dc.cspmb__Charge_Type__c === 'NRC'
									);
									oneOffRow = (
										<DropdownNegotiate
											readOnly={
												this.props.readOnly || !this.props.oneOffAllowed
											}
											invalid={this.props.validation.oneOff}
											discounts={oneOffDiscount}
											onChange={val => {
												this.negotiateInline('oneOff', val);
											}}
											discAsPrice={
												this.props.settings.FACSettings.discount_as_price
											}
											negotiatedValue={negValue}
											originalValue={
												this.props.product.cspmb__One_Off_Charge__c
											}
										/>
									);
								} else if (
									this.props.product.cspmb__One_Off_Charge__c != null
								) {
									// No discounts? Put negotiated value input
									oneOffRow = (
										<InputNegotiate
											readOnly={
												this.props.readOnly || !this.props.oneOffAllowed
											}
											invalid={this.props.validation.oneOff}
											onChange={val => {
												this.negotiateInline('oneOff', val);
											}}
											negotiatedValue={negValue}
											originalValue={
												this.props.product.cspmb__One_Off_Charge__c
											}
										/>
									);
								}
								return oneOffRow;
							})()}
						</div>
						<div className="list-cell">
							{this.props.product.hasOwnProperty('cspmb__Recurring_Charge__c')
								? this.props.product.cspmb__Recurring_Charge__c
								: 'N/A'}
						</div>
						<div className="list-cell negotiable">
							{(() => {
								let recurringRow = 'N/A';
								let negValue = this.props.attachment.hasOwnProperty('recurring')
									? this.props.attachment.recurring
									: this.props.product.cspmb__Recurring_Charge__c;

								if (
									this.discounts.length &&
									this.props.product.cspmb__Recurring_Charge__c != null
								) {
									let recurringDiscount = this.discounts.filter(
										dc => dc.cspmb__Charge_Type__c === 'RC'
									);
									recurringRow = (
										<DropdownNegotiate
											readOnly={
												this.props.readOnly || !this.props.recurringAllowed
											}
											invalid={this.props.validation.recurring}
											discounts={recurringDiscount}
											onChange={val => {
												this.negotiateInline('recurring', val);
											}}
											discAsPrice={
												this.props.settings.FACSettings.discount_as_price
											}
											negotiatedValue={negValue}
											originalValue={
												this.props.product.cspmb__Recurring_Charge__c
											}
										/>
									);
								} else if (
									this.props.product.cspmb__Recurring_Charge__c != null
								) {
									recurringRow = (
										<InputNegotiate
											readOnly={
												this.props.readOnly || !this.props.recurringAllowed
											}
											invalid={this.props.validation.recurring}
											onChange={val => {
												this.negotiateInline('recurring', val);
											}}
											negotiatedValue={negValue}
											originalValue={
												this.props.product.cspmb__Recurring_Charge__c
											}
										/>
									);
								}
								return recurringRow;
							})()}
						</div>
					</li>
				</ul>
			</div>
		);
	}
}

// export default ProductCharges

const mapStateToProps = state => {
	return {
		settings: state.settings
	};
};

// const mapDispatchToProps = {
//     setValidation
// };

export default connect(
	mapStateToProps,
	null
)(ProductCharges);
