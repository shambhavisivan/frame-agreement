import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-responsive-modal';

import { publish } from '../../api';

import Icon from '../utillity/Icon';
import InputSearch from '../utillity/inputs/InputSearch';
import Pagination from '../utillity/Pagination';
import { truncateCPField, getFieldLabel } from '../../utils/shared-service';
import { queryCategoriesInCatalogue, queryProductsInCategory } from '../../graphql-actions';
import { invokeGetCommercialProducts } from '../../actions'

class ProductModal extends Component {
	constructor(props) {
		super(props);
		this.togglePanel = this.togglePanel.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.addProducts = this.addProducts.bind(this);
		this.loadCommercialProducts = this.loadCommercialProducts.bind(this);

		this.categoryId = null;

		let _commercialProducts = this.props.commercialProducts;

		if (this.props.cpFilter) {
			_commercialProducts = this.props.commercialProducts.filter(cp =>
				this.props.cpFilter.has(cp.Id)
			);
		}

		this.addedProductsIds = this.props.addedProducts.map(cp => cp.Id);

		this.notAddedCommercialProducts = _commercialProducts.filter(
			cp => !this.addedProductsIds.includes(cp.Id)
		);

		this.state = {
			searchValue: '',
			panel: false,
			expanded: false,
			actionTaken: false,
			filter: [],
			productFilter: '',
			commercialProducts: this.notAddedCommercialProducts,
			selected: {},
			pagination: {
				page: 1,
				pageSize: 10
			}
		};

		this.priceItemFields = this.props.productFields.filter(f => !f.volume);
		console.warn(this.priceItemFields);
	}

	async componentDidMount() {
		const categoriesInCatalogue = await queryCategoriesInCatalogue();
		this.setState({ filter: [...categoriesInCatalogue] })
	}

	onCloseModal() {
		this.setState({
			actionTaken: false,
			selected: {}
		});
		this.props.onCloseModal();
	}

	togglePanel() {
		this.setState(prevState => ({
			panel: !prevState.panel
		}));
	}

	async loadCommercialProducts(categoryId) {
		// filter cps for category
		if (this.categoryId !== categoryId) {
			this.categoryId = categoryId;
			const linkedProducts = await queryProductsInCategory(categoryId);
			const linkedProductIds = linkedProducts.map(cp => cp.id);
			// refetch cps from apex for the linked products.
			const commercialProducts = await window.SF.invokeAction("getCommercialProducts", [
				linkedProductIds,
			]);
			this.setState({ commercialProducts });
		}
	}

	getCommercialProductsCount() {
		let cpSize = this.state.commercialProducts.length;

		if (this.state.productFilter) {
			cpSize = this.state.commercialProducts.filter(cp => {
				if (this.state.productFilter && this.state.productFilter.length >= 2) {
					return cp.Name.toLowerCase().includes(this.state.productFilter.toLowerCase());
				} else {
					return true;
				}
			}).length;
		}
		return cpSize;
	}

	toggleExpanded() {
		this.setState({ expanded: !this.state.expanded }, () => {
			console.log('Expand:', this.state.expanded);
		});
	}

	selectProduct(product) {
		let currentState = !!this.state.selected[product.Id];
		let newState = { ...this.state.selected };
		if (currentState) {
			delete newState[product.Id];
		} else {
			newState[product.Id] = true;
		}

		this.setState(
			{
				selected: { ...newState }
			},
			() => {
				this.setState({
					actionTaken: true
				});
				console.log(this.state.selected);
			}
		);
	}

	addProducts() {
		this.props.onAddProducts(Object.keys(this.state.selected));
		this.setState({
			actionTaken: false,
			selected: {}
		});
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
					<h2 className="fa-modal-header-title">{window.SF.labels.modal_addProduct_title}</h2>
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
												<div className="fa-modal-product-list-categories">
													<li
														key={category.id}
														onClick={async () =>
															await this.loadCommercialProducts(category.id)
														}
													>
														<span>{category.name}</span>
													</li>
												</div>
											);
										}) : (<div>
											<p>Link atleast one category to the default catalogue to enable filter</p>
										</div>)
										}
									</ul>
								</div>
							</div>
						</div>
					</div>

					<div className="fa-modal-table-container">
						<div className="fa-modal-navigation">
							{!this.state.panel ? (
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
									placeholder={window.SF.labels.modal_addProduct_input_search_placeholder}
									value={this.state.searchValue}
									onChange={val => {
										this.setState({ productFilter: val });
									}}
								/>
							</div>
						</div>

						<div>
							<div className="fa-modal-product-list-header">
								<div className="header-th">{getFieldLabel('cspmb__Price_Item__c', 'name')}</div>
								{this.priceItemFields.map(f => {
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
								{this.state.commercialProducts
									.filter(cp => {
										if (this.state.productFilter && this.state.productFilter.length >= 2) {
											return cp.Name.toLowerCase().includes(this.state.productFilter.toLowerCase());
										} else {
											return true;
										}
									})
									.paginate(this.state.pagination.page, this.state.pagination.pageSize)
									.map(cp => {
										return (
											<div
												key={cp.Id}
												className={'product-row' + (this.state.selected[cp.Id] ? ' selected' : '')}
												onClick={() => this.selectProduct(cp)}
											>
												<span>{cp.Name}</span>
												{this.priceItemFields.map(f => {
													return (
														<span key={cp.Id + '-' + f.name}>
															{(() => {
																if (cp.hasOwnProperty(f.name)) {
																	if (typeof cp[f.name] === 'boolean') {
																		let _val = cp[f.name];
																		return (
																			<Icon
																				name={_val ? 'success' : 'clear'}
																				height="14"
																				width="14"
																				color={_val ? '#4bca81' : '#d9675d'}
																			/>
																		);
																	} else {
																		return cp[f.name].toString();
																	}
																} else {
																	return '-';
																}
															})()}
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
						totalSize={this.getCommercialProductsCount()}
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
						onClick={this.addProducts}
						className="fa-button fa-button--brand"
						disabled={!this.state.actionTaken}
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
		productFields: state.productFields,
		settings: state.settings,
		commercialProducts: state.commercialProducts
	};
};

export default connect(mapStateToProps)(ProductModal);
