import React, { Component } from 'react';
import './InputText.css';

class InputText extends React.Component {
	constructor(props) {
		super(props);
		this.onTextChange = this.onTextChange.bind(this);
		this.state = {
			value: this.props.value
		};
	}

	onTextChange(event) {
		let value = event.target.value;
		if (event.target.type === 'number') {
			value = +value;
		}
		this.setState({
			value: value
		});
		this.props.onChange(value);
	}

	render() {
		return (
			<input
				disabled={this.props.disabled}
				spellCheck="false"
				placeholder={
					window.SF.labels.util_input_text_enter + ' ' + this.props.type
				}
				className="fa-input-border"
				type={this.props.type}
				onChange={this.onTextChange}
				value={this.state.value}
			/>
		);
	}
}

export default InputText;
