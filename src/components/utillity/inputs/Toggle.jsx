import React, { Component } from 'react';

import Icon from '../Icon';

class Toggle extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value
		};
	}

	onChange(val) {
		this.setState({
			value: val || false
		});
		console.log(this.state.value);
		this.props.onChange(val);
	}

	render() {
		return (
			<label className="switch-wrapper">
				<input
					className="switch-checkbox"
					type="checkbox"
					onClick={() => this.onChange(!this.state.value)}
					value={this.state.value}
					disabled={this.props.disabled}
				/>
				<span className="switch-style" />
			</label>
		)
	}
}

export default Toggle;