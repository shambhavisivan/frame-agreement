import React, { Component } from 'react';
import Icon from '../Icon';

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

		// Check if values are 0

		this.discountNulled =
			this.props.discounts.length === 1 &&
			!this.props.discounts.reduce((a, b) => a + b, 0);

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
			selected: initialDiscount,
			fixed: true
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
		var dirty = this.props.originalValue !== this.props.negotiatedValue;
		var negotiateFixed;
		try {
			negotiateFixed = this.props.negotiatedValue.toFixed(2);
		} catch (e) {
			negotiateFixed = this.props.negotiatedValue;
		}

		let _discount;
		if (this.state.fixed) {
			_discount = (
				<span className="discount-amount">
					{' '}
					-{(this.props.originalValue - this.props.negotiatedValue).toFixed(2)}
				</span>
			);
		} else {
			_discount = (
				<span className="discount-amount">
					{' '}
					-
					{(
						((this.props.originalValue - this.props.negotiatedValue) /
							this.props.originalValue) *
						100
					).toFixed(2)}
					%
				</span>
			);
		}

		return (
			<div
				className={
					'negotiate-container select-negotiate' +
					(this.props.invalid ? ' invalid' : '')
				}
			>
				<div className={'negotiate-input-wrapper' + (dirty ? ' dirty' : '')}>
					<span className="">{negotiateFixed}</span>

					{dirty && (
						<div className="discount-info">
							<div
								className="discount"
								onClick={() => {
									this.setState({ fixed: !this.state.fixed });
								}}
							>
								<div>{window.SF.labels.util_negotiation_input_diff_label}</div>
								{_discount}
							</div>
						</div>
					)}
				</div>

				<div className="negotiate-select-wrapper">
					<select
						disabled={this.props.readOnly || this.discountNulled}
						value={this.state.selected}
						onChange={e => this.onChange(e)}
					>
						<option value="none">--none</option>
						{this.discounts.map((disc, index) => {
							let _discount =
								'-' +
								disc.value.toFixed(2) +
								(disc.type === 'Percentage' ? '%' : '');
							if (this.props.discAsPrice) {
								_discount =
									disc.type === 'Percentage'
										? this.props.originalValue -
										  this.props.originalValue * (disc.value / 100)
										: this.props.originalValue - disc.value;
								_discount = _discount.toFixed(2);
							}

							return (
								<option key={disc.Id + disc.value} value={index}>
									{_discount}
								</option>
							);
						})}
					</select>
				</div>
			</div>
		);
	}
}

export default DropdownNegotiate;
