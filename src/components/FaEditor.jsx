import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { withRouter } from 'react-router-dom';

import {
	createToast,
	validateFrameAgreement,
	getAttachment,
	getApprovalHistory,
	saveFrameAgreement,
	addProductsToFa,
	removeProductsFromFa,
	removeAddonsFromFa,
	setFrameAgreementCpFilter,
	negotiate,
	setDisableDiscount,
	getRelatedLists,
	replaceCpEntities,
	getCommercialProductData,
	executeFrameAgreementAction,
	setFrameAgreementState,
	removeOffersFromFa,
	getOffers,
	getOfferData,
	addOffersToFa,
	replaceOfferEntities,
	setFrameAgreementOfferFilter
} from '../actions';

import { publish, findReplacementCommercialProduct } from '../api';

import {
	log,
	isMaster,
} from '../utils/shared-service';
import { confirmAlert } from 'react-confirm-alert';

import ApprovalProcess from './ApprovalProcess';

import Toaster from './utillity/Toaster';

import Tabs from './utillity/tabs/Tabs';
import Tab from './utillity/tabs/Tab';

import RelatedLists from './relatedLists/RelatedLists';

import ConfirmationModal from './modals/ConfirmationModal';

import CommercialProductsTab from './FaEditor/CommercialProductsTab';
import AddonsTab from './FaEditor/AddonsTab';

import FaFields from './FaEditor/FaFields';
import FaFooter from './FaEditor/FaFooter';
import FaTabs from './FaEditor/FaTabs';
import FaHeader from './FaEditor/FaHeader';
import FaModals from './FaEditor/FaModals';
import OffersTab from './FaEditor/OffersTab';

import * as frameAgreementActions from '../actions/frameAgreementActions';

window.editor = {};

const SUBSCRIPTIONS = {};

export class FaEditor extends Component {
	constructor(props) {
		super(props);

		this.onSelectProduct = this.onSelectProduct.bind(this);
		this.onSelectAddon = this.onSelectAddon.bind(this);
		this.onSelectAllProducts = this.onSelectAllProducts.bind(this);
		this.onSelectAllAddons = this.onSelectAllAddons.bind(this);
		this.upsertFrameAgreements = this.upsertFrameAgreements.bind(this);
		this.onRemoveProducts = this.onRemoveProducts.bind(this);
		this.onRemoveAddons = this.onRemoveAddons.bind(this);
		this.toggleVisibility = this.toggleVisibility.bind(this);
		this.onActionTaken = this.onActionTaken.bind(this);
		this._setState = this._setState.bind(this);
		this.onSelectOffer = this.onSelectOffer.bind(this);
		this.onSelectAllOffers = this.onSelectAllOffers.bind(this);
		this.onRemoveOffers = this.onRemoveOffers.bind(this);
		this.setActiveTabIndex = this.setActiveTabIndex.bind(this);

		// ****************************************** API ******************************************
		window.FAM.api.getActiveFrameAgreement = () =>
			new Promise(resolve => {
				resolve(this.props.frameAgreements[this.faId]);
			});

		// ****************************************** API END ******************************************

		this.faId = this.props.match.params.id || null;

		if (!this.faId || !this.props.frameAgreements[this.faId]) {
			console.error('Non existing frame agreement!');
			this.props.history.push('/');
			window.location.reload();
		}

		if (isMaster(this.props.frameAgreements[this.faId])) {
			this.props.history.push('/master/' + this.faId);
		}

		// Ref active FA from store
		this.state = {
			actionTaken: false,
			activeTabIndex: 0,
			selectedProducts: {},
			selectedAddons: {},
			selectedOffers: {},
			loading: {
				attachment: true
			},
			pagination: {
				page: 1,
				pageSize: 10
			}
		};

		this.mounted = true;
		// Disable onLeavePage prompt when saved
		SUBSCRIPTIONS['sub1'] = window.FAM.subscribe('onAfterSaveFrameAgreement', data => {
			return new Promise(resolve => {
				this._setState({
					actionTaken: false
				});
				resolve(data);
			});
		});
		// Enable save on events
		SUBSCRIPTIONS['sub2'] = window.FAM.subscribe('onAfterAddProducts', data => {
			return new Promise(resolve => {
				this._setState({
					actionTaken: true
				});
				resolve(data);
			});
		});
		// Enable save on events
		SUBSCRIPTIONS['sub3'] = window.FAM.subscribe('onAfterBulkNegotiation', data => {
			return new Promise(resolve => {
				this._setState({
					actionTaken: true
				});
				resolve(data);
			});
		});
		// Enable save on events
		SUBSCRIPTIONS['sub4'] = window.FAM.subscribe('onAfterDeleteProducts', data => {
			return new Promise(resolve => {
				this._setState({
					actionTaken: true
				});
				resolve(data);
			});
		});

		// Enable save on FA events
		SUBSCRIPTIONS['sub5'] = window.FAM.subscribe('onFaUpdate', data => {
			return new Promise(resolve => {
				this._setState({
					actionTaken: true
				});
				resolve(data);
			});
		});
		// Enable save on events
		SUBSCRIPTIONS['sub6'] = window.FAM.subscribe('onAfterAddOffers', data => {
			return new Promise(resolve => {
				this._setState({
					actionTaken: true
				});
				resolve(data);
			});
		});

		// Enable save on negotiated events
		SUBSCRIPTIONS['sub7'] = window.FAM.subscribe('onAfterNegotiate', data => {
			return new Promise(resolve => {
				this._setState({
					actionTaken: true
				});
				resolve(data);
			});
		});
		// Enable save on events
		SUBSCRIPTIONS['sub8'] = window.FAM.subscribe('onAfterDeleteOffers', data => {
			return new Promise(resolve => {
				this._setState({
					actionTaken: true
				});
				resolve(data);
			});
		});
	}

	setActiveTabIndex() {
		const { hiddenTabs } = this.props.settings;
		let index = 0;
		if (Object.keys(hiddenTabs).includes('product')) {
			index += 1
			if (Object.keys(hiddenTabs).includes('addon')) {
				index += 1;
			}
		}

		this.setState({ activeTabIndex: index });
	}

	componentWillUnmount() {
		this.mounted = false;
		delete window.FAM.api.getActiveFrameAgreement;
		for (var key in SUBSCRIPTIONS) {
			SUBSCRIPTIONS[key].unsubscribe();
		}
		this.props.executeFrameAgreementAction(this.faId, frameAgreementActions.CLEAR_ATTACHMENT);

		if (this.state.actionTaken && this.editable) {
			this.props.executeFrameAgreementAction(this.faId, frameAgreementActions.RESET);

			if (
				this.props.currentFrameAgreement.csconta__Status__c !==
				this.props.frameAgreements[this.faId].csconta__Status__c
			) {
				this.props.setFrameAgreementState(
					this.faId,
					this.props.currentFrameAgreement.csconta__Status__c
				);
			}
		}
	}

	async componentDidMount() {
		this.props.executeFrameAgreementAction(this.faId, frameAgreementActions.CLONE)
		const cpFilterEvent = async () => {
			let perFaCpFilterList = await publish(
				'onLoadCommercialProducts',
				this.props.commercialProducts
			);
			// If there was any filtering done
			if (perFaCpFilterList.length !== this.props.commercialProducts.length) {
				this.props.setFrameAgreementCpFilter(
					this.faId,
					new Set(perFaCpFilterList.map(cp => cp.Id))
				);
			}

			return true;
		};

		const offerFilterEvent = async () => {
			let perFaOfferFilterList = await publish(
				'onLoadOffers',
				this.props.offers
			);
			// If there was any filtering done
			if (perFaOfferFilterList.length !== this.props.offers.length) {
				this.props.setFrameAgreementOfferFilter(
					this.faId,
					new Set(perFaOfferFilterList.map(offer => offer.Id))
				);
			}

			return true;
		};

		const onLoadingFinished = async () => {
			this.props.validateFrameAgreement(this.faId);
			window.FAM.api.validateStatusConsistency(this.faId);

			this._setState({ loading: { ...this.state.loading, attachment: false } }, async () => {
				let _config = await publish('onFaSelect', [this.props.frameAgreements[this.faId]]);

				if (
					_config.hasOwnProperty('disableDiscountLevels') ||
					_config.hasOwnProperty('disableInlineDiscounts')
				) {
					this.props.setDisableDiscount(this.faId, _config);
				}

				return;
			});
		};

		let _promiseArray = [];

		_promiseArray.push(this.props.getApprovalHistory(this.faId));

		if (!this.props.frameAgreements[this.faId]._ui.hasOwnProperty('relatedList')) {
			_promiseArray.push(this.props.getRelatedLists(this.faId));
		}

		if (this.props.frameAgreements[this.faId]._ui.attachment === null) {
			_promiseArray.push(
				this.props.getAttachment(this.faId).then(async resp_attachment => {
					// ***********************************************
					let IdsToLoad = Object.keys(resp_attachment.products || {});
					// If attachment is present
					// Mend null values, its loaded now
					for (var key in resp_attachment.products) {
						resp_attachment.products[key] = resp_attachment.products[key] || {};
					}

					if (IdsToLoad.length) {
						// Check if any CPs have been deleted
						let _idsToLoadSet = new Set(IdsToLoad);
						let _filteredCpIdList = [];

						this.props.commercialProducts.forEach(cp => {
							if (_idsToLoadSet.has(cp.Id)) {
								_idsToLoadSet.delete(cp.Id);
								_filteredCpIdList.push(cp.Id);
							}
						});

						let cpReplacementData = {};
						if (
							_idsToLoadSet.size &&
							!isMaster(this.props.frameAgreements[this.faId]) &&
							this.props.frameAgreements[this.faId].csconta__Status__c !==
								this.props.settings.FACSettings.statuses.active_status
						) {
							this.props.createToast(
								'warning',
								window.SF.labels.toast_invalid_product_title,
								window.SF.labels.toast_invalid_product,
								3000
							);

							log.orange(
								'These products cannot be found in getCommercialProducts response:',
								Array.from(_idsToLoadSet)
							);
							this.props.createToast(
								'info',
								window.SF.labels.toast_search_replacement_product_title,
								window.SF.labels.toast_search_replacement_product,
								5000
							);

							cpReplacementData = await findReplacementCommercialProduct([..._idsToLoadSet]);
						}

						if (Object.keys(cpReplacementData).length) {
							// get replacement data as well
							_filteredCpIdList = [
								...new Set([
									..._filteredCpIdList,
									...Object.values(cpReplacementData).map(cpr => cpr.new_cp.Id)
								])
							];
						}

						// Get data for commercial products
						// this.props.getCommercialProductData(this.faId, IdsToLoad).then(r => {
						await this.props.getCommercialProductData(_filteredCpIdList);
						await this.props.addProductsToFa(this.faId, _filteredCpIdList);

						if (Object.keys(cpReplacementData).length) {
							// cpReplacementData contains info about which addons and rc old cp was attached to
							await this.props.replaceCpEntities(this.faId, cpReplacementData);

							await window.SF.invokeAction('saveAttachment', [
								this.faId,
								JSON.stringify(this.props.frameAgreements[this.faId]._ui.attachment)
							]);
						}
					}

					let offerIdsToLoad = Object.keys(resp_attachment.offers || {});

					for (var key in resp_attachment.offers) {
						resp_attachment.offers[key] = resp_attachment.offers[key] || {};
					}

					if (offerIdsToLoad.length) {
						// Check if any offers have been deleted
						let _offerIdsToLoadSet = new Set(offerIdsToLoad);
						let _filteredOfferIdList = [];

						if (!this.props.offersLoaded) {
							await this.props.getOffers();
						}

						this.props.offers.forEach(offer => {
							if (_offerIdsToLoadSet.has(offer.Id)) {
								_offerIdsToLoadSet.delete(offer.Id);
								_filteredOfferIdList.push(offer.Id);
							}
						});

						let offerReplacementData = {};
						if (
							_offerIdsToLoadSet.size &&
							!isMaster(this.props.frameAgreements[this.faId]) &&
							this.props.frameAgreements[this.faId].csconta__Status__c !==
								this.props.settings.FACSettings.statuses.active_status
						) {
							this.props.createToast(
								'warning',
								window.SF.labels.toast_invalid_offer_title,
								window.SF.labels.toast_invalid_offer,
								3000
							);

							log.orange(
								'These offers cannot be found in getOffers response:',
								Array.from(_offerIdsToLoadSet)
							);
							this.props.createToast(
								'info',
								window.SF.labels.toast_search_replacement_offer_title,
								window.SF.labels.toast_search_replacement_offer,
								5000
							);

							offerReplacementData = await findReplacementCommercialProduct([..._offerIdsToLoadSet]);
						}

						if (Object.keys(offerReplacementData).length) {
							// get replacement data as well
							_filteredOfferIdList = [
								...new Set([
									..._filteredOfferIdList,
									...Object.values(offerReplacementData).map(offer => offer.new_cp.Id)
								])
							];
						}

						// Get data for offer products
						await this.props.getOfferData(_filteredOfferIdList);
						await this.props.addOffersToFa(this.faId, _filteredOfferIdList);

						if (Object.keys(offerReplacementData).length) {
							// offerReplacementData contains info about which addons and rc old offer was attached to
							await this.props.replaceOfferEntities(this.faId, offerReplacementData);

							await window.SF.invokeAction('saveAttachment', [
								this.faId,
								JSON.stringify(this.props.frameAgreements[this.faId]._ui.attachment)
							]);
						}
					}

					return;
				})
			);
		}

		Promise.all(_promiseArray).then(async response => {
			await this.props.executeFrameAgreementAction(this.faId, frameAgreementActions.CLONE);
			await cpFilterEvent();
			await offerFilterEvent();
			await onLoadingFinished();
		});

		// **************************************
		this.editable = window.FAM.api.isAgreementEditable(this.faId);
		// **************************************

		this.setActiveTabIndex();
	}

	componentDidUpdate() {
		try {
			if (this.editable !== window.FAM.api.isAgreementEditable(this.faId)) {
				this.editable = window.FAM.api.isAgreementEditable(this.faId);
			}
		} catch (e) {}
	}

	_setState(newState, callback) {
		if (this.mounted) {
			this.setState(newState, () => {
				callback ? callback() : null;
			});
		}
	}

	onActionTaken() {
		this._setState({
			actionTaken: true
		});
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

	onRemoveAddons() {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<ConfirmationModal
						title={window.SF.labels.alert_deleteAddons_title}
						message={window.SF.labels.alert_deleteAddons_message}
						onCancel={onClose}
						onConfirm={() => {
							this._removeAddons();
						}}
						confirmText={window.SF.labels.btn_DeleteAddons}
					/>
				);
			}
		});
	}

	async _removeProducts() {
		return new Promise(async resolve => {
			let productsToDelete = await publish(
				'onBeforeDeleteProducts',
				Object.keys(this.state.selectedProducts)
			);

			await this.props.removeProductsFromFa(this.faId, productsToDelete);
			this.props.validateFrameAgreement(this.faId);
			window.FAM.api.validateStatusConsistency(this.faId);

			this._setState(
				{
					selectedProducts: {}
				},
				() => {
					publish(
						'onAfterDeleteProducts',
						this.props.frameAgreements[this.faId]._ui.commercialProducts.map(cp => cp.Id)
					);
					resolve(this.props.frameAgreements[this.faId]._ui.attachment);
				}
			);
		});
	}

	async _removeAddons() {
		return new Promise(async resolve => {
			let addonsToDelete = await publish(
				'onBeforeDeleteAddons',
				Object.keys(this.state.selectedAddons)
			);

			await this.props.removeAddonsFromFa(this.faId, addonsToDelete);

			this.props.validateFrameAgreement(this.faId);
			window.FAM.api.validateStatusConsistency(this.faId);

			this._setState(
				{
					selectedAddons: {}
				},
				() => {
					publish(
						'onAfterDeleteAddons',
						this.props.frameAgreements[this.faId]._ui.standaloneAddons.map(cp => cp.Id)
					);
					resolve(this.props.frameAgreements[this.faId]._ui.attachment);
				}
			);
		});
	}

	onSelectProduct(product) {
		let selectedProducts = { ...this.state.selectedProducts };

		if (selectedProducts[product.Id]) {
			delete selectedProducts[product.Id];
		} else {
			selectedProducts[product.Id] = product;
		}
		this._setState({
			selectedProducts
		});
	}

	onSelectAddon(addon) {
		let selectedAddons = { ...this.state.selectedAddons };

		if (selectedAddons[addon.Id]) {
			delete selectedAddons[addon.Id];
		} else {
			selectedAddons[addon.Id] = addon;
		}
		this._setState({
			selectedAddons
		});
	}

	onSelectAllProducts(allProducts) {
		let selectedProducts = { ...this.state.selectedProducts };

		if (allProducts.length === Object.keys(this.state.selectedProducts).length) {
			selectedProducts = {};
		} else {
			allProducts.forEach(cp => {
				selectedProducts[cp.Id] = cp;
			});
		}

		this._setState({
			selectedProducts
		});
	}

	onSelectAllAddons(allAddons) {
		let selectedAddons = { ...this.state.selectedAddons };

		if (allAddons.length === Object.keys(this.state.selectedAddons).length) {
			selectedAddons = {};
		} else {
			allAddons.forEach(add => {
				selectedAddons[add.Id] = add;
			});
		}

		this._setState({
			selectedAddons
		});
	}

	toggleVisibility(index) {
		this.props.toggleFieldVisibility(index);
	}

	async upsertFrameAgreements() {
		var data = { ...this.props.frameAgreements[this.faId] };
		data = await publish('onBeforeSaveFrameAgreement', data);

		if (this.props.frameAgreements[this.faId]._ui.approvalNeeded && this.editable) {
			data.csconta__Status__c = this.props.settings.FACSettings.statuses.requires_approval_status;
		}

		return this.props
			.saveFrameAgreement(data)
			.then(async responseArr => {
				this._setState({
					actionTaken: false
				});
				return responseArr;
			})
			.then(async responseArr => {
				await publish('onAfterSaveFrameAgreement', responseArr);
				this.props.createToast(
					'success',
					window.SF.labels.toast_success_title,
					window.SF.labels.toast_saved_fa
				);
				return 'Success';
			});
	}

	onSelectAllOffers(allOffers) {
		let selectedOffers = { ...this.state.selectedOffers };

		if (allOffers.length === Object.keys(this.state.selectedOffers).length) {
			selectedOffers = {};
		} else {
			allOffers.forEach(cp => {
				selectedOffers[cp.Id] = cp;
			});
		}

		this._setState({
			selectedOffers
		});
	}

	onSelectOffer(offer) {
		let selectedOffers = { ...this.state.selectedOffers };

		if (selectedOffers[offer.Id]) {
			delete selectedOffers[offer.Id];
		} else {
			selectedOffers[offer.Id] = offer;
		}
		this._setState({
			selectedOffers
		});
	}

	async _removeOffers() {
		return new Promise(async resolve => {
			const offersToDelete = await publish(
				'onBeforeDeleteOffers',
				Object.keys(this.state.selectedOffers)
			);

			await this.props.removeOffersFromFa(this.faId, offersToDelete);

			this.props.validateFrameAgreement(this.faId);
			window.FAM.api.validateStatusConsistency(this.faId);

			this._setState(
				{
					selectedProducts: {}
				},
				() => {
					publish(
						'onAfterDeleteOffers',
						this.props.frameAgreements[this.faId]._ui.offers.map(cp => cp.Id)
					);
					resolve(this.props.frameAgreements[this.faId]._ui.attachment);
				}
			);
		});
	}

	onRemoveOffers() {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<ConfirmationModal
						title={window.SF.labels.alert_deleteOffers_title}
						message={window.SF.labels.alert_deleteOffers_message}
						onCancel={onClose}
						onConfirm={() => {
							this._removeOffers();
						}}
						confirmText={window.SF.labels.alert_deleteOffers_title}
					/>
				);
			}
		});
	}

	render() {
		let _cpDefaultTab = (
			<CommercialProductsTab
				faId={this.faId}
				selectedProducts={this.state.selectedProducts}
				onSelectProduct={this.onSelectProduct}
				onSelectAllProducts={this.onSelectAllProducts}
			/>
		);

		let _addDefaultTab = (
			<AddonsTab
				faId={this.faId}
				selectedAddons={this.state.selectedAddons}
				onSelectAddon={this.onSelectAddon}
				onSelectAllAddons={this.onSelectAllAddons}
			/>
		);

		let _offersDefaultTab = (
			<OffersTab
				faId={this.faId}
				selectedOffers={this.state.selectedOffers}
				onSelectOffer={this.onSelectOffer}
				onSelectAllOffers={this.onSelectAllOffers}
			/>
		);

		return (
			<div className="fa-app">
				<Prompt
					when={this.state.actionTaken && this.editable}
					message={window.SF.labels.modal_unsavedChanges_alert}
				/>

				<FaHeader faId={this.faId} isAttachmentLoading={this.state.loading.attachment}/>

				<div className="fa-main-body">
					<div className="fa-main-body__inner">
						{this.props.settings.RelatedListsData.length ? (
							<Tabs initial={0}>
								<Tab label={window.SF.labels.fa_tab}>
									<FaFields onActionTaken={this.onActionTaken} faId={this.faId} />
								</Tab>
								<Tab label={window.SF.labels.rl_tab}>
									<RelatedLists faId={this.faId} />
								</Tab>
							</Tabs>
						) : (
							<FaFields onActionTaken={this.onActionTaken} faId={this.faId} />
						)}

						{this.props.frameAgreements[this.faId]._ui.approval &&
						this.props.frameAgreements[this.faId]._ui.approval.listProcess.length ? (
							<ApprovalProcess faId={this.faId} />
						) : null}

						<FaTabs
							faId={this.faId}
							defaultTabs={{ cp: _cpDefaultTab, addon: _addDefaultTab, offers: _offersDefaultTab }}
							loading={this.state.loading.attachment}
							onMainTabChange={i => {
								this.setState({ activeTabIndex: i });
							}}
							activeTabIndex ={this.state.activeTabIndex}
						>
							<CommercialProductsTab
								faId={this.faId}
								selectedProducts={this.state.selectedProducts}
								onSelectProduct={this.onSelectProduct}
								onSelectAllProducts={this.onSelectAllProducts}
							/>
						</FaTabs>
					</div>
				</div>

				<Toaster />

				{this.editable && (
					<FaFooter
						faId={this.faId}
						activeTab={this.state.activeTabIndex}
						selectedProducts={this.state.selectedProducts}
						selectedAddons={this.state.selectedAddons}
						selectedOffers={this.state.selectedOffers}
						onRemoveProducts={() => this.onRemoveProducts()}
						onRemoveAddons={() => this.onRemoveAddons()}
						onRemoveOffers={() => this.onRemoveOffers()}
					/>
				)}

				<FaModals
					faId={this.faId}
					selectedProducts={this.state.selectedProducts}
					selectedAddons={this.state.selectedAddons}
					selectedOffers={this.state.selectedOffers}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		commercialProducts: state.commercialProducts,
		frameAgreements: state.frameAgreements,
		currentFrameAgreement: state.currentFrameAgreement,
		settings: state.settings,
		offers: state.offers,
		offersLoaded: state.initialised.of_loaded,
	};
};

const mapDispatchToProps = {
	createToast,
	validateFrameAgreement,
	getAttachment,
	getApprovalHistory,
	saveFrameAgreement,
	addProductsToFa,
	removeProductsFromFa,
	removeAddonsFromFa,
	setFrameAgreementCpFilter,
	negotiate,
	setDisableDiscount,
	getRelatedLists,
	replaceCpEntities,
	getCommercialProductData,
	executeFrameAgreementAction,
	setFrameAgreementState,
	removeOffersFromFa,
	getOffers,
	getOfferData,
	addOffersToFa,
	replaceOfferEntities,
	setFrameAgreementOfferFilter
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FaEditor));
