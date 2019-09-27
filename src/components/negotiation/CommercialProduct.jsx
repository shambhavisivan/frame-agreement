import React, { Component } from 'react';
import { connect } from 'react-redux';

import Icon from '../utillity/Icon';
import ExpandableArticle from '../utillity/ExpandableArticle';

import Tabs from '../utillity/tabs/Tabs';
import Tab from '../utillity/tabs/Tab';

import Checkbox from '../utillity/inputs/Checkbox';
import InputVolume from '../utillity/inputs/InputVolume';

import ProductCharges from './ProductCharges';
import CommercialProductSkeleton from '../skeletons/CommercialProductSkeleton';

import Addons from './Addons';
import Charges from './Charges';
import Rates from './Rates';
import Allowances from './Allowances';

import {
	validateAddons,
	validateProduct,
	validateCharges,
	validateRateCardLines
} from '../../utils/validation-service';

import { setValidation, negotiate } from '~/src/actions';

export class CommercialProduct extends React.Component {
	constructor(props) {
		super(props);

		this.onExpandProduct = this.onExpandProduct.bind(this);

		this.productId = this.props.product.Id;
		this.validation = this.props.validation || {};

		this.state = {
			loading: false,
			open: false
		};
	}

	onExpandProduct(e) {
		this.setState({ open: !this.state.open });
		e.stopPropagation();
	}

	updateVolume(volume, value) {
		let _volume = this.props.frameAgreements[this.props.faId]._ui.attachment
			.products[this.productId]._volume;
		_volume[volume] = value;
		this.onNegotiate('_volume', _volume);
	}

	onNegotiate(type, data) {
		if (type === '_addons') {
			this.props.setValidation(
				this.props.faId,
				this.productId,
				'addons',
				validateAddons(this.props.product._addons, data)
			);
		}

		if (type === '_charges') {
			this.props.setValidation(
				this.props.faId,
				this.productId,
				'charges',
				validateCharges(
					this.props.product._charges,
					this.props.product.cspmb__Authorization_Level__c,
					data
				)
			);
		}

		if (type === '_rateCards') {
			this.props.setValidation(
				this.props.faId,
				this.productId,
				'rated',
				validateRateCardLines(this.props.product._rateCards, data)
			);
		}

		if (type === '_product') {
			this.props.setValidation(
				this.props.faId,
				this.productId,
				'product',
				validateProduct({
					oneOff: this.props.product.cspmb__One_Off_Charge__c,
					negotiatedOneOff: data.oneOff,
					recurring: this.props.product.cspmb__Recurring_Charge__c,
					negotiatedRecurring: data.recurring,
					authLevel: this.props.product.cspmb__Authorization_Level__c || null,
					Name: this.props.product.Name
				})
			);
		}

		this.props.negotiate(this.props.faId, this.productId, type, data);
	}

	render() {
		let _attachment = this.props.frameAgreements[this.props.faId]._ui.attachment
			.products[this.productId];
		let _editable = this.props.settings.FACSettings.fa_editable_statuses.has(
			this.props.frameAgreements[this.props.faId].csconta__Status__c
		);

		let _ignoreProducts = new Set(this.props.ignoreSettings.products || []);

		return (
			<div
				className={
					'product-card__container' +
					(this.state.open ? ' product-open' : '') +
					(this.props.validationProduct[this.productId]
						? ' invalid-product'
						: '')
				}
			>
				<div className="container__header">
					<div className="container__checkbox">
						<Checkbox
							disabled={!_editable}
							value={this.props.selected}
							onChange={() => {
								this.props.onSelect(this.props.product);
							}}
						/>
					</div>
					<div className="container__fields">
						<div
							className="fields__item fields__item--title"
							onClick={this.onExpandProduct}
						>
							{this.props.product.Name}
						</div>
						{this.props.productFields
							.filter(f => f.visible)
							.map((f, i) => {
								let _field;
								if (f.volume && _attachment) {
									_field = (
										<div
											className="fields__item volume-fields"
											key={'facp-' + this.props.product.Id + '-' + f + i}
										>
											<InputVolume
												readOnly={!_editable}
												value={_attachment._volume[f.volume]}
												onChange={val => {
													this.updateVolume(f.volume, val);
												}}
											/>
										</div>
									);
								} else {
									_field = (
										<div
											className="fields__item"
											onClick={this.onExpandProduct}
											key={'facp-' + this.props.product.Id + '-' + f + i}
										>
											{(() => {
												if (this.props.product.hasOwnProperty(f.name)) {
													if (typeof this.props.product[f.name] === 'boolean') {
														let _val = this.props.product[f.name];
														return (
															<Icon
																name={_val ? 'success' : 'clear'}
																height="18"
																width="18"
																color={_val ? '#4bca81' : '#d9675d'}
															/>
														);
													} else {
														return this.props.product[f.name].toString();
													}
												} else {
													return '-';
												}
											})()}
										</div>
									);
								}
								return _field;
							})}
					</div>
				</div>
				{this.state.open && (
					<div className="commercial-product-body">
						{this.props.product.cspmb__Price_Item_Description__c && (
							<div className="commercial-product-description">
								<ExpandableArticle>
									{this.props.product.cspmb__Price_Item_Description__c}
								</ExpandableArticle>
							</div>
						)}
						<Tabs initial={this.props.product._addons.length ? 0 : 1}>
							<Tab
								label={window.SF.labels.products_addons}
								disabled={!this.props.product._addons.length}
							>
								<Addons
									readOnly={!_editable}
									disableLevels={_ignoreProducts.has(this.productId)}
									validation={this.props.validation[this.productId].addons}
									attachment={_attachment._addons || {}}
									addons={this.props.product._addons}
									onNegotiate={data => {
										this.onNegotiate('_addons', data);
									}}
								/>
							</Tab>
							<Tab
								label={
									this.props.product._charges.length
										? window.SF.labels.products_charges
										: window.SF.labels.products_product_charges
								}
							>
								{this.props.product._charges.length ? (
									<Charges
										readOnly={!_editable}
										disableLevels={_ignoreProducts.has(this.productId)}
										oneOffAllowed={
											this.props.product.cspmb__Is_One_Off_Discount_Allowed__c
										}
										recurringAllowed={
											this.props.product.cspmb__Is_Recurring_Discount_Allowed__c
										}
										levels={this.props.product._discountLvIds}
										validation={this.props.validation[this.productId].charges}
										attachment={_attachment._charges || {}}
										onNegotiate={data => {
											this.onNegotiate('_charges', data);
										}}
										authLevel={this.props.product.cspmb__Authorization_Level__c}
										charges={this.props.product._charges}
									/>
								) : (
									<ProductCharges
										product={this.props.product}
										disableLevels={_ignoreProducts.has(this.productId)}
										oneOffAllowed={
											this.props.product.cspmb__Is_One_Off_Discount_Allowed__c
										}
										recurringAllowed={
											this.props.product.cspmb__Is_Recurring_Discount_Allowed__c
										}
										levels={this.props.product._discountLvIds}
										readOnly={!_editable}
										validation={this.props.validation[this.productId].product}
										attachment={_attachment._product || {}}
										onNegotiate={data => {
											this.onNegotiate('_product', data);
										}}
									/>
								)}
							</Tab>
							<Tab
								label={window.SF.labels.products_rates}
								disabled={!this.props.product._rateCards.length}
							>
								<Rates
									readOnly={!_editable}
									validation={this.props.validation[this.productId].rated}
									attachment={_attachment._rateCards || {}}
									rateCards={this.props.product._rateCards}
									onNegotiate={data => {
										this.onNegotiate('_rateCards', data);
									}}
								/>
							</Tab>
							<Tab
								label={window.SF.labels.products_allowances}
								disabled={!this.props.product._allowances.length}
							>
								<Allowances data={this.props.product._allowances} />
							</Tab>
						</Tabs>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		validation: state.validation,
		validationProduct: state.validationProduct,
		productFields: state.productFields,
		ignoreSettings: state.ignoreSettings,
		settings: state.settings
	};
};

const mapDispatchToProps = {
	setValidation,
	negotiate
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CommercialProduct);
