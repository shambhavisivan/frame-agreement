import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// import { } from '~/src/utils/shared-service.js';

import {
	createToast,
	saveFrameAgreement,
	refreshFrameAgreement,
	getApprovalHistory,
	createNewVersionOfFrameAgrement,
	toggleModals
} from '~/src/actions';

import { publish, submitForApproval } from '~/src/api';
import {
	isMaster,
	evaluateExpressionOnAgreement
} from '~/src/utils/shared-service';

import Icon from '../utillity/Icon';
import CustomButtonDropdown from '../utillity/CustomButtonDropdown';
import ActionIframe from '../modals/ActionIframe';

class FaHeader extends React.Component {
	constructor(props) {
		super(props);
		this.createNewVersion = this.createNewVersion.bind(this);
		this.onDecompose = () =>
			window.FAM.api.activateFrameAgreement(this.props.faId);
		this.onSubmitForApproval = this.onSubmitForApproval.bind(this);
		this.onDeltaComparison = this.onDeltaComparison.bind(this);
		this.callHandler = this.callHandler.bind(this);
		this.onCloseIframe = this.onCloseIframe.bind(this);
		// this.props.faId
		this.editable = window.FAM.api.isAgreementEditable(this.props.faId);

		this.state = {
			editable: window.FAM.api.isAgreementEditable(this.props.faId),
			actionIframe: false,
			actionIframeUrl: null,
			actionIframeObject: null
		};
	}

	componentDidUpdate() {
		try {
			if (
				this.state.editable !==
				window.FAM.api.isAgreementEditable(this.props.faId)
			) {
				this.setState({
					editable: window.FAM.api.isAgreementEditable(this.props.faId)
				});
			}
		} catch (e) {}
	}

	onCloseIframe() {
		publish('onIframeClose', this.state.actionIframeObject.id);

		this.setState({
			actionIframe: false,
			actionIframeUrl: null,
			actionIframeObject: null
		});
	}

	async createNewVersion() {
		let newFa = await this.props.createNewVersionOfFrameAgrement(
			this.props.faId
		);
		this.props.history.push('/');
		this.props.history.push('/agreement/' + newFa.Id);
		// window.location.reload();
	}

	async onSubmitForApproval() {
		await this.upsertFrameAgreements(true);
		await publish('onBeforeSubmit');

		let _result;

		return new Promise((resolve, reject) => {
			submitForApproval(this.props.faId)
				.then(async response => {
					_result = response;
					if (response) {
						this.props.createToast(
							'success',
							window.SF.labels.toast_success_title,
							window.SF.labels.toast_submitForApproval_success
						);
					} else {
						this.props.createToast(
							'error',
							window.SF.labels.toast_failed_title,
							window.SF.labels.toast_submitForApproval_failed
						);
					}
					publish('onAfterSubmit');
				})
				.then(() => {
					Promise.all([
						this.props.getApprovalHistory(this.props.faId),
						this.props.refreshFrameAgreement(this.props.faId)
					]).then(
						r => {
							_result ? resolve(_result) : reject(_result);
						},
						err => {}
					);
				});
		});
	}

	async onDeltaComparison() {
		await this.upsertFrameAgreements(true);
		this.props.toggleModals({ deltaModal: true });
	}

	async callHandler(btnObj) {
		if (!this.props.handlers.hasOwnProperty(btnObj.method)) {
			this.props.createToast(
				'error',
				window.SF.labels.toast_invalid_handler_title,
				window.SF.labels.toast_invalid_handler + ' (' + btnObj.method + ')'
			);
			return;
		}

		let result = await this.props.handlers[btnObj.method]();
		switch (btnObj.type) {
			case 'action':
				console.log(result);
				break;
			case 'iframe':
				this.setState({
					actionIframe: true,
					actionIframeUrl: result,
					actionIframeObject: btnObj
				});
				break;
			case 'redirect':
				console.log(result);
				window.location.replace(result);
				break;
			default:
		}
	}

	async upsertFrameAgreements(suppress) {
		var data = { ...this.props.frameAgreements[this.props.faId] };
		data = await publish('onBeforeSaveFrameAgreement', data);

		// If approvers revise is activated, FA wont change status
		if (
			this.props.frameAgreements[this.props.faId]._ui.approvalNeeded &&
			this.state.editable &&
			!this.props.settings.FACSettings.approvers_revise
		) {
			data.csconta__Status__c = this.props.settings.FACSettings.statuses?.requires_approval_status;
		}

		this.props.saveFrameAgreement(data).then(async responseArr => {
			await publish('onAfterSaveFrameAgreement', responseArr);
			!suppress &&
				this.props.createToast(
					'success',
					window.SF.labels.toast_success_title,
					window.SF.labels.toast_saved_fa
				);
			return 'Success';
		});
	}

	render() {
		let _fa = this.props.frameAgreements[this.props.faId];

		// *******************************************************
		// Custom buttons component
		let customButtonsComponent = '';

		let customButtons = this.props.settings.ButtonCustomData.filter(
			btnObj =>
				evaluateExpressionOnAgreement(btnObj.expressions, _fa) &&
				btnObj.location === 'Editor'
		);

		if (customButtons.length >= 3) {
			customButtonsComponent = (
				<CustomButtonDropdown
					className="fa-dropdown"
					buttons={customButtons}
					onAction={this.callHandler}
				/>
			);
		} else {
			customButtonsComponent = (
				<div className="custom-button-container">
					{customButtons.map((btnObj, i) => {
						return (
							<button
								key={btnObj.id + i}
								id={btnObj.id}
								onClick={() => {
									this.callHandler(btnObj);
								}}
								className="fa-button fa-button--transparent"
							>
								{btnObj.label}
							</button>
						);
					})}
				</div>
			);
		}
		// *******************************************************
		let master = isMaster(_fa);

		let headerClass = '';

		if (master) {
			// none of these
		} else if (!this.state.editable) {
			headerClass = ' error fa-disabled';
		} else if (
			_fa._ui.approvalNeeded &&
			_fa.csconta__Status__c !==
				this.props.settings.FACSettings.statuses.approved_status
		) {
			headerClass = ' error fa-invalid';
		}

		let _faStatus = this.props.frameAgreements[this.props.faId]
			.csconta__Status__c;

		return (
			<div className={'fa-secondary-header ' + headerClass}>
				<div className="fa-secondary-header__inner">
					<div
						className="fa-secondary-header__prev"
						onClick={() => this.props.history.push('/')}
					>
						<Icon name="back" width="19" height="18" color="#FFFFFF" />
					</div>
					<div className="fa-secondary-header__item">
						<div className="fa-secondary-header__title-wrapper">
							<div className="fa-secondary-header__subtitle">
								{master
									? window.SF.labels.header_frameAgreementMasterTitle
									: window.SF.labels.header_frameAgreementEditorTitle}
							</div>
							<div className="fa-secondary-header__title">
								{this.props.frameAgreements[this.props.faId]
									.csconta__Agreement_Name__c || '-- anonymous --'}
							</div>
						</div>
						{this.props.frameAgreements[this.props.faId].csconta__Status__c ? (
							<span className="fa-chip fa-chip--draft">
								{master
									? 'Master'
									: window.SF.fieldLabels.statuses[_faStatus] || _faStatus}
							</span>
						) : (
							''
						)}
					</div>

					<div className="fa-secondary-header__item fa-secondary-header__item--right">
						{customButtonsComponent}

						{evaluateExpressionOnAgreement(
							this.props.settings.ButtonStandardData.Save,
							_fa
						) ? (
							<button
								className="fa-button fa-button--transparent"
								onClick={() => this.upsertFrameAgreements()}
							>
								{window.SF.labels.btn_Save}
							</button>
						) : null}

						{!master &&
							evaluateExpressionOnAgreement(
								this.props.settings.ButtonStandardData.SubmitForApproval,
								_fa
							) && (
								<button
									className="fa-button fa-button--transparent"
									disabled={
										!this.props.frameAgreements[this.props.faId]._ui
											.approvalNeeded ||
										!this.props.frameAgreements[this.props.faId]._ui
											.commercialProducts.length
									}
									onClick={this.onSubmitForApproval}
								>
									{window.SF.labels.btn_SubmitForApproval}
								</button>
							)}
						{!master &&
							evaluateExpressionOnAgreement(
								this.props.settings.ButtonStandardData.Delta,
								_fa
							) && (
								<button
									className="fa-button fa-button--transparent"
									onClick={this.onDeltaComparison}
								>
									{window.SF.labels.btn_Delta}
								</button>
							)}
						{evaluateExpressionOnAgreement(
							this.props.settings.ButtonStandardData.Submit,
							_fa
						) &&
							this.props.faId &&
							!master && (
								<button
									className="fa-button fa-button--transparent"
									onClick={this.onDecompose}
								>
									{window.SF.labels.btn_Submit}
								</button>
							)}
						{evaluateExpressionOnAgreement(
							this.props.settings.ButtonStandardData.NewVersion,
							_fa
						) &&
							!master && (
								<button
									className="fa-button fa-button--transparent"
									onClick={this.createNewVersion}
								>
									{window.SF.labels.btn_NewVersion}
								</button>
							)}
					</div>
				</div>

				{this.state.actionIframe && this.state.actionIframeUrl && (
					<ActionIframe
						onCloseIframe={this.onCloseIframe}
						open={this.state.actionIframe}
						config={this.state.actionIframeObject}
						url={this.state.actionIframeUrl}
					/>
				)}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		settings: state.settings,
		handlers: state.handlers
		// approvalNeeded: state.approvalNeeded
	};
};

const mapDispatchToProps = {
	createToast,
	toggleModals,
	saveFrameAgreement,
	refreshFrameAgreement,
	getApprovalHistory,
	createNewVersionOfFrameAgrement
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(FaHeader)
);
