import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { withRouter } from 'react-router-dom';

import {
	addFaToMaster,
	createToast,
	toggleModals,
	toggleFaFieldVisibility,
	validateFrameAgreement,
	getAttachment,
	getApprovalHistory,
	saveFrameAgreement,
	addProductsToFa,
	removeFaFromMaster,
	negotiate,
	getRelatedLists,
	getCommercialProductData,
	executeFrameAgreementAction
} from '../actions';

import { publish } from '../api';

import { truncateCPField, getFieldLabel, log, isMaster, evaluateExpressionOnAgreement } from '../utils/shared-service';
import { confirmAlert } from 'react-confirm-alert';

// import ApprovalProcess from './ApprovalProcess';
// import CommercialProduct from './negotiation/CommercialProduct';

import Toaster from './utillity/Toaster';
import Header from './utillity/Header';
import Pagination from './utillity/Pagination';
import Icon from './utillity/Icon';

import SFDatePicker from './utillity/datepicker/SFDatePicker';
import InputSearch from './utillity/inputs/InputSearch';
import Checkbox from './utillity/inputs/Checkbox';
import DropdownCheckbox from './utillity/inputs/DropdownCheckbox';

import ConfirmationModal from './modals/ConfirmationModal';
import RelatedLists from './relatedLists/RelatedLists';
import Tabs from './utillity/tabs/Tabs';
import Tab from './utillity/tabs/Tab';

// import CommercialProductsTab from './FaEditor/CommercialProductsTab';
import FaFields from './FaEditor/FaFields';
import FaFooter from './FaEditor/FaFooter';
// import FaTabs from './FaEditor/FaTabs';
import FaHeader from './FaEditor/FaHeader';
import FaModals from './FaEditor/FaModals';
import AddAgreementsCTA from './FaEditor/AddAgreementsCTA';

// Skeletons
import CommercialProductSkeleton from './skeletons/CommercialProductSkeleton';

import * as frameAgreementActions from '../actions/frameAgreementActions';

window.editor = {};

const SUBSCRIPTIONS = {};

class FaMaster extends Component {
	constructor(props) {
		super(props);

		this.onSelectAgreement = this.onSelectAgreement.bind(this);
		this.onSelectAllAgreements = this.onSelectAllAgreements.bind(this);
		this.upsertFrameAgreements = this.upsertFrameAgreements.bind(this);
		this.onRemoveAgreements = this.onRemoveAgreements.bind(this);
		this.toggleVisibility = this.toggleVisibility.bind(this);
		this.onActionTaken = this.onActionTaken.bind(this);
		this._setState = this._setState.bind(this);

		this._faFilterMethod = fa => {
			if (!this.state.faFilter) {
				return true;
			} else if (
				this.state.faFilter.length >= 2 &&
				fa.csconta__Agreement_Name__c
			) {
				return fa.csconta__Agreement_Name__c
					.toLowerCase()
					.includes(this.state.faFilter.toLowerCase());
			}
			return false;
		};

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

		if (!isMaster(this.props.frameAgreements[this.faId])) {
			this.props.history.push('/agreement/' + this.faId);
		}

		// Ref active FA from store
		this.state = {
			actionTaken: false,
			selectedAgreements: {},
			faFilter: '',
			loading: {
				attachment: true
			},
			page: 1,
			pageSize: 10
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
		// Enable save on events
		SUBSCRIPTIONS['sub7'] = window.FAM.subscribe('onAfterDeleteOffers', data => {
			return new Promise(resolve => {
				this._setState({
					actionTaken: true
				});
				resolve(data);
			});
		});
	}

	componentWillUnmount() {
		this.mounted = false;
		delete window.FAM.api.getActiveFrameAgreement;
		for (var key in SUBSCRIPTIONS) {
			SUBSCRIPTIONS[key].unsubscribe();
		}
		this.props.executeFrameAgreementAction(this.faId, frameAgreementActions.CLEAR_ATTACHMENT);
		if (this.state.actionTaken && window.FAM.api.isAgreementEditable(this.faId)) {
			this.props.executeFrameAgreementAction(this.faId, frameAgreementActions.RESET);
		}
	}

	componentDidMount() {
		this.props.executeFrameAgreementAction(this.faId, frameAgreementActions.CLONE);
		let _promiseArray = [];

		if (!this.props.frameAgreements[this.faId]._ui.hasOwnProperty('relatedList')) {
			_promiseArray.push(this.props.getRelatedLists(this.faId));
		}

		_promiseArray.push(this.props.getAttachment(this.faId));

		Promise.all(_promiseArray).then(response => {
			const faIdList = new Set(Object.values(this.props.frameAgreements).map((fa) => fa.Id));
			const obsoleteFaList = Object.keys(
				this.props.frameAgreements[this.faId]._ui.attachment.products
			).filter((childFaId) => {
				return !faIdList.has(childFaId);
			});

			if (obsoleteFaList.length) {
				let obsoleteAttachment = { ...this.props.frameAgreements[this.faId]._ui.attachment };
				obsoleteFaList.forEach((obsoleteFa) => {
					delete obsoleteAttachment.products[obsoleteFa];
				});
				window.SF.invokeAction("saveAttachment", [
					this.faId,
					JSON.stringify(obsoleteAttachment),
				]).then((response) => {
					this.props.getAttachment(this.faId);
				});
			}
			this._setState(
				{
					loading: {
						...this.state.loading,
						attachment: false
					}
				},
				() => {
					publish('onFaSelect', [this.props.frameAgreements[this.faId]]);
				}
			);
		});

		// **************************************
		window.editor = this;
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
	onRemoveAgreements() {
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<ConfirmationModal
						title={window.SF.labels.alert_deleteAgreements_title}
						message={window.SF.labels.alert_deleteAgreements_message}
						onCancel={onClose}
						onConfirm={() => {
							this._removeAgreements();
						}}
						confirmText={window.SF.labels.alert_deleteAgreements_title}
					/>
				);
			}
		});
	}

	async _removeAgreements() {
		return new Promise(async resolve => {
			let productsToDelete = await publish(
				'onBeforeDeleteProducts',
				Object.keys(this.state.selectedAgreements)
			);

			await this.props.removeFaFromMaster(this.faId, productsToDelete);

			this._setState(
				{
					selectedAgreements: {}
				},
				() => {
					publish(
						'onAfterDeleteProducts',
						Object.values(this.props.frameAgreements).map(fa => productsToDelete.includes(fa.Id))
					);
					resolve(productsToDelete);
				}
			);
		});
	}

	onSelectAgreement(fa) {
		let selectedAgreements = { ...this.state.selectedAgreements };

		if (selectedAgreements[fa.Id]) {
			delete selectedAgreements[fa.Id];
		} else {
			selectedAgreements[fa.Id] = fa;
		}
		this._setState({
			selectedAgreements
		});
	}

	onSelectAllAgreements(allAgreements) {
		let selectedAgreements = { ...this.state.selectedAgreements };

		if (allAgreements.length === Object.keys(this.state.selectedAgreements).length) {
			selectedAgreements = {};
		} else {
			allAgreements.forEach(fa => {
				selectedAgreements[fa.Id] = this.props.frameAgreements[fa.Id];
			});
		}

		this._setState({
			selectedAgreements
		});
	}

	toggleVisibility(index) {
		this.props.toggleFieldVisibility(index);
	}

	onRedirect(faId) {
		this.props.history.push('/agreement/' + faId);
	}

	/**************************************************/

	async upsertFrameAgreements() {
		var data = { ...this.props.frameAgreements[this.faId] };
		data = await publish('onBeforeSaveFrameAgreement', data);

		if (
			this.props.frameAgreements[this.faId]._ui.approvalNeeded &&
			this.props.settings.FACSettings.fa_editable_statuses.has(
				this.props.frameAgreements[this.faId].csconta__Status__c
			)
		) {
			data.csconta__Status__c = this.props.settings.FACSettings.statuses.requires_approval_status;
		}

		this.props
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
		let _fa = this.props.frameAgreements[this.faId];
		let _editable = window.FAM.api.isAgreementEditable(this.faId);

		let _isAddAgreementsEnabled = evaluateExpressionOnAgreement(this.props.settings.ButtonStandardData.AddProducts, _fa);

		let _addedFaIdSet;
		let addedFa;

		if (!this.state.loading.attachment) {
			_addedFaIdSet = new Set(Object.keys(_fa._ui.attachment.products));
			addedFa = Object.values(this.props.frameAgreements).filter(fa => _addedFaIdSet.has(fa.Id));
		}

		let _faAgreementList = <CommercialProductSkeleton count={5} />;

		if (!this.state.loading.attachment) {
			_faAgreementList = (
				<div className="card products-card">
					<div className="products-card__inner">
						<div className="products-card__header">
							<span className="products__title">
								{window.SF.labels.frame_agreements_title} ({addedFa.length})
							</span>
							<div className="header__inputs">
								<InputSearch
									value={this.state.faFilter}
									bordered={true}
									onChange={val => {
										this._setState({ faFilter: val });
									}}
									placeholder={window.SF.labels.input_quickSearchPlaceholder}
								/>
								{this.props.faFields.length ? (
									<DropdownCheckbox
										object="csconta__Frame_Agreement__c"
										options={this.props.faFields}
										onChange={this.props.toggleFaFieldVisibility}
									/>
								) : null}
							</div>
						</div>

						<div className="product-card__container commercial-product-container-bare product-card__container--header">
							<div className="container__header">
								<div className="container__checkbox">
									<Checkbox
										className="fa-margin-right-sm"
										value={
											Object.keys(this.state.selectedAgreements).length > 0 &&
											addedFa.filter(this._faFilterMethod).length ===
												Object.keys(this.state.selectedAgreements).length
										}
										onChange={() => {
											this.onSelectAllAgreements(addedFa.filter(this._faFilterMethod));
										}}
									/>
								</div>

								<div className="container__fields">
									<span className="list-cell">
										{getFieldLabel('csconta__Frame_Agreement__c', 'csconta__Agreement_Name__c')}
									</span>
									{this.props.faFields
										.filter(f => f.visible)
										.map(f => {
											return (
												<span
													key={'header-' + f.name}
													className={'list-cell' + (f.volume ? ' volume' : '')}
												>
													{getFieldLabel('csconta__Frame_Agreement__c', f.name) ||
														truncateCPField(f.name)}
												</span>
											);
										})}
								</div>
							</div>
						</div>

						{addedFa
							.filter(this._faFilterMethod)
							.paginate(this.state.page, this.state.pageSize)
							.map(fa => {
								return (
									<div className="product-card__container" key={'farow-' + fa.Id}>
										<div className="container__header">
											<div className="container__checkbox">
												<Checkbox
													disabled={!_editable}
													value={this.state.selectedAgreements[fa.Id]}
													onChange={() => {
														this.onSelectAgreement(fa);
													}}
												/>
											</div>
											<div className="container__fields">
												<div
													className="fields__item fields__item--title master-name-field"
													onClick={() => this.onRedirect(fa.Id)}
												>
													{fa.csconta__Agreement_Name__c || '-- anonymous --'}
													<span className="master-redirect-icon">
														<Icon name="forward" height="16" width="16" />
													</span>
												</div>
												{this.props.faFields
													.filter(f => f.visible)
													.map((f, i) => {
														let _field = (
															<div className="fields__item" key={'facp-' + fa.Id + '-' + f + i}>
																{fa.hasOwnProperty(f.name) ? fa[f.name].toString() : '-'}
															</div>
														);

														return _field;
													})}
											</div>
										</div>
									</div>
								);
							})}

						<div className="card__bottom" />
					</div>
				</div>
			);
			if (!addedFa.length) {
				_faAgreementList = (
					<div>
						<AddAgreementsCTA render={true} disabled={!_editable || !_isAddAgreementsEnabled}/>
					</div>
				);
			}
		}
		return (
			<div className="fa-app">
				<Prompt
					when={this.state.actionTaken && _editable}
					message={window.SF.labels.modal_unsavedChanges_alert}
				/>

				<FaHeader faId={this.faId} />

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

						{_faAgreementList}
					</div>
				</div>

				<Toaster />

				{_editable && (
					<FaFooter
						faId={this.faId}
						activeTab={0}
						selectedProducts={this.state.selectedAgreements}
						onRemoveProducts={() => this.onRemoveAgreements()}
					/>
				)}

				<FaModals faId={this.faId} selectedProducts={this.state.selectedAgreements} />
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		commercialProducts: state.commercialProducts,
		frameAgreements: state.frameAgreements,
		settings: state.settings,
		faFields: state.faFields,
		modals: state.modals
	};
};

const mapDispatchToProps = {
	addFaToMaster,
	createToast,
	toggleModals,
	toggleFaFieldVisibility,
	validateFrameAgreement,
	getAttachment,
	getApprovalHistory,
	saveFrameAgreement,
	addProductsToFa,
	removeFaFromMaster,
	negotiate,
	getRelatedLists,
	getCommercialProductData,
	executeFrameAgreementAction
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FaMaster));
