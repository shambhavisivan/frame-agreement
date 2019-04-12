import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { withRouter } from 'react-router-dom';

import {
	createToast,
	setValidation,
	getAttachment,
	performAction,
	registerMethod,
	saveAttachment,
	submitForApproval,
	getFrameAgreement,
	undoDecomposition,
	getApprovalHistory,
	saveFrameAgreement,
	decomposeAttachment,
	createFrameAgreement,
	toggleFieldVisibility,
	setFrameAgreementState,
	createPricingRuleGroup,
	getCommercialProductData,
	createNewVersionOfFrameAgrement
} from '../actions';

import { truncateCPField } from '../utils/shared-service';

import FaSidebar from './FaSidebar';
import CommercialProduct from './negotiation/CommercialProduct';
import ApprovalProcess from './ApprovalProcess';

import Toaster from './utillity/Toaster';
import Header from './utillity/Header';
import Pagination from './utillity/Pagination';
import Icon from './utillity/Icon';
import CustomButtonDropdown from './utillity/CustomButtonDropdown';

import SFDatePicker from './utillity/datepicker/SFDatePicker';
import SFField from './utillity/readonly/SFField';
import InputSearch from './utillity/inputs/InputSearch';
import Checkbox from './utillity/inputs/Checkbox';
import DropdownCheckbox from './utillity/inputs/DropdownCheckbox';

import ProductModal from './modals/ProductModal';
import ActionIframe from './modals/ActionIframe';
import NegotiationModal from './modals/NegotiationModal';

import { confirmAlert } from 'react-confirm-alert';
import ConfirmationModal from './modals/ConfirmationModal';

// Skeletons
import CommercialProductSkeleton from './skeletons/CommercialProductSkeleton';

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
	constructor(props) {
		this.Id = null;
		this.csconta__Agreement_Name__c = '';
		this.csconta__Status__c = props.settings.FACSettings.statuses.draft_status;
		this.csconta__Valid_From__c = null;
		this.csconta__Valid_To__c = null;
		this._ui = {
			approval: {
				listProcess: []
			},
			commercialProducts: [],
			attachment: {}
		};
	}
}

class FaEditor extends Component {
	constructor(props) {
		super(props);

		this.onBackClick = this.onBackClick.bind(this);
		this.getCommercialProductsCount = this.getCommercialProductsCount.bind(
			this
		);
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
		this.toggleVisibility = this.toggleVisibility.bind(this);
		this.refreshFa = this.refreshFa.bind(this);
		this.setStateOFFa = this.setStateOFFa.bind(this);
		this.callHandler = this.callHandler.bind(this);
		this.onDecompose = this.onDecompose.bind(this);
		this.createNewVersion = this.createNewVersion.bind(this);
		this.onOpenCommercialProductModal = this.onOpenCommercialProductModal.bind(
			this
		);

		// API
		window.FAM.registerMethod = this.props.registerMethod;
		window.FAM.api.performAction = this.props.performAction;

		window.FAM.api.addProducts = this.onAddProducts;
		window.FAM.api.removeProducts = this._removeProducts;
		window.FAM.api.negotiate = this._apiNegotiate.bind(this);
		window.FAM.api.toast = this.props.createToast;
		window.FAM.api.refreshFa = this.refreshFa;
		window.FAM.api.setStatusOfFrameAgreement = this.setStateOFFa;
		window.FAM.api.getActiveFrameAgreement = () =>
			new Promise(resolve => {
				resolve(this.state.activeFa);
			});
		window.FAM.api.submitForApproval = this.onSubmitForApproval;

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
			_frameAgreement = new FrameAgreement(this.props);
		}

		// Ref active FA from store
		this.state = {
			activeFa: _frameAgreement,
			actionTaken: false,
			productModal: false,
			productFilter: '',
			negotiateModal: false,
			actionIframe: false,
			actionIframeUrl: '',
			selectedProducts: {},
			loadingProducts: [],
			openCommercialProduct: '',
			loading: {
				attachment: false
			},
			pagination: {
				page: 1,
				pageSize: 10
			}
		};

		this._chargeTypes = [
			'_addons',
			'_charges',
			'_rateCards',
			'_product',
			'_volume'
		];
	}

	componentWillUnmount() {
		delete window.FAM.registerMethod;

		delete window.FAM.api.addProducts;
		delete window.FAM.api.negotiate;
		delete window.FAM.api.toast;
		delete window.FAM.api.refreshFa;
		delete window.FAM.api.setStatusOfFrameAgreement;
		delete window.FAM.api.getActiveFrameAgreement;
		delete window.FAM.api.submitForApprovaldelete;

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
								loading: {
									...this.state.loading,
									attachment: true
								},
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
						loading: {
							...this.state.loading,
							attachment: true
						},
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
					loading: {
						...this.state.loading,
						attachment: true
					},
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

		if (this.faId) {
			this.props.getApprovalHistory(this.faId).then(response => {
				this.setState({
					activeFa: {
						...this.state.activeFa,
						_ui: { ...this.state.activeFa._ui, approval: response }
					}
				});
			});
		}

		// **************************************
		this.editable =
			this.props.settings.FACSettings.fa_editable_statuses.has(
				this.state.activeFa.csconta__Status__c
			) || !this.state.activeFa.Id;
		// **************************************

		// Organize the header grid
		var field_rows = [];
		var row = [];
		var row_grid_count = 0;

		this.props.settings.HeaderData.forEach(f => {
			if (row_grid_count + f.grid > 12) {
				field_rows.push([...row]);
				row = [];
				row_grid_count = 0;
			}
			row_grid_count += f.grid;
			row.push(f);
		});

		if (row.length) {
			field_rows.push(row);
		}
		this.header_rows = field_rows;
		// **************************************
		window.activeFa = this.state.activeFa;
		window.editor = this;
	}

	componentWillUpdate() {
		try {
			// Mostly for local
			if (
				this.editable !==
					this.props.settings.FACSettings.fa_editable_statuses.has(
						this.state.activeFa.csconta__Status__c
					) ||
				!this.state.activeFa.Id
			) {
				this.editable =
					this.props.settings.FACSettings.fa_editable_statuses.has(
						this.state.activeFa.csconta__Status__c
					) || !this.state.activeFa.Id;
			}
		} catch (e) {}
	}

	/**************************************************/
	onApprovalChange() {
		// Refresh approval
		return Promise.all([
			this.props.getApprovalHistory(this.faId),
			this.refreshFa()
		]).then(response => {
			this.setState({
				activeFa: {
					...this.state.activeFa,
					_ui: { ...this.state.activeFa._ui, approval: response[0] }
				}
			});
		});
	}

	/**************************************************/
	async onSubmitForApproval() {
		await this.upsertFrameAgreements();
		await publish('onBeforeSubmit');

		let _result;

		return new Promise((resolve, reject) => {
			this.props
				.submitForApproval(this.faId)
				.then(async response => {
					_result = response;
					if (response) {
						this.props.createToast(
							'success',
							window.SF.labels.toast_success_title,
							window.SF.labels.toast_submitForApproval
						);
					} else {
						this.props.createToast(
							'error',
							window.SF.labels.toast_success_title,
							window.SF.labels.toast_submitForApproval_failed
						);
					}
					await publish('onAfterSubmit');
				})
				.then(this.onApprovalChange)
				.then(() => {
					_result ? resolve(_result) : reject(_result);
				});
		});
	}
	/**************************************************/
	async onDecompose() {
		// 1) Create a structure that is matching one element -> one pipra
		let _attachment = this.state.activeFa._ui.attachment;
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

		console.log(structure);

		// Create pricing rule group, pricing rule and association between them. Return pricing rule id to be used in next stage
		const PR_ID = await this.props.createPricingRuleGroup();

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
				this.props.decomposeAttachment(chunk, PR_ID, this.state.activeFa.Id)
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
			await this.setStateOFFa(
				this.props.settings.FACSettings.statuses.active_status
			);
			await this.refreshFa();

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
	/**************************************************/
	async createNewVersion() {
		let newFa = await this.props.createNewVersionOfFrameAgrement(
			this.state.activeFa.Id
		);
		this.props.history.push('/');
		this.props.history.push('/agreement/' + newFa.Id);
		// window.location.reload();
	}
	/**************************************************/
	getCommercialProductsCount() {
		let cpSize = this.state.activeFa._ui.commercialProducts.length;
		if (this.state.productFilter) {
			cpSize = this.state.activeFa._ui.commercialProducts.filter(cp => {
				if (this.state.productFilter && this.state.productFilter.length >= 2) {
					return cp.Name.toLowerCase().includes(
						this.state.productFilter.toLowerCase()
					);
				} else {
					return true;
				}
			}).length;
		}
		return cpSize;
	}
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
	async onAddProducts(products = []) {
		products = await publish('onBeforeAddProducts', products);
		let _productsSet = new Set(products);

		let _attachment = {};
		// Sort out products data
		let IdsToLoad = this.props.commercialProducts.reduce((acc, cp) => {
			if (_productsSet.has(cp.Id)) {
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
			_att._volume = {
				mv: null,
				mvp: null,
				muc: null,
				mucp: null
			};
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
				if (_productsSet.has(cp.Id)) {
					_attachment[cp.Id] = enrichAttachment(cp);
					return true;
				}
				return false;
			});

			return new Promise(resolve => {
				this.setState(
					{
						actionTaken: true,
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
						await publish(
							'onAfterAddProducts',
							this.state.activeFa._ui.commercialProducts.map(cp => cp.Id)
						);
						this.onCloseModal();
						resolve(this.state.activeFa);
					}
				);
			});
		}

		applyChanges = applyChanges.bind(this);

		// Load products that need loading, this will update their state and we will take them from updated state, not directly from response
		if (IdsToLoad.length) {
			return this.props.getCommercialProductData(IdsToLoad).then(applyChanges);
		} else {
			return applyChanges();
		}
	}

	/**************************************************/
	onRemoveProducts() {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<ConfirmationModal
						title={window.SF.labels.alert_deleteProducts_title}
						message={window.SF.labels.alert_deleteProducts_message}
						onCancel={onClose}
						onConfirm={() => {
							this._removeProducts();
						}}
						confirmText={window.SF.labels.alert_deleteProducts_title}
					/>
				);
			}
		});
	}

	async _removeProducts(optionalIdArray) {
		return new Promise(async resolve => {
			let products = this.state.selectedProducts;

			if (typeof optionalIdArray !== 'undefined') {
				products = {};
				this.state.activeFa._ui.commercialProducts.forEach(cp => {
					if (optionalIdArray.includes(cp.Id)) {
						products[cp.Id] = cp;
					}
				});
			}

			let productsToDelete = await publish('onBeforeDeleteProducts', products);

			let _attachment = this.state.activeFa._ui.attachment;

			for (var key in productsToDelete) {
				delete _attachment[key];
			}

			this.setState(
				{
					actionTaken: true,
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
					await publish(
						'onAfterDeleteProducts',
						this.state.activeFa._ui.commercialProducts.map(cp => cp.Id)
					);
					resolve(this.state.activeFa._ui.attachment);
				}
			);
		});
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

	toggleVisibility(index) {
		this.props.toggleFieldVisibility(index);
	}

	onFieldChange(field, value) {
		this.setState({
			actionTaken: true,
			activeFa: { ...this.state.activeFa, [field]: value }
		});
	}

	/**************************************************/
	async refreshFa(faId = this.faId) {
		return new Promise(async resolve => {
			let newFa = await this.props.getFrameAgreement(faId);
			if (newFa) {
				this.setState(
					{ activeFa: { ...this.state.activeFa, ...newFa } },
					() => {
						resolve(newFa);
					}
				);
			}
		});
	}

	async setStateOFFa(state, faId = this.faId) {
		return new Promise(async (resolve, reject) => {
			let result = await this.props.setFrameAgreementState(faId, state);
			if (result === 'Success') {
				this.setState(
					{ activeFa: { ...this.state.activeFa, csconta__Status__c: state } },
					() => {
						resolve(result);
					}
				);
			} else {
				reject(result);
			}
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
				actionTaken: true,
				activeFa: {
					...this.state.activeFa,
					_ui: { ...this.state.activeFa._ui, attachment }
				}
			},
			async () => {
				publish('onAfterNegotiate', this.state.activeFa._ui.attachment);
			}
		);
	}

	async _apiNegotiate(data = window.mandatory('negotiate()')) {
		// {
		// 	priceItemId: _______, (1)
		// 	cpAddon: ___________, (2)
		// 	addon: _____________, (3) X
		// 	charge: ____________, (4)
		// 	rateCard: __________, (5)
		// 	rateCardLine: ______, (6)
		// 	value: {              (7)
		// 		recurring: _____,
		// 		oneOff: ________
		// 	},
		// 	value: _____________  (8)
		// }
		// **************************
		// Product (1,7)
		// Addons (1,2,7) || (1,3,7)
		// Charges (1,4,7)
		// RateCard (1,5,6,8)
		return new Promise(async (resolve, reject) => {
			// ********************************** BASIC VALIDATION
			let _attachment = this.state.activeFa._ui.attachment;
			let cp = this.state.activeFa._ui.commercialProducts.find(
				_cp => _cp.Id === data.priceItemId
			);

			if (!cp) {
				console.error(
					'Cannot find commercial product with Id ' +
						data.priceItemId +
						' in active Frame Agreement!'
				);
				reject();
				return;
			}
			if (!data.hasOwnProperty('value')) {
				console.error('No value provided for negotiation!');
				reject();
				return;
			}
			// ********************************** Addons
			if (data.hasOwnProperty('cpAddon')) {
				if (data.value.hasOwnProperty('oneOff')) {
					_attachment[data.priceItemId]._addons[data.cpAddon].oneOff =
						data.value.oneOff;
				}
				if (data.value.hasOwnProperty('recurring')) {
					_attachment[data.priceItemId]._addons[data.cpAddon].recurring =
						data.value.recurring;
				}
			}
			// ********************************* Charge
			else if (data.hasOwnProperty('charge')) {
				// Charge validation
				let charge = cp._charges.find(_ch => _ch.Id === data.charge);
				let type;
				if (charge.chargeType === 'One-off Charge') {
					type = 'oneOff';
				}
				if (charge.chargeType === 'Recurring Charge') {
					type = 'recurring';
				}
				if (!data.value.hasOwnProperty(type)) {
					console.error(
						'Pricing element ' + charge.Id + ' has invalid charge type!'
					);
					reject();
					return;
				}

				_attachment[data.priceItemId]._charges[data.charge][type] =
					data.value[type];
			}
			// *********************************
			else if (data.hasOwnProperty('rateCard')) {
				// RCL
				if (!data.hasOwnProperty('rateCardLine')) {
					console.error('No rate card line Id provided!');
					reject();
					return;
				}

				if (typeof data.value !== 'number') {
					console.error('Value for RCL not integer!');
					reject();
					return;
				}

				_attachment[data.priceItemId]._rateCards[data.rateCard][
					data.rateCardLine
				] = data.value;
			}
			// *********************************
			else {
				// Product negotiation
				_attachment[data.priceItemId]._product = {
					..._attachment[data.priceItemId]._product,
					...data.value
				};
			}
			// *********************************

			_attachment = await publish('onBeforeNegotiate', _attachment);

			this.setState(
				{
					actionTaken: true,
					activeFa: {
						...this.state.activeFa,
						_ui: { ...this.state.activeFa._ui, _attachment }
					}
				},
				async () => {
					publish('onAfterNegotiate', this.state.activeFa._ui.attachment);
					resolve(_attachment);
				}
			);
		});
	}

	/**************************************************/

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
				actionTaken: true,
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

					if (attachment[cp.Id].hasOwnProperty('_product')) {
						bulkValidation[cp.Id].product = validateProduct({
							oneOff: cp.cspmb__One_Off_Charge__c,
							negotiatedOneOff: attachment[cp.Id]._product.oneOff,
							recurring: cp.cspmb__Recurring_Charge__c,
							negotiatedRecurring: attachment[cp.Id]._product.recurring,
							authLevel: cp.cspmb__Authorization_Level__c || null,
							Name: cp.Name
						});
					}
				});

				this.props.setValidation(bulkValidation);

				// this.onCloseModal();

				setTimeout(async () => {
					await publish('onAfterBulkNegotiation', attachment);
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
				window.SF.labels.toast_invalid_handler_title,
				window.SF.labels.toast_invalid_handler + ' (' + name + ')'
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
			if (this.props.approvalFlag && this.editable) {
				data.csconta__Status__c = this.props.settings.FACSettings.statuses.requires_approval_status;
			}

			return Promise.all([
				this.props.saveFrameAgreement(data, this.state.activeFa.Id),
				this.props.saveAttachment(
					this.state.activeFa.Id,
					this.state.activeFa._ui.attachment
				)
			])
				.then(async responseArr => {
					await this.refreshFa();
					return responseArr;
				})
				.then(async responseArr => {
					await publish('onAfterSaveFrameAgreement', responseArr);
					this.props.createToast(
						'success',
						window.SF.labels.toast_success_title,
						window.SF.labels.toast_saved_fa
					);
				});
		} else {
			return this.props.createFrameAgreement(data).then(upsertedFa => {
				this.setState(
					{
						activeFa: upsertedFa
					},
					async () => {
						await publish('onAfterSaveFrameAgreement', upsertedFa);
						this.props.createToast(
							'success',
							window.SF.labels.toast_success_title,
							window.SF.labels.toast_created_fa
						);

						this.props.history.push('/');
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
									{window.SF.labels.save_fa_message}
								</span>
							);
						} else {
							return (
								<span className="box-header-2">
									{window.SF.labels.save_fa_products_message}
								</span>
							);
						}
					})()}
					<div className="box-button-container">
						<button
							className="fa-button"
							onClick={this.onOpenCommercialProductModal}
							disabled={!this.state.activeFa.Id}
						>
							{window.SF.labels.btn_AddProducts}
						</button>
					</div>
				</div>
			);
		}
		// *******************************************************
		let footer = '';
		if (this.state.activeFa._ui.commercialProducts.length) {
			footer = (
				<div className="fa-footer">
					{this.props.settings.ButtonStandardData.AddProducts.has(
						this.state.activeFa.csconta__Status__c
					) && (
						<button
							className="fa-button fa-margin-right-xsm"
							onClick={this.onOpenCommercialProductModal}
						>
							{window.SF.labels.btn_AddProducts}
						</button>
					)}

					{this.props.settings.ButtonStandardData.BulkNegotiate.has(
						this.state.activeFa.csconta__Status__c
					) && (
						<button
							disabled={!Object.keys(this.state.selectedProducts).length}
							className="fa-button fa-margin-right-xsm"
							onClick={this.onOpenNegotiationModal}
						>
							{window.SF.labels.btn_BulkNegotiate}
						</button>
					)}

					{this.props.settings.ButtonStandardData.DeleteProducts.has(
						this.state.activeFa.csconta__Status__c
					) && (
						<button
							disabled={!Object.keys(this.state.selectedProducts).length}
							className="fa-button"
							onClick={this.onRemoveProducts}
						>
							{window.SF.labels.btn_DeleteProducts}
						</button>
					)}
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
		// Custom buttons component
		let customButtonsComponent = '';
		let customButtons = this.props.settings.ButtonCustomData.filter(
			btnObj => !btnObj.hidden.has(this.state.activeFa.csconta__Status__c)
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
								className="fa-button fa-button-border-light fa-button-transparent fa-margin-right-xsm"
							>
								{btnObj.label}
							</button>
						);
					})}
				</div>
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
				<div className="fa-padding-top-sm">
					<ApprovalProcess
						onChange={this.onApprovalChange}
						faId={this.faId}
						approval={this.state.activeFa._ui.approval}
					/>
				</div>
			);
		}
		// *******************************************************
		// Negotiation header with and without commercial products
		let commercialProducts = <CommercialProductSkeleton count={5} />;

		if (
			this.state.loading.attachment &&
			this.state.activeFa._ui.commercialProducts.length
		) {
			commercialProducts = (
				<div>
					<div>
						<div className="fa-section fa-section-vertical fa-section-shadow">
							<div className="fa-flex fa-flex-middle">
								<div className="fa-flex-item fa-flex-1">
									<span className="fa-title-lg">
										{window.SF.labels.products_title} (
										{this.state.activeFa._ui.commercialProducts.length})
									</span>
								</div>
								<div className="fa-flex-item fa-flex-1">
									<div className="fa-flex fa-flex-middle">
										<div className="fa-flex-1">
											<div className="fa-flex fa-flex-middle fa-flex-end">
												<InputSearch
													value={this.state.productFilter}
													bordered={true}
													onChange={val => {
														this.setState({ productFilter: val });
													}}
													placeholder={
														window.SF.labels.input_quickSearchPlaceholder
													}
												/>
												<DropdownCheckbox
													options={this.props.productFields}
													onChange={this.toggleVisibility}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="commercial-product-container commercial-product-container-bare commercial-product-container-default">
							<div className="commercial-product-header">
								<div className="commercial-product-checkbox-container">
									<Checkbox
										className="fa-margin-right-sm"
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
										<span className="list-cell">
											{window.SF.labels.products_productNameHeaderCell}
										</span>
										{this.props.productFields
											.filter(f => f.visible)
											.map(f => {
												return (
													<span
														key={'header-' + f.name}
														className={
															'list-cell' + (f.volume ? ' volume' : '')
														}
													>
														{truncateCPField(f.name)}
													</span>
												);
											})}
									</div>
								</div>
							</div>
						</div>
					</div>
					{this.state.activeFa._ui.commercialProducts
						.filter(cp => {
							if (
								this.state.productFilter &&
								this.state.productFilter.length >= 2
							) {
								return cp.Name.toLowerCase().includes(
									this.state.productFilter.toLowerCase()
								);
							} else {
								return true;
							}
						})
						.paginate(
							this.state.pagination.page,
							this.state.pagination.pageSize
						)
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
									invalid={this.props.validationProduct[cp.Id]}
									selected={!!this.state.selectedProducts[cp.Id]}
								/>
							);
						})}
				</div>
			);
		} else if (this.state.loading.attachment) {
			commercialProducts = (
				<div>
					<div>
						<span>{window.SF.labels.products_title_empty} </span>
					</div>
					{addProductCTA}
				</div>
			);
		}

		// *******************************************************

		return (
			<div className="editor-container">
				<Prompt
					when={this.state.actionTaken}
					message={window.SF.labels.modal_unsavedChanges_alert}
				/>

				<Header
					onBackClick={this.onBackClick}
					disabled={!this.editable}
					title={
						this.state.activeFa.csconta__Agreement_Name__c || '-- anonymous --'
					}
					status={this.state.activeFa.csconta__Status__c}
					invalid={this.props.approvalFlag}
					subtitle={window.SF.labels.header_frameAgreementEditorTitle}
				>
					<div className="fa-flex fa-flex-flush">
						{customButtonsComponent}

						{this.props.settings.ButtonStandardData.Save.has(
							this.state.activeFa.csconta__Status__c
						) && (
							<button
								className="fa-button fa-button-border-light fa-button-transparent fa-margin-right-xsm"
								onClick={this.upsertFrameAgreements}
							>
								{window.SF.labels.btn_Save}
							</button>
						)}

						{this.props.settings.ButtonStandardData.SubmitForApproval.has(
							this.state.activeFa.csconta__Status__c
						) && (
							<button
								className="fa-button fa-button-border-light fa-button-transparent"
								disabled={
									!this.props.approvalFlag ||
									!this.state.activeFa._ui.commercialProducts.length
								}
								onClick={this.onSubmitForApproval}
							>
								{window.SF.labels.btn_SubmitForApproval}
							</button>
						)}

						{this.props.settings.ButtonStandardData.Submit.has(
							this.state.activeFa.csconta__Status__c
						) && (
							<button
								className="fa-button fa-button-border-light fa-button-transparent"
								onClick={this.onDecompose}
							>
								{window.SF.labels.btn_Submit}
							</button>
						)}

						{this.props.settings.ButtonStandardData.NewVersion.has(
							this.state.activeFa.csconta__Status__c
						) && (
							<button
								className="fa-button fa-button-border-light fa-button-transparent"
								onClick={this.createNewVersion}
							>
								{window.SF.labels.btn_NewVersion}
							</button>
						)}
					</div>
				</Header>

				<div className="fa-container">
					<div className="fa-container-inner">
						{this.header_rows.length ? (
							<section className="basket-details fa-section fa-section-vertical fa-section-shadow fa-section-light">
								{this.header_rows.map((row, i) => {
									return (
										<div
											className="details-row-wrapper"
											key={'header-row-' + i}
										>
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
							</section>
						) : (
							''
						)}

						{approvalHistory}

						<div className="fa-padding-top-sm">
							{commercialProducts}
							<Pagination
								totalSize={this.getCommercialProductsCount()}
								pageSize={this.state.pagination.pageSize}
								page={this.state.pagination.page}
								onPageSizeChange={newPageSize => {
									this.setState({
										pagination: {
											...this.state.pagination,
											pageSize: newPageSize
										}
									});
								}}
								onPageChange={newPage => {
									this.setState({
										pagination: { ...this.state.pagination, page: newPage }
									});
								}}
							/>
						</div>

						<div>
							{productModal}
							{negotiateModal}
						</div>
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

				{this.editable && footer}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		commercialProducts: state.commercialProducts,
		frameAgreements: state.frameAgreements,
		approvalFlag: state.approvalFlag,
		validation: state.validation,
		validationProduct: state.validationProduct,
		productFields: state.productFields,
		settings: state.settings,
		handlers: state.handlers
	};
};

const mapDispatchToProps = {
	createToast,
	setValidation,
	getAttachment,
	performAction,
	registerMethod,
	saveAttachment,
	submitForApproval,
	getFrameAgreement,
	undoDecomposition,
	getApprovalHistory,
	saveFrameAgreement,
	decomposeAttachment,
	createFrameAgreement,
	toggleFieldVisibility,
	setFrameAgreementState,
	createPricingRuleGroup,
	getCommercialProductData,
	createNewVersionOfFrameAgrement
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(FaEditor)
);
