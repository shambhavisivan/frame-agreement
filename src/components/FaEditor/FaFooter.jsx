import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from '../utillity/Icon';
import {
	isMaster,
	evaluateExpressionOnAgreement
} from '~/src/utils/shared-service';

import { publish } from '~/src/api';
import ActionIframe from '~/src/components/modals/ActionIframe';

import {
	createToast,
	toggleModals,
	validateFrameAgreement
} from '~/src/actions';

class FaFooter extends React.Component {
	constructor(props) {
		super(props);

		this.callHandler = this.callHandler.bind(this);
		this.onCloseIframe = this.onCloseIframe.bind(this);
		this.onOpenFrameModal = this.onOpenFrameModal.bind(this);
		this.onOpenNegotiationModal = this.onOpenNegotiationModal.bind(this);
		this.onOpenCommercialProductModal = this.onOpenCommercialProductModal.bind(
			this
		);

		this.state = {
			actionIframe: false,
			actionIframeUrl: null,
			actionIframeObject: null
		};
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

	onCloseIframe() {
		publish('onIframeClose', this.state.actionIframeObject.id);

		this.setState({
			actionIframe: false,
			actionIframeUrl: null,
			actionIframeObject: null
		});
	}

	onOpenNegotiationModal() {
		this.props.toggleModals({ negotiateModal: true });
	}

	onOpenCommercialProductModal() {
		this.props.toggleModals({ productModal: true });
	}

	onOpenFrameModal() {
		this.props.toggleModals({ frameModal: true });
	}

	render() {
		let _fa = this.props.frameAgreements[this.props.faId];
		let master = isMaster(_fa);

		if (!_fa._ui.commercialProducts.length && !master) {
			return null;
		}

		let customButtonsFooter = this.props.settings.ButtonCustomData.filter(
			btnObj =>
				evaluateExpressionOnAgreement(btnObj.expressions, _fa) &&
				btnObj.location === 'Footer'
		);

		let standardData = this.props.settings.ButtonStandardData;

		let footer = '';

		let _disabled = !Object.keys(this.props.selectedProducts).length;

		footer = (
			<div className="fa-main-footer">
				{evaluateExpressionOnAgreement(standardData.AddFrameAgreement, _fa) &&
					master && (
						<button
							className="fa-button fa-button--default"
							onClick={this.onOpenFrameModal}
						>
							<Icon name="add" width="16" height="16" color="#0070d2" />
							<span className="fa-button-icon">
								{window.SF.labels.btn_AddFa}
							</span>
						</button>
					)}

				{evaluateExpressionOnAgreement(standardData.AddProducts, _fa) &&
					!master && (
						<button
							className="fa-button fa-button--default"
							onClick={this.onOpenCommercialProductModal}
						>
							<Icon name="add" width="16" height="16" color="#0070d2" />
							<span className="fa-button-icon">
								{window.SF.labels.btn_AddProducts}
							</span>
						</button>
					)}

				{evaluateExpressionOnAgreement(standardData.BulkNegotiate, _fa) &&
					!master && (
						<button
							disabled={_disabled}
							className="fa-button fa-button--default"
							onClick={this.onOpenNegotiationModal}
						>
							<Icon name="user" width="16" height="16" color="#0070d2" />
							<span className="fa-button-icon">
								{window.SF.labels.btn_BulkNegotiate}
							</span>
						</button>
					)}

				{evaluateExpressionOnAgreement(standardData.DeleteProducts, _fa) && (
					<button
						disabled={_disabled}
						className="fa-button fa-button--default"
						onClick={this.props.onRemoveProducts}
					>
						<Icon name="delete" width="16" height="16" color="#0070d2" />
						<span className="fa-button-icon">
							{master
								? window.SF.labels.btn_DeleteAgreements
								: window.SF.labels.btn_DeleteProducts}
						</span>
					</button>
				)}

				{customButtonsFooter.map((btnObj, i) => {
					return (
						<button
							key={btnObj.id + i}
							id={btnObj.id}
							className="fa-button fa-button--default"
							onClick={() => this.callHandler(btnObj)}
						>
							<Icon name="salesforce1" width="16" height="16" color="#0070d2" />
							<span className="fa-button-icon">{btnObj.label}</span>
						</button>
					);
				})}

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

		return footer;
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		commercialProducts: state.commercialProducts,
		settings: state.settings,
		handlers: state.handlers
	};
};

const mapDispatchToProps = {
	createToast,
	toggleModals,
	validateFrameAgreement
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FaFooter);
