import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from '../utillity/Icon';

import { publish } from '../../api';

import {
	createToast,
	toggleModals,
	validateFrameAgreement,
	getCommercialProductData
} from '../../actions';

class FaFooter extends React.Component {
	constructor(props) {
		super(props);

		this.onOpenNegotiationModal = this.onOpenNegotiationModal.bind(this);
		this.onOpenCommercialProductModal = this.onOpenCommercialProductModal.bind(
			this
		);
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

	onOpenNegotiationModal() {
		this.props.toggleModals({ negotiateModal: true });
	}

	onOpenCommercialProductModal() {
		this.props.toggleModals({ productModal: true });
	}

	render() {
		let _fa = this.props.frameAgreements[this.props.faId];
		if (!_fa._ui.commercialProducts.length) {
			return null;
		}

		let customButtonsFooter = this.props.settings.ButtonCustomData.filter(
			btnObj =>
				!btnObj.hidden.has(_fa.csconta__Status__c) &&
				btnObj.location === 'Footer'
		);

		let standardData = this.props.settings.ButtonStandardData;

		let footer = '';

		let _disabled = !Object.keys(this.props.selectedProducts).length;

		footer = (
			<div className="fa-main-footer">
				{standardData.AddProducts.has(_fa.csconta__Status__c) && (
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

				{standardData.BulkNegotiate.has(_fa.csconta__Status__c) && (
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

				{standardData.DeleteProducts.has(_fa.csconta__Status__c) && (
					<button
						disabled={_disabled}
						className="fa-button fa-button--default"
						onClick={this.props.onRemoveProducts}
					>
						<Icon name="delete" width="16" height="16" color="#0070d2" />
						<span className="fa-button-icon">
							{window.SF.labels.btn_DeleteProducts}
						</span>
					</button>
				)}

				{customButtonsFooter.map((btnObj, i) => {
					return (
						<button
							key={btnObj.id + i}
							id={btnObj.id}
							className="fa-button fa-button--default"
							onClick={() => this.callHandler(btnObj.method, btnObj.type)}
						>
							<Icon name="salesforce1" width="16" height="16" color="#0070d2" />
							<span className="fa-button-icon">{btnObj.label}</span>
						</button>
					);
				})}
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
	validateFrameAgreement,
	getCommercialProductData
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FaFooter);
