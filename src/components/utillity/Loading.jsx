import React, { Component } from 'react';
import Icon from './Icon';

class Loading extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return this.props.loading ? (
			<div className="spinner-overlay">
				<div className="spinner medium" role="progressbar" aria-valuemin="0" aria-valuemax="100">
					<div className="spinner-dot a" />
					<div className="spinner-dot b" />
				</div>
			</div>
		) : (
			''
		);
	}
}

export default Loading;
