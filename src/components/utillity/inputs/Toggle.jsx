import React, { Component } from 'react';

import Icon from '../Icon';

class Toggle extends React.Component {
	constructor(props) {
		super(props);
	}

	onChange(val) {
		this.props.onChange(val || false);
	}

	render() {
		return (
			<label className="switch-wrapper">
				<input
					className="switch-checkbox"
					type="checkbox"
					onChange={() => this.onChange(!this.props.value)}
					checked={this.props.value}
					disabled={this.props.disabled}
				/>
				<span className="switch-style" />
			</label>
		);
	}
}

export default Toggle;
