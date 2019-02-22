import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import { getFrameAgreements } from '../actions';

import './FaPicker.css';

class FaPicker extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h4>FA PICKER account - {window.SF.param.account}</h4>
				<span>
					<Link to="/agreement">New Agreement</Link>
				</span>
				<ul>
					{Object.values(this.props.frameAgreements).map(fa => {
						return (
							<li key={fa.Id}>
								<Link to={`/agreement/${fa.Id}`}>{fa.Name}</Link>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return { frameAgreements: state.frameAgreements };
};

const mapDispatchToProps = {
	getFrameAgreements
};

// const RcmModal = connect(null, mapDispatchToProps)(ConnectedForm);

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(FaPicker)
);
