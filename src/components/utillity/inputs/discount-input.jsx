import React from 'react';

// TODO: to be used in the ts refactor and add unit test
export class DiscountInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { discountValue: props.value };
		this.onInputChange = this.onInputChange.bind(this);
	}

	componentDidUpdate(prevProps) {
		// if user toggles mode reset discount to zero.
		if (prevProps.mode !== this.props.mode) {
			this.setState({ discountValue: 0 })
		}
	}

	onInputChange(event) {
		const { value } = event.target;

		if (this.props.mode === 'percentage') {
			if (value < 0 || value > 100) {
				return;
			}
		}
		this.setState({ discountValue: value }, this.props.onChange(value));
	}

	render() {
		return (<input
			type="number"
			className="fa-input"
			placeholder={window.SF.labels.modal_bulk_input_placeholder}
			onChange={this.onInputChange}
			value={this.state.discountValue}
		/>);
	}
}