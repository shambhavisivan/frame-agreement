import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import {
	addProductsToFa,
	negotiate,
	getStandaloneAddons,
	apiNegotiate,
	clearToasts,
	createNewVersionOfFrameAgreement,
	updateFrameAgreement,
	cloneFrameAgreement,
	createToast,
	getAppSettings,
	getApprovalHistory,
	getAttachment,
	getCommercialProductData,
	getCommercialProducts,
	getFrameAgreements,
	getPicklistOptions,
	registerMethod,
	refreshFrameAgreement,
	resetNegotiation,
	removeProductsFromFa,
	saveFrameAgreement,
	setCustomData,
	setFrameAgreementState,
	validateFrameAgreement
} from './actions';
// import { editModalWidth } from "./actions";
import FaList from './components/FaList';
import FaEditor from './components/FaEditor';
import FaMaster from './components/FaMaster';

import LandingSkeleton from './components/skeletons/LandingSkeleton';
import EditorSkeleton from './components/skeletons/EditorSkeleton';
import CommercialProductSkeleton from './components/skeletons/CommercialProductSkeleton';

import { log } from '~/src/utils/shared-service.js';

import { withRouter } from 'react-router-dom';

import {
	publish,
	performAction,
	createPricingRuleGroup,
	decomposeAttachment,
	undoDecomposition,
	submitForApproval
} from './api';

export class App extends Component {
	constructor(props) {
		super(props);

		// ****************************************** API ******************************************
		window.FAM.api.clearToasts = this.props.clearToasts;

		window.FAM.api.createNewVersionOfFrameAgreement = this.props.createNewVersionOfFrameAgreement;
		window.FAM.api.updateFrameAgreement = this.props.updateFrameAgreement;

		/**
		 * resets negotiation in FA attachment.
		 * @param  String faId       Frame agreement id
		 * @param  Object entitiyMap nego format data for targeted reset
		 * @return void
		 */
		window.FAM.api.resetNegotiation = async (faId, entitiyMap) => {
			this.props.resetNegotiation(faId, entitiyMap);
			this.props.validateFrameAgreement(faId);
			await window.FAM.api.validateStatusConsistency(faId);
		};

		/**
		 * adds products to frame agreement
		 * @param  String faId 		Frame agreement id
		 * @param List<Object> 	List of products to add
		 */
		window.FAM.api.addProducts = async (
			faId = window.mandatory('addProducts()'),
			products = []
		) => {
			products = await publish('onBeforeAddProducts', products);

			if (products.some(cp_id => cp_id.length === 15)) {
				console.warn('Converting to 18 char Id...');
				// Generate 15: 18 map
				let charMap = {};
				this.props.commercialProducts.forEach(cp => {
					charMap[cp.Id.substring(0, 15)] = cp.Id;
				});

				products = products.map(cp_id => {
					if (cp_id.length === 15) {
						return charMap[cp_id];
					}

					return cp_id;
				});
			}

			let _productsSet = new Set(products);

			// let _attachment = {};
			// Sort out products data
			let IdsToLoad = this.props.commercialProducts.reduce((acc, cp) => {
				if (_productsSet.has(cp.Id)) {
					// _attachment[cp.Id] = {};
					if (!cp._dataLoaded) {
						// return acc.concat([cp.Id]);
						return [...acc, ...[cp.Id]];
					} else {
						return acc;
					}
				} else {
					return acc;
				}
			}, []);

			// IF not, load attachment for FA
			if (this.props.frameAgreements[faId]._ui.attachment === null) {
				let resp_attachment = await this.props.getAttachment(faId);
				IdsToLoad = [...IdsToLoad, ...Object.keys(resp_attachment.products)];
			}

			await this.props.getCommercialProductData(IdsToLoad);
			await this.props.addProductsToFa(faId, products);
			this.props.validateFrameAgreement(faId);

			publish(
				'onAfterAddProducts',
				this.props.frameAgreements[faId]._ui.commercialProducts.map(cp => cp.Id)
			);

			await window.SF.invokeAction('saveAttachment', [
				faId,
				JSON.stringify(this.props.frameAgreements[faId]._ui.attachment)
			]);
			return this.props.frameAgreements[faId];
		};

		/**
		 * negotiates volume fields
		 * @param  String faId      frame agreement id
		 * @param  String productId commercial product id
		 * @param  Object volume    new volume values structure
		 * @return void
		 */
		window.FAM.api.setVolumeFields = async (faId, productId, volume) => {
			return this.props.negotiate(faId, productId, '_volume', volume);
		};

		/**
		 * remove product from fa
		 * @param  String faId 		Frame agreement id
		 * @param List<Object> 	List of products to delete
		 */
		window.FAM.api.removeProducts = (faId = window.mandatory('addProducts()'), products = []) => {
			return new Promise(async resolve => {
				let productsToDelete = await publish('onBeforeDeleteProducts', products);

				// IF not, load attachment for FA
				if (this.props.frameAgreements[faId]._ui.attachment === null) {
					let resp_attachment = await this.props.getAttachment(faId);
				}

				await this.props.removeProductsFromFa(faId, productsToDelete);
				publish(
					'onAfterDeleteProducts',
					this.props.frameAgreements[faId]._ui.commercialProducts.map(cp => cp.Id)
				);

				await window.SF.invokeAction('saveAttachment', [
					faId,
					JSON.stringify(this.props.frameAgreements[faId]._ui.attachment)
				]);
				resolve(this.props.frameAgreements[faId]._ui.attachment);
			});
		};

		window.FAM.validation = this.props.validation;

		// ****************************************** API END ******************************************

		window.FAM.api.performAction = performAction;

		window.FAM.api.cloneFrameAgreement = this.props.cloneFrameAgreement;
		window.FAM.api.toast = this.props.createToast;
		window.FAM.registerMethod = this.props.registerMethod;
		window.FAM.api.getAttachment = this.props.getAttachment;

		/**
		 * activates frame agreemend
		 * @param  String faId 		Frame agreement id
		 * @returns void
		 */
		window.FAM.api.activateFrameAgreement = async faId => {
			// 1) Create a structure that is matching one element -> one pipra
			let _attachment_prod = {};
			let _attachment_addon = {};

			try {
				_attachment_prod = this.props.frameAgreements[faId]._ui.attachment.products || {};
				_attachment_addon = this.props.frameAgreements[faId]._ui.attachment.addons || {};
			} catch (err) {
				// No attachment or no products
			}

			let structure = [];
			for (var cpId in _attachment_prod) {
				if (_attachment_prod[cpId].hasOwnProperty('_addons')) {
					let addons = _attachment_prod[cpId]._addons;
					for (var cpaoa in addons) {
						structure.push({
							cpaoaId: cpaoa,
							recurring: addons[cpaoa].hasOwnProperty('recurring') ? addons[cpaoa].recurring : null,
							oneOff: addons[cpaoa].hasOwnProperty('oneOff') ? addons[cpaoa].oneOff : null
						});
					}
				}

				if (_attachment_prod[cpId].hasOwnProperty('_charges')) {
					let charges = _attachment_prod[cpId]._charges;
					for (var chId in charges) {
						structure.push({
							peId: chId,
							recurring: charges[chId].hasOwnProperty('recurring') ? charges[chId].recurring : null,
							oneOff: charges[chId].hasOwnProperty('oneOff') ? charges[chId].oneOff : null
						});
					}
				}

				if (_attachment_prod[cpId].hasOwnProperty('_product')) {
					structure.push({
						cpId: cpId,
						recurring: _attachment_prod[cpId]._product.hasOwnProperty('recurring')
							? _attachment_prod[cpId]._product.recurring
							: null,
						oneOff: _attachment_prod[cpId]._product.hasOwnProperty('oneOff')
							? _attachment_prod[cpId]._product.oneOff
							: null
					});
				}
			}

			for (var addonId in _attachment_addon) {
				structure.push({
					addonId: addonId,
					recurring: _attachment_addon[addonId].hasOwnProperty('recurring')
						? _attachment_addon[addonId].recurring
						: null,
					oneOff: _attachment_addon[addonId].hasOwnProperty('oneOff')
						? _attachment_addon[addonId].oneOff
						: null
				});
			}

			// 2) Remove items that have no charge value
			structure = structure.filter(item => item.recurring !== null || item.oneOff !== null);

			structure = await publish('onBeforeActivation', structure);

			// Create pricing rule group, pricing rule and association between them. Return pricing rule id to be used in next stage
			const PR_ID = await createPricingRuleGroup(faId);

			if (typeof PR_ID !== 'string') {
				console.error('Activation failed, invalid pricing rule Id!');
				return false;
			}

			log.bg.blue('Pricing rule group created: ' + PR_ID);

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
					structure.slice(i, i + this.props.settings.FACSettings.decomposition_chunk_size)
				);
			}

			console.log(decompositionDataChunked);

			// Fill the promise array
			decompositionDataChunked.forEach(chunk => {
				decompositionPromiseArray.push(decomposeAttachment(chunk, PR_ID, faId));
			});

			if (!decompositionDataChunked.length) {
				decompositionPromiseArray.push(decomposeAttachment([], PR_ID, faId));
			}

			//********************************************
			// Wait for all to resolve
			let result = await Promise.all(decompositionPromiseArray);
			publish('onAfterActivation', PR_ID);
			
			result = new Set(result);
			//********************************************

			console.log('Merged results:', result);

			// If the decomposition was successful
			if ((!result.has('Success') || result.size > 1) && decompositionDataChunked.length) {
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
					undoPromiseArray.push(undoDecomposition(PR_ID));
				});

				let undo_result = await Promise.all(undoPromiseArray);
				this.props.createToast(
					'warning',
					window.SF.labels.toast_decomposition_title_revered,
					window.SF.labels.toast_decomposition_revered
				);
			} else {
				await this.props.setFrameAgreementState(
					faId,
					this.props.settings.FACSettings.statuses.active_status
				);
				await this.props.refreshFrameAgreement(faId);

				if (this.props.frameAgreements[faId].csconta__replaced_frame_agreement__c) {
					await this.props.refreshFrameAgreement(
						this.props.frameAgreements[faId].csconta__replaced_frame_agreement__c
					);
				}

				this.props.createToast(
					'success',
					window.SF.labels.toast_decomposition_title_success,
					window.SF.labels.toast_decomposition_success + ' (' + structure.length + ')'
				);
			}
		};

		/**
		 * [description]
		 * @param  String faId frame agreement id to submit
		 * @return String      event message
		 */
		window.FAM.api.submitForApproval = async faId => {
			let response = await submitForApproval(faId);
			await Promise.all([
				this.props.getApprovalHistory(faId),
				this.props.refreshFrameAgreement(faId)
			]);
			return response;
		};

		/**
		 * checks if fa is editable
		 * @param  String faId frame agreement id
		 * @return Boolean     is editable?
		 */
		window.FAM.api.isAgreementEditable = faId => {
			let _editable = false;
			let _settings = this.props.settings.FACSettings;
			let _fa = this.props.frameAgreements[faId];
			let _is_approver = false;
			let _is_pending = false;
			try {
				_is_approver = _fa._ui.approval.isApprover;
				_is_pending = _fa._ui.approval.isPending;
			} catch (err) {
				// No approval
			}

			if (_settings.fa_editable_statuses.has(_fa.csconta__Status__c)) {
				_editable = true;
			}

			if (_is_pending && _is_approver && _settings.approvers_revise) {
				_editable = true;
			}

			return _editable;
		};

		/**
		 * sets fa status to be in-line with the negotiation
		 * @param  String faId frame agreement id
		 * @return String     new status
		 */
		window.FAM.api.validateStatusConsistency = async faId => {
			if (!this.props.settings.FACSettings.active_status_management__c) {
				return false;
			}

			let _result;
			let _fa = this.props.frameAgreements[faId];
			let _statuses = this.props.settings.FACSettings.statuses;

			// If approval is needed we need to set FA status to requires_approval_status + vice versa
			if (
				_fa._ui.approvalNeeded &&
				(_fa.csconta__Status__c === _statuses.draft_status ||
					_fa.csconta__Status__c === _statuses.approved_status)
			) {
				if (!_statuses.hasOwnProperty('draft_status') || !_statuses.draft_status) {
					log.bg.orange('Cannot set state to ' + newStatus + ' - not defined in Custom Settings');
				} else {
					console.log(
						'Changing the state of FA to %c' + _statuses.requires_approval_status,
						'font-style: italic;color: #0070d2'
					);

					_result = await this.props.setFrameAgreementState(
						faId,
						_statuses.requires_approval_status
					);
					return _result;
				}
			}

			if (
				!_fa._ui.approvalNeeded &&
				_fa.csconta__Status__c === _statuses.requires_approval_status
			) {
				if (
					!_statuses.hasOwnProperty('requires_approval_status') ||
					!_statuses.requires_approval_status
				) {
					log.bg.orange('Cannot set state to ' + newStatus + ' - not defined in Custom Settings');
				} else {
					console.log(
						'Changing the state of FA to %c' + _statuses.draft_status,
						'font-style: italic;color: #0070d2'
					);
					_result = await this.props.setFrameAgreementState(faId, _statuses.draft_status);
					return _result;
				}
			}
		};

		/**
		 * fetches a list of commercial products, can be filtered by fa id
		 * @param  String faId 		get cp for this specific fa
		 * @return List<Object> 	commercial products
		 */
		window.FAM.api.getCommercialProducts = async faId => {
			if (!faId) {
				return this.props.getCommercialProducts();
			} else {
				if (this.props.frameAgreements[faId]._ui.attachment === null) {
					let resp_attachment = await this.props.getAttachment(faId);
					// No need to wait for this one, we only need products
					this.props.getCommercialProductData(Object.keys(resp_attachment.products));

					return this.props.frameAgreements[faId]._ui.commercialProducts;
				} else {
					return this.props.frameAgreements[faId]._ui.commercialProducts;
				}
			}
		};

		/**
		 * reload all the fa information
		 * @param  String faId 		frame agreement id
		 * @return Promise 			remote action response
		 */
		window.FAM.api.refreshFa = faId => {
			return this.props.refreshFrameAgreement(faId);
		};

		/**
		 * set status of given fa
		 * @param  String faId 		frame agreement id
		 * @param  String newState 	new status for fa
		 * @return Promise 			remote action response
		 */
		window.FAM.api.setStatusOfFrameAgreement = (faId, newState) => {
			return this.props.setFrameAgreementState(faId, newState);
		};

		/**
		 * save given fa
		 * @param  String faId 		frame agreement id
		 * @return Promise 			remote action response
		 */
		window.FAM.api.saveFrameAgreement = async faId => {
			let result = await this.props.saveFrameAgreement(this.props.frameAgreements[faId]);
			await publish('onAfterSaveFrameAgreement', result);
			return result;
		};

		/**
		 * fetch custom part of fa attachment
		 * @param  String faId 			frame agreement id
		 * @return Promise(attachment) 	promise that resolves custom data
		 */
		window.FAM.api.getCustomData = (faId = window.mandatory('getCustomData()')) => {
			return new Promise((resolve, reject) => {
				let _fa = this.props.frameAgreements[faId];
				let _attachment = null;
				try {
					_attachment = _fa._ui.attachment.custom;
				} catch (err) {
					console.warn('Attachment cannot be loaded for FA:', faId);
					console.warn(err);
					reject(null);
				}
				resolve(_attachment);
			});
		};

		/**
		 * fetch custom part of fa attachment
		 * @param  String faId 			frame agreement id
		 * @param  Object data 			data to be stored in custom data
		 * @return void
		 */
		window.FAM.api.setCustomData = (
			faId = window.mandatory('setCustomData()'),
			data = window.mandatory('setCustomData()')
		) => {
			return new Promise((resolve, reject) => {
				this.props.setCustomData(faId, data);
				setTimeout(() => {
					resolve(this.props.frameAgreements[faId]._ui.attachment.custom);
				});
			});
		};

		/**
		 * perform negotiation action
		 * @param  String faId 		frame agreement id
		 * @param  Object data 		negotiation structure
		 * @return Promise(attachment) updated attachment
		 */
		window.FAM.api.negotiate = (faId, data = window.mandatory('negotiate()')) => {
			let self = this;
			return new Promise(async (resolve, reject) => {
				data = await publish('onBeforeNegotiate', data);

				this.props.apiNegotiate(faId, data);

				publish('onAfterNegotiate', this.props.frameAgreements[faId]._ui.attachment);

				self.props.validateFrameAgreement(faId);

				await window.FAM.api.validateStatusConsistency(faId);

				resolve(this.props.frameAgreements[faId]._ui.attachment);
			});
		};

		window.SF.getAuthLevels = () => this.props.settings.AuthLevels || {};

		Promise.all([
			this.props.getAppSettings(),
			window.SF.invokeAction('getFieldLabels', ['cspmb__Usage_Type__c']).then(r => {
				window.SF.fieldLabels['cspmb__Usage_Type__c'] = r;
			}),
			window.SF.invokeAction('getFieldLabels', ['csconta__Frame_Agreement__c']).then(r => {
				window.SF.fieldLabels['csconta__Frame_Agreement__c'] = r;
			}),
			window.SF.invokeAction('getFieldLabels', ['cspmb__Price_Item__c']).then(r => {
				window.SF.fieldLabels['cspmb__Price_Item__c'] = r;
			}),
			window.SF.invokeAction('getFieldLabels', ['cspmb__Add_On_Price_Item__c']).then(r => {
				window.SF.fieldLabels['cspmb__Add_On_Price_Item__c'] = r;
			}),
			this.props.getStandaloneAddons()
		]).then(response => {
			let _promiseArray = [this.props.getFrameAgreements(), this.props.getCommercialProducts()];

			let picklists = response[0].HeaderData.filter(f => f.type === 'picklist').map(f => f.field);

			// Load agreement levels for "Add new Agreement" picklist
			picklists.push('csconta__agreement_level__c');
			picklists.push('csconta__Status__c');

			_promiseArray.push(this.props.getPicklistOptions(picklists));

			Promise.all(_promiseArray).then(responseArr => {
				publish('onLoad', [responseArr]);
			});
		});

		this.landing = this.props.history.location.pathname === '/';
	}

	render() {
		let _loadingComponent;

		if (this.landing) {
			_loadingComponent = <LandingSkeleton count={5} />;
		} else {
			_loadingComponent = (
				<React.Fragment>
					<EditorSkeleton count={5} />
					<div className="skeleton-body--alt">
						<div className="skeleton-landing-cp">
							<CommercialProductSkeleton count={5} />
						</div>
					</div>
				</React.Fragment>
			);
		}

		const loaded =
			this.props.initialised.fa_loaded &&
			this.props.initialised.cp_loaded &&
			this.props.initialised.settings_loaded;

		return loaded ? (
			<div className="fa-app-wrapper">
				<Switch>
					<Route exact path="/" component={FaList} />
					<Route exact path="/agreement/:id" component={FaEditor} />
					<Route exact path="/master/:id" component={FaMaster} />
				</Switch>
			</div>
		) : (
			_loadingComponent
		);
	}
}

const mapDispatchToProps = {
	addProductsToFa,
	negotiate,
	getStandaloneAddons,
	apiNegotiate,
	clearToasts,
	createNewVersionOfFrameAgreement,
	updateFrameAgreement,
	cloneFrameAgreement,
	createToast,
	getAppSettings,
	getApprovalHistory,
	getAttachment,
	getCommercialProductData,
	getCommercialProducts,
	getFrameAgreements,
	getPicklistOptions,
	registerMethod,
	refreshFrameAgreement,
	resetNegotiation,
	removeProductsFromFa,
	saveFrameAgreement,
	setCustomData,
	setFrameAgreementState,
	validateFrameAgreement
};

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		commercialProducts: state.commercialProducts,
		settings: state.settings,
		validation: state.validation,
		initialised: state.initialised
	};
};

// export default App;
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
