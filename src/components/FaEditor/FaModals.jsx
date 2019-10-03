import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from '../utillity/Icon';

import { publish } from '../../api';

import ActionIframe from '../modals/ActionIframe';
import ProductModal from '../modals/ProductModal';
import NegotiationModal from '../modals/NegotiationModal';
import FrameModal from '../modals/FrameModal';

import {
	addFaToMaster,
	createToast,
	toggleModals,
	bulkNegotiate,
	validateFrameAgreement,
	addProductsToFa,
	getCommercialProductData
} from '~/src/actions';

class FaModals extends React.Component {
	constructor(props) {
		super(props);

		this.onAddFa = this.onAddFa.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.onAddProducts = this.onAddProducts.bind(this);
		this.onBulkNegotiate = this.onBulkNegotiate.bind(this);
	}

	async onBulkNegotiate(data) {
		data = await publish('onBeforeBulkNegotiation', data);

		this.props.bulkNegotiate(this.props.faId, data);
		this.props.validateFrameAgreement(this.props.faId);

		publish(
			'onAfterBulkNegotiation',
			this.props.frameAgreements[this.props.faId]._ui.attachment
		);
		this.onCloseModal();
	}

	async onAddProducts(products = []) {
		products = await publish('onBeforeAddProducts', products);

		let _productsSet = new Set(products);

		// let _attachment = {};
		// Sort out products data
		let IdsToLoad = this.props.commercialProducts.reduce((acc, cp) => {
			if (_productsSet.has(cp.Id)) {
				// _attachment[cp.Id] = {};
				if (!cp._dataLoaded) {
					return acc.concat([cp.Id]);
				} else {
					return acc;
				}
			} else {
				return acc;
			}
		}, []);

		await this.props.getCommercialProductData(IdsToLoad);
		await this.props.addProductsToFa(this.props.faId, Array.from(_productsSet));
		this.props.validateFrameAgreement(this.props.faId);

		publish(
			'onAfterAddProducts',
			this.props.frameAgreements[this.props.faId]._ui.commercialProducts.map(
				cp => cp.Id
			)
		);
		this.onCloseModal();
		return this.props.frameAgreements[this.props.faId];
	}

	async onAddFa(agreements) {
		await this.props.addFaToMaster(this.props.faId, agreements);
		publish('onAfterAddProducts', agreements);
	}

	onCloseModal() {
		this.props.toggleModals();
	}

	render() {
		let _fa = this.props.frameAgreements[this.props.faId];
		// *******************************************************
		// Modal needs to be conditionally rendered to activate its lifecycle
		let productModal = null;
		if (this.props.modals.productModal) {
			productModal = (
				<ProductModal
					cpFilter={_fa._ui._filter}
					open={this.props.modals.productModal}
					addedProducts={
						this.props.frameAgreements[this.props.faId]._ui.commercialProducts
					}
					onAddProducts={this.onAddProducts}
					onCloseModal={this.onCloseModal}
				/>
			);
		}
		// *******************************************************
		// Modal needs to be conditionally rendered to activate its lifecycle
		let negotiateModal = null;
		if (this.props.modals.negotiateModal) {
			negotiateModal = (
				<NegotiationModal
					open={this.props.modals.negotiateModal}
					products={Object.keys(this.props.selectedProducts)}
					attachment={
						this.props.frameAgreements[this.props.faId]._ui.attachment.products
					}
					onNegotiate={this.onBulkNegotiate}
					onCloseModal={this.onCloseModal}
				/>
			);
		}
		// *******************************************************
		// Modal needs to be conditionally rendered to activate its lifecycle
		let actionModal = null;
		if (this.props.modals.actionIframe && this.props.modals.actionIframeUrl) {
			actionModal = (
				<ActionIframe
					onCloseModal={this.onCloseModal}
					open={this.props.modals.actionIframe}
					url={this.props.modals.actionIframeUrl}
				/>
			);
		}
		// *******************************************************
		// Modal needs to be conditionally rendered to activate its lifecycle
		let faModal = null;
		if (this.props.modals.frameModal) {
			faModal = (
				<FrameModal
					faId={this.props.faId}
					onCloseModal={this.onCloseModal}
					onAddFa={this.onAddFa}
					open={this.props.modals.frameModal}
				/>
			);
		}
		// *******************************************************

		return (
			<React.Fragment>
				{actionModal}
				{faModal}
				{productModal}
				{negotiateModal}
			</React.Fragment>
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		commercialProducts: state.commercialProducts,
		modals: state.modals
	};
};

const mapDispatchToProps = {
	addFaToMaster,
	createToast,
	toggleModals,
	bulkNegotiate,
	addProductsToFa,
	validateFrameAgreement,
	getCommercialProductData
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FaModals);
