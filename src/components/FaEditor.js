import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import {
	saveFrameAgreement,
	createFrameAgreement,
	getCommercialProductData,
	getAttachment,
	saveAttachment
} from '../actions';
import { truncateCPField } from '../utils/shared-service';
import './FaEditor.css';

import FaSidebar from './FaSidebar';
import CommercialProduct from './negotiation/CommercialProduct';

import Header from './utillity/Header';
import Icon from './utillity/Icon';
import PropTypes from 'prop-types';

import SFDatePicker from './utillity/datepicker/SFDatePicker';
import SFField from './utillity/readonly/SFField';
import InputSearch from './utillity/inputs/InputSearch';
import Checkbox from './utillity/inputs/Checkbox';

import ProductModal from './modals/ProductModal';
import NegotiationModal from './modals/NegotiationModal';

window.activeFa = {};
window.editor = {};

class FrameAgreement {
	constructor() {
		this.Id = null;
		this.Name = '';
		this.csconta__Agreement_Name__c = '';
		this.csconta__Status__c = 'Draft';
		this.csconta__Valid_From__c = null;
		this.csconta__Valid_To__c = null;
		this._ui = {
			commercialProducts: [],
			attachment: {}
		};
	}
}

class FaEditor extends Component {
	constructor(props) {
		super(props);

		this.onBackClick = this.onBackClick.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.onFieldChange = this.onFieldChange.bind(this);
		this.onAddProducts = this.onAddProducts.bind(this);
		this.onSelectProduct = this.onSelectProduct.bind(this);
		this.upsertFrameAgreements = this.upsertFrameAgreements.bind(this);
		this.onOpenNegotiationModal = this.onOpenNegotiationModal.bind(this);
		this.onOpenCommercialProductModal = this.onOpenCommercialProductModal.bind(
			this
		);

		this.faId = this.props.match.params.id || null;
		let _frameAgreement;

		if (this.faId) {
			_frameAgreement = { ...this.props.frameAgreements[this.faId] };
		} else {
			_frameAgreement = new FrameAgreement();
		}

		// Ref active FA from store
		this.state = {
			activeFa: _frameAgreement,
			productModal: false,
			negotiateModal: false,
			selectedProducts: {},
			loadingProducts: [],
			attachmentLoaded: false
		};
	}

	componentWillMount() {
		// Check if FA info is loaded already
		if (this.faId && this.state.activeFa._ui.attachment === null) {
			// IF not, load attachment for FA
			this.props.getAttachment(this.faId).then(resp_attachment => {
				let IdsToLoad = Object.keys(resp_attachment || {});
				// If attachment is present
				if (IdsToLoad.length) {
					// Mend null values, its loaded now
					for (var key in resp_attachment) {
						resp_attachment[key] = resp_attachment[key] || {};
					}
					// Get data for commercial products
					this.props.getCommercialProductData(IdsToLoad).then(r => {
						// Apply it
						let _commercialProducts = this.props.commercialProducts.filter(
							cp => {
								return IdsToLoad.includes(cp.Id);
							}
						);
						// Update active FA with data
						setTimeout(() => {
							this.setState({
								attachmentLoaded: true,
								activeFa: {
									...this.state.activeFa,
									_ui: {
										...this.state.activeFa._ui,
										commercialProducts: _commercialProducts,
										attachment: resp_attachment
									}
								}
							});
						});
					});
				} else {
					// No attachment
					this.setState({
						attachmentLoaded: true,
						activeFa: {
							...this.state.activeFa,
							_ui: { ...this.state.activeFa._ui, attachment: {} }
						}
					});
				}
			});
		} else {
			// this.props.setActiveFa(this.state.activeFa);
			this.setState({ attachmentLoaded: true });
		}

		// **************************************
		this.editable =
			this.props.settings.FACSettings.FA_Editable_Statuses.includes(
				this.state.activeFa.csconta__Status__c
			) || !this.state.activeFa.Id;
		// **************************************
		// Organize the header grid
		var field_rows = [];
		var row = [];
		var row_grid_count = 0;

		this.props.settings.JSONData.map(f => {
			if (row_grid_count + f.grid > 12) {
				field_rows.push([...row]);
				row = [];
				row_grid_count = 0;
			}
			row_grid_count += f.grid;
			row.push(f);
		});
		field_rows.push(row);
		this.header_rows = field_rows;
		// **************************************
		window.activeFa = this.state.activeFa;
		window.editor = this;
	}

	/**************************************************/
	applyAttachment(fa, attachment) {}
	/**************************************************/
	onOpenNegotiationModal() {
		console.log(this.state.selectedProducts);
		if (this.state.activeFa.Id) {
			this.setState({ negotiateModal: true });
		}
	}

	onOpenCommercialProductModal() {
		if (this.state.activeFa.Id) {
			this.setState({ productModal: true });
		}
	}

	onCloseModal() {
		this.setState({ productModal: false, negotiateModal: false });
	}

	/**************************************************/
	onAddProducts(productIds) {
		console.log('Added products:', productIds);

		let _attachment = {};
		let productIdsMap = {};

		productIds.forEach(cpId => {
			productIdsMap[cpId] = true;
			_attachment[cpId] = this.state.activeFa._ui.attachment[cpId] || {};
		});

		// Do not load products twice
		let IdsToLoad = this.props.commercialProducts.reduce((acc, cp) => {
			if (!cp.attachmentLoaded && productIdsMap[cp.Id]) {
				return acc.concat([cp.Id]);
			} else {
				return acc;
			}
		}, []);

		function applyChanges() {
			let _commercialProducts = this.props.commercialProducts.filter(cp => {
				return productIdsMap[cp.Id];
			});

			this.setState({
				activeFa: {
					...this.state.activeFa,
					_ui: {
						...this.state.activeFa._ui,
						commercialProducts: _commercialProducts,
						attachment: { ..._attachment }
					}
				}
			});
			this.onCloseModal();
		}

		applyChanges = applyChanges.bind(this);

		if (IdsToLoad.length) {
			this.props.getCommercialProductData(IdsToLoad).then(r => {
				applyChanges();
			});
		} else {
			applyChanges();
		}
	}

	onSelectProduct(product) {
		let selectedProducts = this.state.selectedProducts;

		if (selectedProducts[product.Id]) {
			delete selectedProducts[product.Id];
		} else {
			selectedProducts[product.Id] = product;
		}
		this.setState({
			selectedProducts
		});
	}

	onSelectAllProducts() {
		console.log('CHECK ALL');
		let selectedProducts = this.state.selectedProducts;

		if (
			this.state.activeFa._ui.commercialProducts.length ===
			Object.keys(this.state.selectedProducts).length
		) {
			selectedProducts = {};
		} else {
			this.state.activeFa._ui.commercialProducts.forEach(cp => {
				selectedProducts[cp.Id] = cp;
			});
		}

		this.setState({
			selectedProducts
		});
	}
	onBackClick() {
		this.props.history.push('/');
	}
	onFieldChange(field, value) {
		this.props.updateActiveFa(field, value);
	}
	/**************************************************/
	onNegotiate(priceItemId, type, data) {
		console.log(data);
		let attachment = this.state.activeFa._ui.attachment;
		attachment[priceItemId] = { ...attachment[priceItemId], [type]: data };
		this.setState({
			activeFa: {
				...this.state.activeFa,
				_ui: { ...this.state.activeFa._ui, attachment }
			}
		});
	}
	/**************************************************/

	upsertFrameAgreements() {
		var data = { ...this.state.activeFa };
		data.Id = data.Id || null;

		if (data.Id) {
			Promise.all([
				this.props.saveFrameAgreement(data, this.state.activeFa.Id),
				this.props.saveAttachment(
					this.state.activeFa.Id,
					this.state.activeFa._ui.attachment
				)
			]).then(responseArr => {
				console.log('Attachment:', responseArr[1]);
			});
		} else {
			this.props.createFrameAgreement(data).then(upsertedFa => {
				this.setState({
					activeFa: upsertedFa
				});
			});
		}
	}

	// <SFDatePicker editable={this.editable} initialDate={true} onDateChange={this.onDateChange} labelText="Effective date from" placeholderText="Enter date from"/>

	render() {
		// *******************************************************
		// Add product call to action
		let addProductCTA = '';
		if (!this.state.activeFa._ui.commercialProducts.length) {
			addProductCTA = (
				<div className="add-product-box">
					<span className="box-header-1">There are no Products in here</span>
					{(() => {
						if (!this.state.activeFa.Id) {
							return (
								<span className="box-header-2">
									Save frame agreement before adding products!
								</span>
							);
						} else {
							return (
								<span className="box-header-2">
									They will be visible as soon as you create them.
								</span>
							);
						}
					})()}
					<div className="box-button-container">
						<button
							className="slds-button slds-button--brand"
							onClick={this.onOpenCommercialProductModal}
							disabled={!this.state.activeFa.Id}
						>
							Add Products
						</button>
					</div>
				</div>
			);
		}
		// *******************************************************
		let footer = '';
		if (this.state.activeFa._ui.commercialProducts.length) {
			footer = (
				<div className="main-footer">
					<button
						className="slds-button slds-button--brand"
						onClick={this.onOpenCommercialProductModal}
					>
						Toggle Products
					</button>
					<button
						disabled={!Object.keys(this.state.selectedProducts).length}
						className="slds-button slds-button--neutral"
						onClick={this.onOpenNegotiationModal}
					>
						Negotiate Products
					</button>
				</div>
			);
		}
		// *******************************************************
		// Modal needs to be conditionally rendered to activate its lifecycle
		let productModal = '';
		if (this.state.productModal) {
			productModal = (
				<ProductModal
					open={this.state.productModal}
					addedProducts={this.state.activeFa._ui.commercialProducts}
					onAddProducts={this.onAddProducts}
					onCloseModal={this.onCloseModal}
				/>
			);
		}
		// *******************************************************
		// Modal needs to be conditionally rendered to activate its lifecycle
		let negotiateModal = '';
		if (this.state.negotiateModal) {
			negotiateModal = (
				<NegotiationModal
					open={this.state.negotiateModal}
					products={Object.keys(this.state.selectedProducts)}
					attachment={this.state.activeFa._ui.attachment}
					onCloseModal={this.onCloseModal}
				/>
			);
		}
		// *******************************************************
		// Negotiation header with and without commercial products
		let commercialProductListHeader;
		if (this.state.activeFa._ui.commercialProducts.length) {
			commercialProductListHeader = (
				<div className="info-row">
					<div className="commercial-product-search-container">
						<span>
							Products ({this.state.activeFa._ui.commercialProducts.length})
						</span>
						<div className="commercial-product-search transparent">
							<InputSearch placeholder="Quick search" />
						</div>
					</div>

					<div>
						<div className="commercial-product-list-header">
							<div className="commercial-product-checkbox-container">
								<Checkbox
									value={
										this.state.activeFa._ui.commercialProducts.length ===
										Object.keys(this.state.selectedProducts).length
									}
									onChange={() => {
										this.onSelectAllProducts();
									}}
								/>
							</div>

							<div className="commercial-product-fields-container">
								<div className="commercial-product-fields">
									<span>Product name</span>
									{this.props.settings.FACSettings.Price_Item_Fields.map(
										pif => {
											return (
												<span key={'header-' + pif}>
													{truncateCPField(pif)}
												</span>
											);
										}
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			commercialProductListHeader = (
				<div className="info-row">
					<span>Product Negotiation</span>
				</div>
			);
		}

		// *******************************************************

		return (
			this.state.attachmentLoaded && (
				<div className="editor-container">
					<Header
						onBackClick={this.onBackClick}
						disabled={!this.editable}
						title="Parturient tortor tortor sed tellus molestie neque lobortis sodales"
						subtitle="Frame Agreement Details"
					>
						<div className="header-button-container">
							<button
								className="slds-button slds-button--translucent button-transparent button-border-light"
								onClick={this.upsertFrameAgreements}
							>
								Save
							</button>
						</div>
					</Header>

					<div className="main-container">
						<div className="main">
							<div className="main-header">
								{this.header_rows.map((row, i) => {
									return (
										<div className="main-header-row" key={'header-row-' + i}>
											{row.map(f => {
												var editable = !f.readOnly && this.editable;
												return (
													<SFField
														editable={editable}
														onChange={this.onFieldChange}
														key={f.field}
														field={f}
														value={this.state.activeFa[f.field] || ''}
													/>
												);
											})}
										</div>
									);
								})}
							</div>

							<div className="main-frame-container">
								{commercialProductListHeader}

								{addProductCTA}

								{this.state.activeFa._ui.commercialProducts.map(cp => {
									return (
										<CommercialProduct
											onNegotiate={(type, data) =>
												this.onNegotiate(cp.Id, type, data)
											}
											key={'cp-' + cp.Id}
											attachment={this.state.activeFa._ui.attachment[cp.Id]}
											product={cp}
											onSelect={this.onSelectProduct}
											selected={!!this.state.selectedProducts[cp.Id]}
											fields={this.props.settings.FACSettings.Price_Item_Fields}
										/>
									);
								})}

								{this.state.loadingProducts.map((cpId, i) => {
									return (
										<div
											className="commercial-product-skeleton"
											key={cpId + '-' + i}
										/>
									);
								})}

								{productModal}
								{negotiateModal}
							</div>

							{footer}
						</div>

						<FaSidebar />
					</div>
				</div>
			)
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		commercialProducts: state.commercialProducts,
		settings: state.settings,
		activeFa: state.activeFa
	};
};

const mapDispatchToProps = {
	// setActiveFa,
	saveFrameAgreement,
	createFrameAgreement,
	// setAddedProducts,
	getCommercialProductData,
	getAttachment,
	saveAttachment
	// updateActiveFa
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(FaEditor)
);
