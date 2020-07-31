import React, { Component } from 'react';

// import Checkbox from '../utillity/inputs/Checkbox';
import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';
import DropdownNegotiate from '../utillity/inputs/DropdownNegotiate';

import { validateProduct } from '../../utils/validation-service';
import { isOneOff, isRecurring } from '~/src/utils/shared-service';

import { setValidation } from '~/src/actions';
import { connect } from 'react-redux';

export class ProductCharges extends React.Component {
	constructor(props) {
		super(props);

		this.discounts = [];

		// this.props.oneOffAllowed
		// this.props.recurringAllowed

		if (this.props.levels) {
			this.discounts = this.props.levels.map(lv => lv.discountLevel);
		}
	}

	negotiateInline(chargeType, value) {
		let negotiation = this.props.attachment;
		negotiation[chargeType] = +value;

		this.props.onNegotiate(negotiation);
	}

	isChargeAllowed(chargeType) {
		if (isOneOff(chargeType)) {
			return this.props.oneOffAllowed;
		}

		if (isRecurring(chargeType)) {
			return this.props.recurringAllowed;
		}

		console.error(chargeType + ' is neither "One Off" nor "Recurring"');
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
					<div className="list-cell">{window.SF.labels.product_charge_header_name}</div>
					<div className="list-cell">{window.SF.labels.product_charge_header_oneOff}</div>
					<div className="list-cell">{window.SF.labels.product_charge_header_oneOff_neg}</div>
					<div className="list-cell">{window.SF.labels.product_charge_header_recc}</div>
					<div className="list-cell">{window.SF.labels.product_charge_header_recc_neg}</div>
				</div>

				<ul className="table-list">
					<li className="list-row">
						<div className="list-cell">
							<Icon name="priority" width="14" color={flagColor} /> On product
						</div>
						<div className="list-cell">
							{this.props.product.hasOwnProperty('cspmb__One_Off_Charge__c')
								? this.props.product.cspmb__One_Off_Charge__c.toFixedNumber()
								: 'N/A'}
						</div>
						<div className="list-cell negotiable">
							{(() => {
								// This info applies for both types of charges
								let oneOffRow = 'N/A';
								let negValue = this.props.attachment.hasOwnProperty('oneOff')
									? this.props.attachment.oneOff
									: this.props.product.cspmb__One_Off_Charge__c;

								// Filter only ones that have adequate type
								let oneOffDiscount = this.discounts.filter(dc =>
									isOneOff(dc.cspmb__Charge_Type__c)
								);

								// If there are any discounts and one off is defined
								if (
									oneOffDiscount.length &&
									!this.props.disableLevels &&
									this.props.product.cspmb__One_Off_Charge__c != null
								) {
									oneOffRow = (
										<DropdownNegotiate
											readOnly={this.props.readOnly || !this.props.oneOffAllowed}
											invalid={this.props.validation.oneOff}
											discounts={oneOffDiscount}
											onChange={val => {
												this.negotiateInline('oneOff', val);
											}}
											discAsPrice={this.props.settings.FACSettings.discount_as_price}
											negotiatedValue={negValue}
											originalValue={this.props.product.cspmb__One_Off_Charge__c}
										/>
									);
								} else if (this.props.product.cspmb__One_Off_Charge__c != null) {
									// No discounts? Put negotiated value input
									oneOffRow = (
										<InputNegotiate
											readOnly={
												this.props.readOnly || !this.props.oneOffAllowed || this.props.disableInputs
											}
											invalid={this.props.validation.oneOff}
											onChange={val => {
												this.negotiateInline('oneOff', val);
											}}
											negotiatedValue={negValue}
											originalValue={this.props.product.cspmb__One_Off_Charge__c}
										/>
									);
								}
								return oneOffRow;
							})()}
						</div>
						<div className="list-cell">
							{this.props.product.hasOwnProperty('cspmb__Recurring_Charge__c')
								? this.props.product.cspmb__Recurring_Charge__c.toFixedNumber()
								: 'N/A'}
						</div>
						<div className="list-cell negotiable">
							{(() => {
								let recurringRow = 'N/A';
								let negValue = this.props.attachment.hasOwnProperty('recurring')
									? this.props.attachment.recurring
									: this.props.product.cspmb__Recurring_Charge__c;

								let recurringDiscount = this.discounts.filter(dc =>
									isRecurring(dc.cspmb__Charge_Type__c)
								);

								if (
									recurringDiscount.length &&
									!this.props.disableLevels &&
									this.props.product.cspmb__Recurring_Charge__c != null
								) {
									recurringRow = (
										<DropdownNegotiate
											readOnly={this.props.readOnly || !this.props.recurringAllowed}
											invalid={this.props.validation.recurring}
											discounts={recurringDiscount}
											onChange={val => {
												this.negotiateInline('recurring', val);
											}}
											discAsPrice={this.props.settings.FACSettings.discount_as_price}
											negotiatedValue={negValue}
											originalValue={this.props.product.cspmb__Recurring_Charge__c}
										/>
									);
								} else if (this.props.product.cspmb__Recurring_Charge__c != null) {
									recurringRow = (
										<InputNegotiate
											readOnly={
												this.props.readOnly ||
												!this.props.recurringAllowed ||
												this.props.disableInputs
											}
											invalid={this.props.validation.recurring}
											onChange={val => {
												this.negotiateInline('recurring', val);
											}}
											negotiatedValue={negValue}
											originalValue={this.props.product.cspmb__Recurring_Charge__c}
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

export default connect(mapStateToProps, null)(ProductCharges);
