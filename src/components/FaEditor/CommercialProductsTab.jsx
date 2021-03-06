import React, { Component } from 'react';
import { connect } from 'react-redux';

import Icon from '../utillity/Icon';
import Pagination from '../utillity/Pagination';
import InputSearch from '../utillity/inputs/InputSearch';
import DropdownCheckbox from '../utillity/inputs/DropdownCheckbox';
import Checkbox from '../utillity/inputs/Checkbox';

import CommercialProduct from '../negotiation/CommercialProduct';

import { truncateCPField, getFieldLabel, log, isMaster, evaluateExpressionOnAgreement } from '../../utils/shared-service';
import { toggleFieldVisibility } from '~/src/actions';

import AddProductCTA from './AddProductCTA';

class CommercialProductsTab extends React.Component {
	constructor(props) {
		super(props);

		this.getCommercialProductsCount = this.getCommercialProductsCount.bind(this);

		this.state = {
			productFilter: '',
			page: 1,
			pageSize: 10
		};

		this._productFilter = cp => {
			if (this.state.productFilter && this.state.productFilter.length >= 2) {
				return cp.Name.toLowerCase().includes(this.state.productFilter.toLowerCase());
			} else {
				return true;
			}
		};

		this.prodDeleteSub = window.FAM.subscribe('onAfterDeleteProducts', data => {
			return new Promise(resolve => {
				this.setState({
					page: 1
				});
				resolve(data);
			});
		});
	}

	componentWillUnmount() {
		this.prodDeleteSub.unsubscribe();
	}

	getCommercialProductsCount() {
		let cpSize = this.props.frameAgreements[this.props.faId]._ui.commercialProducts.length;
		if (this.state.productFilter) {
			cpSize = this.props.frameAgreements[this.props.faId]._ui.commercialProducts.filter(cp => {
				if (this.state.productFilter && this.state.productFilter.length >= 2) {
					return cp.Name.toLowerCase().includes(this.state.productFilter.toLowerCase());
				} else {
					return true;
				}
			}).length;
		}
		return cpSize;
	}

	render() {
		let commercialProducts;

		let _cp = this.props.frameAgreements[this.props.faId]._ui.commercialProducts;
		let _editable = window.FAM.api.isAgreementEditable(this.props.faId);

		let _isMaster = isMaster(this.props.frameAgreements[this.props.faId]);
		let standardData = this.props.settings.ButtonStandardData;

		let _isAddProductsEnabled = !_isMaster && evaluateExpressionOnAgreement(standardData.AddProducts, this.props.frameAgreements[this.props.faId]);


		if (_cp.length) {
			commercialProducts = (
				<div className="products-card__inner">
					<div className="products-card__header">
						<span className="products__title">
							{window.SF.labels.products_title} (
							{this.props.frameAgreements[this.props.faId]._ui.commercialProducts.length})
						</span>
						<div className="header__inputs">
							<InputSearch
								value={this.state.productFilter}
								bordered={true}
								onChange={val => {
									this.setState({ productFilter: val });
								}}
								placeholder={window.SF.labels.input_quickSearchPlaceholder}
							/>
							{this.props.productFields.length ? (
								<DropdownCheckbox
									object="cspmb__Price_Item__c"
									options={this.props.productFields}
									onChange={this.props.toggleFieldVisibility}
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
										this.props.frameAgreements[this.props.faId]._ui.commercialProducts.filter(
											this._productFilter
										).length === Object.keys(this.props.selectedProducts).length &&
										!!Object.keys(this.props.selectedProducts).length
									}
									onChange={() => {
										this.props.onSelectAllProducts(
											this.props.frameAgreements[this.props.faId]._ui.commercialProducts.filter(
												this._productFilter
											)
										);
									}}
								/>
							</div>
							<div className="container__fields">
								<span className="list-cell">{getFieldLabel('cspmb__Price_Item__c', 'name')}</span>
								{this.props.productFields
									.filter(f => f.visible)
									.map(f => {
										return (
											<span
												key={'header-' + f.name}
												className={'list-cell' + (f.volume ? ' volume' : '')}
											>
												{getFieldLabel('cspmb__Price_Item__c', f.name) || truncateCPField(f.name)}
											</span>
										);
									})}
							</div>
						</div>
					</div>
					{_cp
						.filter(this._productFilter)
						.paginate(this.state.page, this.state.pageSize)
						.map(cp => {
							return (
								<CommercialProduct
									key={'cp-' + cp.Id}
									product={cp}
									faId={this.props.faId}
									onSelect={product => this.props.onSelectProduct(product)}
									selected={!!this.props.selectedProducts[cp.Id]}
								/>
							);
						})}
					<div className="card__bottom" />
				</div>
			);
		} else {
			commercialProducts = (
				<div>
					<AddProductCTA
						render={!this.props.frameAgreements[this.props.faId]._ui.commercialProducts.length}
						disabled={!_editable || !_isAddProductsEnabled}
					/>
				</div>
			);
		}

		return (
			<div className="card products-card">
				{commercialProducts}

				<Pagination
					totalSize={this.getCommercialProductsCount()}
					pageSize={this.state.pageSize}
					page={this.state.page}
					onPageSizeChange={newPageSize => {
						this.setState({
							page: 1,
							pageSize: newPageSize
						});
					}}
					onPageChange={newPage => {
						this.setState({
							page: newPage
						});
					}}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		settings: state.settings,
		handlers: state.handlers,
		productFields: state.productFields
	};
};

const mapDispatchToProps = {
	toggleFieldVisibility
};

export default connect(mapStateToProps, mapDispatchToProps)(CommercialProductsTab);
