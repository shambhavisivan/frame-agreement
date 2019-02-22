import React, { Component } from 'react';

class RclInput extends Component {
	constructor(props) {
		super(props);
		this.inputRef = React.createRef();

		this.onValueChange = this.onValueChange.bind(this);
	}

	componentDidMount() {
		this.inputRef.current.value = this.props.value;
	}

	onValueChange() {
		this.props.onChange(
			+this.inputRef.current.value,
			this.props.rcid,
			this.props.rclid
		);
	}

	render() {
		return (
			<input
				className="rcm-input_sm"
				ref={this.inputRef}
				type="number"
				onChange={this.onValueChange}
			/>
		);
	}
}

export default RclInput;
