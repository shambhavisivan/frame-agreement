import React, { Component } from 'react';
import Icon from '../Icon';
import { log } from '~/src/utils/shared-service';
import NumberFormat, { getLocaleNumber } from '~/src/components/negotiation/NumberFormat';

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

		let _originalValue = this.props.originalValue || 0;

		this.discounts = [];
		let _logMessages = [];

		this.props.discounts.forEach(discount => {
			discount.cspmb__Discount_Values__c.forEach((val, index) => {
				// Bit of a validation
				if (discount.cspmb__Discount_Type__c === 'Amount' && val > _originalValue) {
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

		// Sort values high to low
		this.discounts.sort((a, b) => (a.value > b.value ? 1 : b.value > a.value ? -1 : 0));

		if (_logMessages.length > 1) {
			console.group('Discount warnings:');
			_logMessages.forEach(log.orange);
			console.groupEnd();
		} else {
			_logMessages.forEach(log.orange);
		}

		// Check if values are 0
		this.discountNulled =
			this.props.discounts.length === 1 && !this.props.discounts.reduce((a, b) => a + b, 0);

		const initialDiscount = this.getSelectedIndex();

		this.state = {
			selected: initialDiscount,
			fixed: true
		};
	}

	onChange(e) {
		let newPrice = this.updateSelectedDiscount(e.target.value);
		this.props.onChange(newPrice.toFixedNumber());
	}

	componentDidUpdate(prevProps) {
		if (prevProps.negotiatedValue != this.props.negotiatedValue) {
			const selectedIndex = this.getSelectedIndex();
			this.updateSelectedDiscount(selectedIndex);
		}
	}

	getSelectedIndex() {
		let initialFixed = 0;
		let _originalValue = this.props.originalValue || 0;
		let _negotiatedValue = this.props.negotiatedValue || 0;

		if (_originalValue - _negotiatedValue) {
			initialFixed = (_originalValue - _negotiatedValue).toFixedNumber();
		}
		let selectedIndex = 'none';
		this.discounts.forEach((discount, index) => {
			if (discount.type === 'Percentage') {
				const discountedPrice = (((100 - discount.value) * _originalValue) / 100).toFixedNumber();
				if (_negotiatedValue === discountedPrice) {
					selectedIndex = index;
				}
			} else if (discount.type === 'Amount' && +discount.value === initialFixed) {
				selectedIndex = index;
			}
		});

		return selectedIndex;
	}

	updateSelectedDiscount(selectedIndex) {
		let newIndex;
		let newPrice;
		let _originalValue = this.props.originalValue || 0;

		if (selectedIndex === 'none') {
			newIndex = 'none';
			newPrice = _originalValue;
		} else {
			newIndex = +selectedIndex;
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

		return newPrice;
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
			_value = _prefix + getLocaleNumber(_value);
		} else {
			_value = Math.abs(((_originalValue - _negotiatedValue) / _originalValue) * 100);
			_value = _prefix + getLocaleNumber(_value) + '%';
		}

		_discount = <span className="discount-amount">{_value}</span>;

		// _negotiatedValue = _negotiatedValue.toFixedNumber();

		return (
			<div
				className={'negotiate-container select-negotiate' + (this.props.invalid ? ' invalid' : '')}
			>
				<div className={'negotiate-input-wrapper' + (dirty ? ' dirty' : '')}>
					<span className="">
						<NumberFormat value={_negotiatedValue} />
					</span>

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
								'-' + disc.value.toFixedNumber() + (disc.type === 'Percentage' ? '%' : '');
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
