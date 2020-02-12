import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';
import { percIncrease } from '~/src/utils/shared-service';
import Icon from '../Icon';

class InputNegotiate extends React.Component {
	constructor(props) {
		super(props);

		this.onNegotiate = this.onNegotiate.bind(this);
		this.onFocus = this.onFocus.bind(this);
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

	// onTextChange(event) {
	//     this.setState({
	//         value: event.target.value
	//     });
	// }

	// onBlur={() => {this.setState({readOnly: true})}}

	//

	render() {
		// this.props.readOnly
		let _inputContainer,
			_originalValue,
			_negotiatedValue,
			dirty,
			_discount,
			_value,
			_prefix;

		const _dp = window.SF.decimal_places || 2;

		if (this.props.readOnly) {
			_inputContainer = (
				<div
					className={
						'negotiate-input-wrapper readOnly' +
						(this.props.negotiatedValue !== this.props.originalValue
							? ' negotiated'
							: '')
					}
				>
					<span>{this.props.negotiatedValue}</span>
				</div>
			);
		} else {
			_originalValue = (this.props.originalValue || 0).toFixedNumber();
			_negotiatedValue = this.props.negotiatedValue.toFixedNumber();

			dirty = _originalValue !== _negotiatedValue;

			_prefix = this.props.negotiatedValue < _originalValue ? '-' : '+';

			if (this.state.fixed) {
				_value = Math.abs(_originalValue - _negotiatedValue);
				_value = _prefix + _value.toFixedNumber(_dp);
			} else {
				_value = percIncrease(_originalValue, _negotiatedValue);
				_value = _prefix + _value.toFixedNumber() + '%';
			}

			_discount = <span className="discount-amount">{_value}</span>;

			_inputContainer = (
				<div
					className={
						'negotiate-input-wrapper' +
						(this.state.focus ? ' focused' : '') +
						(this.props.negotiatedValue !== this.props.originalValue
							? ' negotiated'
							: '')
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
						onChange={this.onNegotiate}
						onBlur={this.onBlur}
						onFocus={this.onFocus}
						value={this.props.negotiatedValue}
					/>
				</div>
			);
		}

		return (
			<div
				className={
					'negotiate-container' +
					(this.props.invalid ? ' invalid' : '') +
					(_prefix === '+' ? ' exceed' : '')
				}
			>
				{_inputContainer}
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
		);
	}
}

export default InputNegotiate;
