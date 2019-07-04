import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
	createToast,
	createPricingRuleGroup,
	saveFrameAgreement,
	decomposeAttachment,
	submitForApproval,
	undoDecomposition,
	getApprovalHistory,
	refreshFrameAgreement,
	setFrameAgreementState,
	createNewVersionOfFrameAgrement
} from '../../actions';

import { publish } from '../../api';
import Icon from '../utillity/Icon';
import CustomButtonDropdown from '../utillity/CustomButtonDropdown';

import ActionIframe from '../modals/ActionIframe';
import { isMaster } from '../../utils/shared-service';

class FaHeader extends React.Component {
	constructor(props) {
		super(props);
		this.createNewVersion = this.createNewVersion.bind(this);
		this.onDecompose = this.onDecompose.bind(this);
		this.onSubmitForApproval = this.onSubmitForApproval.bind(this);
		// this.props.faId
		this.editable =
			this.props.settings.FACSettings.fa_editable_statuses.has(
				this.props.frameAgreements[this.props.faId].csconta__Status__c
			) || !this.props.frameAgreements[this.props.faId].Id;

		this.state = {
			actionIframe: true,
			actionIframeUrl: ''
		};
	}

	componentWillUpdate() {
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

	onCloseModal() {
		this.setState({
			actionIframe: false,
			actionIframeUrl: ''
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

	async onDecompose() {
		// 1) Create a structure that is matching one element -> one pipra
		let _attachment = this.props.frameAgreements[this.props.faId]._ui.attachment
			.products;
		// let _attachment = this.props.frameAgreements[this.props.faId]._ui.attachment.products;
		console.log(_attachment);

		let structure = [];
		for (var cpId in _attachment) {
			if (_attachment[cpId].hasOwnProperty('_addons')) {
				let addons = _attachment[cpId]._addons;
				for (var cpaoa in addons) {
					structure.push({
						cpaoaId: cpaoa,
						recurring: addons[cpaoa].recurring || null,
						oneOff: addons[cpaoa].oneOff || null
					});
				}
			}

			if (_attachment[cpId].hasOwnProperty('_charges')) {
				let charges = _attachment[cpId]._charges;
				for (var chId in charges) {
					structure.push({
						peId: chId,
						recurring: charges[chId].recurring || null,
						oneOff: charges[chId].oneOff || null
					});
				}
			}

			if (_attachment[cpId].hasOwnProperty('_product')) {
				structure.push({
					cpId: cpId,
					recurring: _attachment[cpId]._product.recurring || null,
					oneOff: _attachment[cpId]._product.oneOff || null
				});
			}
		}
		// 2) Remove items that have no charge value
		structure = structure.filter(
			item => item.recurring !== null || item.oneOff !== null
		);

		// Create pricing rule group, pricing rule and association between them. Return pricing rule id to be used in next stage
		const PR_ID = await this.props.createPricingRuleGroup(
			this.props.frameAgreements[this.props.faId].Id
		);

		console.log(PR_ID);

		if (typeof PR_ID !== 'string') {
			console.error('Activation failed, invalid pricing rule Id!');
			return false;
		}

		// This will hold the structure in chunks on n
		let decompositionDataChunked = [];
		// This will be filled with promises
		let decompositionPromiseArray = [];

		// CHUNK THE STRUCTURE
		for (
			let i = 0;
			i < structure.length;
			i += this.props.settings.FACSettings.decomposition_chunk_size
		) {
			decompositionDataChunked.push(
				structure.slice(
					i,
					i + this.props.settings.FACSettings.decomposition_chunk_size
				)
			);
		}

		console.log(decompositionDataChunked);

		// Fill the promise array
		decompositionDataChunked.forEach(chunk => {
			decompositionPromiseArray.push(
				this.props.decomposeAttachment(
					chunk,
					PR_ID,
					this.props.frameAgreements[this.props.faId].Id
				)
			);
		});

		//********************************************
		// Wait for all to resolve
		let result = await Promise.all(decompositionPromiseArray);
		result = new Set(result);
		//********************************************

		console.log('Merged results:', result);

		// If the decomposition was successful
		if (!result.has('Success') || result.size > 1) {
			console.error('Decomposition failed, undoing...!');

			this.props.createToast(
				'error',
				window.SF.labels.toast_decomposition_title_failed,
				window.SF.labels.toast_decomposition_failed
			);

			let undoArray = [];
			let undoPromiseArray = [];
			// CHUNK THE STRUCTURE
			for (let i = 0; i < structure.length; i += 10000) {
				undoArray.push(structure.slice(i, i + 10000));
			}

			undoArray.forEach(chunk => {
				undoPromiseArray.push(this.props.undoDecomposition(PR_ID));
			});

			let undo_result = await Promise.all(undoPromiseArray);
			this.props.createToast(
				'warning',
				window.SF.labels.toast_decomposition_title_revered,
				window.SF.labels.toast_decomposition_revered
			);
		} else {
			await this.props.setFrameAgreementState(
				this.props.faId,
				this.props.settings.FACSettings.statuses.active_status
			);
			await this.props.refreshFrameAgreement(this.props.faId);

			this.props.createToast(
				'success',
				window.SF.labels.toast_decomposition_title_success,
				window.SF.labels.toast_decomposition_success +
					' (' +
					structure.length +
					')'
			);
		}
	}

	async callHandler(handlerName, actionType) {
		if (!this.props.handlers.hasOwnProperty(handlerName)) {
			this.props.createToast(
				'error',
				window.SF.labels.toast_invalid_handler_title,
				window.SF.labels.toast_invalid_handler + ' (' + handlerName + ')'
			);
			return;
		}

		let result = await this.props.handlers[handlerName]();
		switch (actionType) {
			case 'action':
				console.log(result);
				break;
			case 'iframe':
				this.setState({
					actionIframe: true,
					actionIframeUrl: result
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
									this.callHandler(btnObj.method, btnObj.type);
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
						onCloseModal={this.onCloseModal}
						open={this.state.actionIframe}
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
	createPricingRuleGroup,
	saveFrameAgreement,
	decomposeAttachment,
	refreshFrameAgreement,
	submitForApproval,
	getApprovalHistory,
	undoDecomposition,
	setFrameAgreementState,
	createNewVersionOfFrameAgrement
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(FaHeader)
);
