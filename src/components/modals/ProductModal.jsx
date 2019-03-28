import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-responsive-modal';

import { filterCommercialProducts } from '../../actions';

import Icon from '../utillity/Icon';
import Checkbox from '../utillity/inputs/Checkbox';
import InputSearch from '../utillity/inputs/InputSearch';
import Pagination from '../utillity/Pagination';
import { truncateCPField } from '../../utils/shared-service';

import './Modal.css';
import './ProductModal.css';

class ProductModal extends Component {
	constructor(props) {
		super(props);
		this.togglePanel = this.togglePanel.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.addProducts = this.addProducts.bind(this);

		this.resetFilter = this.resetFilter.bind(this);
		this.applyFilter = this.applyFilter.bind(this);

		/* CategorizationData
    [
      {
        "field": "Categorization_Alpha__c",
        "name": "Alpha",
        "values": [
          "Fixed",
          "Mobile",
          "Static"
        ]
      },
      {
        "field": "Categorization_Beta__c",
        "name": "Beta",
        "values": [
          "10GB",
          "20GB",
          "50GB",
          "100GB"
        ]
      }
    ]
    */

		/* this.categoryMap
      {
        "Categorization_Alpha__c": {
          "label": "Alpha",
          "open": false,
          "values": {
            "Fixed": false,
            "Mobile": false,
            "Static": false
          }
        },
        "Categorization_Beta__c": {
          "label": "Beta",
          "open": false,
          "values": {
            "10GB": false,
            "20GB": false,
            "50GB": false,
            "100GB": false
          }
        }
      }
    */
		this.addedProductsIds = this.props.addedProducts.map(cp => cp.Id);
		this.notAddedCommercialProducts = this.props.commercialProducts.filter(
			cp => !this.addedProductsIds.includes(cp.Id)
		);

		this.state = {
			searchValue: '',
			panel: false,
			actionTaken: false,
			filter: this.initFilterData(),
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

	togglePanel(value) {
		this.setState({
			panel: !this.state.panel
		});
	}

	// filterCategories(cp) {
	//   return true;
	// }

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

	resetFilter(name, value) {
		this.setState({
			filter: this.initFilterData(),
			commercialProducts: this.notAddedCommercialProducts
		});
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

		this.setState({
			commercialProducts: result.filter(
				cp => !this.addedProductsIds.includes(cp.Id)
			)
		});
	}

	getCommercialProductsCount() {
		let cpSize = this.state.commercialProducts.length;

		if (this.state.productFilter) {
			cpSize = this.state.commercialProducts.filter(cp => {
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

	toggleCategoryCollapse(name) {
		console.log('Toggling ', name);
		this.setState(
			{
				filter: {
					...this.state.filter,
					[name]: {
						...this.state.filter[name],
						open: !this.state.filter[name].open
					}
				}
			},
			() => {
				console.log(this.state.filter[name]);
			}
		);
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
		this.props.onAddProducts(this.state.selected);
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
					modal: 'modal fa-modal',
					closeButton: 'close-button'
				}}
				open={this.props.open}
				onClose={this.onCloseModal}
				center
			>
				<div>
					<h2>{window.SF.labels.modal_addProduct_title}</h2>
				</div>

				<div
					className={
						'modal-body fa-modal-body ' +
						(this.state.panel ? 'panel-open' : 'panel-closed')
					}
				>
					<div className="modal-panel">
						<div className="panel-navigation">
							<div
								className="panel-navigation--close"
								onClick={this.togglePanel}
							>
								<Icon name="close" width="12" height="12" color="#0070d2" />
								<span>Close</span>
							</div>
							<div
								className="product-list-header"
								style={{ border: 0, padding: 0 }}
							>
								<div className="header-th">
									<span>{window.SF.labels.modal_categorization_title}</span>
								</div>
							</div>
						</div>

						<div className="panel-filter-container">
							{Object.keys(this.state.filter).map(key => {
								let category = this.state.filter[key];

								return (
									<div className="filter-category" key={key}>
										<div
											className="category-title"
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
											<span>{category.label}</span>
										</div>

										{category.open && (
											<ul className="category-values-list">
												{Object.keys(category.values).map(val => {
													return (
														<li
															key={val}
															onClick={() => {
																this.toggleFilter(key, val);
															}}
														>
															<Checkbox
																small={true}
																readOnly={category.values[val]}
															/>
															<span>{val}</span>
														</li>
													);
												})}
											</ul>
										)}
									</div>
								);
							})}
						</div>
						<div className="panel-filter-buttons fa-margin-bottom-sm">
							<button
								onClick={this.resetFilter}
								className="fa-button fa-margin-right-xsm"
								disabled={false}
							>
								{window.SF.labels.modal_categorization_btn_clear}
							</button>
							<button
								onClick={this.applyFilter}
								className="fa-button"
								disabled={false}
							>
								{window.SF.labels.modal_categorization_btn_apply}
							</button>
						</div>
					</div>

					<div className="modal-table-container">
						<div className="modal-navigation">
							{this.props.settings.CategorizationData.length && (
								<div
									className="categorization-container"
									onClick={this.togglePanel}
								>
									<Icon
										name="color_swatch"
										width="14"
										height="14"
										color="#0070d2"
									/>
									<div className="categorization-switch">
										{window.SF.labels.modal_categorization_switch}
									</div>
								</div>
							)}

							<div className="search-container">
								<InputSearch
									placeholder={
										window.SF.labels.modal_addProduct_input_search_placeholder
									}
									value={this.state.searchValue}
									onChange={val => {
										this.setState({ productFilter: val });
									}}
								/>
							</div>
						</div>

						<div className="modal-product-list">
							<div className="product-list-header">
								<div className="header-th">
									{window.SF.labels.products_productNameHeaderCell}
								</div>
								{this.priceItemFields.map(f => {
									return (
										<div key={f.name} className="header-th">
											<span>
												{this.props.settings.FACSettings.truncate_product_fields
													? truncateCPField(f.name)
													: f.name}
											</span>
										</div>
									);
								})}
							</div>
							<div className="product-list">
								{this.state.commercialProducts
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
											<div
												key={cp.Id}
												className={
													'product-row' +
													(this.state.selected[cp.Id] ? ' selected' : '')
												}
												onClick={() => this.selectProduct(cp)}
											>
												<span>{cp.Name}</span>
												{this.priceItemFields.map(f => {
													return (
														<span key={cp.Id + '-' + f.name}>
															{cp[f.name] || '-'}
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

				<div className="modal-footer">
					<Pagination
						totalSize={this.getCommercialProductsCount()}
						pageSize={this.state.pagination.pageSize}
						page={this.state.pagination.page}
						onPageSizeChange={newPageSize => {
							this.setState({
								pagination: { ...this.state.pagination, pageSize: newPageSize }
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
						className="slds-button slds-button--brand"
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
		commercialProducts: state.commercialProducts,
		productFields: state.productFields,
		settings: state.settings
	};
};

const mapDispatchToProps = {
	filterCommercialProducts
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProductModal);
