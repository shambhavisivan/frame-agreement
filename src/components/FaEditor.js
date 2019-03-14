import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import {
	saveFrameAgreement,
	createFrameAgreement,
	getCommercialProductData,
	getAttachment,
	saveAttachment,
	setValidation,
	getApprovalHistory,
	createToast,
	submitForApproval,
	registerMethod
} from '../actions';
import { truncateCPField } from '../utils/shared-service';
import './FaEditor.css';

import FaSidebar from './FaSidebar';
import CommercialProduct from './negotiation/CommercialProduct';
import ApprovalProcess from './ApprovalProcess';

import Toaster from './utillity/Toaster';
import Header from './utillity/Header';
import Icon from './utillity/Icon';
import PropTypes from 'prop-types';

import SFDatePicker from './utillity/datepicker/SFDatePicker';
import SFField from './utillity/readonly/SFField';
import InputSearch from './utillity/inputs/InputSearch';
import Checkbox from './utillity/inputs/Checkbox';

import ProductModal from './modals/ProductModal';
import ActionIframe from './modals/ActionIframe';
import NegotiationModal from './modals/NegotiationModal';

import { confirmAlert } from 'react-confirm-alert';
import ConfirmationModal from './modals/ConfirmationModal';

import {
	validateAddons,
	validateProduct,
	validateCharges,
	validateRateCardLines
} from './negotiation/Validation';

import { publish } from '../api';

window.activeFa = {};
window.editor = {};

class FrameAgreement {
	constructor() {
		this.Id = null;
		this.csconta__Agreement_Name__c = '';
		this.csconta__Status__c = 'Draft';
		this.csconta__Valid_From__c = null;
		this.csconta__Valid_To__c = null;
		this._ui = {
			approval: {},
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
		this.onBulkNegotiate = this.onBulkNegotiate.bind(this);
		this.upsertFrameAgreements = this.upsertFrameAgreements.bind(this);
		this.onOpenNegotiationModal = this.onOpenNegotiationModal.bind(this);
		this.onRemoveProducts = this.onRemoveProducts.bind(this);
		this._removeProducts = this._removeProducts.bind(this);
		this.onSubmitForApproval = this.onSubmitForApproval.bind(this);
		this.onApprovalChange = this.onApprovalChange.bind(this);
		this.onOpenCommercialProductModal = this.onOpenCommercialProductModal.bind(
			this
		);

		// API
		window.FAC.addProducts = this.onAddProducts.bind(this);
		window.FAC.negotiate = this.onNegotiate.bind(this);
		window.FAC.toast = this.props.createToast;
		window.FAC.registerMethod = this.props.registerMethod;
		window.FAC.getActiveFrameAgreement = () => this.state.activeFa;

		this.faId = this.props.match.params.id || null;
		let _frameAgreement;

		if (this.faId) {
			if (!this.props.frameAgreements[this.faId]) {
				console.error('Non existing frame agreement!');

				setTimeout(() => {
					this.props.history.push('/');
					window.location.reload();
				});
			} else {
				_frameAgreement = { ...this.props.frameAgreements[this.faId] };
			}
		} else {
			_frameAgreement = new FrameAgreement();
		}

		// Ref active FA from store
		this.state = {
			activeFa: _frameAgreement,
			productModal: false,
			productFilter: '',
			negotiateModal: false,
			actionIframe: false,
			actionIframeUrl: '',
			selectedProducts: {},
			loadingProducts: [],
			openCommercialProduct: '',
			attachmentLoaded: false
		};
	}

	componentWillUnmount() {
		delete window.FAC.addProducts;
		delete window.FAC.negotiate;
		delete window.FAC.getActiveFrameAgreement;
		delete window.FAC.toast;
		this.props.setValidation();
	}

	componentWillMount() {
		// Check if FA info is loaded already
		if (this.faId && this.state.activeFa._ui.attachment === null) {
			// IF not, load attachment for FA
			this.props.getAttachment(this.faId).then(resp_attachment => {
				// ***********************************************
				publish('onFaSelect', [this.state.activeFa]);
				// ***********************************************

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
			let IdsToLoad = Object.keys(this.state.activeFa._ui.attachment || {});
			let _commercialProducts = this.props.commercialProducts.filter(cp => {
				return IdsToLoad.includes(cp.Id);
			});
			// Attachment loaded

			this.setState(
				{
					attachmentLoaded: true,
					activeFa: {
						...this.state.activeFa,
						_ui: {
							...this.state.activeFa._ui,
							commercialProducts: _commercialProducts
						}
					}
				},
				() => {
					publish('onFaSelect', [this.state.activeFa]);
				}
			);
		}

		this.props.getApprovalHistory(this.faId).then(response => {
			this.setState({
				activeFa: {
					...this.state.activeFa,
					_ui: { ...this.state.activeFa._ui, approval: response }
				}
			});
		});

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

		this.props.settings.HeaderData.map(f => {
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
	onApprovalChange() {
		// Refresh approval
		this.props.getApprovalHistory(this.faId).then(response => {
			this.setState({
				activeFa: {
					...this.state.activeFa,
					_ui: { ...this.state.activeFa._ui, approval: response }
				}
			});
		});
	}
	/**************************************************/
	async onSubmitForApproval() {
		await publish('onBeforeSubmit');

		this.props
			.submitForApproval(this.faId)
			.then(async response => {
				console.log(response);
				if (response) {
					this.props.createToast(
						'success',
						'Submitted!',
						'Successfuly submitted for approval.'
					);
				} else {
					this.props.createToast(
						'error',
						'Failed!',
						'Unable to start approval process.'
					);
				}
				await publish('onAfterSubmit');
			})
			.then(this.onApprovalChange);
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

	onOpenActionIframe(url) {
		this.setState({
			actionIframe: true,
			actionIframeUrl: url
		});
	}

	onCloseModal() {
		this.setState({
			productModal: false,
			negotiateModal: false,
			actionIframe: false,
			actionIframeUrl: ''
		});
	}

	/**************************************************/
	async onAddProducts(productsMap) {
		productsMap = await publish('onBeforeAddProducts', productsMap);
		let _attachment = {};
		// Sort out products data
		let IdsToLoad = this.props.commercialProducts.reduce((acc, cp) => {
			if (productsMap[cp.Id]) {
				_attachment[cp.Id] = {};
				if (!cp.dataLoaded) {
					return acc.concat([cp.Id]);
				} else {
					return acc;
				}
			} else {
				return acc;
			}
		}, []);

		function enrichAttachment(cp) {
			let _att = {};
			// ****************************************
			if (cp._addons.length) {
				_att._addons = {};
			}
			cp._addons.forEach(addon => {
				_att._addons[addon.Id] = {
					oneOff: addon.cspmb__One_Off_Charge__c,
					recurring: addon.cspmb__Recurring_Charge__c
				};
			});
			// ****************************************
			if (cp._charges.length) {
				_att._charges = {};
			} else {
				_att._product = {};
				if (cp.cspmb__One_Off_Charge__c) {
					_att._product.oneOff = cp.cspmb__One_Off_Charge__c;
				}
				if (cp.cspmb__Recurring_Charge__c) {
					_att._product.recurring = cp.cspmb__Recurring_Charge__c;
				}
			}

			cp._charges.forEach(charge => {
				_att._charges[charge.Id] = {};
				if (charge.chargeType === 'One-off Charge') {
					_att._charges[charge.Id].oneOff = charge.oneOff;
				}
				if (charge.chargeType === 'Recurring Charge') {
					_att._charges[charge.Id].recurring = charge.recurring;
				}
			});
			// ****************************************
			if (cp._rateCards.length) {
				_att._rateCards = {};
			}
			cp._rateCards.forEach(rc => {
				if (rc.rateCardLines.length) {
					_att._rateCards[rc.Id] = {};
					rc.rateCardLines.forEach(rcl => {
						_att._rateCards[rc.Id][rcl.Id] = rcl.cspmb__rate_value__c;
					});
				}
			});
			console.log(_att);
			return _att;
		}

		async function applyChanges() {
			let _commercialProducts = this.props.commercialProducts.filter(cp => {
				if (productsMap[cp.Id]) {
					_attachment[cp.Id] = enrichAttachment(cp);
				}

				return productsMap[cp.Id];
			});

			this.setState(
				{
					activeFa: {
						...this.state.activeFa,
						_ui: {
							...this.state.activeFa._ui,
							commercialProducts: [
								...this.state.activeFa._ui.commercialProducts,
								..._commercialProducts
							],
							attachment: {
								...this.state.activeFa._ui.attachment,
								..._attachment
							}
						}
					}
				},
				async () => {
					await publish('onAfterAddProducts');
					this.onCloseModal();
				}
			);
		}

		applyChanges = applyChanges.bind(this);

		// Load products that need loading, this will update their state and we will take them from updated state, not directly from response
		if (IdsToLoad.length) {
			this.props.getCommercialProductData(IdsToLoad).then(applyChanges);
		} else {
			applyChanges();
		}
	}

	/**************************************************/
	onRemoveProducts() {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<ConfirmationModal
						title="Delete products"
						message="Are you sure you want to delete selected products?"
						onCancel={onClose}
						onConfirm={() => {
							this._removeProducts();
						}}
						confirmText="Delete"
					/>
				);
			}
		});
	}

	async _removeProducts() {
		let productsToDelete = await publish(
			'onBeforeDeleteProducts',
			this.state.selectedProducts
		);

		let _attachment = this.state.activeFa._ui.attachment;
		for (var key in productsToDelete) {
			delete _attachment[key];
		}

		this.setState(
			{
				selectedProducts: {},
				activeFa: {
					...this.state.activeFa,
					_ui: {
						...this.state.activeFa._ui,
						commercialProducts: [
							...this.state.activeFa._ui.commercialProducts.filter(
								cp => !productsToDelete[cp.Id]
							)
						],
						attachment: _attachment
					}
				}
			},
			async () => {
				await publish('onAfterDeleteProducts');
			}
		);
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
			this.state.activeFa._ui.commercialProducts
				.filter(cp => {
					if (
						this.state.productFilter.length >= 2 &&
						this.state.productFilter
					) {
						return cp.Name.toLowerCase().includes(
							this.state.productFilter.toLowerCase()
						);
					} else {
						return true;
					}
				})
				.forEach(cp => {
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
		this.setState({
			activeFa: { ...this.state.activeFa, [field]: value }
		});
	}

	/**************************************************/
	async onNegotiate(priceItemId, type, data) {
		console.log(data);
		let attachment = this.state.activeFa._ui.attachment;
		attachment[priceItemId] = { ...attachment[priceItemId], [type]: data };

		attachment = await publish('onBeforeNegotiate', attachment);
		this.setState(
			{
				activeFa: {
					...this.state.activeFa,
					_ui: { ...this.state.activeFa._ui, attachment }
				}
			},
			async () => {
				publish('onAfterNegotiate');
			}
		);
	}

	async onBulkNegotiate(data) {
		console.log(data);
		let attachment = this.state.activeFa._ui.attachment;
		for (var key in attachment) {
			if (data[key]._addons) {
				attachment[key]._addons = attachment[key]._addons || {};
				attachment[key]._addons = {
					...attachment[key]._addons,
					...data[key]._addons
				};
			}
			if (data[key]._charges) {
				attachment[key]._charges = attachment[key]._charges || {};
				attachment[key]._charges = {
					...attachment[key]._charges,
					...data[key]._charges
				};
			}
			if (data[key]._rateCards) {
				attachment[key]._rateCards = attachment[key]._rateCards || {};
				for (var rcId in data[key]._rateCards) {
					attachment[key]._rateCards[rcId] = data[key]._rateCards[rcId];
				}
			}
		}

		// VALIDATE ADDONS
		// this.props.setValidation("addons", validateAddons(this.props.addons, this.props.attachment))

		attachment = await publish('onBeforeBulkNegotiation', attachment);

		this.setState(
			{
				activeFa: {
					...this.state.activeFa,
					_ui: { ...this.state.activeFa._ui, attachment }
				}
			},
			() => {
				let attachment = this.state.activeFa._ui.attachment;

				let bulkValidation = {};

				Object.values(this.state.selectedProducts).forEach(cp => {
					bulkValidation[cp.Id] = {
						addons: validateAddons(cp._addons, attachment[cp.Id]._addons || {}),
						rated: validateRateCardLines(
							cp._rateCards,
							attachment[cp.Id]._rateCards || {}
						),
						charges: validateCharges(
							cp._charges,
							cp.cspmb__Authorization_Level__c,
							attachment[cp.Id]._charges || {}
						)
					};
				});

				this.props.setValidation(bulkValidation);

				// this.onCloseModal();

				setTimeout(async () => {
					await publish('onAfterBulkNegotiation');
					this.onCloseModal();
				});
			}
		);
	}
	/**************************************************/
	async callHandler(name, actionType) {
		if (!this.props.handlers.hasOwnProperty(name)) {
			this.props.createToast(
				'error',
				'Invalid handler!',
				'Handler with method name "' + name + '" is not defined.'
			);
			return;
		}

		let result = await this.props.handlers[name]();
		switch (actionType) {
			case 'action':
				console.log(result);
				break;
			case 'iframe':
				this.onOpenActionIframe(result);
				break;
			case 'redirect':
				console.log(result);
				window.location.replace(result);
				break;
			default:
		}
	}
	/**************************************************/

	async upsertFrameAgreements() {
		var data = { ...this.state.activeFa };
		data.Id = data.Id || null;

		data = await publish('onBeforeSaveFrameAgreement', data);

		if (data.Id) {
			Promise.all([
				this.props.saveFrameAgreement(data, this.state.activeFa.Id),
				this.props.saveAttachment(
					this.state.activeFa.Id,
					this.state.activeFa._ui.attachment
				)
			]).then(async responseArr => {
				await publish('onAfterSaveFrameAgreement', responseArr);
				this.props.createToast(
					'success',
					'Saved!',
					'Successfuly saved frame agreement.'
				);
			});
		} else {
			this.props.createFrameAgreement(data).then(upsertedFa => {
				this.setState(
					{
						activeFa: upsertedFa
					},
					async () => {
						await publish('onAfterSaveFrameAgreement', upsertedFa);
						this.props.createToast(
							'success',
							'Created!',
							'Successfuly created new frame agreement.'
						);

						this.props.history.push('/agreement/' + upsertedFa.Id);
						this.faId = upsertedFa.Id;
						// window.location.reload();
					}
				);
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
						Add Products
					</button>
					<button
						disabled={!Object.keys(this.state.selectedProducts).length}
						className="slds-button slds-button--neutral"
						onClick={this.onOpenNegotiationModal}
					>
						Negotiate Products
					</button>
					<button
						disabled={!Object.keys(this.state.selectedProducts).length}
						className="slds-button slds-button--danger"
						onClick={this.onRemoveProducts}
					>
						Delete Products
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
					onNegotiate={this.onBulkNegotiate}
					onCloseModal={this.onCloseModal}
				/>
			);
		}
		// *******************************************************
		// Modal needs to be conditionally rendered to activate its lifecycle
		let approvalHistory = '';
		if (
			this.state.activeFa._ui.approval &&
			this.state.activeFa._ui.approval.listProcess.length
		) {
			approvalHistory = (
				<ApprovalProcess
					onChange={this.onApprovalChange}
					faId={this.faId}
					approval={this.state.activeFa._ui.approval}
				/>
			);
		}
		// *******************************************************
		// Negotiation header with and without commercial products
		let commercialProducts;

		if (this.state.activeFa._ui.commercialProducts.length) {
			commercialProducts = (
				<div className="commercial-products">
					<div className="info-row">
						<div className="commercial-product-search-container">
							<span>
								Products ({this.state.activeFa._ui.commercialProducts.length})
							</span>
							<div className="commercial-product-search transparent">
								<InputSearch
									value={this.state.productFilter}
									onChange={val => {
										this.setState({ productFilter: val });
									}}
									placeholder="Quick search"
								/>
							</div>
						</div>

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
					{this.state.activeFa._ui.commercialProducts
						.filter(cp => {
							if (
								this.state.productFilter.length >= 2 &&
								this.state.productFilter
							) {
								return cp.Name.toLowerCase().includes(
									this.state.productFilter.toLowerCase()
								);
							} else {
								return true;
							}
						})
						.map(cp => {
							return (
								<CommercialProduct
									onOpen={bool => {
										this.setState({ openCommercialProduct: bool ? cp.Id : '' });
									}}
									onNegotiate={(type, data) =>
										this.onNegotiate(cp.Id, type, data)
									}
									key={'cp-' + cp.Id}
									attachment={this.state.activeFa._ui.attachment[cp.Id]}
									product={cp}
									open={this.state.openCommercialProduct === cp.Id}
									readOnly={!this.editable}
									onSelect={this.onSelectProduct}
									selected={!!this.state.selectedProducts[cp.Id]}
									fields={this.props.settings.FACSettings.Price_Item_Fields}
								/>
							);
						})}
				</div>
			);
		} else {
			commercialProducts = (
				<div className="commercial-products">
					<div className="info-row">
						<span>Product Negotiation</span>
					</div>
					{addProductCTA}
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
							{this.props.settings.ButtonData.filter(
								btnObj =>
									!btnObj.hidden.includes(
										this.state.activeFa.csconta__Status__c
									)
							).map((btnObj, i) => {
								return (
									<button
										key={btnObj.id + i}
										id={btnObj.id}
										onClick={() => {
											this.callHandler(btnObj.method, btnObj.type);
										}}
										className="slds-button slds-button--translucent"
									>
										{btnObj.label}
									</button>
								);
							})}

							<button
								className="slds-button slds-button--translucent"
								onClick={this.upsertFrameAgreements}
							>
								Save
							</button>

							<button
								className="slds-button slds-button--translucent"
								disabled={!this.props.approvalFlag}
								onClick={this.onSubmitForApproval}
							>
								Submit For Approval
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
								{approvalHistory}
								{commercialProducts}

								{productModal}
								{negotiateModal}
							</div>

							{this.editable && footer}
						</div>

						<Toaster />
						{this.state.actionIframe && this.state.actionIframeUrl && (
							<ActionIframe
								onCloseModal={this.onCloseModal}
								open={this.state.actionIframe}
								url={this.state.actionIframeUrl}
							/>
						)}
					</div>
				</div>
			)
		);
	}
}

const mapStateToProps = state => {
	return {
		commercialProducts: state.commercialProducts,
		frameAgreements: state.frameAgreements,
		approvalFlag: state.approvalFlag,
		validation: state.validation,
		settings: state.settings,
		handlers: state.handlers
	};
};

const mapDispatchToProps = {
	// setActiveFa,
	saveFrameAgreement,
	createFrameAgreement,
	// setAddedProducts,
	getCommercialProductData,
	getAttachment,
	setValidation,
	saveAttachment,
	createToast,
	getApprovalHistory,
	registerMethod,
	submitForApproval
	// updateActiveFa
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(FaEditor)
);
