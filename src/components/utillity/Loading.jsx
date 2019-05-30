import React, { Component } from 'react';
import Icon from './Icon';

class Loading extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return this.props.loading ? (
			<div className="loading-overlay">
				<Icon svg-class="icon-search" name="spinner" width="36" height="36" />
			</div>
		) : (
			''
		);
	}
}

export default Loading;
