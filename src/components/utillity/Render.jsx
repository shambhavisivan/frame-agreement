import React, { Component } from 'react';

class Render extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (this.props.if) {
			return this.props.children;
		} else {
			return null;
		}
	}
}

export default Render;
