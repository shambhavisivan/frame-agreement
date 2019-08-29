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
	negotiate,
	getCommercialProductData
} from '../actions';

import { publish } from '../api';

import { truncateCPField, log, isMaster } from '../utils/shared-service';
import { confirmAlert } from 'react-confirm-alert';

import ApprovalProcess from './ApprovalProcess';

import Toaster from './utillity/Toaster';

import ConfirmationModal from './modals/ConfirmationModal';

import CommercialProductsTab from './FaEditor/CommercialProductsTab';
import FaFields from './FaEditor/FaFields';
import FaFooter from './FaEditor/FaFooter';
import FaTabs from './FaEditor/FaTabs';
import FaHeader from './FaEditor/FaHeader';
import FaModals from './FaEditor/FaModals';

// Skeletons
import CommercialProductSkeleton from './skeletons/CommercialProductSkeleton';

window.editor = {};

const SUBSCRIPTIONS = {};

export class FaEditor extends Component {
	constructor(props) {
		super(props);

		this.onSelectProduct = this.onSelectProduct.bind(this);
		this.onSelectAllProducts = this.onSelectAllProducts.bind(this);
		this.upsertFrameAgreements = this.upsertFrameAgreements.bind(this);
		this.onRemoveProducts = this.onRemoveProducts.bind(this);
		this.toggleVisibility = this.toggleVisibility.bind(this);
		this.onActionTaken = this.onActionTaken.bind(this);
		this._setState = this._setState.bind(this);

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
			selectedProducts: {},
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
		SUBSCRIPTIONS['sub1'] = window.FAM.subscribe(
			'onAfterSaveFrameAgreement',
			data => {
				return new Promise(resolve => {
					this._setState({
						actionTaken: false
					});
					resolve(data);
				});
			}
		);
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
		SUBSCRIPTIONS['sub3'] = window.FAM.subscribe(
			'onAfterBulkNegotiation',
			data => {
				return new Promise(resolve => {
					this._setState({
						actionTaken: true
					});
					resolve(data);
				});
			}
		);
		// Enable save on events
		SUBSCRIPTIONS['sub4'] = window.FAM.subscribe(
			'onAfterDeleteProducts',
			data => {
				return new Promise(resolve => {
					this._setState({
						actionTaken: true
					});
					resolve(data);
				});
			}
		);
	}

	componentWillUnmount() {
		this.mounted = false;

		delete window.FAM.api.getActiveFrameAgreement;
		for (var key in SUBSCRIPTIONS) {
			SUBSCRIPTIONS[key].unsubscribe();
		}
	}

	componentDidMount() {
		// Check if FA info is loaded already
		// if (this.faId && this.props.frameAgreements[this.faId]._ui.attachment === null) {
		if (this.props.frameAgreements[this.faId]._ui.attachment === null) {
			// IF not, load attachment for FA
			this.props.getAttachment(this.faId).then(resp_attachment => {
				// ***********************************************
				let IdsToLoad = Object.keys(resp_attachment.products || {});
				// If attachment is present
				// if (IdsToLoad.length) {
				// Mend null values, its loaded now
				for (var key in resp_attachment.products) {
					resp_attachment.products[key] = resp_attachment.products[key] || {};
				}
				// Get data for commercial products
				// this.props.getCommercialProductData(this.faId, IdsToLoad).then(r => {
				this.props.getCommercialProductData(IdsToLoad).then(async r => {
					await this.props.addProductsToFa(this.faId, IdsToLoad);
					this._setState(
						{ loading: { ...this.state.loading, attachment: false } },
						() => {
							publish('onFaSelect', [this.props.frameAgreements[this.faId]]);
						}
					);
					this.props.validateFrameAgreement(this.faId);
				});
			});
		} else {
			this._setState(
				{
					loading: {
						...this.state.loading,
						attachment: false
					}
				},
				() => {
					publish('onFaSelect', [this.props.frameAgreements[this.faId]]);
					this.props.validateFrameAgreement(this.faId);
				}
			);
		}

		this.props.getApprovalHistory(this.faId);

		// **************************************
		this.editable = this.props.settings.FACSettings.fa_editable_statuses.has(
			this.props.frameAgreements[this.faId].csconta__Status__c
		);
		// **************************************
		window.editor = this;
	}

	componentDidUpdate() {
		try {
			if (
				this.editable !==
				this.props.settings.FACSettings.fa_editable_statuses.has(
					this.props.frameAgreements[this.faId].csconta__Status__c
				)
			) {
				this.editable = this.props.settings.FACSettings.fa_editable_statuses.has(
					this.props.frameAgreements[this.faId].csconta__Status__c
				);
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

	async _removeProducts() {
		return new Promise(async resolve => {
			let productsToDelete = await publish(
				'onBeforeDeleteProducts',
				Object.keys(this.state.selectedProducts)
			);

			await this.props.removeProductsFromFa(this.faId, productsToDelete);
			this.props.validateFrameAgreement(this.faId);

			this._setState(
				{
					selectedProducts: {}
				},
				() => {
					publish(
						'onAfterDeleteProducts',
						this.props.frameAgreements[this.faId]._ui.commercialProducts.map(
							cp => cp.Id
						)
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

	onSelectAllProducts(allProducts) {
		let selectedProducts = { ...this.state.selectedProducts };

		if (
			allProducts.length === Object.keys(this.state.selectedProducts).length
		) {
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

	toggleVisibility(index) {
		this.props.toggleFieldVisibility(index);
	}

	/**************************************************/
	async onNegotiate(priceItemId, type, data) {
		console.log(data);

		this.props.negotiate(this.faId, priceItemId, type, data);

		this._setState(
			{
				actionTaken: true
			},
			async () => {
				publish(
					'onAfterNegotiate',
					this.props.frameAgreements[this.faId]._ui.attachment
				);
			}
		);
	}
	/**************************************************/

	async upsertFrameAgreements() {
		var data = { ...this.props.frameAgreements[this.faId] };
		data = await publish('onBeforeSaveFrameAgreement', data);

		if (
			this.props.frameAgreements[this.faId]._ui.approvalNeeded &&
			this.editable
		) {
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

	render() {
		return (
			<div className="fa-app">
				<Prompt
					when={this.state.actionTaken && this.editable}
					message={window.SF.labels.modal_unsavedChanges_alert}
				/>

				<FaHeader faId={this.faId} />

				<div className="fa-main-body">
					<div className="fa-main-body__inner">
						<FaFields onActionTaken={this.onActionTaken} faId={this.faId} />

						{this.props.frameAgreements[this.faId]._ui.approval &&
						this.props.frameAgreements[this.faId]._ui.approval.listProcess
							.length ? (
							<ApprovalProcess faId={this.faId} />
						) : null}

						<FaTabs
							faId={this.faId}
							loading={this.state.loading.attachment}
							onActionTaken={this.onActionTaken}
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
						selectedProducts={this.state.selectedProducts}
						onRemoveProducts={() => this.onRemoveProducts()}
					/>
				)}

				<FaModals
					faId={this.faId}
					selectedProducts={this.state.selectedProducts}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		commercialProducts: state.commercialProducts,
		frameAgreements: state.frameAgreements,
		settings: state.settings
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
	negotiate,
	getCommercialProductData
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(FaEditor)
);
