import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from '../utillity/Icon';
import { isMaster, evaluateExpressionOnAgreement } from '~/src/utils/shared-service';

import { publish } from '~/src/api';
import ActionIframe from '~/src/components/modals/ActionIframe';

import { createToast, toggleModals, validateFrameAgreement } from '~/src/actions';

class FaFooter extends React.Component {
	constructor(props) {
		super(props);

		this.callHandler = this.callHandler.bind(this);
		this.onCloseIframe = this.onCloseIframe.bind(this);
		this.onOpenFrameModal = this.onOpenFrameModal.bind(this);
		this.onOpenNegotiationModal = this.onOpenNegotiationModal.bind(this);
		this.onOpenCommercialProductModal = this.onOpenCommercialProductModal.bind(this);
		this.onOpenFrameAgreementModal = this.onOpenFrameAgreementModal.bind(this);
		this.onOpenAddonNegotiationModal = this.onOpenAddonNegotiationModal.bind(this);
		this.onOpenAddonModal = this.onOpenAddonModal.bind(this);
		this.onOpenOffersModal = this.onOpenOffersModal.bind(this);

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

	onOpenAddonNegotiationModal() {
		this.props.toggleModals({ negotiateStandaloneModal: true });
	}

	onOpenCommercialProductModal() {
		this.props.toggleModals({ productModal: true });
	}

	onOpenFrameAgreementModal() {
		this.props.toggleModals({ frameModal: true });
	}

	onOpenAddonModal() {
		this.props.toggleModals({ addonModal: true });
	}

	onOpenFrameModal() {
		this.props.toggleModals({ frameModal: true });
	}

	onOpenOffersModal() {
		this.props.toggleModals({ offersModal: true });
	}

	onOpenOfferNegotiationModal() {
		this.props.toggleModals({ negotiateOffersModal: true });
	}

	onOpenCreateOffersModal() {
		this.props.toggleModals({ createOffersModal: true });
	}

	render() {
		let _fa = this.props.frameAgreements[this.props.faId];
		let master = isMaster(_fa);

		if (
			!master &&
			!_fa._ui.commercialProducts.length &&
			!_fa._ui.standaloneAddons.length &&
			!_fa._ui.offers.length &&
			!_fa._ui.faOffers.size
		) {
			return null;
		}

		let customButtonsFooter = this.props.settings.ButtonCustomData.filter(
			btnObj =>
				evaluateExpressionOnAgreement(btnObj.expressions, _fa) && btnObj.location === 'Footer'
		);

		let standardData = this.props.settings.ButtonStandardData;

		let footer = '';

		let _disabled_prod = !Object.keys(this.props.selectedProducts).length;
		let _disabled_add = !Object.keys(this.props.selectedAddons || {}).length;
		let _disabled_offer = !Object.keys(this.props.selectedOffers || {}).length;
		const { hiddenTabs } = this.props.settings

		let buttonVisibillityMap = {
			addFa: evaluateExpressionOnAgreement(standardData.AddFrameAgreement, _fa) && master,
			addProd:
				!hiddenTabs?.product && evaluateExpressionOnAgreement(standardData.AddProducts, _fa) &&
				this.props.activeTab === 0,
			addAdd:
				!hiddenTabs?.addon && evaluateExpressionOnAgreement(standardData.AddAddons, _fa) &&
				this.props.activeTab === 1 &&
				!master,
			addBulk:
				evaluateExpressionOnAgreement(standardData.BulkNegotiateAddons, _fa) &&
				this.props.activeTab === 1 &&
				!master,
			bulk:
				!hiddenTabs?.product && evaluateExpressionOnAgreement(standardData.BulkNegotiate, _fa) &&
				this.props.activeTab === 0 &&
				!master,
			deleteProd:
				!hiddenTabs?.product && evaluateExpressionOnAgreement(standardData.DeleteProducts, _fa) &&
				this.props.activeTab === 0,
			deleteAdd:
				evaluateExpressionOnAgreement(standardData.DeleteAddons, _fa) && this.props.activeTab === 1 &&
				!hiddenTabs?.addon && evaluateExpressionOnAgreement(standardData.DeleteAddons, _fa) && this.props.activeTab === 1,
			addOffer:
				evaluateExpressionOnAgreement(standardData.AddOffers, _fa) &&
				this.props.activeTab === 2 && this.props.activeOfferTabIndex == 0 &&
				!master,
			bulkNegotiateOffers:
				evaluateExpressionOnAgreement(standardData.BulkNegotiateOffers, _fa) &&
				this.props.activeTab === 2 && this.props.activeOfferTabIndex == 0 &&
				!master,
			createOffer:
				evaluateExpressionOnAgreement(standardData.CreateOffers, _fa) &&
					this.props.activeTab === 2 && this.props.activeOfferTabIndex == 1 &&
					!master,
			deleteOffer:
				evaluateExpressionOnAgreement(standardData.DeleteOffers, _fa) && this.props.activeTab === 2
		};

		// if isPsEnabled is true show offer related functionalies
		const isPsEnabled = this.props.settings.FACSettings.isPsEnabled;

		footer = (
			<div className="fa-main-footer">
				{buttonVisibillityMap.addFa && (
					<button
						className="fa-button fa-button--default"
						disabled={this.props.disableFrameAgreementOperations}
						onClick={this.onOpenFrameModal}
					>
						<Icon name="add" width="16" height="16" color="#0070d2" />
						<span className="fa-button-icon">{window.SF.labels.btn_AddFa}</span>
					</button>
				)}

				{buttonVisibillityMap.addProd && (
					<button
						className="fa-button fa-button--default"
						disabled={this.props.disableFrameAgreementOperations}
						onClick={master ? this.onOpenFrameAgreementModal : this.onOpenCommercialProductModal}
					>
						<Icon name="add" width="16" height="16" color="#0070d2" />
						<span className="fa-button-icon">{window.SF.labels[master ? 'btn_AddFa' : 'btn_AddProducts']}</span>
					</button>
				)}

				{buttonVisibillityMap.addAdd && (
					<button
						className="fa-button fa-button--default"
						disabled={this.props.disableFrameAgreementOperations}
						onClick={this.onOpenAddonModal}
					>
						<Icon name="add" width="16" height="16" color="#0070d2" />
						<span className="fa-button-icon">{window.SF.labels.btn_AddAddons}</span>
					</button>
				)}

				{buttonVisibillityMap.bulk && (
					<button
						className="fa-button fa-button--default"
						disabled={
							_disabled_prod ||
							this.props.disableFrameAgreementOperations
						}
						onClick={this.onOpenNegotiationModal}
					>
						<Icon name="user" width="16" height="16" color="#0070d2" />
						<span className="fa-button-icon">{window.SF.labels.btn_BulkNegotiate}</span>
					</button>
				)}

				{buttonVisibillityMap.addBulk && (
					<button
						className="fa-button fa-button--default"
						disabled={
							_disabled_add ||
							this.props.disableFrameAgreementOperations
						}
						onClick={this.onOpenAddonNegotiationModal}
					>
						<Icon name="user" width="16" height="16" color="#0070d2" />
						<span className="fa-button-icon">{window.SF.labels.btn_BulkNegotiateAddons}</span>
					</button>
				)}

				{buttonVisibillityMap.deleteProd && (
					<button
						className="fa-button fa-button--default"
						disabled={
							_disabled_prod ||
							this.props.disableFrameAgreementOperations
						}
						onClick={this.props.onRemoveProducts}
					>
						<Icon name="delete" width="16" height="16" color="#0070d2" />
						<span className="fa-button-icon">
							{master ? window.SF.labels.btn_DeleteAgreements : window.SF.labels.btn_DeleteProducts}
						</span>
					</button>
				)}

				{buttonVisibillityMap.deleteAdd && (
					<button
						className="fa-button fa-button--default"
						disabled={
							_disabled_add ||
							this.props.disableFrameAgreementOperations
						}
						onClick={this.props.onRemoveAddons}
					>
						<Icon name="delete" width="16" height="16" color="#0070d2" />
						<span className="fa-button-icon">{window.SF.labels.btn_DeleteAddons}</span>
					</button>
				)}

				{(buttonVisibillityMap.addOffer && isPsEnabled) && (
					<button
						className="fa-button fa-button--default"
						onClick={this.onOpenOffersModal}
						disabled={this.props.disableFrameAgreementOperations || !this.props.offersLoaded}
					>
						<Icon name="add" width="16" height="16" color="#0070d2" />
						<span className="fa-button-icon">{window.SF.labels.btn_AddOffers}</span>
					</button>
				)}

				{(buttonVisibillityMap.createOffer && isPsEnabled) && (
					<button
						disabled={
							this.props.disableFrameAgreementOperations
						}
						className="fa-button fa-button--default"
						onClick={() => this.onOpenCreateOffersModal()}
					>
						<Icon name="add" width="16" height="16" color="#0070d2" />
						<span className="fa-button-icon">
							{window.SF.labels.btn_CreateOffers}
						</span>
					</button>
				)}

				{(buttonVisibillityMap.bulkNegotiateOffers && isPsEnabled) && (
					<button
						disabled={
							_disabled_offer ||
							this.props.disableFrameAgreementOperations
						}
						className="fa-button fa-button--default"
						onClick={() => this.onOpenOfferNegotiationModal()}
					>
						<Icon name="user" width="16" height="16" color="#0070d2" />
						<span className="fa-button-icon">{window.SF.labels.btn_BulkNegotiateOffers}</span>
					</button>
				)}

				{(buttonVisibillityMap.deleteOffer && isPsEnabled) && (
					<button
						disabled={
							_disabled_offer ||
							this.props.disableFrameAgreementOperations
						}
						className="fa-button fa-button--default"
						onClick={this.props.onRemoveOffers}
					>
						<Icon name="delete" width="16" height="16" color="#0070d2" />
						<span className="fa-button-icon">
							{window.SF.labels.btn_DeleteOffers}
						</span>
					</button>
				)}

				{customButtonsFooter.map((btnObj, i) => {
					return (
						<button
							key={btnObj.id + i}
							id={btnObj.id}
							className="fa-button fa-button--default"
							disabled={this.props.disableFrameAgreementOperations}
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
		handlers: state.handlers,
		disableFrameAgreementOperations: state.disableFrameAgreementOperations,
		offersLoaded: state.initialised.of_loaded
	};
};

const mapDispatchToProps = {
	createToast,
	toggleModals,
	validateFrameAgreement
};

export default connect(mapStateToProps, mapDispatchToProps)(FaFooter);
