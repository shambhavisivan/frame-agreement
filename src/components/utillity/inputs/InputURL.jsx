import React, { Component } from 'react';

class InputURL extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<span className="fa-url">
				<a href={this.props.value} target="_blank">
					{this.props.label}
				</a>
			</span>
		);
	}
}

export default InputURL;
