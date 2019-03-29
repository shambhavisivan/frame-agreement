import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getFrameAgreements, createToast } from '../actions';
// import { Toaster } from '../actions';

import ApprovalProcess from './ApprovalProcess';
import { publish } from '../api';

import './FaSidebar.css';

class FaSidebar extends Component {
	constructor(props) {
		super(props);
		this.logs = window.react_logs;
		console.log(this.props.fa._ui);
		console.log(this.props.fa._ui.approval);
	}

	render() {
		return <div className="sidebar" />;
	}
}

// const mapStateToProps = state => {
//   return { activeFa: state.activeFa };
// };

const mapDispatchToProps = {
	getFrameAgreements,
	createToast
};

export default connect(
	null,
	mapDispatchToProps
)(FaSidebar);
