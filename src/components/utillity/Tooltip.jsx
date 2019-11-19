import React, { Component } from 'react';
import Icon from './Icon';

class Tooltip extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="tooltip">
				<Icon name="info" height="12" width="12" color="black" />
				<span className="tooltiptext">{this.props.text}</span>
			</div>
		);
	}
}

export default Tooltip;
