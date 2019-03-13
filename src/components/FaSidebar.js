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
		return (
			<div className="sidebar">
				<p>
					<span>Dev Sidebar</span>
				</p>

				<hr />

				<ul className="temp-info">
					<li className="delimiter" />

					{this.logs &&
						this.logs
							.slice(Math.max(this.logs.length - 15, 1))
							.map((log, i) => {
								return (
									<li className="log" key={log + i}>
										<span className="sf-label">Action fired:</span>{' '}
										<span className="log-action">{log}</span>
									</li>
								);
							})}
				</ul>

				<hr />

				<p className="sidebar-button-container">
					<button
						className="slds-button slds-button--brand"
						onClick={() =>
							this.props.createToast('success', '_TitleTest', 'MessageTest')
						}
					>
						success
					</button>
					<button
						className="slds-button slds-button--brand"
						onClick={() =>
							this.props.createToast('info', '_TitleTest', 'MessageTest')
						}
					>
						info
					</button>
					<button
						className="slds-button slds-button--brand"
						onClick={() =>
							this.props.createToast('warning', '_TitleTest', 'MessageTest')
						}
					>
						warning
					</button>
					<button
						className="slds-button slds-button--brand"
						onClick={() =>
							this.props.createToast(
								'error',
								'Error occurred!',
								'Error has been made while doing the action. Please do this action differently to avoid this error.'
							)
						}
					>
						error
					</button>
				</p>

				<hr />
			</div>
		);
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
