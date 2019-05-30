import React, { Component } from 'react';
import { connect } from 'react-redux';

import Icon from '../utillity/Icon';
import ExpandableArticle from '../utillity/ExpandableArticle';

import Tabs from '../utillity/tabs/Tabs';
import Tab from '../utillity/tabs/Tab';

import Checkbox from '../utillity/inputs/Checkbox';
import InputVolume from '../utillity/inputs/InputVolume';

import ProductCharges from './ProductCharges';

import Addons from './Addons';
import Charges from './Charges';
import Rates from './Rates';
import Allowances from './Allowances';

import {
	validateAddons,
	validateProduct,
	validateCharges,
	validateRateCardLines
} from './Validation';
import { setValidation } from '../../actions';

class CommercialProduct extends React.Component {
	constructor(props) {
		super(props);

		// if (this.props.settings.FACSettings.show_volume_fields) {
		//   this.fields.push("Minimum vol.");
		//   this.fields.push("Minimum vol. period");
		//   this.fields.push("Minimum usage commitment");
		//   this.fields.push("Minimum usage commitment period");
		// }

		this.onExpandProduct = this.onExpandProduct.bind(this);

		this.productId = this.props.product.Id;
		this.validation = this.props.validation || {};

		this.state = {
			loading: false
		};

		let bulkValidation = {};
		bulkValidation[this.productId] = {
			addons: validateAddons(
				this.props.product._addons,
				this.props.attachment._addons || {}
			),
			rated: validateRateCardLines(
				this.props.product._rateCards,
				this.props.attachment._rateCards || {}
			)
		};

		if (this.props.product._charges.length) {
			bulkValidation[this.productId].charges = validateCharges(
				this.props.product._charges,
				this.props.product.cspmb__Authorization_Level__c,
				this.props.attachment._charges || {}
			);
		} else {
			bulkValidation[this.productId].product = validateProduct({
				oneOff: this.props.product.cspmb__One_Off_Charge__c,
				negotiatedOneOff: this.props.attachment._product
					? this.props.attachment._product.oneOff
					: null,
				recurring: this.props.product.cspmb__Recurring_Charge__c,
				negotiatedRecurring: this.props.attachment._product
					? this.props.attachment._product.recurring
					: null,
				authLevel: this.props.product.cspmb__Authorization_Level__c || null,
				Name: this.props.product.Name
			});
		}

		this.props.setValidation(bulkValidation);
	}

	onExpandProduct(e) {
		this.props.onOpen(!this.props.open);
		e.stopPropagation();
	}

	updateVolume(volume, value) {
		let _volume = this.props.attachment._volume;
		_volume[volume] = value;
		this.props.onNegotiate('_volume', _volume);
	}

	onNegotiate(type, data) {
		if (type === '_addons') {
			this.props.setValidation(
				this.productId,
				'addons',
				validateAddons(this.props.product._addons, data)
			);
		}

		if (type === '_charges') {
			this.props.setValidation(
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
				this.productId,
				'rated',
				validateRateCardLines(this.props.product._rateCards, data)
			);
		}

		if (type === '_product') {
			this.props.setValidation(
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

		this.props.onNegotiate(type, data);
	}

	render() {
		return (
			<div
				className={
					'product-card__container' +
					(this.props.open ? ' product-open' : '') +
					(this.props.invalid ? ' invalid-product' : '')
				}
			>
				<div className="container__header">
					<div className="container__checkbox">
						<Checkbox
							disabled={!this.props.editable}
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
								if (f.volume) {
									_field = (
										<div
											className="fields__item volume-fields"
											key={'facp-' + this.props.product.Id + '-' + f + i}
										>
											<InputVolume
												readOnly={this.props.readOnly}
												value={this.props.attachment._volume[f.volume]}
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
											{this.props.product[f.name] || '-'}
										</div>
									);
								}
								return _field;
							})}
					</div>
				</div>
				{this.props.open && (
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
									readOnly={this.props.readOnly}
									validation={this.props.validation[this.productId].addons}
									attachment={this.props.attachment._addons || {}}
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
										readOnly={this.props.readOnly}
										oneOffAllowed={
											this.props.product.cspmb__Is_One_Off_Discount_Allowed__c
										}
										recurringAllowed={
											this.props.product.cspmb__Is_Recurring_Discount_Allowed__c
										}
										level={this.props.product._levelId}
										validation={this.props.validation[this.productId].charges}
										attachment={this.props.attachment._charges || {}}
										onNegotiate={data => {
											this.onNegotiate('_charges', data);
										}}
										authLevel={this.props.product.cspmb__Authorization_Level__c}
										charges={this.props.product._charges}
									/>
								) : (
									<ProductCharges
										product={this.props.product}
										oneOffAllowed={
											this.props.product.cspmb__Is_One_Off_Discount_Allowed__c
										}
										recurringAllowed={
											this.props.product.cspmb__Is_Recurring_Discount_Allowed__c
										}
										level={this.props.product._levelId}
										readOnly={this.props.readOnly}
										validation={this.props.validation[this.productId].product}
										attachment={this.props.attachment._product || {}}
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
									readOnly={this.props.readOnly}
									validation={this.props.validation[this.productId].rated}
									attachment={this.props.attachment._rateCards || {}}
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
		validation: state.validation,
		productFields: state.productFields,
		settings: state.settings
	};
};

const mapDispatchToProps = {
	setValidation
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CommercialProduct);
