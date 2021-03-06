import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';

class InputText extends React.Component {
	constructor(props) {
		super(props);
		this.onTextChange = this.onTextChange.bind(this);
	}

	onTextChange(event) {
		let value = event.target.value;
		if (event.target.type === 'number') {
			value = +value;
		}
		this.props.onChange(value);
	}

	render() {
		let _placeholder = '';

		if (this.props.formula) {
			_placeholder = window.SF.labels.util_input_formula_placehoder;
		} else {
			_placeholder = window.SF.labels.util_input_text_enter + ' ' + this.props.type;
		}

		if (this.props.disabled) {
			_placeholder = '-';
		}

		return (
			<DebounceInput
				minLength={1}
				disabled={this.props.disabled}
				placeholder={_placeholder}
				debounceTimeout={200}
				spellCheck="false"
				className="fa-input-border"
				type={this.props.type}
				onChange={this.onTextChange}
				value={this.props.value}
			/>
		);
	}
}

export default InputText;
