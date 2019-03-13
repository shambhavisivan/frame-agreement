import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-responsive-modal';

import { filterCommercialProducts } from '../../actions';

import Icon from '../utillity/Icon';
import Checkbox from '../utillity/inputs/Checkbox';
import InputSearch from '../utillity/inputs/InputSearch';
import { truncateCPField } from '../../utils/shared-service';

import './Modal.css';
import './ProductModal.css';

class ProductModal extends Component {
	constructor(props) {
		super(props);
		this.onSearchChange = this.onSearchChange.bind(this);
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
			commercialProducts: this.notAddedCommercialProducts,
			selected: {}
		};

		this.priceItemFields = [
			...this.props.settings.FACSettings.Price_Item_Fields
		];
		this.priceItemFields.unshift('Name');
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

	onSearchChange(value) {
		console.log(value);
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
					modal: 'sf-modal',
					closeButton: 'close-button'
				}}
				open={this.props.open}
				onClose={this.onCloseModal}
				center
			>
				<div className="modal-header">
					<h2>Add Product to Frame Agreement</h2>
				</div>

				<div
					className={
						'modal-body ' + (this.state.panel ? 'panel-open' : 'panel-closed')
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
									<span>Product categorisation</span>
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
						<div className="panel-filter-buttons">
							<button
								onClick={this.resetFilter}
								className="slds-button slds-button--neutral"
								disabled={false}
							>
								Clear Filter
							</button>
							<button
								onClick={this.applyFilter}
								className="slds-button slds-button--brand"
								disabled={false}
							>
								Apply Filter
							</button>
						</div>
					</div>

					<div className="modal-table-container">
						<div className="modal-navigation">
							<div
								className="categorisation-container"
								onClick={this.togglePanel}
							>
								<Icon
									name="color_swatch"
									width="14"
									height="14"
									color="#0070d2"
								/>
								<div className="categorisation-switch">
									Product categorisation panel
								</div>
							</div>

							<div className="search-container">
								<InputSearch
									placeholder="Filter products"
									value={this.state.searchValue}
									onChange={this.onSearchChange}
								/>
							</div>
						</div>

						<div className="modal-product-list">
							<div className="product-list-header">
								{this.priceItemFields.map(pif => {
									return (
										<div key={pif} className="header-th">
											<span>
												{this.props.settings.FACSettings.Truncate_CP_Fields
													? truncateCPField(pif)
													: pif}
											</span>
										</div>
									);
								})}
							</div>
							<div className="product-list">
								{this.state.commercialProducts.map(cp => {
									return (
										<div
											key={cp.Id}
											className={
												'product-row' +
												(this.state.selected[cp.Id] ? ' selected' : '')
											}
											onClick={() => this.selectProduct(cp)}
										>
											{this.priceItemFields.map(pif => {
												return (
													<span key={cp.Id + '-' + pif}>{cp[pif] || '-'}</span>
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
					<button
						onClick={this.addProducts}
						className="slds-button slds-button--brand"
						disabled={!this.state.actionTaken}
					>
						Add Selected
					</button>
				</div>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		commercialProducts: state.commercialProducts,
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
