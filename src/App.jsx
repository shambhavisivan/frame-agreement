import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import {
	addProductsToFa,
	negotiate,
	apiNegotiate,
	clearToasts,
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
import Icon from './components/utillity/Icon';

import LandingSkeleton from './components/skeletons/LandingSkeleton';
import EditorSkeleton from './components/skeletons/EditorSkeleton';
import CommercialProductSkeleton from './components/skeletons/CommercialProductSkeleton';

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
		window.FAM.api.resetNegotiation = faId => {
			this.props.resetNegotiation(faId);
			this.props.validateFrameAgreement(faId);
		};
		// ******************************************
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
		// ******************************************
		window.FAM.api.setVolumeFields = async (faId, productId, volume) => {
			return this.props.negotiate(faId, productId, '_volume', volume);
		};
		// ******************************************

		window.FAM.api.removeProducts = (
			faId = window.mandatory('addProducts()'),
			products = []
		) => {
			return new Promise(async resolve => {
				let productsToDelete = await publish(
					'onBeforeDeleteProducts',
					products
				);

				// IF not, load attachment for FA
				if (this.props.frameAgreements[faId]._ui.attachment === null) {
					let resp_attachment = await this.props.getAttachment(faId);
				}

				await this.props.removeProductsFromFa(faId, productsToDelete);
				publish(
					'onAfterDeleteProducts',
					this.props.frameAgreements[faId]._ui.commercialProducts.map(
						cp => cp.Id
					)
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

		window.FAM.api.activateFrameAgreement = async faId => {
			// 1) Create a structure that is matching one element -> one pipra
			let _attachment = this.props.frameAgreements[faId]._ui.attachment
				.products;

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
			const PR_ID = await createPricingRuleGroup(faId);

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
				decompositionPromiseArray.push(decomposeAttachment(chunk, PR_ID, faId));
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

				this.props.createToast(
					'success',
					window.SF.labels.toast_decomposition_title_success,
					window.SF.labels.toast_decomposition_success +
						' (' +
						structure.length +
						')'
				);
			}
		};

		window.FAM.api.submitForApproval = async faId => {
			let response = await submitForApproval(faId);
			await Promise.all([
				this.props.getApprovalHistory(faId),
				this.props.refreshFrameAgreement(faId)
			]);
			return response;
		};

		window.SF.validateStatusConsistency = async faId => {
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
				if (
					!_statuses.hasOwnProperty('draft_status') ||
					!_statuses.draft_status
				) {
					log.bg.orange(
						'Cannot set state to ' +
							newStatus +
							' - not defined in Custom Settings'
					);
				} else {
					console.log(
						'Changing the state of FA to %c' +
							_statuses.requires_approval_status,
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
					log.bg.orange(
						'Cannot set state to ' +
							newStatus +
							' - not defined in Custom Settings'
					);
				} else {
					console.log(
						'Changing the state of FA to %c' + _statuses.draft_status,
						'font-style: italic;color: #0070d2'
					);
					_result = await this.props.setFrameAgreementState(
						faId,
						_statuses.draft_status
					);
					return _result;
				}
			}
		};

		window.FAM.api.getCommercialProducts = async faId => {
			if (!faId) {
				return this.props.getCommercialProducts();
			} else {
				if (this.props.frameAgreements[faId]._ui.attachment === null) {
					let resp_attachment = await this.props.getAttachment(faId);
					// No need to wait for this one, we only need products
					this.props.getCommercialProductData(
						Object.keys(resp_attachment.products)
					);

					return this.props.frameAgreements[faId]._ui.commercialProducts;
				} else {
					return this.props.frameAgreements[faId]._ui.commercialProducts;
				}
			}
		};

		window.FAM.api.refreshFa = faId => {
			return this.props.refreshFrameAgreement(faId);
		};

		window.FAM.api.setStatusOfFrameAgreement = (faId, newState) => {
			return this.props.setFrameAgreementState(faId, newState);
		};

		window.FAM.api.saveFrameAgreement = faId => {
			return this.props.saveFrameAgreement(this.props.frameAgreements[faId]);
		};

		window.FAM.api.getCustomData = (
			faId = window.mandatory('getCustomData()')
		) => {
			return new Promise((resolve, reject) => {
				let _fa = this.props.frameAgreements[faId];
				let _attachment = null;
				try {
					_attachment = _fa._ui.attachment.custom;
				} catch (err) {
					console.warn('Attachemnt cannot be loaded for FA:', faId);
					console.warn(err);
					reject(null);
				}
				resolve(_attachment);
			});
		};

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

		window.FAM.api.negotiate = (
			faId,
			data = window.mandatory('negotiate()')
		) => {
			let self = this;
			return new Promise(async (resolve, reject) => {
				data = await publish('onBeforeNegotiate', data);

				this.props.apiNegotiate(faId, data);

				publish(
					'onAfterNegotiate',
					this.props.frameAgreements[faId]._ui.attachemnt
				);

				self.props.validateFrameAgreement(faId);

				await window.SF.validateStatusConsistency(faId);

				resolve(this.props.frameAgreements[faId]._ui.attachemnt);
			});
		};

		window.SF.getAuthLevels = () => this.props.settings.AuthLevels || {};

		this.props.getAppSettings().then(response => {
			let _promiseArray = [
				this.props.getFrameAgreements(),
				this.props.getCommercialProducts()
			];

			let picklists = response.HeaderData.filter(
				f => f.type === 'picklist'
			).map(f => f.field);

			if (picklists.length) {
				_promiseArray.push(this.props.getPicklistOptions(picklists));
			}

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
	apiNegotiate,
	clearToasts,
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
export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(App)
);
