import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-responsive-modal';

import { toggleFrameAgreementOperations } from '../../actions/index';

import Icon from '../utillity/Icon';
import InputSearch from '../utillity/inputs/InputSearch';
import Pagination from '../utillity/Pagination';
import { truncateCPField, getFieldLabel } from '../../utils/shared-service';
import { queryCategoriesInCatalogue, queryOffersInCategory } from '~/src/graphql-actions';

import ProductRow from '../utillity/ProductRow';
import Checkbox from '../utillity/inputs/Checkbox';

class OffersModal extends Component {
	constructor(props) {
		super(props);
		this.togglePanel = this.togglePanel.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.addOffers = this.addOffers.bind(this);
		this.resetFilter = this.resetFilter.bind(this);

		let _offers = this.props.offers;

		if (this.props.offerFilter) {
			_offers = this.props.offers.filter(offer =>
				this.props.offerFilter.has(offer.Id)
			);
		}

		this.addedOfferIds = this.props.addedOffers.map(offer => offer.Id);

		this.notAddedOffers = _offers.filter(
			offer => !this.addedOfferIds.includes(offer.Id)
		);

		this.state = {
			searchValue: '',
			panel: false,
			expanded: false,
			actionTaken: false,
			filter: [],
			offerFilter: '',
			offers: this.notAddedOffers,
			selected: {},
			pagination: {
				page: 1,
				pageSize: 10
			}
		};

		this.offerFields = this.props.productFields.filter(f => !f.volume);
		this.categoryId = null;
	}

	async componentDidMount() {
		const categoriesInCatalogue = await queryCategoriesInCatalogue();
		this.setState({ filter: [...categoriesInCatalogue] })
	}

	async loadOffers(categoryId) {
		if (categoryId && this.categoryId !== categoryId) {
			this.categoryId = categoryId;
			const linkedOffers = await queryOffersInCategory(categoryId);
			const linkedOfferIds = linkedOffers.map(offer => offer.id);
			// refetch cps from apex for the linked products.
			this.props.toggleFrameAgreementOperations(true);
			const offers = await window.SF.invokeAction("getOffers", [
				linkedOfferIds,
			]);
			const notAddedOffers = offers.filter(
				offer => !this.addedOfferIds.includes(offer.Id)
			);
			this.setState({ offers: notAddedOffers }, () => {
				this.props.toggleFrameAgreementOperations(false);
			});
		}
	}

	onCloseModal() {
		this.setState({
			actionTaken: false,
			selected: {}
		});
		this.props.onCloseModal();
	}

	togglePanel(value) {
		this.setState({
			panel: !this.state.panel
		});
	}

	getOffersCount() {
		let offerSize = this.state.offers.length;

		if (this.state.offerFilter) {
			offerSize = this.state.offers.filter(offer => {
				if (this.state.offerFilter && this.state.offerFilter.length >= 2) {
					return offer.Name.toLowerCase().includes(this.state.offerFilter.toLowerCase());
				} else {
					return true;
				}
			}).length;
		}
		return offerSize;
	}

	toggleExpanded() {
		this.setState({ expanded: !this.state.expanded });
	}

	selectOffer(offer) {
		let currentState = !!this.state.selected[offer.Id];
		let newState = { ...this.state.selected };
		if (currentState) {
			delete newState[offer.Id];
		} else {
			newState[offer.Id] = true;
		}

		this.setState(
			{
				selected: { ...newState }
			},
			() => {
				this.setState({
					actionTaken: true
				});
			}
		);
	}

	addOffers() {
		this.props.onAddOffers(Object.keys(this.state.selected));
		this.setState({
			actionTaken: false,
			selected: {}
		});
	}

	resetFilter() {
		this.setState({ offers: this.notAddedOffers });
		this.categoryId = '';
	}

	render() {
		return (
			<Modal
				classNames={{
					overlay: 'overlay',
					modal: 'modal fa-modal' + (this.state.expanded ? ' expanded' : ''),
					closeButton: 'close-button'
				}}
				closeIconSvgPath={
					<path d="M14.3 11.7l6-6c.3-.3.3-.7 0-1l-.9-1c-.3-.2-.7-.2-1 0l-6 6.1c-.2.2-.5.2-.7 0l-6-6.1c-.3-.3-.7-.3-1 0l-1 1c-.2.2-.2.7 0 .9l6.1 6.1c.2.2.2.4 0 .6l-6.1 6.1c-.3.3-.3.7 0 1l1 1c.2.2.7.2.9 0l6.1-6.1c.2-.2.4-.2.6 0l6.1 6.1c.2.2.7.2.9 0l1-1c.3-.3.3-.7 0-1l-6-6c-.2-.2-.2-.5 0-.7z" />
				}
				closeIconSize={48}
				open={this.props.open}
				onClose={this.onCloseModal}
				center
			>
				<div className="fa-modal-header">
					<button className="close-modal-button" onClick={this.onCloseModal}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 52 52">
							<path
								fill="#fff"
								d="m31 25.4l13-13.1c0.6-0.6 0.6-1.5 0-2.1l-2-2.1c-0.6-0.6-1.5-0.6-2.1 0l-13.1 13.1c-0.4 0.4-1 0.4-1.4 0l-13.1-13.2c-0.6-0.6-1.5-0.6-2.1 0l-2.1 2.1c-0.6 0.6-0.6 1.5 0 2.1l13.1 13.1c0.4 0.4 0.4 1 0 1.4l-13.2 13.2c-0.6 0.6-0.6 1.5 0 2.1l2.1 2.1c0.6 0.6 1.5 0.6 2.1 0l13.1-13.1c0.4-0.4 1-0.4 1.4 0l13.1 13.1c0.6 0.6 1.5 0.6 2.1 0l2.1-2.1c0.6-0.6 0.6-1.5 0-2.1l-13-13.1c-0.4-0.4-0.4-1 0-1.4z"
							/>
						</svg>
					</button>
					<span
						className="fa-modal-expand"
						onClick={() => {
							this.toggleExpanded();
						}}
					>
						<Icon name="expand_alt" width="24" height="24" color="white" />
					</span>
					<h2 className="fa-modal-header-title">{window.SF.labels.modal_addOffers_title}</h2>
				</div>

				<div
					className={
						'fa-product-modal fa-modal-body ' + (this.state.panel ? 'panel-open' : 'panel-closed')
					}
				>
					<div className="fa-modal-panel">
						<div className="panel-navigation">
							<div className="panel-navigation--close" onClick={this.togglePanel}>
								<Icon name="close" width="12" height="12" color="#0070d2" />
								<span>{window.SF.labels.btn_Close}</span>
							</div>
							<div>
								<div className="fa-modal-product-list-header">
									<div className="header-th">
										<span>{window.SF.labels.modal_categorization_title}</span>
									</div>
								</div>
								<div className="fa-modal-product-list">
									<ul>
										{this.state.filter.length ? this.state.filter.map(category => {
											return (
												<div
													className={
														"fa-modal-product-list-categories" +
														(this.categoryId === category.id
															? " selected"
															: "")
													}
												>
													<li
														key={category.id}
														onClick={async () =>
															await this.loadOffers(category.id)
														}
													>
														<span>{category.name}</span>
													</li>
												</div>
											);
										}) : (<div>
											<p>{window.SF.labels.warning_no_offers_linked}</p>
										</div>)
										}
									</ul>
								</div>
							</div>
						</div>
						<div className="fa-modal-button-group">
							<button
								onClick={this.resetFilter}
								className="fa-button fa-button--default"
							>
								{window.SF.labels.modal_categorization_btn_clear}
							</button>
						</div>
					</div>

					<div className="fa-modal-table-container">
						<div className="fa-modal-navigation">
							{this.props.settings.CategorizationData.length && !this.state.panel ? (
								<div className="fa-flex fa-flex-middle" onClick={this.togglePanel}>
									<div className="fa-modal-categorization-switch">
										<Icon name="color_swatch" width="14" height="14" color="#0070d2" />
										<div className="fa-modal-categorization-switch-link">
											{window.SF.labels.modal_categorization_switch}
										</div>
									</div>
								</div>
							) : (
								''
							)}

							<div className="search-container">
								<InputSearch
									placeholder={window.SF.labels.modal_addOffer_input_search_placeholder}
									value={this.state.searchValue}
									onChange={val => {
										this.setState({ offerFilter: val });
									}}
								/>
							</div>
						</div>

						<div>
							<div className="fa-modal-product-list-header">
								<div className="header-th">{getFieldLabel('cspmb__Price_Item__c', 'name')}</div>
								{this.offerFields.map(f => {
									return (
										<div key={f.name} className="header-th">
											<span>
												{getFieldLabel('cspmb__Price_Item__c', f.name) || truncateCPField(f.name)}
											</span>
										</div>
									);
								})}
							</div>
							<div className="fa-modal-product-list">
								{this.state.offers
									.filter(offer => {
										if (this.state.offerFilter && this.state.offerFilter.length >= 2) {
											return offer.Name.toLowerCase().includes(this.state.offerFilter.toLowerCase());
										} else {
											return true;
										}
									})
									.paginate(this.state.pagination.page, this.state.pagination.pageSize)
									.map(offer => {
										return (
											<div
												key={offer.Id}
												className={'product-row' + (this.state.selected[offer.Id] ? ' selected' : '')}
												onClick={() => this.selectOffer(offer)}
											>
												<span>{offer.Name}</span>
												{this.offerFields.map(field => {
													return (
														<span key={offer.Id + '-' + field.name}>
															<ProductRow
																product={offer}
																fieldName={field.name}
															/>
														</span>
													);
												})}
											</div>
										);
									})}
							</div>
						</div>

						<div className="modal-pagination" />
					</div>
				</div>

				<div className="fa-modal-footer">
					<Pagination
						totalSize={this.getOffersCount()}
						pageSize={this.state.pagination.pageSize}
						page={this.state.pagination.page}
						onPageSizeChange={newPageSize => {
							this.setState({
								pagination: {
									...this.state.pagination,
									pageSize: newPageSize,
									page: 1
								}
							});
						}}
						onPageChange={newPage => {
							this.setState({
								pagination: { ...this.state.pagination, page: newPage }
							});
						}}
					/>

					<button
						onClick={this.addOffers}
						className="fa-button fa-button--brand"
						disabled={
							!this.state.actionTaken ||
							this.props.disableFrameAgreementOperations
						}
					>
						{window.SF.labels.modal_categorization_btn_add}
					</button>
				</div>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		offers: state.offers,
		productFields: state.productFields,
		settings: state.settings,
		disableFrameAgreementOperations: state.disableFrameAgreementOperations
	};
};

const mapDispatchToProps = {
	toggleFrameAgreementOperations
};

export default connect(mapStateToProps, mapDispatchToProps)(OffersModal);
