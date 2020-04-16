import React, { Component } from 'react';
import Icon from '../Icon';
import { log, percIncrease } from '~/src/utils/shared-service';

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

		let _originalValue = this.props.originalValue || 0;
		let _negotiatedValue = this.props.negotiatedValue || 0;

		if (_originalValue - _negotiatedValue) {
			initialPercentage = percIncrease(_originalValue, _negotiatedValue);
			initialFixed = (_originalValue - _negotiatedValue).toFixedNumber();
		}

		this.discounts = [];
		let _logMessages = [];

		this.props.discounts.forEach(discount => {
			discount.cspmb__Discount_Values__c.forEach((val, index) => {
				// Bit of a validation
				if (
					discount.cspmb__Discount_Type__c === 'Amount' &&
					val > _originalValue
				) {
					_logMessages.push(
						'Discount level "' +
							discount.Name +
							'" contains discount greater than original charge value.'
					);
					_logMessages.push('Removing discount value -' + val);
					return;
				}
				if (discount.cspmb__Discount_Type__c === 'Percentage' && val > 100) {
					_logMessages.push(
						'Discount level "' +
							discount.Name +
							'" contains discount greater than original charge value.'
					);
					_logMessages.push('Removing discount value %' + val);
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

		if (_logMessages.length > 1) {
			console.group('Discount warnings:');
			_logMessages.forEach(log.orange);
			console.groupEnd();
		} else {
			_logMessages.forEach(log.orange);
		}

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

		this.state = {
			selected: initialDiscount,
			fixed: true
		};
	}

	onChange(e) {
		let newIndex;
		let newPrice;

		let _originalValue = this.props.originalValue || 0;

		if (e.target.value === 'none') {
			newIndex = 'none';
			newPrice = _originalValue;
		} else {
			newIndex = +e.target.value;
			let selectedOption = this.discounts[newIndex];
			if (selectedOption.type === 'Percentage') {
				newPrice = ((100 - selectedOption.value) * _originalValue) / 100;
			} else {
				newPrice = _originalValue - selectedOption.value;
			}
		}

		this.setState({
			selected: newIndex
		});

		this.props.onChange(newPrice.toFixedNumber());
	}

	render() {
		const _dp = window.SF.decimal_places || 2;

		var _originalValue = this.props.originalValue || 0;
		var _negotiatedValue = this.props.negotiatedValue || 0;

		var dirty = _originalValue !== _negotiatedValue;

		let _discount;
		let _value;
		let _prefix = _negotiatedValue < _originalValue ? '-' : '+';

		if (this.state.fixed) {
			_value = Math.abs(_originalValue - _negotiatedValue);
			_value = _prefix + _value.toFixedNumber(_dp);
		} else {
			_value = Math.abs(
				((_originalValue - _negotiatedValue) / _originalValue) * 100
			);
			_value = _prefix + _value.toFixedNumber() + '%';
		}

		_discount = <span className="discount-amount">{_value}</span>;

		_negotiatedValue = _negotiatedValue.toFixedNumber();

		return (
			<div
				className={
					'negotiate-container select-negotiate' +
					(this.props.invalid ? ' invalid' : '')
				}
			>
				<div className={'negotiate-input-wrapper' + (dirty ? ' dirty' : '')}>
					<span className="">{_negotiatedValue}</span>

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
						<option value="none">{window.SF.labels.fa_none}</option>
						{this.discounts.map((disc, index) => {
							let _discount =
								'-' +
								disc.value.toFixedNumber() +
								(disc.type === 'Percentage' ? '%' : '');
							if (this.props.discAsPrice) {
								_discount =
									disc.type === 'Percentage'
										? _originalValue - _originalValue * (disc.value / 100)
										: _originalValue - disc.value;
								_discount = _discount.toFixedNumber();
							}

							return (
								<option key={disc.Id + disc.value + index} value={index}>
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
