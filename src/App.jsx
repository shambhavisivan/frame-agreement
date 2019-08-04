import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import {
	addProductsToFa,
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
	performAction,
	registerMethod,
	refreshFrameAgreement,
	resetNegotiation,
	removeProductsFromFa,
	saveFrameAgreement,
	setCustomData,
	setFrameAgreementState,
	submitForApproval,
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

import { publish } from './api';

class App extends Component {
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

		// ****************************************** API END ******************************************

		window.FAM.api.cloneFrameAgreement = this.props.cloneFrameAgreement;
		window.FAM.api.toast = this.props.createToast;
		window.FAM.registerMethod = this.props.registerMethod;
		window.FAM.api.performAction = this.props.performAction;
		window.FAM.api.getAttachment = this.props.getAttachment;

		window.FAM.api.submitForApproval = async faId => {
			let res1 = await this.props.submitForApproval(faId);
			if (res1) {
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
			await Promise.all([
				this.props.getApprovalHistory(faId),
				this.props.refreshFrameAgreement(faId)
			]);
			return res1;
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
					_attachment = JSON.parse(_attachment || '{}');
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

				resolve(this.props.frameAgreements[faId]._ui.attachemnt);
			});
		};

		this.props.getAppSettings().then(
			response => {
				window.SF.AuthLevels = response.AuthLevels;

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
			},
			reject => {
				console.warn(reject);
			}
		);

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
	performAction,
	registerMethod,
	refreshFrameAgreement,
	resetNegotiation,
	removeProductsFromFa,
	saveFrameAgreement,
	setCustomData,
	setFrameAgreementState,
	submitForApproval,
	validateFrameAgreement
};

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		commercialProducts: state.commercialProducts,
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
