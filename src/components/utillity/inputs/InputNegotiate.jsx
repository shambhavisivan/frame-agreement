import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Icon from '../Icon';

import './InputNegotiate.css';

class InputNegotiate extends React.Component {
	constructor(props) {
		super(props);

		this.onNegotiate = this.onNegotiate.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);

		this.state = {
			focus: false
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
		let _inputContainer;
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
						placeholder="0"
						spellCheck="false"
						className="negotiate-input"
						type="number"
						max={this.props.originalValue}
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
					'negotiate-container' + (this.props.invalid ? ' invalid' : '')
				}
			>
				{_inputContainer}
				<div className="discount-info">
					{this.props.negotiatedValue !== this.props.originalValue &&
					this.props.originalValue ? (
						<span className="discount">
							<div>{window.SF.labels.util_negotiation_input_diff_label} </div>
							<span className="discount-amount">
								{' '}
								-
								{(
									this.props.originalValue - this.props.negotiatedValue
								).toFixed(2)}
							</span>
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
