import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-responsive-modal';

import Icon from '../utillity/Icon';
import InputSearch from '../utillity/inputs/InputSearch';
import Pagination from '../utillity/Pagination';
import { truncateCPField, getFieldLabel } from '../../utils/shared-service';
import { queryCategoriesInCatalogue, queryProductsInCategory } from '~/src/graphql-actions';
import ProductRow from '../utillity/ProductRow';
import { filterCommercialProducts, toggleFrameAgreementOperations } from '../../actions/index';
import Checkbox from '../utillity/inputs/Checkbox';
import { publish } from '../../api';

class ProductModal extends Component {
	constructor(props) {
		super(props);
		this.togglePanel = this.togglePanel.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.addProducts = this.addProducts.bind(this);
		this.loadCommercialProducts = this.loadCommercialProducts.bind(this);
		this.resetFilter = this.resetFilter.bind(this);
		this.renderCategorizationFilter = this.renderCategorizationFilter.bind(this);
		this.toggleFilter = this.toggleFilter.bind(this);
		this.applyFilter = this.applyFilter.bind(this);
		this.toggleCategoryCollapse = this.toggleCategoryCollapse.bind(this);
		this.initFilterData = this.initFilterData.bind(this);

		this.categoryId = null;
		this.isPsEnabled = props.settings.FACSettings.isPsEnabled;

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
	}

	async componentDidMount() {
		if (this.isPsEnabled) {
			const categoriesInCatalogue = await queryCategoriesInCatalogue();
			this.setState({ filter: [...categoriesInCatalogue] })
		} else {
			this.setState({ filter: this.initFilterData() })
		}
	}

	initFilterData() {
		let categoryMap = {};
		this.props.settings.CategorizationData.forEach(cat => {
			categoryMap[cat.field] = {};
			categoryMap[cat.field].label = cat.name;
			categoryMap[cat.field].open = false;
			categoryMap[cat.field].values = {};

			cat.values.forEach(value => {
				categoryMap[cat.field].values[value] = false;
			});
		});
		return categoryMap;
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
		if (categoryId && this.categoryId !== categoryId) {
			this.categoryId = categoryId;
			const linkedProducts = await queryProductsInCategory(categoryId);
			const linkedProductIds = linkedProducts.map(cp => cp.id);
			// refetch cps from apex for the linked products.
			this.props.toggleFrameAgreementOperations(true);
			const commercialProducts = await window.SF.invokeAction("getCommercialProducts", [
				linkedProductIds,
			]);
			const notAddedCommercialProducts = commercialProducts.filter(
				cp => !this.addedProductsIds.includes(cp.Id)
			);
			this.setState({ commercialProducts: notAddedCommercialProducts }, () => {
				this.props.toggleFrameAgreementOperations(false);
			});
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
		this.setState({ expanded: !this.state.expanded });
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

	resetFilter() {
		this.setState({ commercialProducts: this.notAddedCommercialProducts });
	}

	toggleFilter(name, value) {
		this.setState({
			filter: {
				...this.state.filter,
				[name]: {
					...this.state.filter[name],
					values: {
						...this.state.filter[name].values,
						[value]: !this.state.filter[name].values[value]
					}
				}
			}
		});
	}

	resetFilter() {
		this.setState({
			filter: this.isPsEnabled ? this.state.filter : this.initFilterData(),
			commercialProducts: this.notAddedCommercialProducts
		});
		this.categoryId = '';
	}

	async applyFilter() {
		// Prepare data
		let filterData = [];

		for (var field in this.state.filter) {
			let cat = {
				field: field,
				values: []
			};

			for (var key in this.state.filter[field].values) {
				if (this.state.filter[field].values[key]) {
					cat.values.push(key);
				}
			}

			if (cat.values.length) {
				filterData.push(cat);
			}
		}

		let result = await this.props.filterCommercialProducts(filterData);

		let perFaCpFilterList = await publish('onLoadCommercialProducts', result);

		this.setState({
			commercialProducts: perFaCpFilterList.filter(cp => !this.addedProductsIds.includes(cp.Id))
		});
	}

	toggleCategoryCollapse(name) {
		this.setState(
			{
				filter: {
					...this.state.filter,
					[name]: {
						...this.state.filter[name],
						open: !this.state.filter[name].open
					}
				}
			}
		);
	}

	renderCategorizationFilter() {
		if (this.isPsEnabled) {
			return (<ul>
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
									await this.loadCommercialProducts(category.id)
								}
							>
								<span>{category.name}</span>
							</li>
						</div>
					);
				}) : (<div>
					<p>{window.SF.labels.warning_no_commercial_products_linked}</p>
				</div>)
				}
			</ul>)
		} else {
			return Object.keys(this.state.filter).map(key => {
				let category = this.state.filter[key];

				return (
					<div className="fa-modal-product-list-categories" key={key}>
						<div
							onClick={() => {
								this.toggleCategoryCollapse(key);
							}}
						>
							<Icon
								name={category.open ? 'chevrondown' : 'chevronright'}
								width="12"
								height="12"
								color="#747474"
							/>
							<span className="fa-modal-product-list-categories-item">
								{category.label}
							</span>
						</div>

						{category.open && (
							<ul>
								{Object.keys(category.values).map(val => {
									return (
										<li
											key={val}
											onClick={() => {
												this.toggleFilter(key, val);
											}}
										>
											<Checkbox small={true} readOnly={category.values[val]} />
											<span>{val}</span>
										</li>
									);
								})}
							</ul>
						)}
					</div>
				);
			})
		}
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
									{this.renderCategorizationFilter()}
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
							{!this.isPsEnabled && <button
								onClick={this.applyFilter}
								className="fa-button fa-button--default"
								disabled={false}
							>
								{window.SF.labels.modal_categorization_btn_apply}
							</button>}
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
												{this.priceItemFields.map(field => {
													return (
														<span key={cp.Id + '-' + field.name}>
															<ProductRow
																product={cp}
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
		productFields: state.productFields,
		settings: state.settings,
		commercialProducts: state.commercialProducts,
		disableFrameAgreementOperations: state.disableFrameAgreementOperations
	};
};

const mapDispatchToProps = {
	filterCommercialProducts,
	toggleFrameAgreementOperations
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductModal);
