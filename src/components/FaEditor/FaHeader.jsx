import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// import { } from '~/src/utils/shared-service.js';

import {
	createToast,
	saveFrameAgreement,
	refreshFrameAgreement,
	submitForApproval,
	getApprovalHistory,
	createNewVersionOfFrameAgrement
} from '~/src/actions';

import { publish } from '~/src/api';
import { isMaster } from '~/src/utils/shared-service';

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
		this.callHandler = this.callHandler.bind(this);
		this.onCloseIframe = this.onCloseIframe.bind(this);
		// this.props.faId
		this.editable =
			this.props.settings.FACSettings.fa_editable_statuses.has(
				this.props.frameAgreements[this.props.faId].csconta__Status__c
			) || !this.props.frameAgreements[this.props.faId].Id;

		this.state = {
			actionIframe: false,
			actionIframeUrl: null,
			actionIframeObject: null
		};
	}

	UNSAFE_componentWillUpdate() {
		try {
			if (
				this.editable !==
					this.props.settings.FACSettings.fa_editable_statuses.has(
						this.props.frameAgreements[this.props.faId].csconta__Status__c
					) ||
				!this.props.frameAgreements[this.props.faId].Id
			) {
				this.editable =
					this.props.settings.FACSettings.fa_editable_statuses.has(
						this.props.frameAgreements[this.props.faId].csconta__Status__c
					) || !this.props.frameAgreements[this.props.faId].Id;
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
		await this.upsertFrameAgreements();
		await publish('onBeforeSubmit');

		let _result;

		return new Promise((resolve, reject) => {
			this.props
				.submitForApproval(this.props.faId)
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

	async upsertFrameAgreements() {
		var data = { ...this.props.frameAgreements[this.props.faId] };
		data = await publish('onBeforeSaveFrameAgreement', data);

		if (
			this.props.frameAgreements[this.props.faId]._ui.approvalNeeded &&
			this.editable
		) {
			data.csconta__Status__c = this.props.settings.FACSettings.statuses.requires_approval_status;
		}

		this.props.saveFrameAgreement(data).then(async responseArr => {
			await publish('onAfterSaveFrameAgreement', responseArr);
			this.props.createToast(
				'success',
				window.SF.labels.toast_success_title,
				window.SF.labels.toast_saved_fa
			);
			return 'Success';
		});
	}

	render() {
		// *******************************************************
		// Custom buttons component
		let customButtonsComponent = '';

		let customButtons = this.props.settings.ButtonCustomData.filter(
			btnObj =>
				!btnObj.hidden.has(
					this.props.frameAgreements[this.props.faId].csconta__Status__c
				) && btnObj.location === 'Editor'
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

		let _editable =
			this.props.settings.FACSettings.fa_editable_statuses.has(
				this.props.frameAgreements[this.props.faId].csconta__Status__c
			) || !this.props.frameAgreements[this.props.faId].Id;

		let master = isMaster(this.props.frameAgreements[this.props.faId]);

		let headerClass = _editable ? '' : ' error fa-disabled';
		headerClass +=
			this.props.frameAgreements[this.props.faId]._ui.approvalNeeded && !master
				? 'error fa-invalid'
				: '';

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
									: this.props.frameAgreements[this.props.faId]
											.csconta__Status__c}
							</span>
						) : (
							''
						)}
					</div>

					<div className="fa-secondary-header__item fa-secondary-header__item--right">
						{customButtonsComponent}

						{this.props.settings.ButtonStandardData.Save.has(
							this.props.frameAgreements[this.props.faId].csconta__Status__c
						) && (
							<button
								className="fa-button fa-button--transparent"
								onClick={() => this.upsertFrameAgreements()}
							>
								{window.SF.labels.btn_Save}
							</button>
						)}
						{!master &&
							this.props.settings.ButtonStandardData.SubmitForApproval.has(
								this.props.frameAgreements[this.props.faId].csconta__Status__c
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
						{this.props.settings.ButtonStandardData.Submit.has(
							this.props.frameAgreements[this.props.faId].csconta__Status__c
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
						{this.props.settings.ButtonStandardData.NewVersion.has(
							this.props.frameAgreements[this.props.faId].csconta__Status__c
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
	saveFrameAgreement,
	refreshFrameAgreement,
	submitForApproval,
	getApprovalHistory,
	createNewVersionOfFrameAgrement
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(FaHeader)
);
