import React, { Component } from 'react';
import Icon from '../Icon';

import './DropdownNegotiate.css';

/*

  Id: "a141t00000137a8AAA"
  Name: // this charge name
  cspmb__Charge_Type__c: "RC"
  cspmb__Discount_Type__c: "Percentage"
  cspmb__Discount_Values__c: (3) [10, 20, 30]

*/

class DropdownNegotiate extends React.Component {
	constructor(props) {
		super(props);

		// get the initial discount
		let initialDiscount = 'none';
		let initialFixed = 0;
		let initialPercentage = 0;

		if (+(this.props.originalValue - this.props.negotiatedValue).toFixed(2)) {
			initialPercentage =
				(1 - this.props.negotiatedValue / this.props.originalValue).toFixed(2) *
				100;
			initialFixed = +(
				this.props.originalValue - this.props.negotiatedValue
			).toFixed(2);
		}

		this.discounts = [];
		this.props.discounts.forEach(discount => {
			discount.cspmb__Discount_Values__c.forEach((val, index) => {
				// Bit of a validation
				if (
					discount.cspmb__Discount_Type__c === 'Amount' &&
					val > this.props.originalValue
				) {
					console.warn(
						'Discount level "' +
							discount.Name +
							'" contains discount greater than original charge value.'
					);
					console.warn('Removing discount value -' + val);
					return;
				}
				if (discount.cspmb__Discount_Type__c === 'Percentage' && val > 100) {
					console.warn(
						'Discount level "' +
							discount.Name +
							'" contains discount greater than original charge value.'
					);
					console.warn('Removing discount value %' + val);
					return;
				}
				// Carry on
				this.discounts.push({
					Id: discount.Id,
					type: discount.cspmb__Discount_Type__c,
					value: val
				});
			});
		});

		this.discounts.forEach((discount, index) => {
			if (
				discount.type === 'Percentage' &&
				+discount.value === initialPercentage
			) {
				initialDiscount = index;
			} else if (
				discount.type === 'Amount' &&
				+discount.value === initialFixed
			) {
				initialDiscount = index;
			}
		});

		console.log(initialDiscount);

		this.state = {
			selected: initialDiscount
		};
	}

	onChange(e) {
		let newIndex;
		let newPrice;

		if (e.target.value === 'none') {
			newIndex = 'none';
			newPrice = this.props.originalValue;
		} else {
			newIndex = +e.target.value;
			let selectedOption = this.discounts[newIndex];
			if (selectedOption.type === 'Percentage') {
				newPrice =
					((100 - selectedOption.value) * this.props.originalValue) / 100;
			} else {
				newPrice = this.props.originalValue - selectedOption.value;
			}
		}

		this.setState(
			{
				selected: newIndex
			},
			() => {
				console.log(this.state.selected);
			}
		);

		this.props.onChange(+newPrice.toFixed(2));
	}

	render() {
		return (
			<div
				className={
					'negotiate-container ' + (this.props.invalid ? 'invalid' : '')
				}
			>
				<div className="negotiate-input-wrapper">
					<span className="fa-margin-right-xsm">
						{this.props.negotiatedValue}{' '}
					</span>
					<select
						disabled={this.props.readOnly}
						value={this.state.selected}
						onChange={e => this.onChange(e)}
					>
						<option value="none">--none</option>
						{this.discounts.map((disc, index) => {
							return (
								<option key={disc.Id + disc.value} value={index}>
									-{disc.value + (disc.type === 'Percentage' ? '%' : '')}
								</option>
							);
						})}
					</select>
				</div>

				{this.props.originalValue !== this.props.negotiatedValue && (
					<div className="discount-info">
						<div className="discount">
							<div>{window.SF.labels.util_negotiation_input_diff_label} </div>
							<span className="discount-amount">
								{' '}
								-
								{(
									this.props.originalValue - this.props.negotiatedValue
								).toFixed(2)}
							</span>
						</div>
					</div>
				)}
			</div>
		);
	}
}

export default DropdownNegotiate;
