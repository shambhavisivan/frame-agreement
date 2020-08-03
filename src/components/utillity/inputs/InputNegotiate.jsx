import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { percIncrease } from '~/src/utils/shared-service';
import SettingsContext from '~/src/utils/settings-context.js';
import NumberFormat from '~/src/components/negotiation/NumberFormat';
import Icon from '../Icon';

class InputNegotiate extends React.Component {
	constructor(props) {
		super(props);

		this.onNegotiate = this.onNegotiate.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.getDiscount = this.getDiscount.bind(this);
		this.onBlur = this.onBlur.bind(this);

		this.state = {
			focus: false,
			fixed: true
		};
	}

	onNegotiate(e) {
		this.props.onChange(+e.target.value);
	}

	onFocus() {
		this.setState({ focus: true });
	}

	onBlur() {
		this.setState({ focus: false });
	}

	getDiscount(original, negotiated, _dp = 2) {
		original = original || 0;
		negotiated = negotiated || 0;

		let _value;
		let dirty = original !== negotiated;

		let _prefix = negotiated < original ? '-' : '+';

		if (this.state.fixed) {
			_value = Math.abs(original - negotiated);
			_value = _prefix + _value.toFixedNumber(_dp);
		} else {
			_value = percIncrease(original, negotiated);
			_value = _prefix + Math.abs(_value).toFixedNumber() + '%';
		}

		return { _value, dirty, _prefix };
	}

	render() {
		// this.props.readOnly
		let _inputContainer, _originalValue, _negotiatedValue, _discount;

		const _dp = window.SF.decimal_places || 2;

		const { _value, dirty, _prefix } = this.getDiscount(
			this.props.originalValue,
			this.props.negotiatedValue,
			_dp
		);

		_negotiatedValue = this.props.negotiatedValue?.toFixedNumber();

		_discount = (
			<span className="discount-amount">
				<NumberFormat value={_value} />
			</span>
		);

		const _getInputContainer = restrict_minmax => {
			let _inputContainer;

			if (this.props.readOnly) {
				_inputContainer = (
					<div
						className={
							'negotiate-input-wrapper readOnly' +
							(this.props.negotiatedValue !== this.props.originalValue ? ' negotiated' : '')
						}
					>
						<span>{_negotiatedValue}</span>
					</div>
				);
			} else {
				_inputContainer = (
					<div
						className={
							'negotiate-input-wrapper' +
							(this.state.focus ? ' focused' : '') +
							(this.props.negotiatedValue !== this.props.originalValue ? ' negotiated' : '')
						}
					>
						<Icon
							svg-class="negotiate-icon"
							name="edit"
							width="14"
							height="14"
							color={this.state.focus ? '#0070d2' : '#747474'}
						/>
						<DebounceInput
							debounceTimeout={300}
							placeholder={0}
							spellCheck="false"
							className="negotiate-input"
							type="number"
							min={restrict_minmax ? 0 : null}
							max={restrict_minmax ? (this.state.fixed ? this.props.originalValue : 100) : null}
							onChange={this.onNegotiate}
							onBlur={this.onBlur}
							onFocus={this.onFocus}
							value={_negotiatedValue}
						/>
					</div>
				);
			}

			return _inputContainer;
		};

		return (
			<SettingsContext.Consumer>
				{settings => (
					<div
						className={
							'negotiate-container' +
							(this.props.invalid ? ' invalid' : '') +
							(_prefix === '+' ? ' exceed' : '')
						}
					>
						{_getInputContainer(settings.FACSettings.input_minmax_restriction)}
						<div className="discount-info">
							{dirty ? (
								<span
									className="discount"
									onClick={() => {
										this.setState({ fixed: !this.state.fixed });
									}}
								>
									<div>{window.SF.labels.util_negotiation_input_diff_label} </div>
									{_discount}
								</span>
							) : (
								''
							)}
						</div>
					</div>
				)}
			</SettingsContext.Consumer>
		);
	}
}

export default InputNegotiate;
